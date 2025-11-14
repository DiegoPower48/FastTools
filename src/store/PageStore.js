import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

import { useStore } from "zustand";

export const pageStore = createStore(
  persist(
    (set, get) => ({
      theme: "#b91c1c",
      textTheme: "#fafafa",
      colors: [
        { id: 1, nombre: "theme", color: "b91c1c" },
        { id: 2, nombre: "text", color: "fafafa" },
        { id: 3, nombre: "", color: "" },
        { id: 4, nombre: "", color: "" },
        { id: 5, nombre: "", color: "" },
        { id: 6, nombre: "", color: "" },
        { id: 7, nombre: "", color: "" },
        { id: 8, nombre: "", color: "" },
        { id: 9, nombre: "", color: "" },
        { id: 10, nombre: "", color: "" },
        { id: 11, nombre: "", color: "" },
        { id: 12, nombre: "", color: "" },
        { id: 13, nombre: "", color: "" },
        { id: 14, nombre: "", color: "" },
        { id: 15, nombre: "", color: "" },
        { id: 16, nombre: "", color: "" },
        { id: 17, nombre: "", color: "" },
        { id: 18, nombre: "", color: "" },
        { id: 19, nombre: "", color: "" },
        { id: 20, nombre: "", color: "" },
        { id: 21, nombre: "", color: "" },
        { id: 22, nombre: "", color: "" },
        { id: 23, nombre: "", color: "" },
        { id: 24, nombre: "", color: "" },
      ],
      links: [
        {
          id: 1,
          nombre: "Fasttools ",
          link: "https://fasttools.vercel.app",
          icono: "https://fasttools.vercel.app/icono.png",
        },
        { id: 2, nombre: "", link: ":", icono: "" },
        { id: 3, nombre: "", link: ":", icono: "" },
        { id: 4, nombre: "", link: ":", icono: "" },
        { id: 5, nombre: "", link: "", icono: "" },
        { id: 6, nombre: "", link: "", icono: "" },
        { id: 7, nombre: "", link: "", icono: "" },
        { id: 8, nombre: "", link: "", icono: "" },
        { id: 9, nombre: "", link: "", icono: "" },
        { id: 10, nombre: "", link: "", icono: "" },
        { id: 11, nombre: "", link: "", icono: "" },
        { id: 12, nombre: "", link: "", icono: "" },
        { id: 13, nombre: "", link: "", icono: "" },
        { id: 14, nombre: "", link: "", icono: "" },
        { id: 15, nombre: "", link: "", icono: "" },
        { id: 16, nombre: "", link: "", icono: "" },
        { id: 17, nombre: "", link: "", icono: "" },
        { id: 18, nombre: "", link: "", icono: "" },
        { id: 19, nombre: "", link: "", icono: "" },
        { id: 20, nombre: "", link: "", icono: "" },
        { id: 21, nombre: "", link: "", icono: "" },
        { id: 22, nombre: "", link: "", icono: "" },
        { id: 23, nombre: "", link: "", icono: "" },
        { id: 24, nombre: "", link: "", icono: "" },
        { id: 25, nombre: "", link: "", icono: "" },
        { id: 26, nombre: "", link: "", icono: "" },
        { id: 27, nombre: "", link: "", icono: "" },
        { id: 28, nombre: "", link: "", icono: "" },
        { id: 29, nombre: "", link: "", icono: "" },
        { id: 30, nombre: "", link: "", icono: "" },
        { id: 31, nombre: "", link: "", icono: "" },
        { id: 32, nombre: "", link: "", icono: "" },
      ],
      notes: [
        {
          id: 1,
          title: "",
          content: "",
          color: "#000000",
        },
        {
          id: 2,
          title: "",
          content: "",
          color: "#000000",
        },
        {
          id: 3,
          title: "",
          content: "",
          color: "#000000",
        },
        {
          id: 4,
          title: "",
          content: "",
          color: "#000000",
        },
        { id: 5, title: "", content: "", color: "#000000" },
        { id: 6, title: "", content: "", color: "#000000" },
        { id: 7, title: "", content: "", color: "#000000" },
        { id: 8, title: "", content: "", color: "#000000" },
        { id: 9, title: "", content: "", color: "#000000" },
        { id: 10, title: "", content: "", color: "#000000" },
        { id: 11, title: "", content: "", color: "#000000" },
        { id: 12, title: "", content: "", color: "#000000" },
        { id: 13, title: "", content: "", color: "#000000" },
        { id: 14, title: "", content: "", color: "#000000" },
        { id: 15, title: "", content: "", color: "#000000" },
        { id: 16, title: "", content: "", color: "#000000" },
        { id: 17, title: "", content: "", color: "#000000" },
        { id: 18, title: "", content: "", color: "#000000" },
        { id: 19, title: "", content: "", color: "#000000" },
        { id: 20, title: "", content: "", color: "#000000" },
        { id: 21, title: "", content: "", color: "#000000" },
        { id: 22, title: "", content: "", color: "#000000" },
        { id: 23, title: "", content: "", color: "#000000" },
        { id: 24, title: "", content: "", color: "#000000" },
        { id: 25, title: "", content: "", color: "#000000" },
        { id: 26, title: "", content: "", color: "#000000" },
        { id: 27, title: "", content: "", color: "#000000" },
        { id: 28, title: "", content: "", color: "#000000" },
        { id: 29, title: "", content: "", color: "#000000" },
        { id: 30, title: "", content: "", color: "#000000" },
        { id: 31, title: "", content: "", color: "#000000" },
        { id: 32, title: "", content: "", color: "#000000" },
      ],
      toolbarArea: [
        { id: 1, label: "notes" },
        { id: 2, label: "calculator" },
        { id: 3, label: "recorder" },
        { id: 4, label: "picker" },
        { id: 5, label: "conversor" },
        { id: 6, label: "links" },
        { id: 7, label: "colors" },
        { id: 10, label: "editor" },
        { id: 11, label: "qr" },
      ],
      headerArea: [
        { id: 8, label: "apiTester" },
        { id: 9, label: "jwt" },
      ],
      setHeaderArea: (updater) => {
        set((state) => ({
          headerArea:
            typeof updater === "function" ? updater(state.headerArea) : updater,
        }));
      },
      setToolbarArea: (updater) => {
        set((state) => ({
          toolbarArea:
            typeof updater === "function"
              ? updater(state.toolbarArea)
              : updater,
        }));
      },

      // Función de traslado (ya la tenías)
      moveButton: (id, from, to) => {
        if (from === to) return;
        const source = get()[from];
        const target = get()[to];
        const item = source.find((b) => b.id === id);
        if (!item) return;
        set({
          [from]: source.filter((b) => b.id !== id),
          [to]: [...target, item], // Simplemente se agrega al final del nuevo contenedor
        });
      },

      text: "",
      title: "",
      tabs: {
        header: true,
      },
      api: "http://localhost:3000",
      setApi: (api) => set({ api: api }),
      setText: (text) => set({ text: text }),
      setTitle: (title) => set({ title: title }),
      setTheme: (color) => {
        set({ theme: `#${color}` });
      },
      setTextTheme: (color) => {
        set({ textTheme: `#${color}` });
      },
      setTabs: (tab) => {
        const tabList = get().tabs;
        const updatedTabList = { ...tabList, [tab]: !tabList[tab] };
        set({ tabs: updatedTabList });
      },

      setColors: (id, text, color) => {
        const colors = get().colors;
        const updatedColors = colors.map((c, i) =>
          i === id ? { ...c, nombre: text, color: color } : c
        );
        set({ colors: updatedColors });
      },
      setLinks: (id, text, link, icono) => {
        const links = get().links;
        const updatedLinks = links.map((c, i) =>
          i === id ? { ...c, nombre: text, link: link, icono: icono } : c
        );
        set({ links: updatedLinks });
      },
      setNotes: (id, title, content, color) => {
        const notes = get().notes;
        const updateNotes = notes.map((c, i) =>
          i === id ? { ...c, title: title, content: content, color: color } : c
        );
        set({ notes: updateNotes });
      },
    }),
    {
      name: "pagestorage",
    }
  )
);

export const usePageStore = () => useStore(pageStore);
