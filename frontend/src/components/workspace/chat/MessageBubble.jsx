import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`message-row ${isAI ? 'ai' : 'user'}`}>
      {isAI && (
        <div className="ai-avatar">DL</div>
      )}
      <div className="message-content-wrapper">
        <div className="message-bubble">
          {message.content}
        </div>
        <span className="message-time">{message.timestamp}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
