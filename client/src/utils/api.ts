import type { CurrentUser } from "../types";

const BASE_URL = "/api";

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

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>(`${BASE_URL}/documents`);
};

export const getChats = async (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>(`${BASE_URL}/chats`);
};

export const getChat = async (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  return request<{ chat: Chat; messages: Message[] }>(`${BASE_URL}/chats/${id}`);
};

export const createChat = async (title: string) => {
  return request<Chat>(`${BASE_URL}/chats`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
};

export const sendMessage = async (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message>> => {
  return request<Message>(`${BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
};

export const uploadDocument = async (file: File): Promise<ApiResponse<KnowledgeDoc>> => {
  const token = localStorage.getItem('auth-token') ?? '';
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || 'Request failed');
  }

  return res.json();
};
