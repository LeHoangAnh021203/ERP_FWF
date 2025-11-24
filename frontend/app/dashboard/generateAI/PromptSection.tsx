"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Slider } from "@/app/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Wand2, RefreshCw, Sparkles } from "lucide-react";

interface PromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  strength: number[];
  setStrength: (strength: number[]) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const stylePresets = [
  { value: "realistic", label: "Realistic", icon: "📷" },
  { value: "artistic", label: "Artistic", icon: "🎨" },
  { value: "anime", label: "Anime", icon: "🌸" },
  { value: "cartoon", label: "Cartoon", icon: "🎭" },
  { value: "oil-painting", label: "Oil Painting", icon: "🖼️" },
  { value: "watercolor", label: "Watercolor", icon: "💧" },
];

export default function PromptSection({
  prompt,
  setPrompt,
  style,
  setStyle,
  strength,
  setStrength,
  isGenerating,
  onGenerate,
}: PromptSectionProps) {
  return (
    <Card className='border-2 border-orange-200'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wand2 className='w-5 h-5' />
          Mô Tả Biến Đổi
        </CardTitle>
        <CardDescription>Mô tả cách bạn muốn biến đổi hình ảnh</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <Label htmlFor='prompt'>Prompt</Label>
          <Textarea
            id='prompt'
            placeholder='Ví dụ: Biến thành tranh sơn dầu phong cách Van Gogh, với bầu trời đầy sao...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className='mt-1'
            aria-describedby='prompt-help'
          />
          <p id='prompt-help' className='text-xs text-gray-500 mt-1'>
            Mô tả chi tiết sẽ cho kết quả tốt hơn
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='style-select'>Style Preset</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className='mt-1'>
                <SelectValue>{style}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {stylePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    <span className='flex items-center gap-2'>
                      <span>{preset.icon}</span>
                      {preset.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='strength-slider'>Strength: {strength[0]}</Label>
            <Slider
              value={strength}
              onValueChange={setStrength}
              max={1}
              min={0.1}
              step={0.1}
              className='w-full mt-2 h-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full appearance-none
[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:h-4
[&::-webkit-slider-thumb]:w-4
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:border-solid
[&::-webkit-slider-thumb]:rounded-full'
            />
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>Giữ nguyên</span>
              <span>Thay đổi hoàn toàn</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={!prompt || isGenerating}
          className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300'
          size='lg'
        >
          {isGenerating ? (
            <>
              <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
              Đang tạo...
            </>
          ) : (
            <>
              <Sparkles className='w-4 h-4 mr-2' />
              Tạo Hình Ảnh
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
