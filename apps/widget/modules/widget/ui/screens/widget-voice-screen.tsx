import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { useVapi } from "../../hooks/use-vapi";
import { WidgetHeader } from "../components/widget-header";
import { screenAtom } from "../../atoms/widget-atoms";
import { useSetAtom } from "jotai";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const {
    isConnected,
    isSpeaking,
    transcript,
    startCall,
    endCall,
    isConnecting,
  } = useVapi();
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <p>Voice Chat</p>
        </div>
      </WidgetHeader>
      {transcript.length > 0 ? (
        <AIConversation>
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage
                key={`${message.role}-${index}`}
                from={message.role}
                className={message.role === "user" ? "user-message" : ""}
              >
                <AIMessageContent
                  className={
                    message.role === "user" ? "bg-slate-800 text-white" : ""
                  }
                >
                  {message.text}
                </AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
        </AIConversation>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-y-4 flex-1">
          <div className="flex items-center justify-center rounded-full border bg-white p-3 space-x-2">
            <MicIcon className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground">Transcript will appear here</p>
          </div>
        </div>
      )}

      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-4 rounded-full ",
                  isSpeaking ? "animate-pulse bg-red-500" : "bg-green-500"
                )}
              />
              <span className="text-muted-foreground text-sm">
                {isSpeaking ? "Assistant is speaking...." : "Listening..."}
              </span>
            </div>
          )}
          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button
                className="w-full rounded"
                disabled={isConnecting}
                variant="destructive"
                size="lg"
                onClick={() => endCall()}
              >
                <MicOffIcon />
                End Call
              </Button>
            ) : (
              <Button
                className="w-full rounded"
                disabled={isConnecting}
                size="lg"
                onClick={() => startCall()}
              >
                <MicIcon />
                Start Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
