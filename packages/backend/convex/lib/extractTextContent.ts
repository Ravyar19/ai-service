import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  image: openai.chat("gpt-4o-mini"),
  pdf: openai.chat("gpt-4o"),
  html: openai.chat("gpt-4o"),
  text: openai.chat("gpt-4o"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
] as const;

const SYSTEM_PROMPT = {
  image:
    "You turn images into text. if its a photo of a document, transcribe it, IF it is not a document, describe it in detail",
  pdf: "You transform pdf files into text",
  html: "You transform html files into markdown",
};

export type extractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: extractTextContentArgs
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;
  const url = await ctx.storage.getUrl(storageId);
  assert(url !== null, "Failed to get storage url");
  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }
  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }
  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes ?? (await (await ctx.storage.get(storageId))?.arrayBuffer());
  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }
  const text = new TextDecoder().decode(arrayBuffer);
  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPT.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text,
            },
            {
              type: "text",
              text: "extract the text and print it in a markdown format without explaining you will do so",
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), filename, mediaType: mimeType },
          {
            type: "text",
            text: "Extract the text from the PDF and it without explaining you will do so ",
          },
        ] as any,
      },
    ],
  });
  return result.text;
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPT.image,
    messages: [
      { role: "user", content: [{ type: "image", image: new URL(url) }] },
    ],
  });
  return result.text;
}
