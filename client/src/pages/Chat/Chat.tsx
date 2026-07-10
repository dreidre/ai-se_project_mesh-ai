import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  getChats,
  createChat,
  getChat,
  sendMessage,
  type Chat as ChatType,
  type Message,
} from "../../utils/api";

import ErrorImg from "../../assets/error.png";
import "./Chat.css";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export default function Chat() {
  // Chat state
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChat] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>("");

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>("");

  // Input state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  // Mobile sidebar state from AppLayout
  const { isMobileMenuOpen, setIsMobileMenuOpen } =
    useOutletContext<MobileContext>();

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load chats...");
      } finally {
        setIsLoadingChat(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const load = async () => {
      setMessages([]);
      setMessagesError("");
      setIsLoadingMessages(true);
      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";
    setIsCreatingChat(false);
    setNewChatTitle("");
    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
        setIsMobileMenuOpen(false);
      }
    } catch {
      // A toast or inline error could go here in the future
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setInput("");

    try {
      const res = await sendMessage(activeChatId, text);
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch {
      const errorMessage: Message = {
        _id: Date.now().toString(),
        chatId: activeChatId,
        role: "assistant",
        content: "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat">
      <aside
        className={`chat__sidebar${isMobileMenuOpen ? " chat__sidebar_open" : ""}`}
      >
        <button
          type="button"
          className="chat__sidebar-btn"
          onClick={() => setIsCreatingChat(true)}
        >
          New Chat
        </button>
        {isCreatingChat && (
          <input
            className="chat__title-input"
            type="text"
            placeholder="Chat name"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateChat();
              if (e.key === "Escape") {
                setIsCreatingChat(false);
                setNewChatTitle("");
              }
            }}
            autoFocus
          />
        )}

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {chats.map((c) => (
            <li
              key={c._id}
              className={
                c._id === activeChatId
                  ? "chat__item chat__item_active"
                  : "chat__item"
              }
              onClick={() => {
                setActiveChatId(c._id);
                setIsMobileMenuOpen(false);
              }}
            >
              {c.title}
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat__main">
        {activeChatId && isLoadingMessages && (
          <div className="chat__no-messages">
            <p className="chat__title">Loading messages...</p>
          </div>
        )}

        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-messages">
            <h1 className="chat__title">
              Create a new chat or select an existing chat to start the
              conversation
            </h1>
            <button
              type="button"
              className="chat__standard-btn"
              onClick={() => {
                setIsCreatingChat(true);
                setIsMobileMenuOpen(true);
              }}
            >
              Start New Chat
            </button>
          </div>
        )}

        {!messagesError &&
          !isLoadingMessages &&
          activeChatId &&
          messages.length === 0 && (
            <div className="chat__no-messages">
              <h1 className="chat__title">
                Ask a question below to start the conversation
              </h1>
            </div>
          )}

        {activeChatId && messagesError && (
          <div className="chat__error">
            <img src={ErrorImg} alt="" className="chat__error-img" />
            <h1 className="chat__title chat__title_type_error">
              Looks like something went wrong
            </h1>
            <p className="chat__cta">
              Try reloading the page or creating the chat again
            </p>
            <button
              type="button"
              className="chat__standard-btn"
              onClick={() => navigate("/")}
            >
              Go to the main page
            </button>
          </div>
        )}

        {activeChatId && !isLoadingMessages && !messagesError && (
          <>
            <ul className="chat__messages">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={
                    msg.role === "user"
                      ? "chat__message chat__message_user"
                      : "chat__message chat__message_assistant"
                  }
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </li>
              ))}
              {isSending && (
                <li className="chat__message chat__message_assistant chat__message_thinking">
                  Thinking…
                </li>
              )}            
              </ul>
            <div className="chat__input-bar">
              <textarea
                className="chat__input"
                placeholder="Ask any question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                rows={1}
              />
              <button
                className="chat__send"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                aria-label="Send message"
              ></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}