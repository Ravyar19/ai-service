import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import ConversationsPanel from "./components/conversations-panel";

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full ">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="h-full w-full">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
