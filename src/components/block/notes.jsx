"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "react-hot-toast";
import {
  IconDeviceFloppy,
  IconDownload,
  IconEraser,
  IconNote,
  IconPencil,
} from "@tabler/icons-react";
import styles from "../enlaces.module.css";
import { useRef, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Notes({ notes, setNotes, theme, textTheme }) {
  const [bgColor, setBgColor] = useState("#ffffff");
  const scrollRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const groups = [];
  for (let i = 0; i < notes.length; i += 8) {
    groups.push(notes.slice(i, i + 8));
  }
  const groupsMobile = [];
  for (let i = 0; i < notes.length; i += 4) {
    groupsMobile.push(notes.slice(i, i + 4));
  }
  const exportToTextFile = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title === "" ? "untitled" : title}.txt`;
    link.click();
  };
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        e.preventDefault();
        const scrollSpeed = 3.4;
        scrollContainer.scrollLeft += e.deltaY * scrollSpeed;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);
  useEffect(() => {
    if (!editForm) {
      setId(0);
    }
  }, [editForm]);
  return (
    <div
      style={{ border: `2px solid ${theme}` }}
      className={`flex flex-col h-full border- rounded-xl overflow-hidden`}
    >
      <div
        style={{
          backgroundColor: theme,
        }}
        className={`relative  h-14 items-center justify-center grid grid-cols-6 grid-rows-1 w-full`}
      >
        <div className="col-start-1 col-end-6 text-xl  w-full font-bold uppercase flex justify-center items-center">
          Notes
        </div>
        <button
          style={{
            boxShadow: editable ? `0px 0px 5px 2px white` : "",
          }}
          onClick={() => setEditable(!editable)}
          className={`col-start-6 col-end-7 bg-white text-black  flex justify-center w-12 h-5/6 rounded items-center absolute`}
        >
          <IconPencil className={editable && styles.pulse} size={40} />
        </button>
      </div>
      <div
        ref={scrollRef}
        style={{
          "--theme": theme,
        }}
        className={`w-full flex-1 overflow-x-auto overflow-y-hidden ${styles.scrollContainer}`}
      >
        <div className="hidden md:flex gap-6 w-full">
          {(editable
            ? groups
            : groups.filter((group) => group.some((e) => e.title))
          ).map((group, i) => (
            <div
              key={i}
              className="grid grid-cols-2 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((note, e) => (
                <div key={e}>
                  {(note.title != "" || editable) && (
                    <div
                      onClick={() => {
                        setId(note.id - 1);
                        setTitle(note.title);
                        setContent(note.content);
                        setEditForm(true);
                        setBgColor(note.color);
                      }}
                    >
                      <NoteItem
                        note={note}
                        theme={theme}
                        editable={editable}
                        textTheme={textTheme}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex md:hidden gap-6 w-full">
          {(editable
            ? groups
            : groups.filter((group) => group.some((e) => e.title))
          ).map((group, i) => (
            <div
              key={i}
              className="grid grid-cols-1 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((note, e) => (
                <div key={e}>
                  {(note.title != "" || editable) && (
                    <div
                      onClick={() => {
                        setId(note.id - 1);
                        setTitle(note.title);
                        setContent(note.content);
                        setEditForm(true);
                        setBgColor(note.color);
                      }}
                    >
                      <NoteItem
                        note={note}
                        theme={theme}
                        editable={editable}
                        textTheme={textTheme}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Dialog onOpenChange={setEditForm} open={editForm}>
        <DialogContent className="w-full min-h-[70vh] bg-black border-white border-2 text-white overflow-hidden gap-2">
          <DialogTitle
            style={{ color: textTheme }}
            className="flex justify-center items-center font-bold"
          >
            {editable ? "EDIT NOTE" : title.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="hidden">
            Cuadro de notas
          </DialogDescription>
          <div style={{ color: textTheme }} className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              {editable && (
                <>
                  <label className="font-bold" htmlFor="title">
                    TITLE
                  </label>
                  <Input
                    style={{ color: textTheme }}
                    disabled={!editable}
                    id="title"
                    type="text"
                    placeholder={notes[id].title || ""}
                    className="p-2 rounded placeholder:text-gray-500 placeholder:opacity-40"
                    value={title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setTitle(title);
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="content"
                className={!editable ? "hidden" : "font-bold"}
              >
                CONTENT
              </label>
              <div className="w-full h-full flex">
                <Textarea
                  rows={10}
                  disabled={!editable}
                  id="content"
                  placeholder={notes[id].content || ""}
                  style={{ color: textTheme }}
                  className={`text-white disabled:cursor-text disabled:select-text resize-none p-2 w-full rounded ${styles.scrollContainer} placeholder:opacity-40`}
                  value={content}
                  onChange={(e) => {
                    const content = e.target.value;
                    setContent(content);
                  }}
                />
              </div>
            </div>
            {editable ? (
              <div className="w-full h-full flex flex-col justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="color" className="font-bold">
                    Color:
                  </label>
                  <input
                    type="color"
                    id="color"
                    value={bgColor}
                    className="w-8 h-8 p-0 m-0"
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
                <div className="flex w-full h-full items-center justify-center gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger className="flex gap-2">
                      <div className="border-2 flex items-center justify-center bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 w-full text-sm p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white">
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
                        <AlertDialogCancel className="text-black">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setNotes(id, "", "", "#000000");
                            setEditForm(false);
                          }}
                        >
                          DELETE
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <button
                    disabled={!editable}
                    style={{ backgroundColor: theme, color: textTheme }}
                    onClick={() => {
                      setNotes(id, title, content, bgColor);
                      setEditForm(false);
                    }}
                    className="hover:opacity-60  w-8/12 p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <span>SAVE</span> <IconDeviceFloppy />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full mt-4 flex justify-center md:justify-end">
                <Button
                  onClick={exportToTextFile}
                  style={{ backgroundColor: theme, color: textTheme }}
                  className="font-bold w-3/4 md:w-4/12 flex justify-center hover:opacity-70"
                >
                  DOWNLOAD <IconDownload />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}

function NoteItem({ note, theme, textTheme, editable }) {
  const [hover, setHover] = useState(false);
  const borderStyle =
    editable || (hover && note.title)
      ? `2px solid ${theme}`
      : "2px solid transparent";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: textTheme,
        border: borderStyle,
        backgroundColor: note.color,
      }}
      className="w-full hover:opacity-70 p-2 h-12 flex items-center gap-4 rounded-xl duration-200"
    >
      <div
        onClick={() => console.log(note.color)}
        className="h-12 gap-2 w-full rounded-l-md flex items-center justify-start"
      >
        <IconNote />
        {note && <h1 className="font-medium">{note.title}</h1>}
      </div>
    </div>
  );
}
