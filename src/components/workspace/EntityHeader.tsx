"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, ExternalLink, Globe, Lock, Trash2, Archive, Eye } from "lucide-react";
import { PublishStatus } from "@prisma/client";

interface EntityHeaderProps {
  title: string;
  type: string;
  status: PublishStatus;
  entityId: string;
  onUpdateStatus?: (newStatus: PublishStatus) => Promise<void>;
  onDelete?: () => Promise<void>;
  publicUrl?: string;
}

export function EntityHeader({ title, type, status, entityId, onUpdateStatus, onDelete, publicUrl }: EntityHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: PublishStatus) => {
    if (!onUpdateStatus) return;
    setLoading(true);
    await onUpdateStatus(newStatus);
    setLoading(false);
    setDropdownOpen(false);
    router.refresh();
  };

  const getStatusBadge = () => {
    switch (status) {
      case PublishStatus.PUBLISHED:
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-[11px] font-mono uppercase tracking-wider font-semibold border border-green-500/20"><Globe size={12} /> Published</span>;
      case PublishStatus.DRAFT:
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-g2 text-g6 text-[11px] font-mono uppercase tracking-wider font-semibold border border-g3"><Lock size={12} /> Draft</span>;
      case PublishStatus.ARCHIVED:
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 text-[11px] font-mono uppercase tracking-wider font-semibold border border-orange-500/20"><Archive size={12} /> Archived</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 text-brand text-[11px] font-mono uppercase tracking-wider font-semibold border border-brand/20">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[12px] font-mono uppercase tracking-wider text-g5 font-semibold bg-g2 px-2 py-0.5 rounded border border-g3">
            {type}
          </span>
          {getStatusBadge()}
        </div>
        <h1 className="text-3xl font-serif text-ink tracking-tight mt-2">{title || "Untitled"}</h1>
        <p className="text-[13px] text-g5 mt-1 mono">ID: {entityId}</p>
      </div>

      <div className="flex items-center gap-3">
        {publicUrl && (
          <a 
            href={publicUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-g1 border border-g3 text-[13px] font-medium hover:bg-g2 transition-colors text-ink"
          >
            <ExternalLink size={16} /> View Public
          </a>
        )}

        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-g1 border border-g3 text-ink hover:bg-g2 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-g3 bg-paper shadow-xl z-50 overflow-hidden py-1">
                {status !== PublishStatus.PUBLISHED && (
                  <button 
                    onClick={() => handleStatusChange(PublishStatus.PUBLISHED)}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-ink hover:bg-g1 transition-colors text-left disabled:opacity-50"
                  >
                    <Globe size={16} className="text-g5" /> Publish
                  </button>
                )}
                {status === PublishStatus.PUBLISHED && (
                  <button 
                    onClick={() => handleStatusChange(PublishStatus.DRAFT)}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-ink hover:bg-g1 transition-colors text-left disabled:opacity-50"
                  >
                    <Lock size={16} className="text-g5" /> Unpublish (Draft)
                  </button>
                )}
                
                {status !== PublishStatus.ARCHIVED && (
                  <button 
                    onClick={() => handleStatusChange(PublishStatus.ARCHIVED)}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-orange-600 hover:bg-orange-500/10 transition-colors text-left disabled:opacity-50"
                  >
                    <Archive size={16} /> Archive
                  </button>
                )}
                
                <div className="h-px bg-g3 my-1" />
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onDelete) onDelete();
                  }}
                  disabled={loading}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50"
                >
                  <Trash2 size={16} /> Delete...
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
