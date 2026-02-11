import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "@/components/style.module.css";
import { TimePicker } from "../ui/timePicker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { useFireStore } from "@/store/fireStore";
import { cn } from "@/lib/utils";

export default function CreateTask({ open, setOpen }) {
  const [descrition, setDescrition] = useState("");
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [every, setEvery] = useState(0);
  const { newTask, lastTaskId, theme, textTheme, period } = useFireStore();
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const fileRef = useRef(null);
  const containerRef = useRef(null);
  async function uploadTaskImage(taskId, file) {
    const formData = new FormData();
    formData.append("file", file);

    // Puedes enviar otros datos si los necesitas
    formData.append("taskId", taskId);

    const res = await fetch(`/api/task/${uid}/${taskId}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    return await res.json(); // ← aquí viene secure_url
  }

  const handleImage = (file) => {
    fileRef.current = file;
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setNewImage(url);
    };

    img.onerror = () => {
      toast.error("Error loading image");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImage(files[0]);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    const nextId = lastTaskId + 1;

    let uploadedImageUrl = null;

    if (newImage && fileRef.current) {
      try {
        const upload = await uploadTaskImage(nextId, fileRef.current);

        uploadedImageUrl = upload.secure_url;
      } catch (err) {
        toast.error("Error uploading image");
        console.error(err);
      }
    }
    let finalEndDate = null;
    let finalFrequency = "none";

    if (period === "special" || period === "all") {
      finalFrequency = "special";
      finalEndDate = endDate;
      console.log(finalEndDate);
    }
    if (period === "daily") {
      const now = new Date();

      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );

      finalFrequency = "daily";
      finalEndDate = end;
    }
    if (period === "monthly") {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      finalFrequency = "monthly";
      finalEndDate = end;
    }

    if (period === "weekly") {
      const now = new Date();

      const currentDay = now.getDay(); // 0–6
      const targetDay = Number(every); // 0–6

      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7; // si el día ya pasó esta semana → siguiente semana

      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + diff,
        23,
        59,
        59,
        999,
      );

      finalFrequency = "weekly";
      finalEndDate = end;
    }
    if (!finalEndDate || finalEndDate <= new Date()) {
      toast.error("End date must be greater than the current time");
      return;
    }
    const form = {
      id: nextId,
      name,
      descrition,
      startDate: new Date(),
      endDate: finalEndDate, // ← YA tienes el valor correcto
      frequency: finalFrequency, // ← YA tienes el valor correcto
      state: "active",
      notes: [],
      image: uploadedImageUrl ?? "",
    };

    newTask(form);
    setOpen(false);
    toast.success("Task created");
    setName("");
    setDescrition("");
    setEndDate("");
    setNewImage(null);
  };
  useEffect(() => {
    const handlePaste = (e) => {
      if (!containerRef.current?.contains(e.target)) return;
      const items = e.clipboardData.items;
      for (let item of items) {
        if (item.type.includes("image")) {
          const blob = item.getAsFile();
          fileRef.current = blob;
          const img = URL.createObjectURL(blob);
          setNewImage(img);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescrition("");
      setEndDate("");
      setNewImage(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={containerRef}
        style={{
          color: textTheme,
          backgroundColor: theme,
          border: `1px solid ${textTheme}`,
        }}
        className="max-w-2xl  bg-black border-white border-2 overflow-y-auto flex flex-col gap-4 "
      >
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>CREATE NEW TASK</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="w-full h-full">
            <label
              style={{
                border: `1px ${!newImage ? "dotted" : "solid"} ${textTheme}`,
              }}
              htmlFor="newImage"
              className="items-center flex justify-center"
            >
              {newImage ? (
                <img className="max-w-xl max-h-48" src={newImage} />
              ) : (
                <div className="flex items-center justify-center font-bold max-w-xl h-48">
                  PASTE AN IMAGE
                </div>
              )}
            </label>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              id="newImage"
            />
          </div>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col w-full">
                <label className="font-bold">NAME</label>
                <Input
                  style={{ color: textTheme, border: `1px solid ${textTheme}` }}
                  placeholder="Name"
                  value={name}
                  required
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-bold">TASK DESCRIPTION</label>
                <Textarea
                  placeholder="Description"
                  rows={4}
                  required
                  style={{
                    "--theme": textTheme,
                    color: textTheme,
                    border: `1px solid ${textTheme}`,
                  }}
                  className={cn(styles.scrollContainer, "resize-none")}
                  value={descrition}
                  onChange={(e) => setDescrition(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="w-full flex flex-col pt-2 items-center justify-center gap-2 ">
              {(period === "special" || period === "all") && (
                <div className="flex flex-col">
                  <TimePicker setNewDate={setEndDate} />
                </div>
              )}
              {period === "daily" && (
                <div className="flex flex-col">
                  <div>ALL DAY</div>
                </div>
              )}
              {period === "monthly" && (
                <div className="flex flex-col">
                  <div>LAST DAY OF MONTH</div>
                </div>
              )}
              {period === "weekly" && (
                <div className="h-full flex gap-2 items-center justify-center">
                  <label>Every </label>
                  <Select
                    style={{ color: textTheme }}
                    value={every}
                    onValueChange={setEvery}
                    className="p-2 rounded w-full bg-transparent"
                  >
                    <SelectTrigger
                      style={{ color: textTheme, border: `1px solid white` }}
                      className="bg-black w-[100px] md:w-[130px]"
                    >
                      Sunday
                    </SelectTrigger>
                    <SelectContent
                      style={{ color: textTheme, backgroundColor: "black" }}
                    >
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center px-4 pt-4">
            <Button
              style={{ color: theme, backgroundColor: textTheme }}
              className="w-full md:w-2/3 h-12 duration-300 rounded font-bold  active:opacity-50"
            >
              CREATE TASK
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
