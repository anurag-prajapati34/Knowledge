import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-700 tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full bg-white text-black placeholder-zinc-400 text-sm rounded-xl border px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-zinc-500 focus:border-black focus:ring-black/10'
              : 'border-zinc-300 focus:border-black focus:ring-black/10'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-zinc-700 mt-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-zinc-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
