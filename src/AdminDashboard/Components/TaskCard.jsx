import React, { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, isDraggingOverlay, activeTaskId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useDraggable({ id: task.id });

  // ⛔ Prevent duplicate drag on double click
  const clickTimeout = useRef(null);

  const handleClick = (e) => {
    if (clickTimeout.current) {
      // Double click detected — stop event to prevent duplicate drag or clone
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      e.preventDefault();
      e.stopPropagation();
      console.log("Double click ignored — no duplicate drag");
      return;
    }

    // Single click debounce
    clickTimeout.current = setTimeout(() => {
      clickTimeout.current = null;
    }, 300);
  };

  if (isDragging && !isDraggingOverlay) {
    return <div className="opacity-0 h-0" />;
  }

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDraggingOverlay ? 9999 : 1,
    cursor: isDraggingOverlay ? "grabbing" : "grab",
  };

  return (
    <div
      ref={!isDraggingOverlay ? setNodeRef : null}
      {...(!isDraggingOverlay ? attributes : {})}
      {...(!isDraggingOverlay ? listeners : {})}
      onClick={handleClick} // 👈 fixes double-click clone
      style={style}
      className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 rounded-lg shadow-lg transition-transform ${
        isDraggingOverlay ? "opacity-95 scale-[1.05]" : ""
      }`}
    >
      <p className="font-medium break-words">{task.title}</p>
      <p className="text-xs text-gray-200 font-light mt-1">{task.createdAt}</p>
    </div>
  );
}
