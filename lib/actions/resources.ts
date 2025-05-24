"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schemas/resources";
import { db } from "@/lib/db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "@/lib/db/schemas/embeddings";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    return "Resource successfully created and embedded";
  } catch (e) {
    if (e instanceof Error) {
      return e.message.length > 0 ? e.message : "Error, please try again.";
    }
  }
};
