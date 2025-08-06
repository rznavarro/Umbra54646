import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface SendMessagePayload {
  message: string;
  functionId: string;
  webhook: string;
  context?: {
    activeModule?: number;
    functionName?: string;
    previousMessages?: any[];
  };
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  status: string;
  error?: string;
}

export class WebhookService {
  private static instance: WebhookService;
  
  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    const messageId = `user_${Date.now()}_${uuidv4().substring(0, 8)}`;
    
    try {
      console.log('Sending message to webhook:', payload.webhook);
      console.log('Message payload:', payload);
      
      // Prepare the webhook payload
      const webhookPayload = {
        ...payload,
        messageId,
        timestamp: new Date().toISOString(),
        user: 'admin'
      };

      const response = await fetch(`${API_BASE_URL}/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log('API response status:', response.status);
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      return {
        success: true,
        messageId,
        status: 'sent'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        messageId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async pollForResponses(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pending-responses`);
      const data = await response.json();
      
      return data.responses || [];
    } catch (error) {
      console.error('Error polling for responses:', error);
      return [];
    }
  }

  async checkMessageStatus(messageId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/message-status/${messageId}`);
      const data = await response.json();
      
      return data.status || 'unknown';
    } catch (error) {
      console.error('Error checking message status:', error);
      return 'error';
    }
  }

  async clearCache(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clear-cache`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      return data.success || false;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
}