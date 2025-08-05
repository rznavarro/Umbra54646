import React from 'react';
import { Clock, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { MessageStatus } from '../types';

interface StatusIndicatorProps {
  status: MessageStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className={`${sizeClasses[size]} animate-pulse text-yellow-400`} />;
      case 'sent':
        return <CheckCircle className={`${sizeClasses[size]} text-blue-400`} />;
      case 'delivered':
        return <CheckCircle className={`${sizeClasses[size]} text-green-400`} />;
      case 'error':
        return <AlertCircle className={`${sizeClasses[size]} text-red-400`} />;
      default:
        return <Clock className={`${sizeClasses[size]} text-gray-400`} />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getStatusIcon()}
    </div>
  );
};

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'error';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4 text-green-400" />,
          text: 'Conectado',
          color: 'text-green-400'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-yellow-400" />,
          text: 'Conectando...',
          color: 'text-yellow-400'
        };
      case 'error':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-400" />,
          text: 'Error de conexión',
          color: 'text-red-400'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex items-center space-x-2">
      {statusDisplay.icon}
      <span className={`text-xs ${statusDisplay.color}`}>
        {statusDisplay.text}
      </span>
    </div>
  );
};