"use client";

import { useSetAtom, useAtomValue } from "jotai";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import {
  screenAtom,
  conversationAtom,
  contactSessionIdAtomFamily,
  organizationIdAtom,
  previousScreenAtom,
} from "../../atoms/widget-atoms";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/_generated/api";
import { useAction, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTools,
  AIInputTextarea,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import { Form, FormField } from "@workspace/ui/components/form";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const previousScreen = useAtomValue(previousScreenAtom);
  const setPreviousScreen = useSetAtom(previousScreenAtom);
  const conversationId = useAtomValue(conversationAtom);
  const setConversationId = useSetAtom(conversationAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const handleBack = () => {
    setConversationId(null);
    // Go back to the previous screen if it exists, otherwise default to selection
    const targetScreen = previousScreen || "selection";
    setPreviousScreen(null); // Clear previous screen after using it
    setScreen(targetScreen);
  };

  const handleMenu = () => {
    // TODO: Implement menu functionality
    console.log("Menu clicked");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      !conversation ||
      !contactSessionId ||
      conversation.status === "resolved" ||
      conversation.status === "escalated"
    ) {
      return;
    }
    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">Chat</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenu}
            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </WidgetHeader>

      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])
            ?.filter(
              (message) => message.content && message.content.trim() !== ""
            )
            ?.map((message) => (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
                className={message.role === "user" ? "user-message" : ""}
              >
                <AIMessageContent
                  className={
                    message.role === "user" ? "bg-slate-800 text-white" : ""
                  }
                >
                  <AIResponse>{message.content || ""}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            ))}
        </AIConversationContent>
      </AIConversation>
      <Form {...form}>
        <AIInput
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-none border-x-0 border-b-0"
        >
          <FormField
            control={form.control}
            disabled={
              conversation?.status === "resolved" ||
              conversation?.status === "escalated"
            }
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                {...field}
                disabled={
                  conversation?.status === "resolved" ||
                  conversation?.status === "escalated"
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "Conversation is resolved"
                    : conversation?.status === "escalated"
                      ? "Conversation escalated to human operator"
                      : "Type your message..."
                }
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" ||
                conversation?.status === "escalated" ||
                !form.formState.isValid
              }
              status="ready"
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white border-slate-800"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
