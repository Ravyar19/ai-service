import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greet message is required"),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

type widgetSettings = Doc<"widgetSettings">;
export type FormSchema = z.infer<typeof widgetSettingsSchema>;

interface CustomizationFormProps {
  initialData?: widgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi! how can I help you today?",
      defaultSuggestions: initialData?.defaultSuggestions || {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId || "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber || "",
      },
    },
  });
  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: widgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      });
      toast.success("Widget settings saved successfully");
    } catch (error) {
      console.error("Failed to update widget settings", error);
      toast.error("Failed to update widget settings");
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat behavior and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-24 bg-background"
                      placeholder="Welcome message shown when chat opens"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customer sees when they open the chat
                  </FormDescription>
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Quick reply suggestions shown to help guide the conversation
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., How do i get started?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The first message customer sees when they open the
                          chat
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., What are your pricing plans?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The first message customer sees when they open the
                          chat
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Can you help me with a refund?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The first message customer sees when they open the
                          chat
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure voice calling features powered by VAPI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
