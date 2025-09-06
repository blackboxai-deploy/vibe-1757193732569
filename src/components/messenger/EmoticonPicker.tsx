'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CLASSIC_EMOTICONS, EMOTICON_CATEGORIES } from '@/data/emoticonsData';
import { Emoticon } from '@/types/messenger';

interface EmoticonPickerProps {
  onEmoticonSelect: (emoticon: Emoticon) => void;
  trigger?: React.ReactNode;
}

export function EmoticonPicker({ onEmoticonSelect, trigger }: EmoticonPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('happy');

  const getEmoticonsByCategory = (categoryId: string): Emoticon[] => {
    return CLASSIC_EMOTICONS.filter(emoticon => emoticon.category === categoryId);
  };

  const handleEmoticonClick = (emoticon: Emoticon) => {
    onEmoticonSelect(emoticon);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-yellow-100"
      title="Insertar emoticon"
    >
      <span className="text-lg">😊</span>
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" side="top" align="end">
        <div className="bg-white rounded-lg shadow-lg border">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <h3 className="font-semibold text-gray-900 text-sm">Emoticons</h3>
            <p className="text-xs text-gray-600 mt-1">
              Haz clic en un emoticon para insertarlo
            </p>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-gray-50 rounded-none border-b">
              {EMOTICON_CATEGORIES.map((category) => {
                const categoryEmoticons = getEmoticonsByCategory(category.id);
                if (categoryEmoticons.length === 0) return null;
                
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-xs px-3 py-2 whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {EMOTICON_CATEGORIES.map((category) => {
              const categoryEmoticons = getEmoticonsByCategory(category.id);
              if (categoryEmoticons.length === 0) return null;

              return (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-0 p-4"
                >
                  <div className="grid grid-cols-8 gap-2">
                    {categoryEmoticons.map((emoticon) => (
                      <Button
                        key={emoticon.id}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-150"
                        onClick={() => handleEmoticonClick(emoticon)}
                        title={`${emoticon.shortcut} - ${emoticon.description}`}
                      >
                        <img 
                          src={emoticon.imageUrl} 
                          alt={emoticon.shortcut}
                          className="w-5 h-5"
                          draggable={false}
                        />
                      </Button>
                    ))}
                  </div>

                  {/* Show shortcuts */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                      Atajos de teclado:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {categoryEmoticons.slice(0, 6).map((emoticon) => (
                        <div 
                          key={emoticon.id}
                          className="flex items-center space-x-2 text-gray-600"
                        >
                          <img 
                            src={emoticon.imageUrl} 
                            alt={emoticon.shortcut}
                            className="w-4 h-4"
                            draggable={false}
                          />
                          <span className="font-mono bg-gray-100 px-1 rounded">
                            {emoticon.shortcut}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Recently used */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                Tip: También puedes escribir los atajos directamente
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}