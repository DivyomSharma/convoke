"use client";

import { ImagePlus } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  fileName: string;
  onChange: (value: string) => void;
  onFileNameChange: (value: string) => void;
  onError?: (message: string) => void;
  compact?: boolean;
};

export function ImageUploadField({
  label,
  value,
  fileName,
  onChange,
  onFileNameChange,
  onError,
  compact = false,
}: ImageUploadFieldProps) {
  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      onFileNameChange(file.name);
      onError?.("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={compact ? "" : "rounded-[24px] border border-dashed border-g3 bg-g1/45 p-4"}>
      <label className="text-ink font-medium text-xs mb-2 block">{label}</label>
      <div className="aspect-[16/9] overflow-hidden rounded-[18px] border border-g3 bg-g2">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-[12px] leading-5 text-g5">
            <ImagePlus size={22} className="text-brand" />
            <span>Upload an image from your device.</span>
          </div>
        )}
      </div>
      <label className="mt-3 flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-g3 bg-paper-elevated px-4 text-sm font-medium text-ink transition-all hover:border-brand/45">
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        {fileName || "Choose image"}
      </label>
    </div>
  );
}
