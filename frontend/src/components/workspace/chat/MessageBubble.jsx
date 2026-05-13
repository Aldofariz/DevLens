import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'assistant';
  const time = message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`message-row ${isAI ? 'ai' : 'user'}`}>
      {isAI && (
        <div className="ai-avatar">DL</div>
      )}
      <div className="message-content-wrapper">
        <div className="message-bubble">
          {message.content}
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
