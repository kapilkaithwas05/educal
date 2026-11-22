import React from 'react'
import { AlertCircle } from 'lucide-react'

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm animate-fade-in">
      <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
      <div>
        <p className="font-semibold text-rose-200">Computation Error</p>
        <p className="mt-0.5">{message}</p>
      </div>
    </div>
  )
}
