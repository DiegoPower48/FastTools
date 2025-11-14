"use client";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "./enlaces.module.css";
import { useRef, useEffect, useState } from "react";
import {
  IconColorSwatch,
  IconDeviceFloppy,
  IconImageInPicture,
  IconPencil,
  IconTex,
  IconTextColor,
} from "@tabler/icons-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Colors({
  colors,
  setColors,
  theme,
  textTheme,
  setTheme,
  setTextTheme,
}) {
  const scrollRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [id, setId] = useState(0);
  const [color, setColor] = useState("");
  const [nombre, setNombre] = useState("");
  const groups = [];
  for (let i = 0; i < colors.length; i += 12) {
    groups.push(colors.slice(i, i + 12));
  }
  const groupsMobile = [];
  for (let i = 0; i < colors.length; i += 8) {
    groupsMobile.push(colors.slice(i, i + 8));
  }
  const manageFormat = (color) => {
    if (color[0] === "#") {
      console.log(color.slice(1, color.length));
      return color.slice(1, color.length);
    }
    return color;
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText("#" + text);
    toast.success("Copied!");
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
          Colors
        </div>
        <button
          style={{
            boxShadow: editable ? `0px 0px 5px 2px white` : "",
          }}
          onClick={() => setEditable(!editable)}
          className={`col-start-6 col-end-7 bg-white text-black flex justify-center w-12 h-5/6 rounded items-center absolute`}
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
            : groups.filter((group) => group.some((e) => e.nombre))
          ).map((group, i) => (
            <div
              key={i}
              className="grid grid-cols-3 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((color, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!editable && color.color) {
                      handleCopy(color.color);
                    }
                    if (editable) {
                      setId(color.id - 1);
                      setColor(color.color);
                      setNombre(color.nombre);
                      setEditForm(true);
                    }
                  }}
                >
                  {(color.color || editable) && (
                    <Color
                      color={color}
                      editable={editable}
                      theme={theme}
                      textTheme={textTheme}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex md:hidden gap-6 w-full">
          {(editable
            ? groupsMobile
            : groupsMobile.filter((group) => group.some((e) => e.nombre))
          ).map((group, i) => (
            <div
              key={i}
              className="grid grid-cols-2 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((color, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!editable && color.color) {
                      handleCopy(color.color);
                    }
                    if (editable) {
                      setId(color.id - 1);
                      setColor(color.color);
                      setNombre(color.nombre);
                      setEditForm(true);
                    }
                  }}
                >
                  {(color.color || editable) && (
                    <Color
                      color={color}
                      editable={editable}
                      theme={theme}
                      textTheme={textTheme}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Dialog onOpenChange={setEditForm} open={editForm}>
        <DialogContent
          style={{ color: textTheme }}
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
                placeholder={colors[id].nombre || ""}
                className="p-2 rounded placeholder:text-gray-500 placeholder:opacity-40"
                value={nombre}
                onChange={(e) => {
                  const nombre = e.target.value;
                  setNombre(nombre);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="color">
                COLOR
              </label>
              <div className="w-full h-full flex items-center justify-center gap-4">
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
                  placeholder={colors[id].color || ""}
                  value={color.toUpperCase()}
                  onChange={(e) => {
                    const color = e.target.value;
                    setColor(color.toLowerCase());
                  }}
                />
              </div>
            </div>

            <div className="w-full h-full flex justify-center items-center gap-4">
              <Button
                variant="destructive"
                onClick={() => {
                  setEditForm(false);
                  setColors(id, "", "");
                  setColor("");
                  setNombre("");
                  setId(0);
                }}
              >
                DELETE
              </Button>
              <button
                style={{ backgroundColor: theme, color: textTheme }}
                onClick={() => {
                  setColors(id, nombre, manageFormat(color));
                  setEditForm(false);
                }}
                className="hover:opacity-60 w-full p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
              >
                <div className="flex gap-2 items-center justify-center">
                  <span>SAVE</span> <IconDeviceFloppy />
                </div>
              </button>
            </div>
            {colors[id].color && (
              <div className="w-full flex gap-8 items-center justify-center">
                <Button
                  variant="outline"
                  className="text-white bg-black border-2 border-white"
                  onClick={() => setTheme(manageFormat(color))}
                >
                  <IconColorSwatch />
                  SET THEME COLOR
                </Button>
                <Button
                  variant="outline"
                  className="text-white bg-black border-2 border-white"
                  onClick={() => setTextTheme(manageFormat(color))}
                >
                  <IconTextColor size={10} />
                  SET TEXT COLOR
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Color({ color, theme, editable, textTheme }) {
  const [hover, setHover] = useState(false);
  const borderStyle =
    hover && (color.color || editable)
      ? `2px solid ${theme}`
      : "2px solid transparent";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: borderStyle,
      }}
      className={`${
        (color.color || editable) && "cursor-pointer"
      } w-full h-12 flex text-white items-center gap-4 p-2 rounded-xl border-2 border-transparent`}
    >
      <div
        style={{
          backgroundColor: color.color && color.nombre ? `#${color.color}` : "",
          border: color.color || editable ? `1px solid ${theme}` : "none",
        }}
        className="h-full w-12 rounded"
      ></div>
      <div
        style={{ color: textTheme }}
        className="w-full h-full flex items-center"
      >
        <h1 className="">{color.nombre}</h1>
      </div>
    </div>
  );
}
