import { embedMany, embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { db } from "../db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "@/lib/db/schemas/embeddings";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// 解释一下
// 1. 使用 openai 的 embedding 模型，使用 text-embedding-ada-002 模型
// 2. 使用 generateChunks 函数，将输入的文本分割成多个句子
// 3. 使用 embedMany 函数，将多个句子转换为向量
// 4. 返回一个包含内容和向量的数组

const openai = createOpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
  apiKey: process.env.SILICON_FLOW_API_KEY,
});
const embeddingModel = openai.embedding("BAAI/bge-large-zh-v1.5");
console.log("embeddingModel", embeddingModel);

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  console.log("embeddings", embeddings);
  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
};

// 从输入字符串中生成单个向量
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// 从数据库中找到与用户查询最相似的内容
export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
