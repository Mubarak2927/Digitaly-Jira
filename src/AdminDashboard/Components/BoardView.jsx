import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import {
  sprintTaskMoveColumn,
  getAllUsers,
  completeSprint,
} from "../../Api/projectAPI";
import { User2 } from "lucide-react";

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
  const [openDetails, setOpenDetails] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };
  const isGhost = isDragging && !isDraggingOverlay;

  // if (isDragging && !isDraggingOverlay) {
  //   return <div className="opacity-0 h-0" />;
  // }

  const handleAdd = () => {
    if (comment.trim()) {
      console.log("Added Comment:", comment);
      alert("Comment added!");
      setComment("");
    } else {
      alert("Please enter a comment before adding.");
    }
  };

  const handleCancel = () => {
    setComment("");
  };
  useEffect(() => {
    if (openAssignModal) {
      fetchUsers();
    }
  }, [openAssignModal]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data); // assuming API returns [{ id, name, ... }]
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return (
    <div
      ref={!isDraggingOverlay ? setNodeRef : null}
      {...(!isDraggingOverlay ? attributes : {})}
      {...(!isDraggingOverlay ? listeners : {})}
      style={style}
      className="bg-blue-600 text-white p-3 
      rounded-lg shadow-md cursor-grab relative"
    >
      <p className="font-medium">{task.name}</p>
      <button
        className="absolute right-2 top-1 text-xs text-white hover:underline hover:text-black cursor-pointer"
        onClick={() => setOpenDetails(true)}
      >
        Details
      </button>
      <p className="text-xs text-gray-200">{task.created_at}</p>
      <button
        className="absolute right-2 hover:scale-105 bg-white p-1 rounded-full bottom-1 cursor-pointer text-black"
        onClick={() => setOpenAssignModal(true)}
      >
        <User2 size={13} />
      </button>

      {openDetails && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/60 bg-opacity-50 z-50">
          <div className="bg-white text-black   p-6 rounded-lg shadow-lg/60 border  w-80">
            <h3 className="text-lg font-bold mb-2">Task Details</h3>
            <p>
              <span className="font-semibold">Name:</span> {task.name}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {task.type}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {task.created_at}
            </p>
            <p>
              <span className="font-semibold">Epic:</span> {task.epic_name}
            </p>
            <p>
              <span className="font-semibold capitalize">Status:</span>{" "}
              {task.status}
            </p>
            <div className="flex flex-col">
              <textarea
                placeholder="Comments..."
                className="w-60 border text-black text-xs h-20 mt-3 p-1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex justify-end gap-3 mr-8 mt-2">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="bg-blue-600 text-white px-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
              onClick={() => setOpenDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {openAssignModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/70 z-50">
          <div className="bg-gray-900 px-4 py-10 border-gray-950 rounded-lg shadow-lg/60 w-64">
            <h3 className="font-semibold text-lg mb-4 text-white">
              Assign User
            </h3>

            <select
              className="w-full p-2 border bg-gray-800 text-white rounded-lg"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-1 bg-blue-700 text-white rounded"
                onClick={() => {
                  if (selectedUser) {
                    console.log("Assigned to:", selectedUser);
                    setOpenAssignModal(false);
                  } else {
                    alert("Please select a user first");
                  }
                }}
              >
                Assign
              </button>
              <button
                className="px-4 py-1 bg-white text-black rounded"
                onClick={() => setOpenAssignModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

        {/* {col.column_info.status === "todo" && (
          <button
            onClick={() => onAddTaskClick(col.column_info.id)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            + Create
          </button>
        )} */}
      </h2>

      {isAdding && (
        <div className="mb-3 p-1  border-gray-600 rounded">
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
          <p className="text-blue-600 text-sm text-center py-4">No tasks</p>
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

  const columns = selectedProject?.columns?.columns?.board?.columns || [];

  console.log(selectedProject, columns, "success resp[opnse");

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
      columns: {
        columns: {
          board: {
            columns: updatedColumns,
          },
        },
      },
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
  //  const handleDragEnd = async (event) => {
  //   const { active, over } = event;

  //   console.log("🔥 DRAG END");
  //   console.log("🟦 Active Task ID:", active.id);
  //   console.log("🟨 Dropped Over ID:", over?.id);

  //   setActiveTask(null);
  //   if (!over) {
  //     console.log("❌ No drop target!");
  //     return;
  //   }

  //   const isOverColumn = columns.some(
  //     (col) => col.column_info.id === over.id
  //   );

  //   if (!isOverColumn) {
  //     console.log("⚠️ Dropped on NON column!");
  //     return;
  //   }

  //   let sourceCol, destCol;

  //   columns.forEach((col) => {
  //     if (col.issues.some((t) => t.id === active.id)) sourceCol = col;
  //     if (col.column_info.id === over.id) destCol = col;
  //   });

  //   console.log("📦 Source Column:", sourceCol?.column_info?.name);
  //   console.log("📥 Destination Column:", destCol?.column_info?.name);

  //   // ==== API CALL ====
  //   try {
  //     const payload = { status: destCol?.column_info?.status };

  //     console.log(payload, active.id);

  //     const data = await sprintTaskMoveColumn(active.id, payload);
  //     console.log(data, "Successfully dragged");
  //   } catch (error) {
  //     console.log(error);
  //     console.log("api not called");
  //   }

  //   if (!sourceCol || !destCol) return;

  //   if (sourceCol.column_info.id === destCol.column_info.id) {
  //     console.log("⚠️ Same column — no move");
  //     return;
  //   }

  //   console.log(
  //     `✅ MOVING TASK ${active.id} FROM → ${sourceCol.column_info.name} TO → ${destCol.column_info.name}`
  //   );

  //   // Move UI task
  //   const task = sourceCol.issues.find((t) => t.id === active.id);

  //   const newSource = sourceCol.issues.filter((t) => t.id !== active.id);
  //   const newDest = [
  //     ...destCol.issues,
  //     { ...task, status: destCol.column_info.status },
  //   ];

  //   const updated = columns.map((col) =>
  //     col.column_info.id === sourceCol.column_info.id
  //       ? { ...col, issues: newSource }
  //       : col.column_info.id === destCol.column_info.id
  //       ? { ...col, issues: newDest }
  //       : col
  //   );

  //   updateProject(updated);
  // };
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    console.log("🔥 DRAG END");
    console.log("🟦 Active Task ID:", active?.id);
    console.log("🟨 Dropped Over ID:", over?.id);

    setActiveTask(null);

    // ❗ OVER NULL CHECK — prevents white screen
    // 🎯 If over.id is a task → replace with its column
    if (over && over.id && over.data?.current?.type === "task") {
      const parentColumn = columns.find((col) =>
        col.issues.some((t) => t.id === over.id)
      );
      if (parentColumn) {
        over.id = parentColumn.column_info.id;
      }
    }

    // Check if dropped over a column
    const isOverColumn = columns.some((col) => col.column_info.id === over.id);

    if (!isOverColumn) {
      console.log("⚠️ Dropped outside any column");
      return;
    }

    // Find source/destination
    let sourceCol, destCol;

    columns.forEach((col) => {
      if (col.issues.some((t) => t.id === active.id)) sourceCol = col;
      if (col.column_info.id === over.id) destCol = col;
    });

    if (!sourceCol || !destCol) {
      console.log("❌ Source or Destination column not found!");
      return;
    }

    if (sourceCol.column_info.id === destCol.column_info.id) {
      console.log("⚠️ Same column drop → no move");
      return;
    }

    // API call
    try {
      const payload = { status: destCol.column_info.status };
      const data = await sprintTaskMoveColumn(active.id, payload);
      console.log("API Success:", data);
    } catch (err) {
      console.error("API Error", err);
    }

    // UI Move
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
  const handleComplete = async () => {
    try {
      const res = await completeSprint();
    } catch (error) {}
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className=" cursor-pointer text-white bg-green-500 hover:bg-green-600  px-2 py-2 rounded-lg"
        >
          Complete Sprint
        </button>
      </div>

      {/* ================= Columns ================== */}
      <div className="flex gap-4 p-4 h-fit mt-15 text-white overflow-x-scroll">
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
