'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { StatusPanel } from '@/components/messenger/StatusPanel';
import { ContactsList } from '@/components/messenger/ContactsList';
import { ChatWindow } from '@/components/messenger/ChatWindow';

export default function MessengerPage() {
  const { isAuthenticated } = useAuth();
  const { chatWindows } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* MSN-style background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,197,253,0.1) 0%, transparent 50%)',
          backgroundSize: '300px 300px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif' }}>
                    Windows Live™ Messenger
                  </h1>
                  <p className="text-sm text-gray-500">Conectado y listo para chatear</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  En línea
                </span>
                <span>•</span>
                <span>v8.0.792.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Status */}
            <div className="lg:col-span-1 space-y-6">
              <StatusPanel />
              
              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Acciones rápidas</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    📧 Revisar correo
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    📁 Archivos compartidos
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    🎵 Reproducir música
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    📞 Hacer llamada
                  </button>
                </div>
              </div>

              {/* MSN Today */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">MSN Hoy</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-800">Noticias destacadas</h4>
                    <p className="text-gray-600 text-xs mt-1">
                      Windows Vista Beta disponible para descarga
                    </p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-800">Entretenimiento</h4>
                    <p className="text-gray-600 text-xs mt-1">
                      Nuevos videos musicales en MSN Video
                    </p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-800">Clima</h4>
                    <p className="text-gray-600 text-xs mt-1">
                      ☀️ 22°C - Soleado en tu ciudad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contacts */}
            <div className="lg:col-span-2">
              <ContactsList />
              
              {/* Tips */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos MSN</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Haz clic en un contacto para abrir una ventana de chat</li>
                  <li>• Usa emoticons escribiendo :) :D :P en tus mensajes</li>
                  <li>• Cambia tu estado según tu disponibilidad</li>
                  <li>• Personaliza tu mensaje personal para que tus amigos sepan qué estás haciendo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Windows */}
        {chatWindows
          .filter(window => window.isOpen)
          .map((window) => (
            <ChatWindow key={window.id} chatWindow={window} />
          ))}

        {/* Footer */}
        <div className="mt-16 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>© 2005 Microsoft Corporation</span>
                <span>•</span>
                <span>Términos de uso</span>
                <span>•</span>
                <span>Privacidad</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Recreación nostálgica</span>
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}