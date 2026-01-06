import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import styles from "../style.module.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  IconAlarmAverage,
  IconCheck,
  IconDownload,
  IconEraser,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFireStore } from "@/store/fireStore";
import { useClock } from "@/hooks/useClock";
import { TimerOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { TimePicker } from "../ui/timePicker";

export default function Task({ task }) {
  const {
    theme,
    textTheme,
    deleteTask,
    addNote,
    completeTask,
    restoreTask,
    updateEndDateTask,
  } = useFireStore();
  const time = useClock();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [comment, setComment] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [movilSeccion, setMovilSeccion] = useState("description");
  const containerRef = useRef(null);
  const startDate = task.startDate?.toDate?.() ?? task.startDate;
  const endDate = task.endDate?.toDate?.() ?? task.endDate;
  const total = endDate.getTime() - startDate.getTime();
  const firstThird = startDate.getTime() + total * (1 / 3);
  const secondThird = startDate.getTime() + total * (2 / 3);

  const updateEndDate = (taskid) => {
    if (!newEndDate || newEndDate <= new Date()) {
      toast.error("End date must be greater than the current time");
      return;
    }
    updateEndDateTask(taskid, newEndDate);
    toast.success("Date Updated");
  };

  const colorCondition = () => {
    if (!startDate || !endDate) return null;

    const now = time.getTime();

    if (task.state === "completed") {
      return "transparent";
    }

    // 🔴 Último tercio → se pasó o está por acabarse
    if (now >= secondThird) {
      return "#E31B1C";
    }

    // 🟡 Segundo tercio
    if (now >= firstThird && now < secondThird) {
      return "#D8C901"; // color ejemplo — cámbialo si quieres
    }

    // 🟢 Primer tercio
    if (now < firstThird) {
      return "#b2dddd";
    }

    return "#b2dddd";
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setNewImagePreview(url);
    setNewImageFile(file);
  };
  useEffect(() => {
    const handlePaste = (e) => {
      if (!containerRef.current?.contains(e.target)) return;
      const items = e.clipboardData.items;
      for (let item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          const url = URL.createObjectURL(file);

          setNewImagePreview(url);
          setNewImageFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    if (!openForm) {
      setTitle("");
      setComment("");
      setNewImagePreview(null);
      setNewImageFile(null);
    }
  }, [openForm]);
  const downloadImage = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(blobUrl);
  };
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          boxShadow: `0 0 5px 4px ${colorCondition()}`,
          background: theme,

          color: textTheme,
        }}
        className={cn(
          "w-full relative h-16 rounded-xl p-2 cursor-pointer select-none",
          task.state === "completed" && "opacity-50"
        )}
      >
        <div className=" w-full h-full flex flex-col justify-center items-center">
          {task.state === "completed" && (
            <span
              style={{
                backgroundColor: theme,
                boxShadow: `0 0 5px 4px ${colorCondition()}`,
              }}
              className="absolute -top-3 -left-3 rounded-xl "
            >
              <IconCheck size={25} />
            </span>
          )}
          {time > endDate && task.state !== "completed" && (
            <span
              style={{
                backgroundColor: theme,
                boxShadow: `0 0 5px 4px ${colorCondition()}`,
              }}
              className="absolute -top-3 -left-4 rounded-xl "
            >
              <IconAlarmAverage size={30} />
            </span>
          )}
          <div
            style={{ color: textTheme }}
            title={task.name}
            className="font-bold uppercase text-sm text-wrap text-center line-clamp-2"
          >
            {task.name}
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          style={{
            color: textTheme,
            backgroundColor: theme,
            border: `2px solid ${colorCondition()}`,
          }}
          className={cn(
            "animate-none",
            "max-w-3xl border-white border-2 max-h-[90vh] overflow-y-auto flex flex-col gap-1 p-4 bg-black "
          )}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="font-bold flex flex-col items-center gap-2 justify-center uppercase w-full">
              <span className="text-center">{task.name}</span>
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="flex w-full gap-2 md:hidden items-center justify-center">
              <Button
                style={{
                  border: movilSeccion === "description" && "1px solid white",
                }}
                onClick={() => setMovilSeccion("description")}
              >
                DESCRIPTION
              </Button>{" "}
              <Button
                style={{
                  border: movilSeccion === "notes" && "1px solid white",
                }}
                onClick={() => setMovilSeccion("notes")}
              >
                NOTES
              </Button>
            </div>
          </DialogHeader>
          <div className={"h-full flex flex-col md:grid md:grid-cols-2 gap-8"}>
            <div
              className={cn(
                movilSeccion === "description" ? "flex flex-col" : "hidden",
                "gap-4 w-full h-full"
              )}
            >
              <div className="flex flex-col w-full gap-4 items-center justify-center">
                <div
                  className={
                    task.image && "w-full h-full   overflow-hidden  rounded-lg"
                  }
                >
                  {task.image ? (
                    <>
                      <Dialog>
                        <DialogTrigger className="focus-visible:outline-0 flex items-center justify-center w-full h-full">
                          <img
                            className="max-w-full max-h-[20vh] object-contain rounded"
                            src={task.image}
                            alt={task.name}
                          />
                        </DialogTrigger>
                        <DialogContent
                          style={{
                            color: textTheme,
                            backgroundColor: theme,
                            border: `1px solid ${textTheme}`,
                          }}
                          className="h-fit w-fit flex items-center justify-center"
                        >
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col h-full gap-2 items-center justify-center">
                            <img
                              className="max-w-full max-h-[80vh] object-contain p-4"
                              src={task.image}
                              alt={task.name}
                            />
                            <div>
                              <Button
                                onClick={() =>
                                  downloadImage(
                                    task.image,
                                    task.name ?? "imagen"
                                  )
                                }
                                variant="ghost"
                              >
                                <IconDownload size={30} />
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center"></div>
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span className="font-bold w-full">DESCRIPTION</span>
                  <div
                    style={{
                      "--theme": textTheme,
                      backgroundColor: theme,
                      border: `2px solid ${textTheme}`,
                    }}
                    className={cn(
                      styles.scrollContainer,
                      "overflow-y-auto min-h-16 p-2 text-sm rounded border-2"
                    )}
                  >
                    {task.descrition}
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-between gap-2  ">
                <div
                  className={cn(
                    "w-full flex text-sm gap-4 items-center justify-center"
                  )}
                >
                  <div
                    className={cn(
                      task.image ? "w-full" : "w-1/3",
                      "h-full flex flex-col"
                    )}
                  >
                    <div className="font-bold text-center">STARTED</div>
                    <div
                      style={{
                        border: `2px solid ${textTheme}`,
                        backgroundColor: theme,
                      }}
                      className="rounded w-full text-center p-1"
                    >
                      {startDate.toLocaleString("en-GB")}
                    </div>
                  </div>

                  <div
                    className={cn(
                      task.image ? "w-full" : "w-1/3",
                      "h-full flex flex-col"
                    )}
                  >
                    <div className="flex justify-center gap-2 items-center">
                      <div className="font-bold text-center">END</div>
                      {task.state != "completed" && (
                        <Dialog>
                          <DialogTrigger>
                            <IconPencil className="hover:scale-125 duration-300" />
                          </DialogTrigger>

                          <DialogContent
                            style={{
                              color: textTheme,
                              backgroundColor: theme,
                              border: `2px solid ${colorCondition()}`,
                            }}
                            className="w-full"
                          >
                            <DialogDescription></DialogDescription>
                            <DialogTitle className="text-center">
                              EDIT END DATE
                            </DialogTitle>
                            <div className="w-full h-full flex flex-col gap-4 items-center justify-center p-4">
                              <div className="w-full flex justify-center">
                                <TimePicker setNewDate={setNewEndDate} />
                              </div>

                              <div className="w-full flex justify-center">
                                <DialogClose asChild>
                                  <Button
                                    style={{
                                      color: theme,
                                      backgroundColor: textTheme,
                                    }}
                                    onClick={() => updateEndDate(task.id)}
                                    className="w-full md:w-1/2 h-10 font-bold px-8 p-2"
                                  >
                                    SAVE
                                  </Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div
                      style={{
                        border: `2px solid ${textTheme}`,
                        backgroundColor: theme,
                      }}
                      className="rounded w-full text-center p-1"
                    >
                      {endDate.toLocaleString("en-GB")}
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex flex-col uppercase gap-4 items-center justify-center">
                  <div className="flex h-full w-full items-center justify-center  gap-2">
                    <span className="h-full text-xl flex items-center font-bold">
                      Frequency:
                    </span>
                    <span className="h-full text-xl flex items-center">
                      {task.frequency != "none" && task.frequency}
                    </span>
                  </div>
                  {task.state === "completed" ? (
                    <Button
                      onClick={() => {
                        restoreTask(task.id);
                        setOpen(false);
                        toast.success("Task restored");
                      }}
                      className="bg-black select-none border-2 flex items-center justify-center text-destructive-foreground shadow-sm h-10 w-full text-sm p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
                    >
                      RESTORE <IconEraser />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        completeTask(task.id);
                        setOpen(false);
                        toast.success("Task completed");
                      }}
                      className="bg-black select-none border-2 flex items-center justify-center text-destructive-foreground shadow-sm h-10 w-full text-sm p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
                    >
                      COMPLETE <IconEraser />
                    </Button>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className="flex gap-2 w-full justify-center">
                    <div className=" border-2 flex items-center justify-center bg-destructive text-destructive-foreground h-10 shadow-sm hover:bg-destructive/90 w-full text-sm p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white">
                      DELETE <IconEraser />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    style={{ color: textTheme }}
                    className="bg-black"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-black font-bold">
                        CANCEL
                      </AlertDialogCancel>
                      <Button
                        className="font-bold h-10"
                        variant="destructive"
                        onClick={async () => {
                          setOpen(false);
                          await deleteTask(task.id);
                          toast.success("Task deleted");
                        }}
                      >
                        DELETE
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="w-full h-[70vh] flex overflow-y-auto">
              <div
                className={cn(
                  movilSeccion === "notes"
                    ? "flex flex-col h-96"
                    : "hidden md:flex md:flex-col md:h-full",
                  "w-full  gap-4"
                )}
              >
                <div className="font-bold w-full text-center">NOTES</div>
                <div
                  style={{
                    "--theme": textTheme,
                    border: `1px solid ${textTheme}`,
                  }}
                  className={cn(
                    styles.scrollContainer,
                    "w-full  h-full flex flex-col overflow-y-auto gap-2 p-2"
                  )}
                >
                  {task.notes &&
                    task.notes.map((note, i) => (
                      <Dialog key={i}>
                        <DialogTrigger>
                          <div
                            style={{
                              border: `1px solid ${textTheme}`,
                              backgroundColor: theme,
                            }}
                            className="w-full flex flex-col justify-center text-sm gap-2 h-16 items-center p-2  hover:opacity-70 rounded "
                          >
                            {new Date(note.createdAt).toLocaleString("en-GB")}

                            <div className="line-clamp-2 ">{note.title}</div>
                          </div>
                        </DialogTrigger>
                        <DialogContent
                          style={{
                            color: textTheme,
                            backgroundColor: theme,
                            border: `1px solid ${textTheme}`,
                          }}
                          className="w-full md:w-1/2   border-2 overflow-x-hidden overflow-y-auto flex flex-col"
                        >
                          <DialogHeader className="pb-4">
                            <DialogTitle className="text-center font-bold uppercase">
                              {note.title}
                            </DialogTitle>
                          </DialogHeader>

                          <div
                            className={
                              note.imageUrl &&
                              "w-full h-48 overflow-hidden rounded-lg" // altura para tasks con imagen
                            }
                          >
                            {note.imageUrl ? (
                              <Dialog>
                                <DialogTrigger className="focus-visible:outline-0 h-full w-full flex items-center justify-center">
                                  <div className="h-fit w-fit border rounded">
                                    <img
                                      className="max-h-44 max-w-full object-contain rounded"
                                      src={note.imageUrl}
                                      alt={note.title}
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent
                                  style={{
                                    color: textTheme,
                                    backgroundColor: theme,
                                    border: `1px solid ${textTheme}`,
                                  }}
                                  className="h-fit w-fit flex items-center justify-center"
                                >
                                  <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription></DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col h-full gap-2 items-center justify-center">
                                    <img
                                      className="max-w-full max-h-[80vh] p-4"
                                      src={note.imageUrl}
                                      alt={note.title}
                                    />
                                    <div>
                                      <Button
                                        onClick={() =>
                                          downloadImage(
                                            note.imageUrl,
                                            note.title ?? "imagen"
                                          )
                                        }
                                        variant="ghost"
                                      >
                                        <IconDownload size={30} />
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <div className="w-full h-full bg-neutral-900 flex items-center justify-center"></div>
                            )}
                          </div>

                          <DialogDescription></DialogDescription>
                          <div
                            style={{
                              "--theme": textTheme,
                              backgroundColor: theme,
                              border: `2px solid ${textTheme}`,
                              whiteSpace: "pre-wrap",
                              overflowX: "hidden",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                            className={cn(
                              styles.scrollContainer,
                              "overflow-y-auto min-h-16 max-h-40 p-2 text-sm  rounded border-2"
                            )}
                          >
                            {note.text && note.text}
                          </div>
                          <DialogClose
                            style={{ color: theme, backgroundColor: textTheme }}
                            className="w-full h-10 font-bold active:opacity-50 duration-300 rounded"
                          >
                            OK
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    ))}
                  <div
                    onClick={() => setOpenForm(true)}
                    style={{
                      border: `1px dotted ${textTheme}`,
                      backgroundColor: theme,
                    }}
                    className="flex w-full h-12 justify-center items-center p-2 hover:opacity-70 rounded "
                  >
                    <IconPlus color={textTheme} size={20} />
                  </div>
                  <Dialog open={openForm} onOpenChange={setOpenForm}>
                    <DialogContent
                      ref={containerRef}
                      style={{
                        color: textTheme,
                        backgroundColor: theme,
                        border: `1px solid ${textTheme}`,
                      }}
                      className="w-full md:w-1/2 bg-black  overflow-x-hidden overflow-y-auto flex flex-col"
                    >
                      <DialogHeader>
                        <DialogTitle className="text-center font-bold">
                          NEW NOTE
                        </DialogTitle>
                        <DialogDescription className=""></DialogDescription>
                      </DialogHeader>
                      <div className="w-full h-full flex gap-2 items-center justify-center">
                        <label htmlFor="note" className="font-bold">
                          TITLE
                        </label>
                        <Input
                          id="note"
                          style={{
                            color: textTheme,
                            border: `1px solid ${textTheme}`,
                          }}
                          value={title}
                          onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                      </div>
                      <div className="w-full h-full">
                        <label
                          htmlFor="newImage"
                          style={{ border: `1px dotted ${textTheme}` }}
                          className=" min-h-32 rounded items-center flex justify-center"
                        >
                          {newImagePreview ? (
                            <img
                              className="max-w-full max-h-64"
                              src={newImagePreview}
                            />
                          ) : (
                            "Click here  or Paste an Image"
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
                      <div className="w-full h-full flex flex-col gap-2 justify-center">
                        <label htmlFor="note" className="font-bold">
                          COMMENT
                        </label>
                        <Textarea
                          style={{
                            "--theme": textTheme,
                            border: `1px solid ${textTheme}`,
                          }}
                          id="note"
                          rows={4}
                          value={comment}
                          className={cn(styles.scrollContainer, "resize-none")}
                          onChange={(e) => setComment(e.currentTarget.value)}
                        />
                      </div>
                      <div className="w-full h-full flex justify-center">
                        <Button
                          style={{ color: theme, backgroundColor: textTheme }}
                          className="w-full h-10 font-bold active:opacity-50 duration-300 rounded"
                          onClick={async () => {
                            console.log(task.id);
                            setOpenForm(false);
                            await addNote(task.id, {
                              text: comment,
                              title,
                              image: newImageFile,
                            });
                            toast.success("Note added");
                          }}
                        >
                          CREATE NOTE
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
