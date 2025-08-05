# Umbra Legal - Sistema de Agentes IA con Webhooks Bidireccionales

## 🚀 Descripción

Sistema completo de 21 agentes IA especializados en derecho inmobiliario con comunicación bidireccional através de webhooks. Cada agente procesa consultas específicas y responde en tiempo real.

## 🏗️ Arquitectura

### Frontend
- **React 18** + TypeScript + Tailwind CSS
- **Comunicación en tiempo real** con polling cada 2 segundos
- **Estados de mensaje** visuales (enviando, enviado, entregado, error)
- **Chat especializado** por cada uno de los 21 agentes

### Backend
- **Node.js** + Express + Redis
- **Sistema de webhooks bidireccionales**
- **Cola de mensajes** con Redis para manejo de respuestas
- **API REST** completa para comunicación frontend-backend

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Redis Server
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar Redis**
```bash
# En Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis-server

# En macOS
brew install redis
brew services start redis

# En Windows
# Descargar Redis desde https://redis.io/download
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar el sistema completo**
```bash
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3001`
- Redis en `localhost:6379`

## 🔗 Configuración de Webhooks

### URLs de Webhooks por Agente

El sistema utiliza webhooks específicos para cada función:

**Módulo 1 - Agente Legal Interactivo 24/7:**
- Chat Legal 24/7: `https://n8n.srv880021.hstgr.cloud/webhook-test/Chat-Legal-24-7`
- Revisión Rápida: `https://n8n.srv880021.hstgr.cloud/webhook-test/Revision-Rapida-Documentos`
- Generación Informes: `https://n8n.srv880021.hstgr.cloud/webhook-test/Generacion-Informes-Legales`
- Simulador Problemas: `https://n8n.srv880021.hstgr.cloud/webhook-test/Simulador-Problemas-Legales`
- Buscador Normativas: `https://n8n.srv880021.hstgr.cloud/webhook-test/Buscador-Normativas-Locales`

### Flujo de Comunicación

1. **Usuario envía mensaje** → Frontend genera messageId único
2. **POST a webhook n8n** → Con payload completo
3. **n8n procesa con IA** → Genera respuesta especializada
4. **POST a webhook respuesta** → `http://localhost:3001/api/webhook-responses`
5. **Frontend recibe respuesta** → Actualiza chat en tiempo real

### Formato de Payload

**Envío (Frontend → n8n):**
```json
{
  "message": "¿Es legal esta cláusula?",
  "functionId": "1.1",
  "messageId": "user_1704067200000_abc123",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user": "admin",
  "responseWebhook": "http://localhost:3001/api/webhook-responses",
  "context": {
    "activeModule": 1,
    "functionName": "Chat Legal 24/7",
    "sessionData": {
      "previousMessages": []
    }
  }
}
```

**Respuesta (n8n → Frontend):**
```json
{
  "messageId": "user_1704067200000_abc123",
  "output": "Basado en mi análisis legal...",
  "functionId": "1.1",
  "timestamp": "2024-01-01T00:00:30.000Z",
  "metadata": {
    "confidence": 0.95,
    "processingTime": 2.3,
    "sources": ["Código Civil Art. 1544"]
  }
}
```

## 🛠️ API Endpoints

### Backend Endpoints

- `POST /api/send-message` - Enviar mensaje a agente
- `POST /api/webhook-responses` - Recibir respuestas de n8n
- `GET /api/pending-responses` - Obtener respuestas pendientes
- `GET /api/message-status/:messageId` - Estado de mensaje
- `DELETE /api/clear-cache` - Limpiar cache Redis
- `GET /api/health` - Health check

### Configuración n8n

Para cada webhook en n8n, configurar:

1. **Webhook Trigger** con URL específica
2. **Procesamiento IA** con el agente correspondiente
3. **HTTP Request** de respuesta a `http://localhost:3001/api/webhook-responses`

## 🎨 Características de la Interfaz

### Tema Visual
- **Tema oscuro** profesional
- **Gradientes verdes** para elementos activos
- **Animaciones suaves** y micro-interacciones
- **Responsive design** completo

### Estados de Mensaje
- 🟡 **Enviando** - Mensaje en proceso de envío
- 🔵 **Enviado** - Mensaje enviado a n8n
- 🟢 **Entregado** - Respuesta recibida del agente
- 🔴 **Error** - Error en el proceso

### Funcionalidades
- **Chat en tiempo real** con cada agente
- **Exportar conversaciones** en formato texto
- **Minimizar/maximizar** ventanas de chat
- **Indicadores de conexión** en tiempo real
- **Historial persistente** por sesión

## 🔧 Desarrollo

### Estructura del Proyecto
```
/
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/              # Custom hooks
│   ├── services/           # Servicios de API
│   ├── types/              # Tipos TypeScript
│   └── App.tsx
├── server/
│   └── server.js           # Servidor Express
├── .env                    # Variables de entorno
└── package.json
```

### Scripts Disponibles
- `npm run dev` - Desarrollo completo (frontend + backend)
- `npm run dev:client` - Solo frontend
- `npm run dev:server` - Solo backend
- `npm run build` - Build de producción

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3001
REDIS_URL=redis://localhost:6379
N8N_BASE_URL=https://n8n.srv880021.hstgr.cloud
WEBHOOK_SECRET=umbra_legal_secret_2024
```

## 🚀 Despliegue

### Producción
1. Configurar Redis en servidor
2. Configurar variables de entorno de producción
3. Build del frontend: `npm run build`
4. Desplegar backend en servidor Node.js
5. Configurar webhooks de n8n con URLs de producción

### Docker (Opcional)
```dockerfile
# Dockerfile incluido para despliegue containerizado
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "server/server.js"]
```

## 📊 Monitoreo

### Logs del Sistema
- Mensajes enviados/recibidos
- Errores de webhook
- Estados de conexión Redis
- Performance de respuestas

### Métricas Disponibles
- Tiempo de respuesta por agente
- Tasa de éxito de webhooks
- Volumen de mensajes por módulo
- Errores y reconexiones

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico:
- Crear issue en GitHub
- Email: soporte@umbralegal.com
- Documentación: [docs.umbralegal.com](https://docs.umbralegal.com)

---

**Umbra Legal** - 21 Agentes IA Especializados por $3,000/mes