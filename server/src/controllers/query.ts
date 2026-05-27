import type { Request, Response } from 'express';
import OpenAI from 'openai';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';

const LLM_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct';

let client: OpenAI;

const getClient = () => {
  if (!client) {
    client = new OpenAI({
      baseURL: 'https://api.tokenfactory.nebius.com/v1/',
      apiKey: process.env.NEBIUS_API_KEY!,
    });
  }
  return client;
};

const buildContext = (chunks: { text: string }[]): string => {
  if (chunks.length === 0) {
    return 'No relevant context found.';
  }

  return chunks
    .map((chunk, index) => `Chunk ${index + 1}: ${chunk.text}`)
    .join('\n\n');
};

export const queryDocuments = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  const userId = req.user!.userId;
  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);

  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful research assistant. Answer the question using only the provided context. If the context does not contain enough information to answer, say so.',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
    temperature: 0.2,
  });

  const answer = response.choices[0]!.message.content ?? 'No answer returned.';

  res.status(200).json({
    success: true,
    data: { question, chunks: ranked, answer },
    error: null,
  });
};
