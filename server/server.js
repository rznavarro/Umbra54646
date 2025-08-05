const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// Redis client setup
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
client.connect().catch(console.error);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint to send message to n8n webhook
app.post('/api/send-message', async (req, res) => {
  try {
    const { message, functionId, messageId, webhook, responseWebhook, context } = req.body;
    
    const payload = {
      message,
      functionId,
      messageId,
      timestamp: new Date().toISOString(),
      user: 'admin',
      responseWebhook: `http://localhost:${port}/api/webhook-responses`,
      context: {
        activeModule: context?.activeModule || 1,
        functionName: context?.functionName || 'Unknown Function',
        sessionData: {
          previousMessages: context?.previousMessages || []
        }
      },
      webhookConfig: {
        expectsResponse: true,
        responseFormat: 'json',
        responseField: 'output',
        statusCode: 200
      }
    };

    // Store pending message in Redis
    await client.setex(`pending_${messageId}`, 300, JSON.stringify({
      messageId,
      functionId,
      timestamp: payload.timestamp,
      status: 'sent'
    }));

    // Send to n8n webhook
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      res.json({ success: true, messageId, status: 'sent' });
    } else {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      messageId: req.body.messageId,
      status: 'error'
    });
  }
});

// Endpoint for n8n to send responses back
app.post('/api/webhook-responses', async (req, res) => {
  try {
    const { messageId, output, functionId, timestamp, metadata } = req.body;
    
    console.log('Received response from n8n:', { messageId, functionId, output: output?.substring(0, 100) + '...' });
    
    // Store response in Redis with expiration
    await client.setex(`response_${messageId}`, 300, JSON.stringify({
      messageId,
      output: output || 'Respuesta procesada correctamente',
      functionId,
      timestamp: timestamp || new Date().toISOString(),
      metadata: metadata || { confidence: 0.9, processingTime: 1.5 }
    }));

    // Remove from pending
    await client.del(`pending_${messageId}`);
    
    res.status(200).json({ success: true, received: true });
  } catch (error) {
    console.error('Error handling webhook response:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint for frontend to poll for responses
app.get('/api/pending-responses', async (req, res) => {
  try {
    const keys = await client.keys('response_*');
    const responses = [];
    
    for (const key of keys) {
      const data = await client.get(key);
      if (data) {
        const response = JSON.parse(data);
        responses.push(response);
        // Clean up after reading
        await client.del(key);
      }
    }
    
    res.json({ responses, count: responses.length });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ responses: [], error: error.message });
  }
});

// Endpoint to check message status
app.get('/api/message-status/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const pending = await client.get(`pending_${messageId}`);
    const response = await client.get(`response_${messageId}`);
    
    if (response) {
      res.json({ status: 'delivered', hasResponse: true });
    } else if (pending) {
      res.json({ status: 'sent', hasResponse: false });
    } else {
      res.json({ status: 'unknown', hasResponse: false });
    }
  } catch (error) {
    console.error('Error checking message status:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Endpoint to clear all Redis data (for development)
app.delete('/api/clear-cache', async (req, res) => {
  try {
    await client.flushAll();
    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(port, () => {
  console.log(`🚀 Umbra Legal Server running on port ${port}`);
  console.log(`📡 Webhook endpoint: http://localhost:${port}/api/webhook-responses`);
  console.log(`🔍 Health check: http://localhost:${port}/api/health`);
});