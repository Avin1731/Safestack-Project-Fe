// Hapus import useState yang bikin warning
import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          SafeTask Ready! 🚀
        </h1>
        <p className="text-gray-400">
          Frontend aman, sekarang lanjut connect Database.
        </p>
      </div>
    </div>
  )
}

export default App