import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { HomeIcon, MessageCircle } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);
  return (
    <footer className="bg-white border-t border-[#e9ecef] px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          className="flex cursor-pointer flex-col items-center gap-1 rounded-none border-0 bg-transparent p-2 hover:bg-transparent flex-1"
          size="icon"
          variant="ghost"
          onClick={() => setScreen("selection")}
        >
          <HomeIcon
            className={cn(
              "size-5",
              screen === "selection" ? "text-slate-800" : "text-[#6c757d]"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              screen === "selection" ? "text-slate-800" : "text-[#6c757d]"
            )}
          >
            Home
          </span>
        </Button>
        <Button
          className="flex flex-col cursor-pointer items-center gap-1 rounded-none border-0 bg-transparent p-2 hover:bg-transparent flex-1"
          size="icon"
          variant="ghost"
          onClick={() => setScreen("inbox")}
        >
          <MessageCircle
            className={cn(
              "size-5",
              screen === "inbox" ? "text-slate-800" : "text-[#6c757d]"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              screen === "inbox" ? "text-slate-800" : "text-[#6c757d]"
            )}
          >
            Messages
          </span>
        </Button>
      </div>
    </footer>
  );
};
