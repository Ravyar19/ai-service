"use client";
import { BotIcon, PhoneIcon, SettingsIcon, UnplugIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { VapiPhoneNumbersTab } from "./vapi-phone-numbers-tab";
import { VapiAssistantsTab } from "./vapi-assitants-tab";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl">VAPI Plugin</h1>
        <p className="text-muted-foreground">
          Connect Vapi to enable AI voice calls and phone support
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src="/vapi.jpg"
                  alt="Vapi"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                />
                <div>
                  <CardTitle>Vapi Integration</CardTitle>
                  <CardDescription>
                    Manage your phone numbers and AI assistants
                  </CardDescription>
                </div>
              </div>
              <Button variant="destructive" onClick={onDisconnect}>
                <UnplugIcon className="size-4" />
                Disconnect
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
                  <SettingsIcon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Widget Configuration</CardTitle>
                  <CardDescription>
                    Set up voice calls for your chat widget
                  </CardDescription>
                </div>
              </div>
              <Button asChild>
                <Link href="/customization">
                  <SettingsIcon className="size-4" />
                  Configure
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <Tabs
            defaultValue="phone-numbers"
            onValueChange={setActiveTab}
            className="gap-0"
            value={activeTab}
          >
            <TabsList className="grid h-12 w-full grid-cols-2 p-0 bg-muted">
              <TabsTrigger
                value="phone-numbers"
                className="h-full rounded-none data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <PhoneIcon className="size-4" />
                Phone Numbers
              </TabsTrigger>
              <TabsTrigger
                value="ai-assistants"
                className="h-full rounded-none data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <BotIcon className="size-4" />
                AI Assistants
              </TabsTrigger>
            </TabsList>
            <TabsContent value="phone-numbers">
              <VapiPhoneNumbersTab />
            </TabsContent>
            <TabsContent value="ai-assistants">
              <VapiAssistantsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
