import { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import { getChats } from '../../utils/api';
import { createChat } from '../../utils/api';
import { type Chat as ChatType } from '../../utils/api';
import { getChat, type Message } from "../../utils/api";
import messages_error from '../../assets/messages_error.png';

import './Chat.css';

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


  console.log(messages);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || 'New Chat';
    setIsCreatingChat(false);
    setNewChatTitle('');
    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
      }
    } catch {
      // A toast or inline error could go here in the future
    }
  };


  return (
  <div className="chat">
    <aside className="chat__sidebar">
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
            onClick={() => setActiveChatId(c._id)}
          >
            {c.title}
          </li>
        ))}
      </ul>
    </aside>

    <div className="chat__main">
      {!messagesError && !isLoadingMessages && (messages.length === 0 || !activeChatId) && (
        <div className="chat__no-messages">
          <p className="chat__no-messages-text">Create a new chat or select an existing chat to start the conversation</p>
          <button className="chat__no-messages-button" onClick={() => setIsCreatingChat(true)}>
            Start New Chat
          </button>
        </div>
      )}

      {activeChatId && isLoadingMessages && (
        <p className="chat__no-messages">Loading messages...</p>
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
      )}
    </div>
  </div>
);
}
