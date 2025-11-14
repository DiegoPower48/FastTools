"use client";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Recorder from "@/components/recorder";
import Calculator from "@/components/calculator";
import Conversor from "@/components/Conversor";
import Links from "@/components/enlaces";
import Colors from "@/components/colors";
import ApiTester from "@/components/testApi";
import Hasher from "@/components/hasher";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";
import QRGenerator from "@/components/QRGenerator";
import useUserStore from "@/store/userStore";
import { useFireStore } from "@/store/fireStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import ImageColorPicker from "@/components/colorPicker";
import Notes from "@/components/block/notes";
import FireToolBar from "@/components/fireToolBar";

const componentMap = {
  notes: Notes,
  calculator: Calculator,
  recorder: Recorder,
  picker: ImageColorPicker,
  conversor: Conversor,
  links: Links,
  colors: Colors,
  editor: ImageCropper,
  qr: QRGenerator,
  apiTester: ApiTester,
  jwt: Hasher,
};

export default function Page() {
  const { logout, setUser } = useUserStore();
  const {
    tabs,
    colors,
    links,
    api,
    notes,
    setNotes,
    setApi,
    toolbarArea,
    setColors,
    setLinks,
    loadUserData,
    loading,
    theme,
    setTheme,
    textTheme,
    setTextTheme,
  } = useFireStore();

  const componentsArray = toolbarArea.map((item) => ({
    id: item.id,
    label: item.label,
    Component: componentMap[item.label],
  }));
  const router = useRouter();
  const getOut = () => {
    logout();
    toast.success("Session closed");
    router.push("/");
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Usuario autenticado:", firebaseUser.uid);
        setUser(firebaseUser);

        // ✅ Establece UID y carga datos en un solo paso

        const unsubFirestore = loadUserData(firebaseUser.uid);

        window.__UNSUB_FIRESTORE__ = unsubFirestore;
      } else {
        console.log("No hay usuario autenticado");

        // Limpiar todo

        setUser(null);

        if (window.__UNSUB_FIRESTORE__) {
          window.__UNSUB_FIRESTORE__();
          delete window.__UNSUB_FIRESTORE__;
        }

        router.push("/");
      }
    });

    return () => {
      unsubscribe();
      if (window.__UNSUB_FIRESTORE__) {
        window.__UNSUB_FIRESTORE__();
        delete window.__UNSUB_FIRESTORE__;
      }
    };
  }, []);

  return (
    <>
      <div
        style={{
          color: textTheme,
        }}
        className={`flex   flex-col min-h-dvh overflow-hidden  ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen  text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-14 h-14 border-4 border-t-transparent border-white rounded-full"
            />
            <p className="mt-4 text-gray-400 text-lg"></p>
          </div>
        ) : (
          <>
            <FireToolBar getOut={getOut} theme={theme} textTheme={textTheme} />
            <div className="relative w-full flex-1 flex flex-col justify-center items-center">
              <div className="w-screen h-screen absolute bg-black inset-0 flex justify-center items-center -z-10">
                <Image
                  src="/icono.png"
                  alt="Background"
                  width={600} // ajusta según el tamaño que desees
                  height={600}
                  className="opacity-30 object-contain select-none pointer-events-none"
                  priority
                  fetchPriority="high"
                />
              </div>

              <motion.div
                layout
                className="2xl:w-9/12 w-full py-4 overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-y-4 md:gap-5 p-4 "
              >
                <AnimatePresence mode="popLayout">
                  {componentsArray.map((component, i) => (
                    <motion.div
                      key={component.label}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 300, damping: 25 },
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className={`${
                        component.label === "apiTester" ||
                        component.label === "jwt"
                          ? "h-[500px]"
                          : "h-[350px]"
                      } ${
                        component.label === "recorder" ||
                        component.label === "picker"
                          ? "hidden md:block"
                          : ""
                      }`}
                    >
                      <component.Component
                        theme={theme}
                        setTheme={setTheme}
                        textTheme={textTheme}
                        setTextTheme={setTextTheme}
                        notes={notes}
                        setNotes={setNotes}
                        colors={colors}
                        setColors={setColors}
                        links={links}
                        setLinks={setLinks}
                        api={api}
                        setApi={setApi}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
            <AnimatePresence mode="popLayout">
              {tabs.header && (
                <motion.div
                  key="footer"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  style={{ color: textTheme, background: "black" }}
                  className="flex font-bold justify-end items-center pr-20"
                >
                  <a href="https://diegotorres-portfoliodev.vercel.app">
                    AUTOR: DIEGO TORRES
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <Toaster
        toastOptions={{
          // Estilo general
          style: {
            background: "#1e293b", // gris oscuro
            color: "#f8fafc", // blanco
            border: `1px solid ${theme}`,
          },
          // Éxitos
          success: {
            style: {
              background: "black",
              color: "white",
            },
            iconTheme: {
              primary: theme,
              secondary: "#fff",
            },
          },
          // Errores
          error: {
            style: {
              background: "black",
              color: "red",
            },
            iconTheme: {
              primary: "#b91c1c",
              secondary: "white",
            },
          },
        }}
      />
    </>
  );
}
