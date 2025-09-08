"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import {
  MessageSquareTextIcon,
  ArrowRightIcon,
  MicIcon,
  PhoneIcon,
} from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  organizationIdAtom,
  previousScreenAtom,
  screenAtom,
  conversationAtom,
  widgetSettingsAtom,
  hasVapiSecretsAtom,
} from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setPreviousScreen = useSetAtom(previousScreenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setConversationId = useSetAtom(conversationAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const setErrorMessage = useSetAtom(errorMessageAtom);

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization ID");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    setIsPending(true);

    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      });

      setConversationId(conversationId);
      setPreviousScreen("selection");
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <WidgetHeader
        title="Hi There 👋"
        subtitle="How can we help you today?"
        showAvatar={false}
      />

      <div className="flex-1 bg-[#f8f9fa] p-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="space-y-3">
            <Card
              className={`shadow-sm border-0 bg-white hover:shadow-lg transition-all duration-200 group ${
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-lg"
              }`}
              onClick={isPending ? undefined : handleNewConversation}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md group-hover:shadow-lg transition-shadow">
                      <MessageSquareTextIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2c3e50] text-base mb-1">
                        Start Chat
                      </h3>
                      <p className="text-sm text-[#6c757d]">Chat with us</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-[#6c757d] group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
            {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
              <Card
                className={`shadow-sm border-0 bg-white hover:shadow-lg transition-all duration-200 group ${
                  isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg"
                }`}
                onClick={() => setScreen("voice")}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md group-hover:shadow-lg transition-shadow">
                        <MicIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2c3e50] text-base mb-1">
                          Voice chat with our AI assistant
                        </h3>
                        <p className="text-sm text-[#6c757d]">
                          Start a Voice chat with our AI assistant
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-[#6c757d] group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            )}
            {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
              <Card
                className={`shadow-sm border-0 bg-white hover:shadow-lg transition-all duration-200 group ${
                  isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg"
                }`}
                onClick={() => setScreen("contact")}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md group-hover:shadow-lg transition-shadow">
                        <PhoneIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2c3e50] text-base mb-1">
                          Start Phone Call
                        </h3>
                        <p className="text-sm text-[#6c757d]">
                          Start a phone call with us
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-[#6c757d] group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
