import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  Search,
  Bell,
  User,
  ChevronRight,
  Activity,
  Eye,
  Download,
  Upload,
  Zap,
  Target,
  BarChart3,
  Lock,
  Cpu,
  Bot,
  Send,
  Plus,
  AlertCircle,
  XCircle,
  FileCheck,
  Gavel,
  Scale,
  Calendar,
  Mail,
  CreditCard,
  Building,
  MapPin,
  Briefcase,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Layers,
  Filter,
  ArrowRight,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  AlertOctagon,
  FileSignature,
  Scan,
  BookOpen,
  Lightbulb,
  Radar,
  ShieldCheck,
  Timer,
  Link,
  Workflow,
  BellRing,
  UserCheck,
  HelpCircle,
  X,
  Minimize2
} from 'lucide-react';
import { AgentChat } from './components/AgentChat';
import { ConnectionStatus } from './components/StatusIndicator';
import { useWebhooks } from './hooks/useWebhooks';
import { useAgentMessages } from './hooks/useAgentMessages';
import { Module, AgentFunction } from './types';

function App() {
  const [activeModule, setActiveModule] = useState(1);
  const [chatMessage, setChatMessage] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentFunction | null>(null);
  
  const { connectionStatus, sendMessage } = useWebhooks();
  const { agentMessages } = useAgentMessages();

  const legalStats = {
    activeContracts: 247,
    urgentTasks: 3,
    complianceScore: 97,
    riskAlerts: 2,
    monthlyValue: 3000,
    savedCosts: 45000
  };

  const modules: Module[] = [
    {
      id: 1,
      name: 'Agente Legal Interactivo 24/7',
      description: 'Abogado virtual general que responde preguntas y ejecuta acciones legales básicas',
     icon: Bot,  
      color: 'green',
      functions: [
        {
          id: '1.1',
          name: 'Chat Legal 24/7',
          description: 'Preguntas legales específicas con respuestas en segundos',
          icon: MessageSquare, 
          webhook: 'http://localhost:5678/webhook-test/Chat Legal 24/7',
          howToUse: 'Escribe tu consulta legal específica y obtén respuestas inmediatas de nuestro agente especializado en derecho inmobiliario. Ideal para dudas rápidas sobre contratos, normativas o procedimientos legales.'
        },
        {
          id: '1.2',
          name: 'Revisión Rápida de Documentos',
          description: 'Análisis automático de documentos con resumen legal',
          icon: FileCheck,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Revision-Rapida-Documentos',
          howToUse: 'Sube tu documento legal (PDF, Word, imagen) y el agente lo analizará completamente, identificando cláusulas importantes, riesgos potenciales y recomendaciones de mejora.'
        },
        {
          id: '1.3',
          name: 'Generación de Informes Legales',
          description: 'Informes legales en PDF descargables por propiedad',
          icon: FileText,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Generacion-Informes-Legales',
          howToUse: 'Proporciona los datos de la propiedad o situación legal y el agente generará un informe profesional completo en PDF, listo para presentar a clientes o autoridades.'
        },
        {
          id: '1.4',
          name: 'Simulador de Problemas Legales',
          description: 'Anticipa problemas legales comunes por caso',
          icon: Lightbulb,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Simulador-Problemas-Legales',
          howToUse: 'Describe tu caso o proyecto inmobiliario y el agente simulará posibles escenarios problemáticos, ayudándote a preparar estrategias preventivas y soluciones anticipadas.'
        },
        {
          id: '1.5',
          name: 'Buscador de Normativas Locales',
          description: 'Artículos de ley por comuna, ciudad o país',
          icon: BookOpen,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Buscador-Normativas-Locales',
          howToUse: 'Especifica la ubicación geográfica y el tipo de normativa que necesitas. El agente buscará y te proporcionará los artículos de ley aplicables con interpretación práctica.'
        }
      ]
    },
    {
      id: 2,
      name: 'Agente de Contratos Inteligentes',
      description: 'Especialista en creación, revisión y corrección de contratos inmobiliarios',
      icon: FileSignature,
      color: 'blue',
      functions: [
        {
          id: '2.1',
          name: 'Generador de Promesas de Compraventa',
          description: 'Contratos completos con cláusulas adaptadas por operación',
          icon: FileText,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Generador-Promesas-Compraventa',
          howToUse: 'Ingresa los datos de la operación (comprador, vendedor, propiedad, condiciones) y el agente generará una promesa de compraventa completa con todas las cláusulas legales necesarias.'
        },
        {
          id: '2.2',
          name: 'Detección de Cláusulas Riesgosas',
          description: 'Identifica cláusulas peligrosas o ilegales automáticamente',
          icon: AlertOctagon,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Deteccion-Clausulas-Riesgosas',
          howToUse: 'Sube cualquier contrato y el agente lo escaneará completamente, identificando cláusulas problemáticas, ilegales o que puedan generar conflictos futuros.'
        },
        {
          id: '2.3',
          name: 'Revisión de Arriendos y Cesiones',
          description: 'Análisis de errores y condiciones desfavorables',
          icon: Scan,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Revision-Arriendos-Cesiones',
          howToUse: 'Proporciona el contrato de arriendo o cesión y el agente lo revisará exhaustivamente, detectando errores, condiciones desfavorables y sugiriendo mejoras.'
        },
        {
          id: '2.4',
          name: 'Corrección Automática de Contratos',
          description: 'Ajustes legales para cumplimiento y reducción de conflictos',
          icon: CheckSquare,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Correccion-Automatica-Contratos',
          howToUse: 'Envía tu contrato con problemas identificados y el agente lo corregirá automáticamente, ajustando cláusulas para cumplimiento legal y reducción de riesgos.'
        },
        {
          id: '2.5',
          name: 'Análisis de Firmas Electrónicas',
          description: 'Validación legal de contratos con firma digital',
          icon: ShieldCheck,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Analisis-Firmas-Electronicas',
          howToUse: 'Sube contratos con firmas electrónicas y el agente validará su legalidad, autenticidad y cumplimiento con las normativas de firma digital vigentes.'
        }
      ]
    },
    {
      id: 3,
      name: 'Agente de Fiscalización y Riesgos',
      description: 'Evaluación de riesgos legales y verificación de cumplimiento normativo',
      icon: Radar,
      color: 'red',
      functions: [
        {
          id: '3.1',
          name: 'Verificador de Cumplimiento Legal',
          description: 'Evaluación de proyectos contra normativa vigente',
          icon: Scale,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Verificador-Cumplimiento-Legal',
          howToUse: 'Describe tu proyecto inmobiliario con todos sus detalles y el agente lo evaluará contra toda la normativa vigente, identificando áreas de cumplimiento y riesgo.'
        },
        {
          id: '3.2',
          name: 'Alertas Legales Automatizadas',
          description: 'Notificaciones por cambios de ley que afecten proyectos',
          icon: BellRing,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Alertas-Legales-Automatizadas',
          howToUse: 'Registra tus proyectos activos y el agente te notificará automáticamente cuando cambien leyes o normativas que puedan afectar tus operaciones inmobiliarias.'
        },
        {
          id: '3.3',
          name: 'Semáforo Legal por Propiedad',
          description: 'Estado Verde, Amarillo o Rojo según riesgo legal',
          icon: Target,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Semaforo-Legal-Propiedad',
          howToUse: 'Ingresa los datos de cualquier propiedad y el agente la evaluará asignando un color: Verde (bajo riesgo), Amarillo (riesgo medio) o Rojo (alto riesgo) con explicación detallada.'
        },
        {
          id: '3.4',
          name: 'Evaluación de Permisos Pendientes',
          description: 'Detección de permisos municipales o sanitarios faltantes',
          icon: CheckCircle,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Evaluacion-Permisos-Pendientes',
          howToUse: 'Proporciona información del proyecto o propiedad y el agente identificará todos los permisos municipales, sanitarios o gubernamentales que falten por obtener.'
        },
        {
          id: '3.5',
          name: 'Informe de Riesgo para Inversionistas',
          description: 'PDF de riesgo legal para presentar a inversores',
          icon: TrendingUp,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Informe-Riesgo-Inversionistas',
          howToUse: 'Envía los datos del proyecto de inversión y el agente generará un informe profesional de riesgo legal en PDF, perfecto para presentar a inversionistas potenciales.'
        }
      ]
    },
    {
      id: 4,
      name: 'Agente de Automatización Legal',
      description: 'Automatización de tareas repetitivas y procesos legales',
      icon: Workflow,
      color: 'purple',
      functions: [
        {
          id: '4.1',
          name: 'Seguimiento Automático de Promesas',
          description: 'Recordatorios automáticos de vencimiento de contratos',
          icon: Timer,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Seguimiento-Automatico-Promesas',
          howToUse: 'Registra tus contratos y promesas de compraventa. El agente creará recordatorios automáticos para fechas importantes, vencimientos y renovaciones.'
        },
        {
          id: '4.2',
          name: 'Integración con Sistemas CRM',
          description: 'Generación automática de tareas legales desde CRM',
          icon: Link,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Integracion-Sistemas-CRM',
          howToUse: 'Conecta tu CRM existente y el agente generará automáticamente tareas legales basadas en las actividades comerciales, manteniendo sincronizada la gestión legal.'
        },
        {
          id: '4.3',
          name: 'Agenda Legal Automática',
          description: 'Eventos legales importantes en Google Calendar',
          icon: Calendar,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Agenda-Legal-Automatica',
          howToUse: 'El agente creará automáticamente eventos en tu Google Calendar para fechas legales críticas: vencimientos, audiencias, plazos de respuesta y renovaciones.'
        },
        {
          id: '4.4',
          name: 'Automatización de Notificaciones Legales',
          description: 'Avisos legales automáticos a partes involucradas',
          icon: Mail,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Automatizacion-Notificaciones-Legales',
          howToUse: 'Configura las partes involucradas en tus contratos y el agente enviará automáticamente notificaciones legales, recordatorios y avisos importantes por email.'
        },
        {
          id: '4.5',
          name: 'Recordatorio de Firmas Pendientes',
          description: 'Detección y aviso de firmas faltantes',
          icon: UserCheck,
          webhook: 'https://n8n.srv880021.hstgr.cloud/webhook-test/Recordatorio-Firmas-Pendientes',
          howToUse: 'El agente monitoreará todos tus contratos y detectará automáticamente firmas faltantes, enviando recordatorios personalizados a las partes que deben firmar.'
        }
      ]
    }
  ];

  const getModuleColor = (color: string) => {
    const colors = {
      green: 'from-green-400 to-green-600',
      blue: 'from-blue-400 to-blue-600',
      red: 'from-red-400 to-red-600',
      purple: 'from-purple-400 to-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const getModuleBorder = (color: string) => {
    const colors = {
      green: 'border-green-400/30 hover:border-green-400/50',
      blue: 'border-blue-400/30 hover:border-blue-400/50',
      red: 'border-red-400/30 hover:border-red-400/50',
      purple: 'border-purple-400/30 hover:border-purple-400/50'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const openAgentChat = (agentFunction: AgentFunction) => {
    setActiveAgent(agentFunction);
  };

  const sendUmbraMessage = async () => {
    // Implementation for central Umbra AI chat
    console.log('Sending message to Umbra Central:', chatMessage);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">UMBRA LEGAL</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-green-400 font-medium">21 AGENTES IA ESPECIALIZADOS</p>
                  <ConnectionStatus status={connectionStatus} />
                </div>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8 ml-12">
              <a href="#" className="text-green-400 font-medium">Dashboard</a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Agentes</a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Análisis</a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Automatizaciones</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar entre 21 agentes especializados..."
                className="bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 w-80"
              />
            </div>
            
            <button className="relative p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 lg:pr-80">
          {/* Value Proposition Banner */}
          <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">21 Agentes IA Especializados por $3,000/mes</h2>
                <p className="text-gray-300">Cada agente es un experto dedicado en su área legal específica</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">21</div>
                <div className="text-sm text-gray-400">Agentes Activos</div>
              </div>
            </div>
          </div>

          {/* Module Navigation */}
          <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg border transition-all duration-300 whitespace-nowrap ${
                    activeModule === module.id
                      ? `bg-gradient-to-r ${getModuleColor(module.color)} text-black border-transparent`
                      : `bg-gray-900/50 text-gray-300 ${getModuleBorder(module.color)}`
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">Módulo {module.id}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Display */}
          {modules.map((module) => {
            if (module.id !== activeModule) return null;
            
            const IconComponent = module.icon;
            
            return (
              <div key={module.id} className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getModuleColor(module.color)} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">{module.name}</h2>
                    <p className="text-gray-400">{module.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {module.functions.map((func) => {
                    const FuncIcon = func.icon;
                    return (
                      <div
                        key={func.id}
                        className={`bg-gradient-to-br from-gray-900 to-gray-800 border rounded-xl p-6 transition-all duration-300 ${getModuleBorder(module.color)}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getModuleColor(module.color)} rounded-lg flex items-center justify-center`}>
                            <FuncIcon className="w-5 h-5 text-black" />
                          </div>
                          <span className="text-xs font-mono text-gray-500">{func.id}</span>
                        </div>
                        
                        <h3 className="font-bold text-gray-100 mb-2">{func.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{func.description}</p>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
                            onClick={() => {
                              alert(`Cómo usar: ${func.howToUse}`);
                            }}
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Cómo usar</span>
                          </button>
                          <button 
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r ${getModuleColor(module.color)} text-black text-sm font-medium rounded-lg transition-colors hover:opacity-90`}
                            onClick={() => openAgentChat(func)}
                          >
                            <Bot className="w-4 h-4" />
                            <span>Usar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>

        {/* Right Sidebar - Umbra AI Central */}
        <aside className="fixed right-0 top-16 bottom-0 w-80 bg-gradient-to-b from-gray-900 to-black border-l border-gray-700/50 z-40">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">Umbra AI Central</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Coordinando 21 Agentes</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 hover:bg-green-700 text-black font-medium rounded-lg transition-colors mb-3">
                <Download className="w-4 h-4" />
                <span>Informe General</span>
              </button>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">21</div>
                <div className="text-xs text-gray-400">Agentes Especializados</div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-200">¡Hola! Soy Umbra AI Central. Coordino 21 agentes especializados. Puedo ayudarte a elegir el agente correcto o responder consultas generales.</p>
                    <span className="text-xs text-gray-400 mt-1 block">Hace 2 min</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-green-600 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-black">¿Cuál es la diferencia entre tener 21 agentes especializados vs un solo agente general?</p>
                    <span className="text-xs text-green-900 mt-1 block">Hace 1 min</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-200">Excelente pregunta. Cada agente está entrenado específicamente en su área:</p>
                    <ul className="text-sm text-gray-300 mt-2 space-y-1">
                      <li>• Precisión 10x mayor</li>
                      <li>• Respuestas especializadas</li>
                      <li>• Contexto profundo por área</li>
                      <li>• Menos errores</li>
                    </ul>
                    <span className="text-xs text-gray-400 mt-1 block">Justo ahora</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700/50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Consulta general o pide recomendación de agente..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20"
                />
                <button 
                  className="p-3 bg-green-600 hover:bg-green-700 text-black rounded-lg transition-colors"
                  onClick={sendUmbraMessage}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Agent Chat Component */}
      {activeAgent && (
        <AgentChat
          agentFunction={activeAgent}
          onClose={() => setActiveAgent(null)}
          moduleColor={modules.find(m => m.functions.some(f => f.id === activeAgent.id))?.color || 'green'}
        />
      )}
    </div>
  );
}

export default App;