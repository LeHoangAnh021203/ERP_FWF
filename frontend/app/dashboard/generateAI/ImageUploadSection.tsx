"use client";

import { useRef } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ImageIcon, Upload, Camera } from "lucide-react";
import Image from "next/image";

interface ImageUploadSectionProps {
  selectedImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadSection({ 
  selectedImage, 
  onImageUpload 
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-orange-200 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Hình Ảnh
        </CardTitle>
        <CardDescription>
          Chọn hình ảnh từ máy tính của bạn để bắt đầu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onClick={handleFileSelect}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFileSelect();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Chọn hình ảnh"
        >
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="Selected image"
                  width={300}
                  height={300}
                  className="mx-auto rounded-lg object-cover max-h-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileSelect();
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Chọn ảnh khác
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Kéo thả hoặc click để chọn ảnh
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP (tối đa 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          aria-label="Chọn file hình ảnh"
        />
      </CardContent>
    </Card>
  );
}