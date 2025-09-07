import { cn } from "@workspace/ui/lib/utils";

type ConversationStatus = "unresolved" | "escalated" | "resolved";

interface ConversationStatusIconProps {
  status: ConversationStatus;
  className?: string;
  showLabel?: boolean;
}

export const ConversationStatusIcon = ({
  status,
  className,
  showLabel = false,
}: ConversationStatusIconProps) => {
  const getStatusConfig = (status: ConversationStatus) => {
    switch (status) {
      case "unresolved":
        return {
          color: "bg-green-500",
          label: "Active",
          description: "Ongoing conversation",
        };
      case "escalated":
        return {
          color: "bg-orange-500",
          label: "Escalated",
          description: "Requires attention",
        };
      case "resolved":
        return {
          color: "bg-gray-400",
          label: "Resolved",
          description: "Conversation completed",
        };
      default:
        return {
          color: "bg-gray-300",
          label: "Unknown",
          description: "Status unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  if (showLabel) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("w-2 h-2 rounded-full", config.color)} />
        <span className="text-xs text-slate-500">{config.label}</span>
      </div>
    );
  }

  return (
    <div
      className={cn("w-2 h-2 rounded-full", config.color, className)}
      title={`${config.label}: ${config.description}`}
    />
  );
};
