"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "../style.module.css";
import { useRef, useEffect, useState } from "react";
import {
  IconBrush,
  IconDeviceFloppy,
  IconEye,
  IconEyeClosed,
  IconPencil,
} from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

/* ------------------ SortableItem (solo usado cuando editable === true) ------------------ */
function SortableItem({ color, onClick, theme, textTheme, displayColors }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(color.id) });
  const [open, setOpen] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Timer para detectar click vs drag
  const clickTimerRef = useRef(null);
  const moved = useRef(false);

  const handlePointerDown = (e) => {
    moved.current = false;

    clickTimerRef.current = setTimeout(() => {
      if (listeners && typeof listeners.onPointerDown === "function") {
        listeners.onPointerDown(e);
      }
    }, 10);
  };

  const handlePointerMove = () => {
    moved.current = true; // El usuario se está moviendo
    clearTimeout(clickTimerRef.current);
  };

  const handlePointerUp = (e) => {
    clearTimeout(clickTimerRef.current);

    if (!moved.current) {
      onClick();
    }
  };

  return (
    <>
      {!displayColors && color.nombre ? (
        <TooltipProvider delayDuration={1}>
          <Tooltip open={open} onOpenChange={(v) => setOpen(v)}>
            <TooltipTrigger asChild>
              <div
                onPointerEnter={() => setOpen(true)}
                onPointerLeave={() => {
                  setTimeout(() => setOpen(false), 0);
                }}
                className={cn(!displayColors ? "w-full" : "w-[194px]")}
                ref={setNodeRef}
                style={style}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                {...attributes}
              >
                <div className="cursor-grab rounded-xl active:cursor-grabbing w-full">
                  <Color
                    displayColors={displayColors}
                    color={color}
                    theme={theme}
                    editable={true}
                    textTheme={textTheme}
                  />
                </div>
              </div>
            </TooltipTrigger>

            <TooltipContent onPointerEnter={() => setOpen(false)}>
              <p className="select-none">{color.nombre}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className={cn(!displayColors ? "w-full" : "w-[194px]")}
          ref={setNodeRef}
          style={style}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          {...attributes}
        >
          <div className="cursor-grab rounded-xl active:cursor-grabbing w-full">
            <Color
              displayColors={displayColors}
              color={color}
              theme={theme}
              editable={true}
              textTheme={textTheme}
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------ StaticItem (solo cuando editable === false) ------------------ */
function StaticItem({
  color,
  onClick,
  theme,
  textTheme,
  editable,
  displayColors,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!displayColors && color.nombre ? (
        <TooltipProvider delayDuration={1}>
          <Tooltip open={open} onOpenChange={(v) => setOpen(v)}>
            <TooltipTrigger asChild>
              <div
                onPointerEnter={() => setOpen(true)}
                onPointerLeave={() => {
                  setTimeout(() => setOpen(false), 0);
                }}
                className={cn(!displayColors ? "w-full" : "w-[194px]")}
                onClick={onClick}
              >
                <Color
                  color={color}
                  displayColors={displayColors}
                  theme={theme}
                  editable={editable}
                  textTheme={textTheme}
                />
              </div>
            </TooltipTrigger>

            <TooltipContent onPointerEnter={() => setOpen(false)}>
              <p className="select-none">{color.nombre}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className={cn(!displayColors ? "w-full" : "w-[194px]")}
          onClick={onClick}
        >
          <Color
            color={color}
            displayColors={displayColors}
            theme={theme}
            editable={editable}
            textTheme={textTheme}
          />
        </div>
      )}
    </>
  );
}

function ColorsGrid({
  colors,
  editable,
  moveColor,
  setEditForm,
  setColor,
  setEditingIndex,
  setNombre,
  theme,
  displayColors,
  textTheme,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = colors.findIndex(
      (c) => String(c.id) === String(active.id),
    );
    const newIndex = colors.findIndex((c) => String(c.id) === String(over.id));

    if (oldIndex !== -1 && newIndex !== -1) {
      moveColor(oldIndex, newIndex);
    }
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText("#" + color.color);
    toast((t) => (
      <span className="flex items-center justify-center gap-4">
        <IconBrush stroke={3} size={20} style={{ color: `#${color.color}` }} />
        Copied <b>#{color.color.toUpperCase()}</b>
        <div
          className="h-4 w-4"
          style={{
            backgroundColor: `#${color.color}`,
            border: `1px solid ${textTheme}`,
          }}
        ></div>
      </span>
    ));
  };

  // ✅ CAMBIO: Ahora recibimos el índice como parámetro
  const handleItemClick = (color, index) => {
    if (!editable && color.color) handleCopy(color);
    if (editable) {
      // ✅ Guardamos el índice real del array, no el ID
      setEditingIndex(index);
      setColor(color.color);
      setNombre(color.nombre);
      setEditForm(true);
    }
  };
  const visibleColors = colors.slice(
    0,
    colors.map((c) => (c.color || c.nombre) !== "").lastIndexOf(true) + 1,
  );

  // Si editable === true -> habilitamos DnD (dnd-kit)
  if (editable) {
    return (
      <>
        <DndContext
          className="md:block hidden"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={colors.map((c) => String(c.id))}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid h-full grid-rows-4 grid-flow-col w-full gap-2 p-4">
              {colors.map((color, index) => (
                <SortableItem
                  displayColors={displayColors}
                  key={color.id}
                  color={color}
                  theme={theme}
                  textTheme={textTheme}
                  onClick={() => handleItemClick(color, index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="md:hidden grid h-full grid-rows-4 grid-flow-col w-full gap-2 p-4">
          {colors.map((color, index) => (
            <StaticItem
              displayColors={displayColors}
              key={color.id}
              color={color}
              editable={true}
              theme={theme}
              textTheme={textTheme}
              onClick={() => handleItemClick(color, index)}
            />
          ))}
        </div>
      </>
    );
  }

  // Si editable === false -> grid estático, sin DnD
  return (
    <div className="grid h-full grid-rows-4 grid-flow-col w-full gap-2 p-4">
      {visibleColors.map((color, index) => (
        <StaticItem
          displayColors={displayColors}
          key={color.id}
          color={color}
          editable={false}
          theme={theme}
          textTheme={textTheme}
          onClick={() => handleItemClick(color, index)}
        />
      ))}
    </div>
  );
}

/* ------------------ Main component Colors (tu código adaptado) ------------------ */
export default function ColorsDesktop({
  colors,
  setColors,
  theme,
  textTheme,
  moveColor,
  displayColors,
  setDisplayColors,
}) {
  const scrollRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [color, setColor] = useState("");
  const [nombre, setNombre] = useState("");

  const manageFormat = (colorStr) => {
    if (!colorStr) return "";
    if (colorStr[0] === "#") return colorStr.slice(1);
    return colorStr;
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        e.preventDefault();
        const scrollSpeed = 4.0;
        scrollContainer.scrollLeft += e.deltaY * scrollSpeed;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (!editForm) {
      setEditingIndex(null);
    }
  }, [editForm]);

  return (
    <div
      style={{ border: `2px solid ${theme}` }}
      className={`flex flex-col h-full rounded-xl overflow-hidden`}
    >
      <div
        style={{
          backgroundColor: theme,
        }}
        className={`relative flex h-14 items-center justify-center px-2  w-full`}
      >
        <div
          className="w-12 p-2 h-full cursor-pointer flex items-center justify-center"
          onClick={() => setDisplayColors()}
        >
          {!displayColors ? <IconEyeClosed size={40} /> : <IconEye size={40} />}
        </div>
        <div className=" text-xl  w-full font-bold uppercase flex justify-center items-center">
          Colors
        </div>
        <button
          onClick={() => setEditable(!editable)}
          className={` flex justify-center w-12 h-12 p-2 rounded items-center`}
        >
          <IconPencil
            color={textTheme}
            className={editable && styles.pulse}
            size={40}
          />
        </button>
      </div>

      <div
        ref={scrollRef}
        style={{
          "--theme": textTheme,
          backgroundColor: `${theme}90`,
          border: `2px solid ${theme}`,
        }}
        className={cn(
          !displayColors && "justify-center",
          ` w-full flex-1 flex items-center overflow-x-auto overflow-y-hidden ${styles.scrollContainer}`,
        )}
      >
        <div className="h-full">
          <ColorsGrid
            displayColors={displayColors}
            colors={colors}
            editable={editable}
            moveColor={moveColor}
            setEditForm={setEditForm}
            setColor={setColor}
            setEditingIndex={setEditingIndex}
            setNombre={setNombre}
            theme={theme}
            textTheme={textTheme}
          />
        </div>
      </div>

      <Dialog onOpenChange={setEditForm} open={editForm}>
        <DialogContent
          style={{
            color: textTheme,
            backgroundColor: theme,
            border: `1px solid ${textTheme}`,
          }}
          className="w-full bg-black border-white border-2 overflow-hidden"
        >
          <DialogTitle className="flex justify-center items-center font-bold">
            EDIT COLOR
          </DialogTitle>
          <DialogDescription className="hidden">
            Cuadro de edicion de color
          </DialogDescription>
          <div className="grid grid-cols-1 grid-rows-3 gap-8  p-4 h-full">
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="nombre">
                NAME
              </label>
              <Input
                id="nombre"
                type="text"
                style={{ border: `1px solid ${textTheme}` }}
                placeholder={
                  editingIndex !== null ? colors[editingIndex]?.nombre : ""
                }
                className="p-2 rounded placeholder:text-gray-500 placeholder:opacity-40"
                value={nombre}
                onChange={(e) => {
                  const nombreV = e.target.value;
                  setNombre(nombreV);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="color">
                COLOR
              </label>
              <div className="w-full h-full flex items-center gap-4">
                <div
                  className="w-8 h-8"
                  style={{
                    backgroundColor: `#${manageFormat(color)}`,
                    border: `1px solid ${theme}`,
                  }}
                ></div>
                <span className="flex justify-center items-center text-xl font-bold">
                  #
                </span>
                <Input
                  id="color"
                  maxLength={9}
                  className="p-2 w-40 rounded placeholder:opacity-40"
                  type="text"
                  style={{ border: `1px solid ${textTheme}` }}
                  placeholder={
                    editingIndex !== null ? colors[editingIndex]?.color : ""
                  }
                  value={color.toUpperCase()}
                  onChange={(e) => {
                    const colorV = e.target.value;
                    setColor(colorV);
                  }}
                />
              </div>
            </div>

            <div className="w-full h-full flex justify-center items-center gap-4">
              <Button
                className="h-10"
                variant="destructive"
                onClick={() => {
                  if (editingIndex !== null) {
                    setEditForm(false);
                    setColors(editingIndex, "", "");
                    setColor("");
                    setNombre("");
                    setEditingIndex(null);
                  }
                }}
              >
                DELETE
              </Button>
              <button
                style={{ color: theme, backgroundColor: textTheme }}
                onClick={() => {
                  if (editingIndex !== null) {
                    setColors(editingIndex, nombre, manageFormat(color));
                    setEditForm(false);
                  }
                }}
                className="hover:opacity-60 w-full p-2 h-10 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
              >
                <div className="flex gap-2  items-center justify-center">
                  <span>SAVE</span> <IconDeviceFloppy />
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------ Small Color component (keeps behavior) ------------------ */
function Color({ color, theme, editable, textTheme, displayColors }) {
  const [hover, setHover] = useState(false);
  const borderStyle = !editable
    ? hover && (color.color || editable)
      ? `1px solid ${textTheme}`
      : "1px solid transparent"
    : `1px solid ${textTheme}`;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: borderStyle,
      }}
      className={cn(
        color.color && color.nombre && `bg-black`,
        (color.color || editable) && "cursor-pointer",
        hover && !displayColors && "scale-110 ",
        displayColors ? " rounded-xl p-2" : "rounded p-1",
        " w-full  flex  text-white items-center justify-center gap-2",
      )}
    >
      <div
        style={{
          backgroundColor: color.color && color.nombre ? `#${color.color}` : "",
        }}
        className={`h-8 w-8 flex-shrink-0 `}
      ></div>
      {displayColors && (
        <h1
          style={{ color: textTheme, textShadow: `0 0 15px ${theme}` }}
          className="flex-1 text-sm truncate select-none "
        >
          {color.nombre}
        </h1>
      )}
    </div>
  );
}
