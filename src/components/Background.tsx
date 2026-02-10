import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-[#0a0515]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 cyber-bg opacity-50" />
      
      {/* Hex pattern overlay */}
      <div className="absolute inset-0 hex-pattern opacity-30" />
      
      {/* Data stream effect */}
      <div className="absolute inset-0 data-stream opacity-20" />
      
      {/* Radial glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[150px]" />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f3ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 Q400,100 800,200 T1600,200"
          fill="none"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
        />
        <path
          d="M0,400 Q400,300 800,400 T1600,400"
          fill="none"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
        />
        <path
          d="M0,600 Q400,500 800,600 T1600,600"
          fill="none"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
        />
      </svg>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker/80 via-transparent to-cyber-darker/40" />
    </div>
  );
};
