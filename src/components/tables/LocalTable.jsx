"use client";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

import { usePageStore } from "@/store/PageStore";
function ComponentSkeleton({ height }) {
  return (
    <div
      style={{ height }}
      className="rounded-xl overflow-hidden bg-gray-900/20 animate-pulse"
    />
  );
}
const componentMap = {
  notes: dynamic(() => import("@/components/block/notes"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  calculator: dynamic(() => import("@/components/calculator/calculator"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  recorder: dynamic(() => import("@/components/recorder/recorder"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  colorpicker: dynamic(() => import("@/components/colorPicker/colorPicker"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  conversor: dynamic(() => import("@/components/conversor/Conversor"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  links: dynamic(() => import("@/components/links/links"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  colors: dynamic(() => import("@/components/colors/colors"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  editor: dynamic(() => import("@/components/imageCropper/ImageCropper"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  qr: dynamic(() => import("@/components/qrgenerator/QRGenerator"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
  apiTester: dynamic(() => import("@/components/testApi/testApi"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="500px" />,
  }),
  jwt: dynamic(() => import("@/components/hasher/hasher"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="500px" />,
  }),
  webanalyzer: dynamic(() => import("@/components/webanalyzer/webanalyzer"), {
    ssr: false,
    loading: () => <ComponentSkeleton height="350px" />,
  }),
};
export default function LocalTable() {
  const {
    colors,
    links,
    api,
    toolbarArea,
    setApi,
    socketApi,
    setSocketApi,
    setColors,
    setLinks,
    notes,
    setNotes,
    theme,
    setTheme,
    setTextTheme,
    textTheme,
    displayColors,
    setDisplayColors,
    displayLinks,
    setDisplayLinks,
  } = usePageStore();

  const componentsArray = toolbarArea.map((item) => ({
    id: item.id,
    label: item.label,
    Component: componentMap[item.label],
  }));
  return (
    <motion.div
      layout
      className="2xl:w-9/12 w-full py-4 overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-y-4 md:gap-5 p-4 "
    >
      <AnimatePresence mode="popLayout">
        {componentsArray.map((component, i) => (
          <motion.div
            key={component.label}
            layout
            style={{
              boxShadow: `0 0 15px 2px ${textTheme}`,
              color: textTheme,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 25 },
              duration: 0.4,
              ease: "easeInOut",
            }}
            className={`rounded-xl overflow-hidden ${
              component.label === "apiTester" ||
              component.label === "jwt" ||
              component.label === "webanalyzer"
                ? "h-[500px]"
                : "h-[350px]"
            } ${
              component.label === "recorder" || component.label === "picker"
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
              socketApi={socketApi}
              setSocketApi={setSocketApi}
              displayColors={displayColors}
              setDisplayColors={setDisplayColors}
              displayLinks={displayLinks}
              setDisplayLinks={setDisplayLinks}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
