import { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, subtitle, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`${sizes[size]} w-full glass-card max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="px-6 py-4 border-b border-[#26262d] flex justify-between items-start">
          <div>
            <div className="font-semibold text-white text-base">{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-[#1d1d24] flex items-center justify-center text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white focus:outline-none focus:border-[#d4a24c]/50 transition-colors ${props.className || ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white focus:outline-none focus:border-[#d4a24c]/50 transition-colors appearance-none cursor-pointer ${props.className || ''}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white focus:outline-none focus:border-[#d4a24c]/50 transition-colors resize-none ${props.className || ''}`}
    />
  );
}

export function Button({ variant = 'primary', className = '', children, ...rest }: { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; className?: string; } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-[#d4a24c] text-black font-semibold hover:bg-[#e9c27a]',
    secondary: 'bg-[#1a1a20] text-slate-200 border border-[#26262d] hover:bg-[#22222a]',
    danger: 'bg-red-500/20 text-red-400 border border-red-900/50 hover:bg-red-500/30',
    ghost: 'text-slate-300 hover:bg-[#1a1a20] hover:text-white',
  };
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function useModal() {
  const [open, setOpen] = useState(false);
  return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false) };
}
