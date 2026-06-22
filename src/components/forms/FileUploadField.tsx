"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { FileText, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

type FileUploadFieldProps = {
  label: string;
  value: string;
  fileName?: string;
  onChange: (value: string) => void;
  onFileNameChange?: (value: string) => void;
  onError?: (message: string) => void;
  compact?: boolean;
};

export function FileUploadField({
  label,
  value,
  fileName,
  onChange,
  onFileNameChange,
  onError,
  compact = false,
}: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("documentUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]) {
        onChange(res[0].url);
        onFileNameChange?.(res[0].name);
        toast.success("Document uploaded successfully.");
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      onError?.(error.message);
      toast.error(`Upload failed: ${error.message}`);
    },
    onUploadBegin: () => {
      setIsUploading(true);
      onError?.("");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await startUpload([file]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        await startUpload([file]);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  return (
    <div className={compact ? "" : "rounded-[24px] border border-dashed border-g3 bg-g1/45 p-4"}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-ink font-medium text-xs block">{label}</label>
        {value && (
          <button 
            type="button" 
            onClick={() => onChange("")}
            className="text-[10px] text-g4 hover:text-red-400 flex items-center gap-1 uppercase tracking-wider"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>
      
      <div 
        className={`aspect-[16/9] overflow-hidden rounded-[18px] border bg-g2 relative group cursor-pointer transition-colors ${
          dragActive ? "border-brand border-solid bg-g2/80" : "border-g3 border-dashed"
        }`}
        onClick={() => {
          if (!value && !isUploading) {
            inputRef.current?.click();
          }
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />

        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs uppercase tracking-widest font-mono">Uploading...</span>
          </div>
        )}

        {value ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[12px] leading-5 text-brand bg-g1">
            <FileText size={32} className="text-brand opacity-80" />
            <span className="font-medium text-ink max-w-[200px] truncate">{fileName || "Document Uploaded"}</span>
            <a 
              href={value} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-brand hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View Document
            </a>
          </div>
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[12px] leading-5 transition-colors ${dragActive ? "text-brand" : "text-g5"}`}>
            <FileText size={22} className={dragActive ? "text-brand animate-pulse" : "text-brand"} />
            <span>{dragActive ? "Drop the PDF here" : "Drag & drop or click to upload PDF."}</span>
            <span className="text-[10px] text-g4 font-mono">Max 16MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
