// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 md:px-8 zine-card text-xs text-center border-t border-secondary/50">
      <div className="max-w-5xl mx-auto sometype-mono">
        <p>
          &copy; {currentYear} ROTASY2NIAA. All Rights Reserved. | Designed with 
          <span className="text-highlight"> React, Tailwind, Vite</span> | 
          <a 
            href="https://github.com/rotasy2niaa" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-highlight hover:underline ml-1"
          >
             Source Code (GitHub)
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; // 必须有 default export