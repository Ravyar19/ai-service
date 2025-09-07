"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationAtom,
  organizationIdAtom,
  previousScreenAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { ArrowLeftIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setPreviousScreen = useSetAtom(previousScreenAtom);
  const setConversationId = useSetAtom(conversationAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 5,
    }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 5,
      observerEnabled: false,
    });

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("selection")}
            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">
              Your Conversations
            </h1>
          </div>
        </div>
      </WidgetHeader>

      <div className="flex-1 bg-[#f8f9fa] p-6 overflow-y-auto">
        <div className="space-y-4">
          {conversations.status === "LoadingFirstPage" ? (
            // Loading state
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-sm border-0 bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-20"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : conversations.results.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-300"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No conversations yet
              </h3>
              <p className="text-slate-600 mb-4">
                Start a new conversation to see it here
              </p>
              <Button
                onClick={() => setScreen("selection")}
                className="bg-slate-800 hover:bg-slate-700 text-white"
              >
                Start New Chat
              </Button>
            </div>
          ) : (
            conversations?.results.map((conversation) => (
              <Card
                key={conversation._id}
                className="shadow-sm border-0 bg-white hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  setConversationId(conversation._id);
                  setPreviousScreen("inbox");
                  setScreen("chat");
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          💬
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                          Chat Conversation
                        </h3>
                        <p className="text-xs text-slate-500">
                          {formatDistanceToNow(
                            new Date(conversation._creationTime),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConversationStatusIcon status={conversation.status} />
                    </div>
                  </div>

                  {conversation.lastMessage?.text && (
                    <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-slate-200">
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <ConversationStatusIcon
                      status={conversation.status}
                      showLabel={true}
                      className="text-xs"
                    />
                    <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                      <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
