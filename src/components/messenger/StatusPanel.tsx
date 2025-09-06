'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserStatus } from '@/types/user';
import { USER_STATUS_CONFIG } from '@/lib/constants';

export function StatusPanel() {
  const { user, logout, updateUserStatus, updatePersonalMessage, updateDisplayName } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || '');
  const [editPersonalMessage, setEditPersonalMessage] = useState(user?.personalMessage || '');

  if (!user) return null;

  const handleStatusChange = (status: UserStatus) => {
    updateUserStatus(status);
  };

  const handleSaveProfile = () => {
    updateDisplayName(editDisplayName);
    updatePersonalMessage(editPersonalMessage);
    setIsEditingProfile(false);
  };

  const handleEditProfile = () => {
    setEditDisplayName(user.displayName);
    setEditPersonalMessage(user.personalMessage || '');
    setIsEditingProfile(true);
  };

  const currentStatusConfig = USER_STATUS_CONFIG[user.status];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <Avatar className="w-12 h-12 border-2 border-gray-200">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.displayName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                onClick={handleEditProfile}
              >
                Editar
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 truncate mt-1">
              {user.personalMessage || 'Sin mensaje personal'}
            </p>

            {/* Status Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 mt-2 justify-start">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: currentStatusConfig.color }}
                  ></span>
                  <span className="text-sm font-medium">
                    {currentStatusConfig.label}
                  </span>
                  <div className="ml-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {(Object.entries(USER_STATUS_CONFIG) as Array<[UserStatus, typeof USER_STATUS_CONFIG[UserStatus]]>).map(([status, config]) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status as UserStatus)}
                    className="flex items-center space-x-3 py-3"
                  >
                    <span 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: config.color }}
                    ></span>
                    <div>
                      <div className="font-medium text-sm">{config.label}</div>
                      <div className="text-xs text-gray-500">{config.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Nombre para mostrar</Label>
              <Input
                id="display-name"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="Tu nombre"
                maxLength={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personal-message">Mensaje personal</Label>
              <Input
                id="personal-message"
                value={editPersonalMessage}
                onChange={(e) => setEditPersonalMessage(e.target.value)}
                placeholder="¿Qué está pasando?"
                maxLength={100}
              />
              <p className="text-xs text-gray-500">
                {editPersonalMessage.length}/100 caracteres
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}