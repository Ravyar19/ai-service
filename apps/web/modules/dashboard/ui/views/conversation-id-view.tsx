"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
  AIInputButton,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { toast } from "sonner";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const ConversationSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    {/* AI Message Skeleton (assistant role) */}
    <div className="group flex w-full items-end  gap-2 py-2 is-assistant flex-row-reverse justify-end">
      <div className="max-w-[80%] flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-sm chat-agent-bubble">
        <Skeleton className="h-4 w-48 bg-white/20" />
        <Skeleton className="h-4 w-32 bg-white/20" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>

    {/* User Message Skeleton (user role) */}
    <div className="group flex w-full items-end justify-end gap-2 py-2 is-user">
      <div className="max-w-[80%] flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-sm chat-user-bubble">
        <Skeleton className="h-4 w-36 bg-white/20" />
      </div>
    </div>

    {/* AI Message Skeleton (assistant role) */}
    <div className="group flex w-full items-end  gap-2 py-2 is-assistant flex-row-reverse justify-end">
      <div className="max-w-[80%] flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-sm chat-agent-bubble">
        <Skeleton className="h-4 w-56 bg-white/20" />
        <Skeleton className="h-4 w-40 bg-white/20" />
        <Skeleton className="h-4 w-24 bg-white/20" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    {
      initialNumItems: 10,
    }
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const [isEnhancingResponse, setIsEnhancingResponse] = useState(false);
  const handleEnhanceResponse = async () => {
    const currentValues = form.getValues("message");
    try {
      setIsEnhancingResponse(true);
      const response = await enhanceResponse({
        prompt: currentValues,
      });
      form.setValue("message", response);
    } catch {
      toast.error("Failed to enhance response");
    } finally {
      setIsEnhancingResponse(false);
    }
  };
  const createMessage = useMutation(api.private.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });
      form.reset();
    } catch {
      toast.error("Failed to create message");
    }
  };

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const handleToggleStatus = async () => {
    if (!conversation) return;
    setIsUpdatingStatus(true);
    let newStatus: "unresolved" | "escalated" | "resolved";
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (error) {
      toast.error("Failed to update conversation status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex h-full  flex-col  bg-muted">
      <header className="flex items-center justify-between border-b p-4.5 bg-background">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
        {conversation ? (
          <ConversationStatusButton
            status={conversation.status}
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
          />
        ) : (
          <Skeleton className="h-8 w-24" />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)] ">
        <AIConversationContent>
          {messages.status === "LoadingFirstPage" ||
          !conversation ||
          !messages.results ||
          messages.results.length === 0 ? (
            <ConversationSkeleton />
          ) : (
            <>
              {toUIMessages(messages.results ?? [])
                ?.filter(
                  (message) => message.content && message.content.trim() !== ""
                )
                ?.map((message) => (
                  <AIMessage
                    from={message.role === "user" ? "assistant" : "user"}
                    key={message.id}
                  >
                    <AIMessageContent>
                      <AIResponse>{message.content || ""}</AIResponse>
                    </AIMessageContent>
                    {message.role === "user" && (
                      <DicebearAvatar
                        seed={conversation?.contactSessionId ?? "user"}
                        size={32}
                      />
                    )}
                  </AIMessage>
                ))}
              <AIConversationScrollButton />
            </>
          )}
        </AIConversationContent>
      </AIConversation>
      <div className="w-full">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  {...field}
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhancingResponse
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "Conversation is resolved"
                      : "Type your message..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancingResponse ||
                    !form.formState.isValid
                  }
                  onClick={handleEnhanceResponse}
                >
                  <Wand2Icon className="h-4 w-4" />
                  <span className="text-sm">
                    {isEnhancingResponse ? "Enhancing..." : "Enhance"}
                  </span>
                </Button>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancingResponse
                }
                status="ready"
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary mr-2 mb-2"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
