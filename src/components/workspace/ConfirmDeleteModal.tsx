"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  entityType: string;
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDeleteModal({ entityType, entityName, isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isMatch = inputValue.trim() === entityName.trim();

  const handleConfirm = async () => {
    if (!isMatch) return;
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div 
        className="premium-card campus-frame relative w-full max-w-md bg-paper p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-g4 hover:text-ink transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-red-500 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif text-ink leading-tight tracking-tight">Delete {entityType}</h3>
            <p className="text-[13px] text-g5 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <div className="bg-g1/50 border border-red-500/20 rounded-lg p-4 mb-5 text-[13px] text-g6">
          You are about to permanently delete <strong className="text-ink font-semibold">{entityName}</strong>. This will remove all associated data, files, and members.
        </div>

        <div className="mb-6">
          <label className="block text-[12px] font-medium text-g5 mb-2">
            Please type <strong className="text-ink bg-g2 px-1 py-0.5 rounded select-all font-mono">{entityName}</strong> to confirm.
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="w-full bg-transparent border border-g3 focus:border-red-500 rounded-md px-3 py-2 text-[14px] text-ink outline-none transition-colors"
            placeholder={entityName}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-g3/60">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-[13px] font-medium text-g6 hover:text-ink transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!isMatch || loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-g3 disabled:text-g5 text-white text-[13px] font-medium rounded-md transition-colors shadow-sm"
          >
            {loading ? "Deleting..." : "I understand, delete this"}
          </button>
        </div>
      </div>
    </div>
  );
}
