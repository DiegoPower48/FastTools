"use client";

import { usePageStore } from "@/store/PageStore";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconLayoutNavbar,
  IconCalculator,
  IconVideoPlus,
  IconNote,
  IconPhotoEdit,
  IconLink,
  IconBrush,
  IconApi,
  IconHash,
  IconCrop,
  IconQrcode,
  IconColorPicker,
  IconRocket,
  IconCloud,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// === Icon Map ===
const iconMap = {
  header: IconLayoutNavbar,
  calculator: IconCalculator,
  recorder: IconVideoPlus,
  notes: IconNote,
  conversor: IconPhotoEdit,
  links: IconLink,
  colors: IconBrush,
  apiTester: IconApi,
  jwt: IconHash,
  editor: IconCrop,
  qr: IconQrcode,
  picker: IconColorPicker,
};

// === Sortable Button ===
function SortableButton({ id, label, theme, textTheme }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const Icon = iconMap[label];
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: theme,
    color: textTheme,
    boxShadow: `0px 0px 15px 2px ${theme}`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative h-14 w-14 p-2 border-2 border-black rounded flex justify-center items-center cursor-grab active:cursor-grabbing touch-none ${
        label === "recorder" || label === "picker" ? "sm:block hidden" : ""
      }`}
    >
      <Icon size={40} />
    </div>
  );
}

// === Button Overlay (para DragOverlay) ===
function ButtonOverlay({ label, theme, textTheme }) {
  const Icon = iconMap[label];
  return (
    <div
      style={{
        backgroundColor: theme,
        color: textTheme,
        boxShadow: `0px 0px 10px 2px ${theme}`,
      }}
      className="relative h-14 w-14 p-2 border-2 border-black rounded flex justify-center items-center cursor-grabbing"
    >
      <Icon
        style={{ boxShadow: `0 0 15px 2px ${textTheme}`, color: textTheme }}
        size={40}
      />
    </div>
  );
}

// === Droppable Area ===
function DroppableArea({ id, items, theme, textTheme }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "container",
      containerId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-wrap gap-2 justify-center items-center min-h-[60px] transition-colors px-4 py-2"
      style={{
        borderRadius: "8px",
        width: "100%",
        backgroundColor: isOver
          ? id != "headerArea"
            ? `${theme}40`
            : `${textTheme}40`
          : "transparent",
      }}
    >
      <SortableContext
        id={id}
        items={items.map((i) => i.id)}
        strategy={horizontalListSortingStrategy}
      >
        {items.map((t) => (
          <SortableButton
            key={t.id}
            {...t}
            theme={theme}
            textTheme={textTheme}
          />
        ))}
      </SortableContext>
    </div>
  );
}

export default function FireToolBar({ theme, setAuthenticate, textTheme }) {
  const {
    headerArea,
    toolbarArea,
    moveButton,
    tabs,
    setTabs,
    setHeaderArea,
    setToolbarArea,
  } = usePageStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor)
  );
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const activeItem = activeId
    ? [...headerArea, ...toolbarArea].find((item) => item.id === activeId)
    : null;

  // Estrategia de detección de colisión personalizada
  const customCollisionDetection = (args) => {
    // Primero intenta detectar colisiones con elementos dentro de las áreas (más preciso)
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // Filtra solo las colisiones con botones o contenedores
      const validCollisions = pointerCollisions.filter((collision) => {
        const id = collision.id;
        return (
          id === "headerArea" ||
          id === "toolbarArea" ||
          headerArea.some((item) => item.id === id) ||
          toolbarArea.some((item) => item.id === id)
        );
      });

      if (validCollisions.length > 0) {
        return validCollisions;
      }
    }

    // Si no hay colisión directa, usa intersección de rectángulos
    const intersectionCollisions = rectIntersection(args);

    if (intersectionCollisions.length > 0) {
      // Filtra solo colisiones válidas
      const validCollisions = intersectionCollisions.filter((collision) => {
        const id = collision.id;
        return (
          id === "headerArea" ||
          id === "toolbarArea" ||
          headerArea.some((item) => item.id === id) ||
          toolbarArea.some((item) => item.id === id)
        );
      });

      return validCollisions;
    }

    return [];
  };

  const handleDragStart = (event) => {
    console.log("Drag started", event);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determinar área de origen
    const isFromHeader = headerArea.some((b) => b.id === activeId);
    const from = isFromHeader ? "headerArea" : "toolbarArea";

    // Determinar área de destino
    let to = null;

    // Si overId es el ID de un área droppable
    if (overId === "headerArea" || overId === "toolbarArea") {
      to = overId;
    }
    // Si overId es el ID de un botón
    else if (toolbarArea.some((b) => b.id === overId)) {
      to = "toolbarArea";
    } else if (headerArea.some((b) => b.id === overId)) {
      to = "headerArea";
    }

    if (!to) return;

    // Mismo contenedor: reordenar
    if (from === to && activeId !== overId) {
      const sourceItems = from === "headerArea" ? headerArea : toolbarArea;
      const setter = from === "headerArea" ? setHeaderArea : setToolbarArea;

      const oldIndex = sourceItems.findIndex((item) => item.id === activeId);
      const newIndex = sourceItems.findIndex((item) => item.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setter(arrayMove(sourceItems, oldIndex, newIndex));
      }
    }
    // Diferente contenedor: mover
    else if (from !== to) {
      moveButton(activeId, from, to);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      collisionDetection={customCollisionDetection}
    >
      {/* HEADER AREA */}
      {tabs.header && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key="headerBar"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 25 },
              duration: 0.4,
              ease: "easeInOut",
            }}
            style={{
              backgroundColor: theme,
              color: textTheme,
            }}
            className=" w-screen flex flex-col items-center justify-center"
          >
            <span
              style={{ textShadow: `0 0 15px  ${textTheme}` }}
              className="text-5xl font-bold"
            >
              FAST TOOLS
            </span>

            <DroppableArea
              id="headerArea"
              items={headerArea}
              theme={theme}
              textTheme={textTheme}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* TOOLBAR AREA */}
      <div className="w-screen flex justify-center items-center gap-2 py-2 px-2">
        <div
          style={{
            backgroundColor: theme,
            color: textTheme,
            boxShadow: `0 0 15px 5px ${textTheme}`,
          }}
          onClick={() => {
            setTabs("header");
          }}
          className={`h-14 w-14 p-2 rounded flex-shrink-0 ${
            tabs.header ? "opacity-70" : ""
          }`}
        >
          <IconRocket size={40} />
        </div>
        <div className="flex-1">
          <DroppableArea
            id="toolbarArea"
            items={toolbarArea}
            theme={theme}
            textTheme={textTheme}
          />
        </div>
        <div
          onClick={() => {
            setAuthenticate(true);
          }}
          className="hover:scale-125 duration-300 flex justify-end pr-4 cursor-pointer"
        >
          <IconCloud color={theme} size={40} />
        </div>
      </div>

      {/* DragOverlay para mostrar el botón mientras se arrastra */}
      <DragOverlay>
        {activeItem ? (
          <ButtonOverlay
            label={activeItem.label}
            theme={theme}
            textTheme={textTheme}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
