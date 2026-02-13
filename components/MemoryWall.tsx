
import React from 'react';
import { Memory } from '../types';

interface MemoryWallProps {
  memories: Memory[];
}

const MemoryWall: React.FC<MemoryWallProps> = ({ memories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {memories.map((m) => (
        <div 
          key={m.id} 
          className="group bg-white p-4 rounded-xl shadow-xl transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-red-50 flex flex-col"
        >
          {m.imageUrl && (
            <div className="relative overflow-hidden rounded-lg mb-6 aspect-[4/5] bg-rose-50">
                <img 
                  src={m.imageUrl} 
                  alt={m.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: 'inherit' }} // Parent or global state should handle this via CSS
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          <div className="px-2 pb-4">
            <div className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{m.date}</div>
            <h3 className="font-serif text-2xl text-rose-900 mb-3 group-hover:text-rose-600 transition-colors">{m.title}</h3>
            <p className="text-gray-600 leading-relaxed italic text-sm">"{m.description}"</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoryWall;
