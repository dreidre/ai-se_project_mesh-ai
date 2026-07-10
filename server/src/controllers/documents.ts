import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { getCacheValue, setCacheValue, deleteCacheValue } from '../utils/cache.js';

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
    return;
  }

  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  const chunks = chunkText(text);

  const title = req.body.title || req.file.originalname;

  const document = await Document.create({
    title,
    fileName: req.file.originalname,
    userId: req.user!.userId,
  });

  await Promise.all(
    chunks.map(async (chunk) =>
      Chunk.create({
        documentId: document._id,
        text: chunk,
        embedding: await createEmbedding(chunk),
      }),
    ),
  );

  deleteCacheValue(`documents-list:${req.user!.userId}`);

  res.status(201).send({
    success: true,
    data: document,
    error: null,
  });
};

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;
  const cacheKey = `documents-list:${userId}`;
  const cached = getCacheValue(cacheKey);

  if (cached) {
    res.status(200).json(cached);
    return;
  }

  const documents = await Document.find({ userId });
  const responseData = { success: true, data: documents, error: null };

  setCacheValue(cacheKey, responseData, 30 * 1000);
  res.status(200).json(responseData);
};
