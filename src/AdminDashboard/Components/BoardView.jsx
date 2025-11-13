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

  const clickTimeout = useRef(null);

  const handleClick = (e) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
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
      onClick={handleClick}
      style={style}
      className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 rounded-lg shadow-lg transition-transform ${
        isDraggingOverlay ? "opacity-95 scale-[1.05]" : ""
      }`}
    >
      <p className="font-medium break-words">{task.name}</p>
      <p className="text-xs text-gray-200 font-light mt-1">{task.createdAt}</p>
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
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl w-full sm:w-72 p-4 flex-shrink-0 
                 border border-gray-700 bg-gray-800/80 shadow-lg 
                 transition-all duration-200 z-0"
    >
      <h2 className="text-sm font-bold text-gray-300 mb-3 flex justify-between items-center">
        <span className="truncate">{col.column_info.name.toUpperCase()}</span>

        {col.column_info.status === "todo" && (
          <button
            onClick={() => onAddTaskClick(col.column_info.id)}
            className="text-blue-400 text-lg font-bold hover:text-blue-300 transition"
          >
            + Create
          </button>
        )}
      </h2>

      {isAdding && (
        <div className="mb-3 animate-fadeIn">
          <textarea
            rows="2"
            placeholder="Enter task name..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-2 mt-5 rounded-md bg-gray-900 text-gray-200 
                       border border-gray-700 focus:outline-none 
                       focus:border-blue-500 mb-2 resize-none text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onAddTaskInline(col.column_info.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 
                         text-sm rounded-md transition"
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewTaskTitle("");
                onAddTaskClick(null);
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-900 
                         text-sm rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-y-auto max-h-[70vh] flex flex-col gap-2 no-scrollbar">
        {col.issues?.length ? (
          col.issues.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-gray-500 text-sm italic text-center py-4">
            No tasks yet
          </p>
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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddTaskClick = (colId) => {
    setActiveColumnForNewTask(colId === activeColumnForNewTask ? null : colId);
  };

  const handleAddTaskInline = (colId) => {
    if (!newTaskTitle.trim() || !selectedProject) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      createdAt: new Date().toLocaleString(),
      column:
        selectedProject.columns.find((c) => c.id === colId)?.title || "Unknown",
    };

    const updatedColumns = selectedProject.columns.map((col) =>
      col.id === colId
        ? { ...col, tasks: [...(col.tasks || []), newTask] }
        : col
    );

    const updatedProject = {
      ...selectedProject,
      columns: updatedColumns,
      lists: [...(selectedProject.lists ?? []), newTask],
      backlogs: [...(selectedProject.backlogs ?? []), newTask], // ✅ IMPORTANT
    };

    console.log(updatedProject, "updated columns ");

    setSelectedProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    );

    setNewTaskTitle("");
    setActiveColumnForNewTask(null);
  };

  const handleDragStart = (event) => {
    const active = selectedProject.columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === event.active.id);
    setActiveTask(active);
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    document.body.style.overflow = "auto";
    setActiveTask(null);
    if (!over) return;

    let sourceCol, destinationCol;

    selectedProject.columns.forEach((col) => {
      if (col.tasks.find((t) => t.id === active.id)) sourceCol = col;
      if (col.id === over.id) destinationCol = col;
    });

    if (sourceCol && destinationCol) {
      const taskToMove = sourceCol.tasks.find((t) => t.id === active.id);
      const newSourceTasks = sourceCol.tasks.filter((t) => t.id !== active.id);
      const newDestTasks = [
        ...destinationCol.tasks,
        { ...taskToMove, column: destinationCol.title },
      ];

      const updatedProject = {
        ...selectedProject,
        columns: selectedProject.columns.map((col) =>
          col.id === sourceCol.id
            ? { ...col, tasks: newSourceTasks }
            : col.id === destinationCol.id
            ? { ...col, tasks: newDestTasks }
            : col
        ),
        lists: selectedProject.lists.map((t) =>
          t.id === taskToMove.id ? { ...t, column: destinationCol.title } : t
        ),
        backlogs: selectedProject.backlogs.map((t) =>
          t.id === taskToMove.id ? { ...t, column: destinationCol.title } : t
        ),
      };

      setSelectedProject(updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
      );
    }
  };

  if (!selectedProject) return null;

  const addColumn = async () => {
    const columnData = {
      name: "New Column",
      status: "qa_review",
      position: 3,
    };
    
    console.log(selectedProject, "selected project");
    
    const data = await addColumnToBoard(selectedProject.columns[0].id, columnData);
    console.log(data, "added column");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className=" absolute w-fit p-2 right-15 rounded-lg  bg-blue-600  hover:bg-blue-700">
        <button className="cursor-pointer" onClick={addColumn}>
          + Add Column
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 pt-17 overflow-x-auto no-scrollbar">
        {selectedProject.columns.board.columns?.map((col) => (
          <div
            key={col.column_info.id}
            className="flex-shrink-0 w-full sm:w-[300px] md:w-[340px] lg:w-[380px]"
          >
            <Column
              col={col}
              onAddTaskClick={handleAddTaskClick}
              onAddTaskInline={handleAddTaskInline}
              isAdding={activeColumnForNewTask === col.id}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
            />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDraggingOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
