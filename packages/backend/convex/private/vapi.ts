import { Vapi, VapiClient } from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretString } from "../lib/secrets";
import { ConvexError } from "convex/values";

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "unauthorized",
        message: "identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "unauthorized",
        message: "organization not found",
      });
    }
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "not_found",
        message: "plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "not_found",
        message: "secret data not found",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "not_found",
        message: "Credentials incomplete please reconnect your Vapi account",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});
export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "unauthorized",
        message: "identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "unauthorized",
        message: "organization not found",
      });
    }
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "not_found",
        message: "plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "not_found",
        message: "secret data not found",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "not_found",
        message: "Credentials incomplete please reconnect your Vapi account",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});
