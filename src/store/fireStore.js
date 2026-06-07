import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "@/firebase/config";
import { getAuth } from "firebase/auth";
const db = getFirestore(app);

function arrayMove(arr, from, to) {
  const cloned = [...arr];
  const item = cloned.splice(from, 1)[0];
  cloned.splice(to, 0, item);
  return cloned;
}

export const fireStore = createStore((set, get) => ({
  mode: "tools",
  setMode: (mode) => {
    set({ mode });
    get().saveToFirestore();
  },
  backgroundType: "image",
  setBackgroundType: (backgroundType) => {
    set({ backgroundType });
    get().saveToFirestore();
  },
  background: "/background.png",
  mobileBackground: "/background.webp",
  images: [],
  theme: "#fafafa",
  textTheme: "#000000",
  displayColors: true,
  displayLinks: true,
  task: [],
  completed: true,
  period: "all",
  setCompleted: (completed) => {
    set({ completed });
  },
  setPeriod: (period) => {
    set({ period });
  },
  lastTaskId: 0,
  colors: [
    { id: 1, nombre: "theme", color: "fafafa" },
    { id: 2, nombre: "text", color: "000000" },
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
    { id: 25, nombre: "", color: "" },
    { id: 26, nombre: "", color: "" },
    { id: 27, nombre: "", color: "" },
    { id: 28, nombre: "", color: "" },
    { id: 29, nombre: "", color: "" },
    { id: 30, nombre: "", color: "" },
    { id: 31, nombre: "", color: "" },
    { id: 32, nombre: "", color: "" },
    { id: 33, nombre: "", color: "" },
    { id: 34, nombre: "", color: "" },
    { id: 35, nombre: "", color: "" },
    { id: 36, nombre: "", color: "" },
    { id: 37, nombre: "", color: "" },
    { id: 38, nombre: "", color: "" },
    { id: 39, nombre: "", color: "" },
    { id: 40, nombre: "", color: "" },
    { id: 41, nombre: "", color: "" },
    { id: 42, nombre: "", color: "" },
    { id: 43, nombre: "", color: "" },
    { id: 44, nombre: "", color: "" },
    { id: 45, nombre: "", color: "" },
    { id: 46, nombre: "", color: "" },
    { id: 47, nombre: "", color: "" },
    { id: 48, nombre: "", color: "" },
  ],

  moveColor: (from, to) => {
    const colors = get().colors;
    set({ colors: arrayMove(colors, from, to) });
    get().saveToFirestore();
  },
  moveLink: (from, to) => {
    const link = get().links;
    set({ links: arrayMove(link, from, to) });
    get().saveToFirestore();
  },
  moveNotes: (from, to) => {
    const note = get().notes;
    set({ notes: arrayMove(note, from, to) });
    get().saveToFirestore();
  },
  links: [
    {
      id: 1,
      nombre: "Fasttools",
      link: "https://fasttools.vercel.app",
      icono: "https://fasttools.vercel.app/icono.png",
    },
    { id: 2, nombre: "", link: "", icono: "" },
    { id: 3, nombre: "", link: "", icono: "" },
    { id: 4, nombre: "", link: "", icono: "" },
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
    { id: 33, nombre: "", link: "", icono: "" },
    { id: 34, nombre: "", link: "", icono: "" },
    { id: 35, nombre: "", link: "", icono: "" },
    { id: 36, nombre: "", link: "", icono: "" },
    { id: 37, nombre: "", link: "", icono: "" },
    { id: 38, nombre: "", link: "", icono: "" },
    { id: 39, nombre: "", link: "", icono: "" },
    { id: 40, nombre: "", link: "", icono: "" },
    { id: 41, nombre: "", link: "", icono: "" },
    { id: 42, nombre: "", link: "", icono: "" },
    { id: 43, nombre: "", link: "", icono: "" },
    { id: 44, nombre: "", link: "", icono: "" },
    { id: 45, nombre: "", link: "", icono: "" },
    { id: 46, nombre: "", link: "", icono: "" },
    { id: 47, nombre: "", link: "", icono: "" },
    { id: 48, nombre: "", link: "", icono: "" },
  ],
  text: "",
  title: "",
  tabs: {
    header: true,
    calculator: false,
    recorder: false,
    notes: false,
    conversor: false,
    links: false,
    colors: false,
    apiTester: false,
    jwt: false,
    editor: false,
    qr: false,
    colorpicker: false,
  },
  notes: [
    {
      id: 1,
      title: "Example",
      content: "Write a note here",
      color1: "#b91c1c",
      color2: "#FAFAFA",
    },
    {
      id: 2,
      title: "",
      content: "",
      color1: "",
      color2: "#FAFAFA",
    },
    {
      id: 3,
      title: "",
      content: "",
      color1: "",
      color2: "#FAFAFA",
    },
    {
      id: 4,
      title: "",
      content: "",
      color1: "",
      color2: "#FAFAFA",
    },
    { id: 5, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 6, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 7, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 8, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 9, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 10, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 11, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 12, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 13, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 14, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 15, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 16, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 17, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 18, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 19, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 20, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 21, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 22, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 23, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 24, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 25, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 26, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 27, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 28, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 29, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 30, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 31, title: "", content: "", color1: "", color2: "#FAFAFA" },
    { id: 32, title: "", content: "", color1: "", color2: "#FAFAFA" },
  ],

  toolbarArea: [
    { id: 2, label: "calculator" },
    { id: 3, label: "recorder" },
    { id: 4, label: "colorpicker" },
    { id: 5, label: "conversor" },
    { id: 7, label: "colors" },
    { id: 10, label: "editor" },
    { id: 11, label: "qr" },
  ],
  headerArea: [
    { id: 1, label: "notes" },
    { id: 6, label: "links" },
    { id: 8, label: "apiTester" },
    { id: 9, label: "jwt" },
    { id: 12, label: "videoTrimmer" },
    { id: 13, label: "webanalyler" },
  ],

  setTheme: (color) => {
    set({ theme: `#${color}` });
    get().saveToFirestore();
  },
  setTextTheme: (color) => {
    set({ textTheme: `#${color}` });
    get().saveToFirestore();
  },
  api: "http://localhost:3000",
  socketApi: "http://localhost:3000",
  loading: true,
  error: null,

  // 🔴 NUEVA FLAG CRÍTICA: Evita sobrescribir datos mientras se carga desde Firestore
  isLoadingFromFirestore: false,

  loadUserData: () => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("No hay usuario autenticado");
      set({ loading: false });
      return;
    }

    // Marcar que estamos cargando desde Firestore
    set({ isLoadingFromFirestore: true });

    const userDoc = doc(db, "stores", uid);

    const unsubscribe = onSnapshot(
      userDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          // ✅ Cargar datos (siempre debería existir porque se crea en registro)
          const firestoreData = snapshot.data();
          set({
            ...firestoreData,
            uid: uid,
            loading: false,
            isLoadingFromFirestore: false,
          });
          console.log("✅ Datos cargados desde Firestore");
        } else {
          // ⚠️ Esto NO debería ocurrir nunca, pero por seguridad:
          console.warn(
            "⚠️ Store no encontrado para usuario existente. Esto es anormal."
          );
          set({
            loading: false,
            isLoadingFromFirestore: false,
            error: "Store no encontrado",
          });
        }
      },
      (error) => {
        console.error("❌ Error en onSnapshot:", error);
        set({
          error: error.message,
          loading: false,
          isLoadingFromFirestore: false,
        });
      }
    );

    return unsubscribe;
  },

  saveToFirestore: async () => {
    const state = get();
    const uid = state.uid;

    // 🔴 PROTECCIÓN CRÍTICA: No guardar si aún estamos cargando desde Firestore
    if (state.isLoadingFromFirestore) {
      console.log("⏸️ Guardado pausado: cargando desde Firestore");
      return;
    }

    if (!uid) {
      console.error("❌ No hay UID en el store");
      return;
    }

    const data = Object.fromEntries(
      Object.entries(state).filter(
        ([key, value]) =>
          key !== "uid" &&
          key !== "isLoadingFromFirestore" && // ✅ Excluir flag de sincronización
          typeof value !== "function"
      )
    );

    try {
      await updateDoc(doc(db, "stores", uid), data);
      console.log("💾 Datos guardados en Firestore");
    } catch (err) {
      console.error("❌ Error guardando:", err);
      // Si falla por documento inexistente, intentar crearlo
      if (err.code === "not-found") {
        try {
          await setDoc(doc(db, "stores", uid), { ...data, uid });
          console.log("📝 Documento creado después de error not-found");
        } catch (setErr) {
          console.error("❌ Error al crear documento:", setErr);
        }
      }
    }
  },

  setBackground: (background) => {
    set({ background });
    get().saveToFirestore();
  },
  setMobileBackground: (mobileBackground) => {
    set({ mobileBackground });
    get().saveToFirestore();
  },
  setApi: (api) => {
    set({ api });
    get().saveToFirestore();
  },
  setSocketApi: (socketApi) => {
    set({ socketApi });
    get().saveToFirestore();
  },
  loading: true,

  setLoading: (state) => {
    set({ loading: state });
  },
  setText: (text) => {
    set({ text });
    get().saveToFirestore();
  },

  setTitle: (title) => {
    set({ title });
    get().saveToFirestore();
  },

  setDisplayColors: () => {
    const value = get().displayColors;
    set({ displayColors: !value });
    get().saveToFirestore();
  },
  setDisplayLinks: () => {
    const value = get().displayLinks;
    set({ displayLinks: !value });
    get().saveToFirestore();
  },
  setTabs: (tab) => {
    const tabList = get().tabs || {};
    const updatedTabList = { ...tabList, [tab]: !tabList[tab] };
    set({ tabs: updatedTabList });
    get().saveToFirestore();
  },

  setColors: (id, text, color) => {
    const colors = get().colors || [];
    const updatedColors = colors.map((c, i) =>
      i === id ? { ...c, nombre: text, color } : c
    );
    set({ colors: updatedColors });
    get().saveToFirestore();
  },
  setAllImages: (images) => {
    set({ images });
  },

  setImages: (index, newUrl) => {
    const images = get().images || [];
    const newImages = images.map((img, i) => (i === index - 1 ? newUrl : img));
    set({ images: newImages });
  },

  setLinks: (id, text, link, icono) => {
    const links = get().links || [];
    const updatedLinks = links.map((c, i) =>
      i === id ? { ...c, nombre: text, link, icono } : c
    );
    set({ links: updatedLinks });
    get().saveToFirestore();
  },

  setNotes: (id, title, content, color1, color2) => {
    const notes = get().notes;
    const updateNotes = notes.map((c, i) =>
      i === id
        ? {
            ...c,
            title: title,
            content: content,
            color1: color1,
            color2: color2,
          }
        : c
    );
    set({ notes: updateNotes });
    get().saveToFirestore();
  },
  newTask: async (taskData) => {
    const lastId = get().lastTaskId;
    const newId = lastId + 1;

    const newTask = {
      ...taskData,
      id: newId,
    };
    set({ task: [...get().task, newTask], lastTaskId: newId });
    get().saveToFirestore();
  },
  completeTask: (taskId) => {
    set((state) => ({
      task: state.task.map((t) =>
        t.id === taskId ? { ...t, state: "completed" } : t
      ),
    }));
    get().saveToFirestore();
  },
  updateEndDateTask: (taskId, endDate) => {
    set((state) => ({
      task: state.task.map((t) =>
        t.id === taskId ? { ...t, endDate: endDate } : t
      ),
    }));
    get().saveToFirestore();
  },
  restoreTask: (taskId) => {
    set((state) => ({
      task: state.task.map((t) =>
        t.id === taskId ? { ...t, state: "attention" } : t
      ),
    }));
    get().saveToFirestore();
  },
  deleteTask: async (taskId) => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    try {
      const tasks = get().task;
      const updatedTasks = tasks.filter((t) => t.id !== taskId);

      set({ task: updatedTasks });
      await get().saveToFirestore();
      await fetch(`/api/task/${uid}/${taskId}`, {
        method: "DELETE",
      });

      console.log("Task deleted completely.");
    } catch (error) {
      console.error("Error deleting task image", error);
    }
  },
  updateExpiredTasks: () => {
    const tasks = get().task;
    const now = new Date();
    let hasChanges = false;

    const updated = tasks.map((task) => {
      if (task.frequency === "special") return task;

      const end = task.endDate.toDate?.() ?? new Date(task.endDate);

      if (now < end) return task;

      hasChanges = true;
      let newStart = null;
      let newEnd = null;

      switch (task.frequency) {
        case "daily": {
          newStart = new Date();
          newStart.setHours(0, 0, 0, 0);
          newEnd = new Date(newStart);
          newEnd.setHours(23, 59, 59, 999);
          break;
        }

        case "weekly": {
          newStart = new Date(end);
          newStart.setDate(newStart.getDate() + 1);
          newStart.setHours(0, 0, 0, 0);
          newEnd = new Date(newStart);
          newEnd.setDate(newEnd.getDate() + 6);
          newEnd.setHours(23, 59, 59, 999);
          break;
        }

        case "monthly": {
          const today = new Date();
          newStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          newStart.setHours(0, 0, 0, 0);
          newEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
          newEnd.setHours(23, 59, 59, 999);
          break;
        }

        default:
          return task;
      }

      return {
        ...task,
        startDate: newStart,
        endDate: newEnd,
        state: "attention",
      };
    });

    if (hasChanges) {
      set({ task: updated });
      get().saveToFirestore();
    }
  },
  addNote: async (taskId, note) => {
    const uid = get().uid;

    const noteId = crypto.randomUUID();

    let imageUrl = null;
    let imagePublicId = null;

    if (note.image) {
      const formData = new FormData();
      formData.append("file", note.image);

      const res = await fetch(`/api/notes/${uid}/${taskId}/${noteId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      imageUrl = data.url;
      imagePublicId = data.publicId;
    }

    const newNote = {
      id: noteId,
      text: note.text ?? "",
      title: note.title ?? "",
      imageUrl,
      imagePublicId,
      createdAt: Date.now(),
    };

    set((state) => ({
      task: state.task.map((t) =>
        t.id === taskId ? { ...t, notes: [...t.notes, newNote] } : t
      ),
    }));

    get().saveToFirestore();
  },

  deleteNote: async (taskId, noteId) => {
    const uid = get().uid;

    const tasks = get().task;
    const task = tasks.find((t) => t.id === taskId);
    const note = task.notes.find((n) => n.id === noteId);

    if (note.imagePublicId) {
      await fetch(`/api/notes/${uid}/${taskId}/${noteId}`, {
        method: "DELETE",
      });
    }

    set((state) => ({
      task: state.task.map((t) =>
        t.id === taskId
          ? {
              ...t,
              notes: t.notes.filter((n) => n.id !== noteId),
            }
          : t
      ),
    }));

    get().saveToFirestore();
  },

  setHeaderArea: (updater) => {
    const currentHeaderArea = get().headerArea;
    const newHeaderArea =
      typeof updater === "function" ? updater(currentHeaderArea) : updater;

    set({ headerArea: newHeaderArea });
    get().saveToFirestore();
  },

  setToolbarArea: (updater) => {
    const currentToolbarArea = get().toolbarArea;
    const newToolbarArea =
      typeof updater === "function" ? updater(currentToolbarArea) : updater;

    set({ toolbarArea: newToolbarArea });
    get().saveToFirestore();
  },

  moveButton: (id, from, to) => {
    if (from === to) return;

    const source = get()[from];
    const target = get()[to];
    const item = source.find((b) => b.id === id);

    if (!item) return;

    set({
      [from]: source.filter((b) => b.id !== id),
      [to]: [...target, item],
    });
    get().saveToFirestore();
  },
}));

export const useFireStore = () => useStore(fireStore);
