import React, { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { addColumnToBoard } from "../../Api/projectAPI";

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
    // pointerEvents: isDraggingOverlay ? "none" : "auto", // Removed, as the PointerSensor constraint fixes the issue
  };

  // When the original card is dragging AND it's NOT the overlay, hide it
  if (isDragging && !isDraggingOverlay) {
    return <div className="opacity-0 h-0" />;
  }

  return (
    <div
      ref={!isDraggingOverlay ? setNodeRef : null}
      {...(!isDraggingOverlay ? attributes : {})}
      {...(!isDraggingOverlay ? listeners : {})}
      style={style}
      className={`bg-gradient-to-r from-blue-600 to-purple-700
                  text-white p-3 rounded-lg shadow-md cursor-grab`}
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
            className="w-full p-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => onAddTaskInline(col.column_info.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm font-medium transition-colors"
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
}) {
  const [activeColumnForNewTask, setActiveColumnForNewTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  // 🔥 FIX APPLIED HERE: Add distance constraint to PointerSensor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // A small drag is needed to start dragging, preventing simple clicks from triggering a drag
      },
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
      created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
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

  const handleDragStart = (event) => {
    const allTasks = columns.flatMap((c) => c.issues);
    const active = allTasks.find((t) => t.id === event.active.id);
    setActiveTask(active);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    // Check if we dropped on a task card (we don't want this)
    // Only allow dropping on a column
    const isOverColumn = columns.some(col => col.column_info.id === over.id);
    if (!isOverColumn) return;


    let sourceCol, destCol;

    columns.forEach((col) => {
      if (col.issues.some((t) => t.id === active.id)) sourceCol = col;
      if (col.column_info.id === over.id) destCol = col;
    });

    if (!sourceCol || !destCol) return;

    // Don't move if dropped back into the same column
    if (sourceCol.column_info.id === destCol.column_info.id) return;


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

   const addColumn = async () => {
    const columnData = {
      name: "New Column",
      status: "qa_review",
      position: 3,
    };
    
    console.log(selectedProject, "selected project");
    
    const data = await addColumnToBoard(selectedProject?.columns?.board?.columns, columnData);
    console.log(data, "added column");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end p-2">
        <button
         className="bg-blue-600 rounded-lg p-2 hover:bg-blue-700 cursor-pointer mb-5 "
         onClick={addColumn}>
           + Add Column</button>
      </div>

        

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



