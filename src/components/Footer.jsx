import React from 'react';

const Footer = ({ userName }) => {
  return (
    <footer className="h-16 bg-[#E0E5B6] border-t border-[#CCD5AE] flex items-center justify-center">
      <p className="text-[10px] text-[#606C38]/60 font-black uppercase tracking-[0.3em]">
        SafeTask Environment • {userName} • 2025
      </p>
    </footer>
  );
};

export default Footer;