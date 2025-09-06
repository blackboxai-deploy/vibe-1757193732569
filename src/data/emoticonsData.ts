import { Emoticon } from '@/types/messenger';

export const CLASSIC_EMOTICONS: Emoticon[] = [
  // Happy faces
  { id: '1', shortcut: ':)', imageUrl: 'https://placehold.co/16x16?text=😊', description: 'Smile', category: 'happy' },
  { id: '2', shortcut: ':D', imageUrl: 'https://placehold.co/16x16?text=😃', description: 'Big smile', category: 'happy' },
  { id: '3', shortcut: ':-)', imageUrl: 'https://placehold.co/16x16?text=😊', description: 'Smile with nose', category: 'happy' },
  { id: '4', shortcut: '=)', imageUrl: 'https://placehold.co/16x16?text=😊', description: 'Smile alt', category: 'happy' },
  { id: '5', shortcut: '(h)', imageUrl: 'https://placehold.co/16x16?text=❤️', description: 'Heart', category: 'love' },
  
  // Sad faces
  { id: '6', shortcut: ':(', imageUrl: 'https://placehold.co/16x16?text=😢', description: 'Sad', category: 'sad' },
  { id: '7', shortcut: ':-(', imageUrl: 'https://placehold.co/16x16?text=😢', description: 'Sad with nose', category: 'sad' },
  { id: '8', shortcut: ":'(", imageUrl: 'https://placehold.co/16x16?text=😭', description: 'Crying', category: 'sad' },
  
  // Other expressions
  { id: '9', shortcut: ':P', imageUrl: 'https://placehold.co/16x16?text=😛', description: 'Tongue out', category: 'playful' },
  { id: '10', shortcut: ':-P', imageUrl: 'https://placehold.co/16x16?text=😛', description: 'Tongue out with nose', category: 'playful' },
  { id: '11', shortcut: ':p', imageUrl: 'https://placehold.co/16x16?text=😛', description: 'Tongue out small', category: 'playful' },
  { id: '12', shortcut: ';)', imageUrl: 'https://placehold.co/16x16?text=😉', description: 'Wink', category: 'playful' },
  { id: '13', shortcut: ';-)', imageUrl: 'https://placehold.co/16x16?text=😉', description: 'Wink with nose', category: 'playful' },
  
  // Surprise and shock
  { id: '14', shortcut: ':O', imageUrl: 'https://placehold.co/16x16?text=😮', description: 'Surprised', category: 'surprise' },
  { id: '15', shortcut: ':-O', imageUrl: 'https://placehold.co/16x16?text=😮', description: 'Surprised with nose', category: 'surprise' },
  { id: '16', shortcut: ':o', imageUrl: 'https://placehold.co/16x16?text=😮', description: 'Surprised small', category: 'surprise' },
  
  // Special MSN emoticons
  { id: '17', shortcut: '(y)', imageUrl: 'https://placehold.co/16x16?text=👍', description: 'Thumbs up', category: 'gesture' },
  { id: '18', shortcut: '(n)', imageUrl: 'https://placehold.co/16x16?text=👎', description: 'Thumbs down', category: 'gesture' },
  { id: '19', shortcut: '(6)', imageUrl: 'https://placehold.co/16x16?text=😈', description: 'Devil', category: 'special' },
  { id: '20', shortcut: '(a)', imageUrl: 'https://placehold.co/16x16?text=😇', description: 'Angel', category: 'special' },
  { id: '21', shortcut: '8-)', imageUrl: 'https://placehold.co/16x16?text=😎', description: 'Cool with sunglasses', category: 'cool' },
  { id: '22', shortcut: '8)', imageUrl: 'https://placehold.co/16x16?text=😎', description: 'Cool', category: 'cool' },
  
  // Angry
  { id: '23', shortcut: ':@', imageUrl: 'https://placehold.co/16x16?text=😠', description: 'Angry', category: 'angry' },
  { id: '24', shortcut: ':-@', imageUrl: 'https://placehold.co/16x16?text=😠', description: 'Angry with nose', category: 'angry' },
  
  // Confused
  { id: '25', shortcut: ':S', imageUrl: 'https://placehold.co/16x16?text=😕', description: 'Confused', category: 'confused' },
  { id: '26', shortcut: ':-S', imageUrl: 'https://placehold.co/16x16?text=😕', description: 'Confused with nose', category: 'confused' },
  
  // Kiss
  { id: '27', shortcut: ':-*', imageUrl: 'https://placehold.co/16x16?text=😘', description: 'Kiss', category: 'love' },
  { id: '28', shortcut: ':*', imageUrl: 'https://placehold.co/16x16?text=😘', description: 'Kiss', category: 'love' },
  
  // More special ones
  { id: '29', shortcut: '(l)', imageUrl: 'https://placehold.co/16x16?text=❤️', description: 'Love heart', category: 'love' },
  { id: '30', shortcut: '(u)', imageUrl: 'https://placehold.co/16x16?text=💔', description: 'Broken heart', category: 'sad' },
  { id: '31', shortcut: '(k)', imageUrl: 'https://placehold.co/16x16?text=😘', description: 'Kiss lips', category: 'love' },
  { id: '32', shortcut: '(f)', imageUrl: 'https://placehold.co/16x16?text=🌸', description: 'Flower', category: 'nature' },
];

export const EMOTICON_CATEGORIES = [
  { id: 'happy', name: 'Happy', color: '#FFD700' },
  { id: 'sad', name: 'Sad', color: '#4169E1' },
  { id: 'playful', name: 'Playful', color: '#FF69B4' },
  { id: 'surprise', name: 'Surprise', color: '#FF4500' },
  { id: 'gesture', name: 'Gestures', color: '#32CD32' },
  { id: 'special', name: 'Special', color: '#8A2BE2' },
  { id: 'cool', name: 'Cool', color: '#00CED1' },
  { id: 'angry', name: 'Angry', color: '#DC143C' },
  { id: 'confused', name: 'Confused', color: '#DAA520' },
  { id: 'love', name: 'Love', color: '#FF1493' },
  { id: 'nature', name: 'Nature', color: '#228B22' }
];