import React from 'react';
import { Bot } from 'lucide-react';

export default function BotIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-7 h-7 flex items-center justify-center">
        <Bot className="text-red-500 scale-125" />
        {/* Angry Eyebrows */}
        <div className="absolute top-[12px] left-[9px] w-[4px] h-[1.5px] bg-red-500 rotate-[35deg] shadow-[0_0_5px_#ef4444]" />
        <div className="absolute top-[12px] right-[9px] w-[4px] h-[1.5px] bg-red-500 rotate-[-35deg] shadow-[0_0_5px_#ef4444]" />
      </div>
    </div>
  );
}