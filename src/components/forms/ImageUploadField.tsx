"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "sonner";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  fileName?: string;
  onChange: (value: string) => void;
  onFileNameChange?: (value: string) => void;
  onError?: (message: string) => void;
  compact?: boolean;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  onError,
  compact = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]) {
        onChange(res[0].url);
        toast.success("Image uploaded successfully.");
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
      if (file.type.startsWith("image/")) {
        await startUpload([file]);
      } else {
        toast.error("Please upload an image file");
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
          accept="image/*"
          className="hidden"
        />

        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs uppercase tracking-widest font-mono">Uploading...</span>
          </div>
        )}

        {value ? (
          <Image 
            src={value} 
            alt="Uploaded image" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[12px] leading-5 transition-colors ${dragActive ? "text-brand" : "text-g5"}`}>
            <ImagePlus size={22} className={dragActive ? "text-brand animate-pulse" : "text-brand"} />
            <span>{dragActive ? "Drop the image here" : "Drag & drop or click to upload."}</span>
            <span className="text-[10px] text-g4 font-mono">Max 4MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
