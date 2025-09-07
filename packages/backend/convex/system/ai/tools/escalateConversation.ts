import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation to a human operator",
  args: z.object({}),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Thread ID is required";
    }
    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to human operator",
      },
    });
    return "Conversation escalated to human operator";
  },
});
