import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Download, Minimize2 } from 'lucide-react';
import { AgentFunction } from '../types';
import { MessageBubble } from './MessageBubble';
import { ConnectionStatus } from './StatusIndicator';
import { useAgentMessages } from '../hooks/useAgentMessages';
import { useWebhooks } from '../hooks/useWebhooks';

interface AgentChatProps {
  agentFunction: AgentFunction;
  onClose: () => void;
  moduleColor: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({ 
  agentFunction, 
  onClose, 
  moduleColor 
}) => {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    agentMessages, 
    addMessage, 
    updateMessageStatus, 
    addAgentResponse, 
    initializeAgent 
  } = useAgentMessages();
  
  const { 
    responses, 
    connectionStatus, 
    sendMessage 
  } = useWebhooks();

  // Initialize agent when component mounts
  useEffect(() => {
    initializeAgent(agentFunction.id, agentFunction.name);
  }, [agentFunction.id, agentFunction.name, initializeAgent]);

  // Handle incoming responses
  useEffect(() => {
    responses.forEach(response => {
      if (response.functionId === agentFunction.id) {
        console.log('Received response for agent:', agentFunction.id, response);
        addAgentResponse(
          agentFunction.id,
          response.messageId,
          response.output,
          response.metadata
        );
      }
    });
  }, [responses, agentFunction.id, addAgentResponse]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages[agentFunction.id]]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message with sending status
    const messageId = addMessage(agentFunction.id, {
      type: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sending'
    });

    try {
      // Send to webhook
      const result = await sendMessage({
        message: userMessage,
        functionId: agentFunction.id,
        webhook: agentFunction.webhook,
        context: {
          activeModule: parseInt(agentFunction.id.split('.')[0]),
          functionName: agentFunction.name,
          previousMessages: agentMessages[agentFunction.id]?.slice(-5) || []
        }
      });

      if (result.success) {
        updateMessageStatus(agentFunction.id, messageId, 'sent');
      } else {
        updateMessageStatus(agentFunction.id, messageId, 'error');
        // Add error message from agent
        addAgentResponse(
          agentFunction.id,
          messageId,
          `Lo siento, hubo un error procesando tu solicitud: ${result.error || 'Error desconocido'}. Por favor intenta nuevamente.`
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      updateMessageStatus(agentFunction.id, messageId, 'error');
      addAgentResponse(
        agentFunction.id,
        messageId,
        'Lo siento, hubo un error de conexión. Por favor verifica tu conexión e intenta nuevamente.'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModuleColor = (color: string) => {
    const colors = {
      green: 'from-green-400 to-green-600',
      blue: 'from-blue-400 to-blue-600',
      red: 'from-red-400 to-red-600',
      purple: 'from-purple-400 to-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const exportChat = () => {
    const messages = agentMessages[agentFunction.id] || [];
    const chatText = messages.map(msg => 
      `[${msg.timestamp}] ${msg.type === 'user' ? 'Usuario' : 'Agente'}: ${msg.message}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${agentFunction.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getModuleColor(moduleColor)} text-black rounded-lg shadow-lg hover:opacity-90 transition-opacity`}
        >
          <Bot className="w-4 h-4" />
          <span className="font-medium">{agentFunction.name}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getModuleColor(moduleColor)} rounded-lg flex items-center justify-center`}>
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100">{agentFunction.name}</h3>
              <ConnectionStatus status={connectionStatus} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportChat}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Exportar chat"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Minimizar"
            >
              <Minimize2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {(agentMessages[agentFunction.id] || []).map((message, index) => (
              <MessageBubble 
                key={message.messageId} 
                message={message}
                isLatest={index === (agentMessages[agentFunction.id] || []).length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-end space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta específica para este agente..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 resize-none min-h-[44px] max-h-32"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className={`p-3 bg-gradient-to-r ${getModuleColor(moduleColor)} text-black rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </div>
        </div>
      </div>
    </div>
  );
};