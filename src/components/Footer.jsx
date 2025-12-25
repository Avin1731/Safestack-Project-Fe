import React from 'react';

const Footer = ({ userName }) => {
  return (
    <footer className="h-14 bg-[#FAEDCE] border-t border-[#E0E5B6] flex items-center justify-between px-10 relative z-10">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#606C38] opacity-20" />
        <p className="text-[9px] text-[#606C38]/40 font-black uppercase tracking-[0.2em]">
          SafeTask Environment
        </p>
      </div>
      
      <p className="text-[9px] text-[#606C38]/60 font-black uppercase tracking-[0.3em]">
        {userName || 'Guest'} • 2025
      </p>
    </footer>
  );
};

export default Footer;