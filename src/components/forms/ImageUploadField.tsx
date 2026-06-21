"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
      
      <div className="aspect-[16/9] overflow-hidden rounded-[18px] border border-g3 bg-g2 relative group">
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
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <UploadDropzone
              endpoint="imageUploader"
              onUploadBegin={() => {
                setIsUploading(true);
                onError?.("");
              }}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (res?.[0]) {
                  onChange(res[0].url);
                  toast.success("Image uploaded successfully.");
                }
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                onError?.(error.message);
                toast.error(`Upload failed: ${error.message}`);
              }}
              className="h-full w-full border-0 bg-black/60 ut-label:text-white ut-button:bg-brand ut-button:text-ink ut-allowed-content:text-g4"
            />
          </div>
        )}
        
        {!value && !isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[12px] leading-5 text-g5 pointer-events-none">
            <ImagePlus size={22} className="text-brand" />
            <span>Drag & drop or click to upload.</span>
            <span className="text-[10px] text-g4 font-mono">Max 4MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
