"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageIcon, Download, RefreshCw, Palette } from "lucide-react";
import Image from "next/image";

interface OutputSectionProps {
  generatedImage: string | null;
  isGenerating: boolean;
  onDownload: () => void;
  onRegenerate: () => void;
  setPrompt: (prompt: string) => void;
}

export default function OutputSection({
  generatedImage,
  isGenerating,
  onDownload,
  onRegenerate,
  setPrompt,
}: OutputSectionProps) {
  const suggestions = [
    "Biến thành tranh sơn dầu cổ điển",
    "Phong cách anime Nhật Bản",
    "Tranh vẽ bằng bút chì",
    "Phong cách cyberpunk tương lai",
    "Tranh watercolor nhẹ nhàng",
  ];

  return (
    <div className='space-y-6'>
      <Card className='border-2 border-orange-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Palette className='w-5 h-5' />
            Kết Quả
          </CardTitle>
          <CardDescription>Hình ảnh được tạo bởi Face Wash Fox</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
            {isGenerating ? (
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto'></div>
                <p className='text-gray-600'>Đang tạo hình ảnh...</p>
                <div className='w-48 bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-purple-600 h-2 rounded-full animate-pulse'
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            ) : generatedImage ? (
              <div className='w-full space-y-4'>
                <div className='relative'>
                  <Image
                    src={generatedImage}
                    alt='Generated image'
                    width={512}
                    height={512}
                    className='w-full rounded-lg object-cover'
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    onClick={onDownload}
                    className='flex-1 bg-orange-500 hover:bg-orange-600'
                  >
                    <Download className='w-4 h-4 mr-2' />
                    Tải xuống
                  </Button>
                  <Button
                    variant='outline'
                    onClick={onRegenerate}
                    className='flex-1'
                    disabled={isGenerating}
                  >
                    <RefreshCw className='w-4 h-4 mr-2' />
                    Tạo lại
                  </Button>
                </div>
              </div>
            ) : (
              <div className='text-center space-y-4'>
                <ImageIcon className='w-16 h-16 text-gray-400 mx-auto' />
                <p className='text-gray-500'>
                  Hình ảnh sẽ xuất hiện ở đây sau khi tạo
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card className='border-2 border-orange-200'>
        <CardHeader>
          <CardTitle className='text-sm'>Gợi Ý Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='cursor-pointer bg-white/10 backdrop-blur-sm border border-orange-200 rounded-md px-3 py-1 transition-all hover:bg-white/20 hover:scale-105'
                onClick={() => setPrompt(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
