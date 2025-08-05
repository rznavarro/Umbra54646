import { useState, useEffect, useCallback } from 'react';
import { WebhookService } from '../services/webhookService';
import { WebhookResponse } from '../types';

export const useWebhooks = () => {
  const [responses, setResponses] = useState<WebhookResponse[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  const webhookService = WebhookService.getInstance();

  const pollForResponses = useCallback(async () => {
    if (isPolling) return;
    
    setIsPolling(true);
    try {
      const newResponses = await webhookService.pollForResponses();
      
      if (newResponses.length > 0) {
        setResponses(prev => [...prev, ...newResponses]);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error polling for responses:', error);
      setConnectionStatus('error');
    } finally {
      setIsPolling(false);
    }
  }, [isPolling, webhookService]);

  useEffect(() => {
    // Start polling every 2 seconds
    const interval = setInterval(pollForResponses, 2000);
    
    // Initial connection test
    pollForResponses();
    
    return () => clearInterval(interval);
  }, [pollForResponses]);

  const clearResponses = useCallback(() => {
    setResponses([]);
  }, []);

  const sendMessage = useCallback(async (payload: any) => {
    try {
      setConnectionStatus('connected');
      const result = await webhookService.sendMessage(payload);
      return result;
    } catch (error) {
      setConnectionStatus('error');
      throw error;
    }
  }, [webhookService]);

  return {
    responses,
    isPolling,
    connectionStatus,
    clearResponses,
    sendMessage,
    pollForResponses
  };
};