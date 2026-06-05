import { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import { getChats } from '../../utils/api';
import { createChat } from '../../utils/api';
import { type Chat as ChatType } from '../../utils/api';
import { getChat, sendMessage, type Message } from "../../utils/api";
import messages_error from '../../assets/messages_error.png';
import { useOutletContext } from 'react-router-dom';
import './Chat.css';

  type MobileContext = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
  };

export default function Chat() {

  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);


  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext<MobileContext>();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError('Failed to load chats');
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    // 1. If activeChatId isn't set, return early
    if (!activeChatId) {
      return;
    }

    const load = async () => {
      setMessages([]);
      setMessagesError("");
      setIsLoadingMessages(true);
      // See Hint 1
      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Message error");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || 'New Chat';
    setIsCreatingChat(false);
    setNewChatTitle('');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    setInput('');
    setIsSending(true);

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
      setInput('');
      setIsSending(true);
    } finally {
      setIsSending(false);
    }
  };

  console.log(isMobileMenuOpen);

  return (
  <div className="chat">
    <aside
      className={`chat__sidebar${
        isMobileMenuOpen ? ' chat__sidebar_open' : ''
      }`}
    >
      <button className="chat__new-btn" type="button" onClick={() => setIsCreatingChat(true)}>
        <span className="chat__new-btn-icon">+</span>New Chat
      </button>

      {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
      {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}
      {isCreatingChat && (
        <input
          className="chat__title-input"
          type="text"
          placeholder="Chat name"
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateChat();
            if (e.key === 'Escape') {
              setNewChatTitle('');
              setIsCreatingChat(false);
            }
          }}
          autoFocus
        />
      )}

      <ul className="chat__list">
        {chats.map((c) => (
          <li
            key={c._id}
            className={
              c._id === activeChatId
                ? 'chat__item chat__item_active'
                : 'chat__item'
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
      {!messagesError && !isLoadingMessages && !activeChatId && (
        <div className="chat__no-messages">
          <p className="chat__no-messages-text">Create a new chat or select an existing chat to start the conversation</p>
          <button className="chat__no-messages-button" 
          onClick={() => {
            setIsCreatingChat(true);
            setIsMobileMenuOpen(true);
          }}
          >
            Start New Chat
          </button>
        </div>
      )}

      {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
        <div className="chat__no-messages">
            <p className="chat__no-messages-text">Ask a question below to start the conversation</p>
            {/* <div className="chat__message-input-container">
              <textarea className="chat__message-input" placeholder="Ask any question" />
              <button className="chat__message-send-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5004 12H5.00043M4.91577 12.2915L2.58085 19.2662C2.39742 19.8142 2.3057 20.0881 2.37152 20.2569C2.42868 20.4034 2.55144 20.5145 2.70292 20.5567C2.87736 20.6054 3.14083 20.4869 3.66776 20.2497L20.3792 12.7296C20.8936 12.4981 21.1507 12.3824 21.2302 12.2216C21.2993 12.082 21.2993 11.9181 21.2302 11.7784C21.1507 11.6177 20.8936 11.5019 20.3792 11.2705L3.66193 3.74776C3.13659 3.51135 2.87392 3.39315 2.69966 3.44164C2.54832 3.48375 2.42556 3.59454 2.36821 3.74078C2.30216 3.90917 2.3929 4.18255 2.57437 4.72931L4.91642 11.7856C4.94759 11.8795 4.96317 11.9264 4.96933 11.9744C4.97479 12.0171 4.97473 12.0602 4.96916 12.1028C4.96289 12.1508 4.94718 12.1977 4.91577 12.2915Z" stroke="#1C1C1C" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div> */}
        </div>
      )}

      {activeChatId && isLoadingMessages && (
        <p className="chat__no-messages">Loading...</p>
      )}

      {activeChatId && messagesError && (
        <div className="chat__error">
          <img src={messages_error} alt="Error loading messages" className="chat__error-image" />
          <h1 className="chat__error-title">Looks like something went wrong</h1>
          <p className="chat__error-text">Try reloading the page or creating the chat again</p>
          <button className="chat__error-button">
            Go to the Main Page
          </button>
        </div>
      )}

      {activeChatId && !isLoadingMessages && !messagesError && (
        <>
        <ul className="chat__messages">
          {messages.map((m) => (
            <li
              key={m._id}
              className={
                m.role === 'user'
                  ? 'chat__message chat__message_user'
                  : 'chat__message chat__message_assistant'
              }
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </li>
          ))}
        </ul>
        <div className="chat__input-bar">
          <textarea
            className="chat__input"
            placeholder="Ask any question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isSending}
          />
          <button
            className="chat__send"
            aria-label="Send message"
            onClick={handleSend} 
            disabled={isSending || !input.trim()}
          >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5004 12H5.00043M4.91577 12.2915L2.58085 19.2662C2.39742 19.8142 2.3057 20.0881 2.37152 20.2569C2.42868 20.4034 2.55144 20.5145 2.70292 20.5567C2.87736 20.6054 3.14083 20.4869 3.66776 20.2497L20.3792 12.7296C20.8936 12.4981 21.1507 12.3824 21.2302 12.2216C21.2993 12.082 21.2993 11.9181 21.2302 11.7784C21.1507 11.6177 20.8936 11.5019 20.3792 11.2705L3.66193 3.74776C3.13659 3.51135 2.87392 3.39315 2.69966 3.44164C2.54832 3.48375 2.42556 3.59454 2.36821 3.74078C2.30216 3.90917 2.3929 4.18255 2.57437 4.72931L4.91642 11.7856C4.94759 11.8795 4.96317 11.9264 4.96933 11.9744C4.97479 12.0171 4.97473 12.0602 4.96916 12.1028C4.96289 12.1508 4.94718 12.1977 4.91577 12.2915Z" stroke="#1C1C1C" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        </>
      )}
    </div>
  </div>
);
}
