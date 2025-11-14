import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { sprintTaskMoveColumn } from "../../Api/projectAPI";

// =================== TaskCard Component ===================
function TaskCard({ task, isDraggingOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({ id: task.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  if (isDragging && !isDraggingOverlay) {
    return <div className="opacity-0 h-0" />;
  }

  return (
    <div
      ref={!isDraggingOverlay ? setNodeRef : null}
      {...(!isDraggingOverlay ? attributes : {})}
      {...(!isDraggingOverlay ? listeners : {})}
      style={style}
      className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 
      rounded-lg shadow-md cursor-grab"
    >
      <p className="font-medium">{task.name}</p>
      <p className="text-xs text-gray-200">{task.created_at}</p>
    </div>
  );
}

// =================== Column Component ===================
function Column({
  col,
  onAddTaskClick,
  onAddTaskInline,
  isAdding,
  newTaskTitle,
  setNewTaskTitle,
}) {
  const { setNodeRef } = useDroppable({ id: col.column_info.id });

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl w-72 bg-gray-800 p-4 shadow-xl border border-gray-700 flex-shrink-0"
    >
      <h2 className="text-sm text-gray-300 font-bold mb-3 flex justify-between">
        {col.column_info.name}

        {col.column_info.status === "todo" && (
          <button
            onClick={() => onAddTaskClick(col.column_info.id)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            + Create
          </button>
        )}
      </h2>

      {isAdding && (
        <div className="mb-3 p-1 border border-dashed border-gray-600 rounded">
          <textarea
            rows="2"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task name..."
            className="w-full p-2 rounded bg-gray-900 text-gray-200 
            border border-gray-700 focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => onAddTaskInline(col.column_info.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded 
              text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => onAddTaskClick(null)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-3 pt-1">
        {col.issues.length > 0 ? (
          col.issues.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No tasks</p>
        )}
      </div>
    </div>
  );
}

// =================== BoardView Component ===================
export default function BoardView({
  selectedProject,
  setSelectedProject,
  setProjects,
  handleSelectProject,
}) {
  const [activeColumnForNewTask, setActiveColumnForNewTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const columns = selectedProject?.columns?.board?.columns || [];

  const handleAddTaskClick = (colId) => {
    setActiveColumnForNewTask(colId === activeColumnForNewTask ? null : colId);
  };

  const handleAddTaskInline = (colId) => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      name: newTaskTitle,
      created_at: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "todo",
    };

    const updated = columns.map((col) =>
      col.column_info.id === colId
        ? { ...col, issues: [...col.issues, newTask] }
        : col
    );

    updateProject(updated);
    setNewTaskTitle("");
    setActiveColumnForNewTask(null);
  };

  const updateProject = (updatedColumns) => {
    const updatedProject = {
      ...selectedProject,
      columns: { board: { columns: updatedColumns } },
    };

    setSelectedProject(updatedProject);
    setProjects((p) =>
      p.map((pr) => (pr.id === selectedProject.id ? updatedProject : pr))
    );
  };

  // 🔥 DRAG START LOGS
  const handleDragStart = (event) => {
    console.log("🔥 DRAG START:", event.active.id);

    const allTasks = columns.flatMap((c) => c.issues);
    const active = allTasks.find((t) => t.id === event.active.id);

    console.log("➡️ Dragging Task:", active);

    setActiveTask(active);
  };

  // 🔥 DRAG END LOGS
 const handleDragEnd = async (event) => {
  const { active, over } = event;

  console.log("🔥 DRAG END");
  console.log("🟦 Active Task ID:", active.id);
  console.log("🟨 Dropped Over ID:", over?.id);

  setActiveTask(null);
  if (!over) {
    console.log("❌ No drop target!");
    return;
  }

  const isOverColumn = columns.some(
    (col) => col.column_info.id === over.id
  );

  if (!isOverColumn) {
    console.log("⚠️ Dropped on NON column!");
    return;
  }

  let sourceCol, destCol;

  columns.forEach((col) => {
    if (col.issues.some((t) => t.id === active.id)) sourceCol = col;
    if (col.column_info.id === over.id) destCol = col;
  });

  console.log("📦 Source Column:", sourceCol?.column_info?.name);
  console.log("📥 Destination Column:", destCol?.column_info?.name);

  // ==== API CALL ====
  try {
    const payload = { status: destCol?.column_info?.status };

    console.log(payload, active.id);
    

    const data = await sprintTaskMoveColumn(active.id, payload);
    console.log(data, "Successfully dragged");
  } catch (error) {
    console.log(error);
    console.log("api not called");
  }

  if (!sourceCol || !destCol) return;

  if (sourceCol.column_info.id === destCol.column_info.id) {
    console.log("⚠️ Same column — no move");
    return;
  }

  console.log(
    `✅ MOVING TASK ${active.id} FROM → ${sourceCol.column_info.name} TO → ${destCol.column_info.name}`
  );

  // Move UI task
  const task = sourceCol.issues.find((t) => t.id === active.id);

  const newSource = sourceCol.issues.filter((t) => t.id !== active.id);
  const newDest = [
    ...destCol.issues,
    { ...task, status: destCol.column_info.status },
  ];

  const updated = columns.map((col) =>
    col.column_info.id === sourceCol.column_info.id
      ? { ...col, issues: newSource }
      : col.column_info.id === destCol.column_info.id
      ? { ...col, issues: newDest }
      : col
  );

  updateProject(updated);
};


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* ================= Columns ================== */}
      <div className="flex gap-4 p-4 h-fit bg-gray-900 text-white overflow-x-scroll">
        {columns.map((col) => (
          <Column
            key={col.column_info.id}
            col={col}
            onAddTaskClick={handleAddTaskClick}
            onAddTaskInline={handleAddTaskInline}
            isAdding={activeColumnForNewTask === col.column_info.id}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDraggingOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
