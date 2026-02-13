
import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * (30 - 10) + 10}px`,
      duration: `${Math.random() * (15 - 8) + 8}s`,
      delay: `${Math.random() * 10}s`
    }));
    setHearts(newHearts);
  }, []);

  return (
    <>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart text-red-300 opacity-0"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            top: '100%'
          }}
        >
          ❤
        </div>
      ))}
    </>
  );
};

export default FloatingHearts;
