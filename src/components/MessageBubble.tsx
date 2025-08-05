import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLatest = false }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''} ${isLatest ? 'animate-fadeIn' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-black" />
        </div>
      )}
      
      <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
        isUser 
          ? 'bg-green-600 text-black' 
          : 'bg-gray-800 text-gray-200'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${
            isUser ? 'text-green-900' : 'text-gray-400'
          }`}>
            {message.timestamp}
          </span>
          
          {isUser && (
            <StatusIndicator status={message.status} size="sm" />
          )}
        </div>

        {message.metadata && (
          <div className="mt-2 pt-2 border-t border-gray-600/30">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              {message.metadata.confidence && (
                <span>Confianza: {Math.round(message.metadata.confidence * 100)}%</span>
              )}
              {message.metadata.processingTime && (
                <span>Tiempo: {message.metadata.processingTime}s</span>
              )}
            </div>
            {message.metadata.sources && message.metadata.sources.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">
                  Fuentes: {message.metadata.sources.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
};