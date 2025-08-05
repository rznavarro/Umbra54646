import { useState, useCallback } from 'react';
import { Message, MessageStatus } from '../types';

export const useAgentMessages = () => {
  const [agentMessages, setAgentMessages] = useState<{[key: string]: Message[]}>({});

  const addMessage = useCallback((functionId: string, message: Omit<Message, 'messageId'>) => {
    const messageWithId = {
      ...message,
      messageId: message.messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setAgentMessages(prev => ({
      ...prev,
      [functionId]: [...(prev[functionId] || []), messageWithId]
    }));

    return messageWithId.messageId;
  }, []);

  const updateMessageStatus = useCallback((functionId: string, messageId: string, status: MessageStatus) => {
    setAgentMessages(prev => ({
      ...prev,
      [functionId]: (prev[functionId] || []).map(msg => 
        msg.messageId === messageId ? { ...msg, status } : msg
      )
    }));
  }, []);

  const addAgentResponse = useCallback((functionId: string, messageId: string, response: string, metadata?: any) => {
    const agentMessage: Message = {
      type: 'agent',
      message: response,
      timestamp: new Date().toLocaleTimeString(),
      messageId: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'delivered',
      metadata
    };

    setAgentMessages(prev => ({
      ...prev,
      [functionId]: [...(prev[functionId] || []), agentMessage]
    }));

    // Update the original user message status to delivered
    updateMessageStatus(functionId, messageId, 'delivered');
  }, [updateMessageStatus]);

  const initializeAgent = useCallback((functionId: string, functionName: string) => {
    if (!agentMessages[functionId]) {
      const welcomeMessage: Message = {
        type: 'agent',
        message: `¡Hola! Soy el agente especializado en "${functionName}". Estoy aquí para ayudarte con esta funcionalidad específica. ¿En qué puedo asistirte?`,
        timestamp: new Date().toLocaleTimeString(),
        messageId: `welcome_${functionId}_${Date.now()}`,
        status: 'delivered'
      };

      setAgentMessages(prev => ({
        ...prev,
        [functionId]: [welcomeMessage]
      }));
    }
  }, [agentMessages]);

  const clearMessages = useCallback((functionId?: string) => {
    if (functionId) {
      setAgentMessages(prev => ({
        ...prev,
        [functionId]: []
      }));
    } else {
      setAgentMessages({});
    }
  }, []);

  return {
    agentMessages,
    addMessage,
    updateMessageStatus,
    addAgentResponse,
    initializeAgent,
    clearMessages
  };
};