export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'error';

export interface Message {
  type: 'user' | 'agent';
  message: string;
  timestamp: string;
  messageId: string;
  status: MessageStatus;
  metadata?: {
    confidence?: number;
    processingTime?: number;
    sources?: string[];
  };
}

export interface AgentFunction {
  id: string;
  name: string;
  description: string;
  icon: any;
  webhook: string;
  responseWebhook?: string;
  howToUse: string;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  icon: any;
  color: string;
  functions: AgentFunction[];
}

export interface WebhookResponse {
  messageId: string;
  output: string;
  functionId: string;
  timestamp: string;
  metadata?: {
    confidence: number;
    processingTime: number;
    sources?: string[];
  };
}