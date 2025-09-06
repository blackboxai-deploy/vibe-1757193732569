'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USER_CREDENTIALS } from '@/lib/constants';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState(MOCK_USER_CREDENTIALS.email);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus password input when component mounts
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Error de inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail(MOCK_USER_CREDENTIALS.email);
    setPassword(MOCK_USER_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 30px 30px, rgba(255,255,255,0.05) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* MSN Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full opacity-90"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif' }}>
            Windows Live™ Messenger
          </h1>
          <p className="text-blue-100 text-lg">Conéctate y chatea con tus amigos</p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center text-gray-800">Iniciar sesión</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tu dirección de correo electrónico y contraseña
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Dirección de correo electrónico:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 px-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ejemplo@hotmail.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña:
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 px-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ingresa tu contraseña"
                  required
                  ref={passwordInputRef}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">
                  Recordar mi dirección de correo electrónico
                </Label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              {/* Demo Login Helper */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center mb-2">
                  Demo - Credenciales de prueba:
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full text-xs h-8"
                  onClick={handleDemoLogin}
                >
                  Usar credenciales demo (usuario@hotmail.com / 123456)
                </Button>
              </div>
            </form>

            {/* Status indicators */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Servicio en línea
                </span>
                <span>v8.0.792.00</span>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 text-center space-y-1">
              <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                ¿Olvidaste tu contraseña?
              </div>
              <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                Obtener una nueva cuenta
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-blue-100">
          <p>© 2005 Microsoft Corporation. Todos los derechos reservados.</p>
          <p className="mt-1">Recreación nostálgica para fines educativos</p>
        </div>
      </div>
    </div>
  );
}