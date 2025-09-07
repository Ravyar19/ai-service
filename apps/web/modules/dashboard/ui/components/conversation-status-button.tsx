import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="ghost"
          className="status-resolved gap-2"
        >
          <CheckIcon />
          Resolved
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="ghost"
          className="status-escalated gap-2"
        >
          <ArrowUpIcon />
          Escalated
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Mark as escalated">
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        variant="ghost"
        className="status-unresolved gap-2"
      >
        <ArrowRightIcon />
        Unresolved
      </Button>
    </Hint>
  );
};
