"use client";

import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BrushCleaningIcon, ImageUp } from "lucide-react";
import toast from "react-hot-toast";
import { IconClipboard, IconDeviceFloppy } from "@tabler/icons-react";
import { Button } from "../ui/button";

export default function Conversor({ theme, textTheme }) {
  const canvasRef = useRef();
  const dragCounterRef = useRef(0);
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [format, setFormat] = useState("webp");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [aspectRatio, setAspectRatio] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFilename("");
    setFormat("webp");
    setHeight("");
    setWidth("");
    setAspectRatio(null);
    setOriginalImage(null);
  };

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.name.endsWith(".ico")) {
      toast.error("Format ICO can't be converted");
      return;
    }

    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFilename(nameWithoutExt);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setPreview(url);
      setOriginalImage(img);
      setAspectRatio(img.width / img.height);
      setWidth(img.width);
      setHeight(img.height);
    };

    img.onerror = () => {
      toast.error("Error loading image");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };
const generateDataURL = async () => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const parsedWidth = parseInt(width);
    const parsedHeight = parseInt(height);

    canvas.width = parsedWidth;
    canvas.height = parsedHeight;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, parsedWidth, parsedHeight);
    ctx.drawImage(originalImage, 0, 0, parsedWidth, parsedHeight);

    let mimeType = `image/${format}`;
    if (format === "jpg" || format === "jpeg") mimeType = "image/jpeg";

    const quality = format === "png" || format === "ico" ? undefined : 0.92;

    const url = canvas.toDataURL(mimeType, quality);
    return url;
  };

  const copyDataURL = async () => {
    const data = await generateDataURL();

    try {
      await navigator.clipboard.writeText(data);
      toast.success("Data URL copiada al clipboard");
    } catch (err) {
      toast.error("Error al copiar");
    }
  };
  // Drag & Drop handlers con contador
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImage(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImage(files[0]);
    }
  };

  const generateICO = async () => {
    const sizes = [16, 32, 48, 64, 128, 256];
    const images = [];

    for (const size of sizes) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(originalImage, 0, 0, size, size);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const arrayBuffer = await blob.arrayBuffer();
      images.push({ size, data: new Uint8Array(arrayBuffer) });
    }

    const header = new Uint8Array(6);
    const headerView = new DataView(header.buffer);
    headerView.setUint16(0, 0, true);
    headerView.setUint16(2, 1, true);
    headerView.setUint16(4, images.length, true);

    const entries = [];
    let offset = 6 + images.length * 16;

    for (const img of images) {
      const entry = new Uint8Array(16);
      const entryView = new DataView(entry.buffer);

      entryView.setUint8(0, img.size === 256 ? 0 : img.size);
      entryView.setUint8(1, img.size === 256 ? 0 : img.size);
      entryView.setUint8(2, 0);
      entryView.setUint8(3, 0);
      entryView.setUint16(4, 1, true);
      entryView.setUint16(6, 32, true);
      entryView.setUint32(8, img.data.length, true);
      entryView.setUint32(12, offset, true);

      entries.push(entry);
      offset += img.data.length;
    }

    const totalSize =
      6 +
      images.length * 16 +
      images.reduce((sum, img) => sum + img.data.length, 0);
    const icoData = new Uint8Array(totalSize);
    let position = 0;

    icoData.set(header, position);
    position += 6;

    for (const entry of entries) {
      icoData.set(entry, position);
      position += 16;
    }

    for (const img of images) {
      icoData.set(img.data, position);
      position += img.data.length;
    }

    return new Blob([icoData], { type: "image/x-icon" });
  };

  const descargar = async () => {
    if (
      !width ||
      !height ||
      isNaN(parseInt(width)) ||
      isNaN(parseInt(height))
    ) {
      toast.error("Please enter a valid resolution");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const parsedWidth = parseInt(width);
    const parsedHeight = parseInt(height);

    canvas.width = parsedWidth;
    canvas.height = parsedHeight;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, parsedWidth, parsedHeight);
    ctx.drawImage(originalImage, 0, 0, parsedWidth, parsedHeight);

    if (format === "ico") {
      try {
        const icoBlob = await generateICO();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(icoBlob);
        link.download = `${filename}.ico`;
        link.click();
        toast.success("ICO generated successfully!");
      } catch (error) {
        toast.error("Error generating ICO: " + error.message);
      }
      return;
    }

    const mimeType = `image/${format}`;
    const quality = format === "png" ? undefined : 0.92;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error(`Format "${format}" not supported`);
          return;
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.${format}`;
        link.click();
        toast.success("Image converted successfully!");
      },
      mimeType,
      quality
    );
  };

  return (
    <div
      style={{ border: `2px solid ${theme}`, backgroundColor: `${theme}90` }}
      className="flex flex-col h-full rounded-xl overflow-hidden"
    >
      <div
        style={{ backgroundColor: theme }}
        className="relative h-14 items-center justify-center flex px-2 w-full"
      >
        <div className="w-12 p-2"></div>
        <div className=" text-xl w-full font-bold uppercase flex justify-center items-center">
          CONVERT IMAGE
        </div>
        <button
          aria-label="clean"
          onClick={reset}
          className="active:scale-110 duration-200  font-bold  flex justify-center items-center gap-4 p-2 rounded hover:opacity-80 cursor-pointer transition-opacity"
        >
          <BrushCleaningIcon color={textTheme} size={30} />
        </button>
      </div>

      <div
        style={{ border: `2px solid ${theme}` }}
        className={`${
          preview
            ? "grid md:grid-cols-[5fr_1fr] grid-cols-1 grid-rows-[2fr_1fr] md:grid-rows-1"
            : "grid grid-cols-1 grid-rows-[5fr] w-full h-full"
        } justify-center items-center h-full`}
      >
        <div
          className="w-full h-full"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label
            htmlFor="conversorInput"
            className="w-full h-full cursor-pointer block"
          >
            <div className="md:col-span-1 h-full w-full flex justify-center items-center">
              <input
                id="conversorInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />

              <div className="h-full w-full flex gap-4 items-center justify-center pointer-events-none">
                {preview ? (
                  <div className="w-full flex justify-center items-center p-4">
                    <img
                      style={{ border: `2px solid ${theme}` }}
                      src={preview}
                      alt="Preview"
                      className="max-h-32 md:max-h-64 rounded"
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    {isDragging ? (
                      <div className="w-28">
                        <ImageUp
                          size={48}
                          style={{ color: textTheme }}
                          className="animate-bounce"
                        />
                      </div>
                    ) : (
                      <div
                        style={{ color: textTheme }}
                        className="font-bold select-none opacity-60 text-xl"
                      >
                        SELECT OR DRAG IMAGE
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>

        {preview && (
          <div
            style={{ color: theme }}
            className="md:p-4 flex md:flex-col gap-2 h-full"
          >
            <div
              style={{ color: textTheme }}
              className="flex flex-col h-full gap-4 md:flex-col md:py-2"
            >
              <div className="w-full flex flex-col items-center justify-center md:items-start">
                <p className="text-xl font-bold mb-2 hidden md:block">
                  FORMAT:
                </p>
                <Select
                  style={{ color: textTheme }}
                  value={format}
                  onValueChange={setFormat}
                >
                  <SelectTrigger
                    style={{
                      color: textTheme,
                      border: `1px solid ${textTheme}`,
                      backgroundColor: theme,
                    }}
                    className="w-[100px] md:w-[140px]"
                  >
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      color: textTheme,
                      backgroundColor: theme,
                      border: `1px solid ${textTheme}`,
                    }}
                  >
                    <SelectItem value="webp">WEBP</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="URL">URL</SelectItem>
                    <SelectItem value="ico">ICO</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-center md:items-start w-full">
                <p className="text-xl font-bold mb-2 hidden md:block">
                  {format === "ico" ? "MAIN SIZE:" : "RESOLUTION:"}
                </p>

                <div className="flex w-full gap-2 text-center items-center">
                  <Input
                    name="width"
                    type="text"
                    style={{
                      color: textTheme,
                      backgroundColor: theme,
                      border: `1px solid ${textTheme}`,
                    }}
                    className="w-[70px] md:w-full text-center p-2 rounded"
                    value={width}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      const val = e.target.value;
                      setWidth(val);
                      if (val && aspectRatio) {
                        setHeight(Math.round(parseInt(val) / aspectRatio));
                      }
                    }}
                  />
                  <div className=" font-bold">X</div>
                  <Input
                    name="height"
                    type="text"
                    style={{
                      color: textTheme,
                      backgroundColor: theme,
                      border: `1px solid ${textTheme}`,
                    }}
                    className="w-[70px] md:w-full text-center p-2 rounded"
                    value={height}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      const val = e.target.value;
                      setHeight(val);
                      if (val && aspectRatio) {
                        setWidth(Math.round(parseInt(val) * aspectRatio));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="h-full w-full flex items-center justify-center md:mt-4">
              <Button
                onClick={format === "URL" ? copyDataURL : descargar}
                style={{ color: theme, backgroundColor: textTheme }}
                className="hover:opacity-80 w-full font-bold"
              >
                <div className="flex gap-2 items-center justify-center">
                  <span className="">{format === "URL" ? "COPY URL" : "DOWNLOAD"}</span>
                  
                  {format === "URL" ? <IconClipboard size={18} /> : <IconDeviceFloppy size={18} />}
                </div>
              </Button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
