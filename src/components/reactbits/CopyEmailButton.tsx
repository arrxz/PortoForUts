import React, { useState } from 'react';
import { Toast } from 'bootstrap';

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

export const CopyEmailButton: React.FC<CopyEmailButtonProps> = ({
  email,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);

      // Trigger Bootstrap Toast element
      const toastEl = document.getElementById('emailToast');
      if (toastEl) {
        const toast = Toast.getOrCreateInstance(toastEl, { delay: 3000 });
        toast.show();
      }

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Gagal menyalin email', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:bg-surface-2 ${className}`}
      aria-label="Salin alamat email"
    >
      <span className="font-mono text-accent">{email}</span>
      <span className="text-xs text-ink-muted">
        {copied ? '(Tersalin)' : '(Klik untuk salin)'}
      </span>
    </button>
  );
};
