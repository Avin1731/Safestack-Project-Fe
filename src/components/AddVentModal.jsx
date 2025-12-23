import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { useVents } from '../hooks/useVents';

const AddVentModal = ({ isOpen, onClose }) => {
  const { createVent } = useVents();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomPos = {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 300)
    };
    const randomRotate = Math.floor(Math.random() * 20) - 10;
    const colors = ['#fff740', '#ffc0cb', '#add8e6', '#90ee90', '#e6e6fa'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    createVent({
      content,
      mood,
      position: randomPos,
      rotation: randomRotate,
      color: randomColor
    }, {
      onSuccess: () => {
        setContent('');
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <HiX size={24} />
        </button>

        <h3 className="text-2xl font-black mb-2 text-blue-400">The Void</h3>
        <p className="text-slate-400 text-sm mb-6">Keluarkan bebanmu. Tidak ada yang tahu itu kamu.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            maxLength={500}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white focus:outline-none focus:border-blue-500 h-40 resize-none text-lg italic"
            placeholder="Apa yang sedang kamu rasakan?..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['😊', '😔', '😠', '🤯', '😭', '😴'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`text-2xl p-2 rounded-xl transition-all ${mood === m ? 'bg-blue-600 scale-110' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="bg-white text-slate-900 font-black px-8 py-3 rounded-full hover:bg-blue-400 transition-all uppercase tracking-widest text-sm"
            >
              Lepaskan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVentModal;