import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../contstants";

export const supportAgent = new Agent(components.agent, {
  chat: openai("gpt-4o-mini"),
  instructions: SUPPORT_AGENT_PROMPT,
});
