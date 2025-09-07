"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
} from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { api } from "@workspace/backend/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "@/modules/dashboard/atoms";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

const ConversationsPanel = () => {
  const pathname = usePathname();
  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);
  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    {
      initialNumItems: 10,
    }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });

  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b p-4">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            setStatusFilter(value as Doc<"conversations">["status"] | "all");
          }}
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          <div className="flex flex-col text-sm w-full">
            {isLoadingFirstPage ? (
              <div className="flex flex-col gap-4 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              conversations?.results?.map((conversation) => {
                const isLastMessageFromOperator =
                  conversation.lastMessage?.message?.role === "assistant";
                const country = getCountryFromTimezone(
                  conversation.contactSession.metadata?.timezone
                );

                const countryFlagUrl = country?.code
                  ? getCountryFlagUrl(country.code)
                  : undefined;
                return (
                  <Link
                    href={`/conversations/${conversation._id}`}
                    key={conversation._id}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-4 border-b p-4 py-5 text-sm leading-tight hover:bg-accent/50 transition-all duration-200 hover:text-accent-foreground",
                      pathname === `/conversations/${conversation._id}` &&
                        "bg-accent/50 text-accent-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                        pathname === `/conversations/${conversation._id}` &&
                          "opacity-100"
                      )}
                    />
                    <DicebearAvatar
                      seed={conversation.contactSession._id}
                      size={40}
                      badgeImageUrl={countryFlagUrl}
                      className="shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex w-full items-center gap-2">
                        <span className="truncate font-bold">
                          {conversation.contactSession.name}
                        </span>
                        <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                          {formatDistanceToNow(
                            new Date(conversation._creationTime),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex w-0 grow items-center gap-1">
                          {isLastMessageFromOperator && (
                            <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "line-clamp-1 text-muted-foreground text-xs ",
                              !isLastMessageFromOperator &&
                                "font-bold text-black"
                            )}
                          >
                            {conversation.lastMessage?.text}
                          </span>
                        </div>
                        <ConversationStatusIcon
                          status={conversation.status}
                          showLabel={true}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
            {!isLoadingFirstPage && (
              <InfiniteScrollTrigger
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                ref={topElementRef}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ConversationsPanel;
