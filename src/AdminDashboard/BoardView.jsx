import React, { useState } from "react";
import Column from "./Components/Column";
import TaskCard from "./Components/TaskCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const BoardView = ({ selectedProject, setSelectedProject, setProjects }) => {
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
      column: selectedProject.columns.find((c) => c.id === colId)?.title || "Unknown",
    };

    const updatedColumns = selectedProject.columns.map((col) =>
      col.id === colId ? { ...col, tasks: [...(col.tasks || []), newTask] } : col
    );

    const updatedLists = [...(selectedProject.lists || []), newTask];
    const updatedBacklogs = [...(selectedProject.backlogs || []), newTask];

    const updatedProject = {
      ...selectedProject,
      columns: updatedColumns,
      lists: updatedLists,
      backlogs: updatedBacklogs,
    };

    setSelectedProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    );

    setNewTaskTitle("");
    setActiveColumnForNewTask(null);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeTaskData = selectedProject.columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === active.id);
    setActiveTask(activeTaskData);
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    document.body.style.overflow = "auto";
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    let sourceCol, destinationCol;
    const updatedColumns = selectedProject.columns.map((col) => {
      if (col.tasks.find((task) => task.id === activeId)) sourceCol = col;
      if (col.id === overId) destinationCol = col;
      return col;
    });

    if (sourceCol && destinationCol) {
      const taskToMove = sourceCol.tasks.find((t) => t.id === activeId);
      const newSourceTasks = sourceCol.tasks.filter((t) => t.id !== activeId);
      const newDestTasks = [
        ...destinationCol.tasks,
        { ...taskToMove, column: destinationCol.title },
      ];

      const newCols = updatedColumns.map((col) => {
        if (col.id === sourceCol.id) return { ...col, tasks: newSourceTasks };
        if (col.id === destinationCol.id) return { ...col, tasks: newDestTasks };
        return col;
      });

      const updatedLists = selectedProject.lists.map((t) =>
        t.id === taskToMove.id ? { ...t, column: destinationCol.title } : t
      );

      const updatedBacklogs = selectedProject.backlogs.map((t) =>
        t.id === taskToMove.id ? { ...t, column: destinationCol.title } : t
      );

      const updatedProject = {
        ...selectedProject,
        columns: newCols,
        lists: updatedLists,
        backlogs: updatedBacklogs,
      };

      setSelectedProject(updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
      );
    }
  };

  if (!selectedProject) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Responsive board container */}
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 
                   overflow-x-auto sm:overflow-x-scroll p-3 sm:p-4 
                   w-full h-full no-scrollbar 
                   scroll-smooth touch-pan-x"
      >
        {selectedProject?.columns?.columns?.map((col) => (
          <div
            key={col.id}
            className="shrink-0 w-full sm:w-[300px] md:w-[340px] 
                       lg:w-[380px] transition-all duration-300"
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

      {/* Drag preview */}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDraggingOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardView;
