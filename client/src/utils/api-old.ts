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

  const messages: Message[] =
    id === "c2"
      ? [
          {
            _id: "m1",
            chatId: "c2",
            role: "user",
            content: "Who are our users?",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "m2",
            chatId: "c2",
            role: "assistant",
            content:
              "Our main users are product teams, marketers, and support teams who need quick answers from company knowledge.",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "m3",
            chatId: "c2",
            role: "user",
            content: "What do they use MeshAI for?",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "m4",
            chatId: "c2",
            role: "assistant",
            content:
              "They use MeshAI to search internal documents, summarize information, and turn scattered knowledge into clear answers.",
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

  return {
    success: true,
    data: {
      chat: {
        _id: id,
        title: "Sample Chat",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      messages,
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
