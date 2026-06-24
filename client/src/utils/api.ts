import type { CurrentUser } from "../types";

const BASE_URL = "/api";
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

export type LoginResponse = {
  token: string;
  user: CurrentUser;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth-token') ?? '';

  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('auth-token');
    // Don't force a navigation here; let callers handle unauthenticated state.
    return { success: false, data: null, error: { message: 'Session expired' } };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || 'Request failed');
  }

  return res.json();
}

export function loginUser(
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  return request<LoginResponse>(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<ApiResponse<CurrentUser>> {
  return request<CurrentUser>(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  return request<CurrentUser>(`${BASE_URL}/users/me`);
}

export const getDocuments = async (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  await delay(700);
  return {
    success: true,
    data: [
      {
        _id: "1",
        title: "Code Review Guidelines",
        fileName: "code-review-guidelines.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "API Reference",
        fileName: "api-reference.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        title: "Onboarding Guide",
        fileName: "onboarding-guide.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "4",
        title: "Code of Conduct",
        fileName: "code_of_conduct.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ],
    error: null,
  };
};

export const getChats = async (): Promise<ApiResponse<Chat[]>> => {
  await delay(700);
  return {
    success: true,
    data: [
      {
        _id: "c1",
        title: "What is posthog",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "c2",
        title: "Who are our users",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "c3",
        title: "Marketing Hypothesis",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ],
    error: null,
  };
};

export const getChat = async (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  await delay(700);
  return {
    success: true,
    data: {
      chat: {
        _id: id,
        title: "Sample Chat",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      messages: [],
    },
    error: null,
  };
};

export const createChat = async (title: string): Promise<ApiResponse<Chat>> => {
  await delay(400);
  return {
    success: true,
    data: {
      _id: Date.now().toString(),
      title,
      userId: "u1",
      createdAt: new Date().toISOString(),
    },
    error: null,
  };
};

export const sendMessage = async (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message>> => {
  await delay(1500);
  return {
    success: true,
    data: {
      _id: Date.now().toString(),
      chatId,
      role: "assistant",
      content: `This is a simulated response to: "${question}"`,
      createdAt: new Date().toISOString(),
    },
    error: null,
  };
};

