"use client";

import { useState, useRef } from "react";
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

import { Badge } from "@/app/components/ui/badge";
import {
  Upload,
  ImageIcon,
  Wand2,
  Download,
  RefreshCw,
  Sparkles,
  Palette,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { aiService } from "../../lib/ai-service";

export default function ImageGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [strength, setStrength] = useState([0.8]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new window.Image();

      img.onload = () => {
        // Calculate new dimensions to fit Stability AI requirements
        const maxWidth = 1024;
        const maxHeight = 1024;

        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        const validDimensions = [
          [1024, 1024],
          [1152, 896],
          [1216, 832],
          [1344, 768],
          [1536, 640],
          [640, 1536],
          [768, 1344],
          [832, 1216],
          [896, 1152],
        ];

        let bestDimension = validDimensions[0];
        let minDiff =
          Math.abs(width - bestDimension[0]) +
          Math.abs(height - bestDimension[1]);

        for (const [w, h] of validDimensions) {
          const diff = Math.abs(width - w) + Math.abs(height - h);
          if (diff < minDiff) {
            minDiff = diff;
            bestDimension = [w, h];
          }
        }

        [width, height] = bestDimension;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/jpeg",
          0.9
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBlob = await resizeImage(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(resizedBlob);

        console.log("Image resized successfully");
      } catch (error) {
        console.error("Image resize error:", error);

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setIsGenerating(true);
    setError(null); // Clear previous errors

    try {
      const base64Response = await fetch(selectedImage);
      const imageBlob = await base64Response.blob();

      console.log("Starting AI generation...");
      console.log("Service:", aiService.getServiceName());
      console.log("Image size:", imageBlob.size, "bytes");
      console.log("Prompt:", prompt);

      const generatedImageData = await aiService.generateFoxPerson(
        imageBlob,
        prompt,
        strength[0]
      );
      setGeneratedImage(generatedImageData);
      
      // Check if demo image was returned
      if (generatedImageData.startsWith('/fox')) {
        setError('Đang sử dụng chế độ demo do các dịch vụ AI không khả dụng. Vui lòng cấu hình API key để sử dụng tính năng đầy đủ.');
      } else {
        console.log("AI generation successful!");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      
      // Provide user-friendly error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('insufficient_balance')) {
        setError('Tài khoản AI không đủ số dư. Đang thử dịch vụ khác...');
      } else if (errorMessage.includes('429')) {
        setError('Dịch vụ AI đang quá tải. Đang thử dịch vụ khác...');
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        setError('Lỗi xác thực API. Vui lòng kiểm tra API key.');
      } else {
        setError(`Lỗi tạo ảnh: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "fox-person.png";
      link.click();
    }
  };

  const foxPromptSuggestions = [
    "Biến thành cáo đỏ với đuôi xù",
    "Cáo trắng với mắt xanh",
    "Cáo hoang dã với bộ lông rậm",
    "Cáo tinh nghịch với tai nhọn",
    "Cáo thông minh với đuôi dài",
  ];

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-orange-700 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 transition duration-300 hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] hover:scale-110" />
            Fox Person AI Generator
          </h1>
          <p className="text-gray-600 flex flex-wrap justify-center items-center gap-[3px] text-xs sm:text-sm md:text-base px-4">
            Biến đổi hình ảnh của bạn thành{" "}
            <span className="text-orange-500 flex justify-center items-center font-semibold">
              người cáo
            </span>{" "}
            <span className="flex justify-center items-center">với</span>
            <span className="text-orange-500 flex justify-center items-center font-semibold">
              Face Wash Fox
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-orange-200 border-2">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Hình Ảnh
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Chọn ảnh để biến thành cáo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <Image
                          src={selectedImage}
                          alt="Selected image"
                          width={300}
                          height={300}
                          className="mx-auto rounded-lg object-cover max-h-48 sm:max-h-64 w-full"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Chọn ảnh khác
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm sm:text-lg font-medium text-gray-700">
                          Kéo thả hoặc click để chọn ảnh
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Mô Tả Cáo
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Mô tả loại cáo bạn muốn biến đổi thành
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="prompt" className="text-sm sm:text-base">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ví dụ: Cáo đỏ với đuôi xù, mắt xanh, tai nhọn..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="mt-1 text-sm sm:text-base"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <Label className="text-sm sm:text-base">
                      Strength: {strength[0]}
                    </Label>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full mt-2 h-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full appearance-none
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:h-4
  [&::-webkit-slider-thumb]:w-4
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:border-solid
  [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Giữ nguyên</span>
                      <span>Thay đổi hoàn toàn</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!selectedImage || !prompt || isGenerating}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-sm sm:text-base"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                      Đang tạo cáo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Tạo Người Cáo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-orange-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  Kết Quả
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Hình ảnh người cáo được tạo bởi Face Wash Fox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Đang biến hình...
                      </p>
                      <div className="w-32 sm:w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <div className="w-full space-y-3 sm:space-y-4">
                      <div className="relative">
                        <Image
                          src={generatedImage}
                          alt="Generated fox person"
                          width={512}
                          height={512}
                          className="w-full rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleDownload}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-sm sm:text-base"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Tải xuống
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleGenerate}
                          className="flex-1 text-sm sm:text-base"
                        >
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Tạo lại
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 sm:space-y-4">
                      <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                      <p className="text-gray-500 text-sm sm:text-base px-4">
                        Hình ảnh người cáo sẽ xuất hiện ở đây
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Examples */}
            <Card className="border-2 border-orange-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-sm sm:text-base">
                  Gợi Ý Prompt Cáo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                  {foxPromptSuggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-white/10 backdrop-blur-sm border border-orange-200 rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all hover:bg-white/20 hover:scale-105 text-center"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}