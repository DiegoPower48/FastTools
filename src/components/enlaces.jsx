"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "react-hot-toast";
import { IconDeviceFloppy, IconPencil } from "@tabler/icons-react";
import styles from "./enlaces.module.css";
import { useRef, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Links({ links, setLinks, theme, textTheme }) {
  const scrollRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [id, setId] = useState(0);
  const [link, setLink] = useState("");
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("");
  const groups = [];
  for (let i = 0; i < links.length; i += 8) {
    groups.push(links.slice(i, i + 8));
  }
  const groupsMobile = [];
  for (let i = 0; i < links.length; i += 4) {
    groupsMobile.push(links.slice(i, i + 4));
  }

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
          LINKS
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
              className="grid grid-cols-2 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((link, e) => (
                <div key={e}>
                  {(link.link || editable) && (
                    <a
                      className={editable ? "cursor-pointer" : "cursor-pointer"}
                      target="_blank"
                      {...(!editable && { href: link.link })}
                      onClick={() => {
                        if (editable) {
                          setId(link.id - 1);
                          setLink(link.link);
                          setNombre(link.nombre);
                          setEditForm(true);
                          setIcono(link.icono);
                        }
                      }}
                    >
                      <LinkItem
                        link={link}
                        theme={theme}
                        editable={editable}
                        textTheme={textTheme}
                      />
                    </a>
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
              className="grid grid-cols-1 grid-rows-4 gap-2 w-full p-4 rounded-2xl flex-shrink-0"
            >
              {group.map((link, e) => (
                <div key={e}>
                  {(link.link || editable) && (
                    <a
                      className={editable ? "cursor-pointer" : "cursor-pointer"}
                      target="_blank"
                      {...(!editable && { href: link.link })}
                      onClick={() => {
                        if (editable) {
                          setId(link.id - 1);
                          setLink(link.link);
                          setNombre(link.nombre);
                          setEditForm(true);
                          setIcono(link.icono);
                        }
                      }}
                    >
                      <LinkItem
                        link={link}
                        theme={theme}
                        editable={editable}
                        textTheme={textTheme}
                      />
                    </a>
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
          className="w-full bg-black border-white border-2 text-white overflow-hidden"
        >
          <DialogTitle className="font-bold flex justify-center items-center">
            EDIT LINKS
          </DialogTitle>
          <DialogDescription className="hidden">
            Cuadro de edicion de Links
          </DialogDescription>
          <div className="grid grid-cols-1 grid-rows-3 gap-8  p-4 h-full">
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="icono">
                ICON
              </label>
              <Input
                id="icono"
                type="text"
                className="p-2 rounded placeholder:text-gray-500  placeholder:opacity-40"
                placeholder="URL"
                value={icono}
                onChange={(e) => {
                  const icono = e.target.value;
                  setIcono(icono);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="nombre">
                NAME
              </label>
              <Input
                id="nombre"
                type="text"
                placeholder={links[id].nombre || ""}
                className="p-2 rounded placeholder:text-gray-500 placeholder:opacity-40 "
                value={nombre}
                onChange={(e) => {
                  const nombre = e.target.value;
                  setNombre(nombre);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="color">
                LINK
              </label>
              <div className="w-full h-full flex gap-4">
                <Input
                  id="link"
                  className="p-2 w-full rounded placeholder:opacity-40"
                  type="text"
                  placeholder={links[id].link || ""}
                  value={link}
                  onChange={(e) => {
                    const link = e.target.value;
                    setLink(link.toLowerCase());
                  }}
                />
              </div>
            </div>

            <div className="w-full h-full flex justify-center items-center gap-4">
              <Button
                variant="destructive"
                onClick={() => {
                  setEditForm(false);
                  setLinks(id, "", "", "");
                  setId(0);
                  setNombre("");
                  setLink("");
                  setIcono("");
                }}
              >
                DELETE
              </Button>
              <button
                style={{ backgroundColor: theme, color: textTheme }}
                onClick={() => {
                  setLinks(id, nombre, link, icono);
                  setEditForm(false);
                }}
                className="hover:opacity-60 w-full p-2 rounded  font-bold duration-200 active:scale-105 active:border-2 active:border-white"
              >
                <div className="flex gap-2 items-center justify-center">
                  <span>SAVE</span> <IconDeviceFloppy />
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}

function LinkItem({ link, theme, textTheme, editable }) {
  const [hover, setHover] = useState(false);
  const borderStyle =
    editable || (hover && link.link)
      ? `2px solid ${theme}`
      : "2px solid transparent";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: textTheme, border: borderStyle }}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-12 flex bg-black items-center gap-4 rounded-xl duration-200"
    >
      <div className="h-12 w-12 rounded-l-md flex items-center justify-center">
        {link.icono && (
          <img
            className="flex items-center rounded-xl p-2 justify-center"
            src={link.icono}
            alt=""
          />
        )}
      </div>
      <h1 className="font-medium">{link.nombre}</h1>
    </div>
  );
}
