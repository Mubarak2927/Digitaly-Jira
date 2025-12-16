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
  assignIssueToUser,
  getRunningSprints,
  getCompleteSprints,
} from "../../Api/projectAPI";

import { User2 } from "lucide-react";
import CompleteSprint from "../ProductBacklog/completeSprint";
import CompleteSprints from "../ProductBacklog/completeSprint";

// =================== TaskCard Component ===================
function TaskCard({ task, isDraggingOverlay, onAssign }) {
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
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    onAssign(task.id, selectedUser);
    setOpenAssignModal(false);
  };

  return (
    <div
      ref={!isDraggingOverlay ? setNodeRef : null}
      {...(!isDraggingOverlay ? attributes : {})}
      {...(!isDraggingOverlay ? listeners : {})}
      style={style}
      className="bg-blue-600 text-white p-3 rounded-lg shadow-md cursor-grab relative"
    >
      <p className="font-medium">{task.name}</p>
      <button
        className="absolute right-2 top-1 text-xs text-white hover:underline hover:text-black cursor-pointer"
        onClick={() => setOpenDetails(true)}
      >
        Details
      </button>
      <p className="text-xs text-gray-200">{task.created_at}</p>

      {/* ASSIGN BUTTON */}
      <button
        className="absolute right-2 hover:scale-105 bg-white p-1 rounded-full bottom-1 cursor-pointer text-black"
        onClick={() => setOpenAssignModal(true)}
        title={task.assigned_user?.full_name || "Assign User"}
      >
        {task.assigned_user && task.assigned_user.full_name ? (
          <div className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
            {task.assigned_user.full_name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <User2 size={13} />
        )}
      </button>

      {openDetails && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/60 bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-2">Task Details</h3>
            <p><span className="font-semibold">Name:</span> {task.name}</p>
            <p><span className="font-semibold">Type:</span> {task.type}</p>
            <p><span className="font-semibold">Created At:</span> {task.created_at}</p>
            <p><span className="font-semibold">Epic:</span> {task.epic_name}</p>
            <p><span className="font-semibold capitalize">Status:</span> {task.status}</p>
          
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
          <div className="bg-gray-900 px-4 py-10 rounded-lg shadow-lg w-64">
            <h3 className="font-semibold text-lg mb-4 text-white">Assign User</h3>

            <select
              className="w-full p-2 bg-gray-800 text-white rounded-lg"
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
              <button className="px-4 py-1 bg-blue-700 text-white rounded" onClick={handleAssignUser}>
                Assign
              </button>
              <button className="px-4 py-1 bg-white text-black rounded" onClick={() => setOpenAssignModal(false)}>
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
  onAssign,
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
      </h2>

      {isAdding && (
        <div className="mb-3 p-1 border-gray-600 rounded">
          <textarea
            rows="2"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task name..."
            className="w-full p-2 rounded bg-gray-900 text-gray-200 border border-gray-700"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => onAddTaskInline(col.column_info.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => onAddTaskClick(null)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-3 pt-1">
        {col.issues.length > 0 ? (
          col.issues.map((task) => (
            <TaskCard key={task.id} task={task} onAssign={onAssign} />
          ))
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

  const [completedSprints, setCompletedSprints] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    handleSelectProject(selectedProject);
  }, []);

  const columns = selectedProject?.columns?.columns?.board?.columns || [];

  const handleAddTaskClick = (colId) => {
    setActiveColumnForNewTask(colId === activeColumnForNewTask ? null : colId);
  };

  const handleAddTaskInline = (colId) => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      name: newTaskTitle,
      created_at: new Date().toLocaleTimeString(),
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

  const handleDragStart = (event) => {
    const allTasks = columns.flatMap((c) => c.issues);
    const active = allTasks.find((t) => t.id === event.active.id);

    setActiveTask(active);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const isOverColumn = columns.some((col) => col.column_info.id === over.id);

    if (!isOverColumn) return;

    let sourceCol, destCol;

    columns.forEach((col) => {
      if (col.issues.some((t) => t.id === active.id)) sourceCol = col;
      if (col.column_info.id === over.id) destCol = col;
    });

    if (!sourceCol || !destCol) return;
    if (sourceCol.column_info.id === destCol.column_info.id) return;

    try {
      const payload = { status: destCol.column_info.status };
      await sprintTaskMoveColumn(active.id, payload);
    } catch (err) {
      console.error("API Error", err);
    }

    const task = sourceCol.issues.find((t) => t.id === active.id);

    const newSource = sourceCol.issues.filter((t) => t.id !== active.id);
    const newDest = [...destCol.issues, { ...task, status: destCol.column_info.status }];

    const updated = columns.map((col) =>
      col.column_info.id === sourceCol.column_info.id
        ? { ...col, issues: newSource }
        : col.column_info.id === destCol.column_info.id
        ? { ...col, issues: newDest }
        : col
    );

    updateProject(updated);
  };

  const fetchRunningSprints = async () => {
    try {
      const res = await getRunningSprints(selectedProject?.id);
      console.log("Running Sprints:", res);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  useEffect(() => {
    fetchRunningSprints();
  }, []);


const handleComplete = async () => {
  try {
    const projectID = selectedProject?.id;
    if (!projectID) return alert("No project selected");

    const res = await getRunningSprints(projectID);
    const sprintId = res?.sprints?.[0]?.sprint_id;

    if (!sprintId) return alert("No active sprint found!");

    // complete the sprint
    await completeSprint(sprintId);

    // fetch updated completed sprints from backend
    const completed = await getCompleteSprints(projectID);

    // broadcast to all pages/components
    window.dispatchEvent(
      new CustomEvent("completedSprintsUpdatedFromServer", { detail: completed })
    );

    alert("Sprint Completed!");
  } catch (err) {
    console.error(err);
    alert("Failed to complete sprint!");
  }
};


  const updateProjectAfterSprintComplete = (data) => {
    const { completed_issues, pending_issues } = data;

    const updated = columns.map((col) => {
      if (col.column_info.status === "done") {
        return { ...col, issues: [...col.issues, ...completed_issues] };
      }

      if (col.column_info.status === "backlog") {
        return { ...col, issues: [...col.issues, ...pending_issues] };
      }

      return {
        ...col,
        issues: col.issues.filter(
          (task) =>
            !completed_issues.some((t) => t.id === task.id) &&
            !pending_issues.some((t) => t.id === task.id)
        ),
      };
    });

    updateProject(updated);
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await assignIssueToUser(taskId, userId);

      const updated = columns.map((col) => ({
        ...col,
        issues: col.issues.map((i) =>
          i.id === taskId ? { ...i, assigned_user: { id: userId } } : i
        ),
      }));

      updateProject(updated);
    } catch (err) {
      console.error("Assign failed", err);
    }
  };

  const loadCompletedSprints = async () => {
    try {
      const res = await getCompleteSprints(selectedProject?.id);
      setCompletedSprints(res);
    } catch (err) {
      console.error("Failed to load completed sprints:", err);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end gap-2">

        <button
          onClick={handleComplete}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 px-2 py-2 rounded-lg"
        >
          Complete Sprint
        </button>

        {/* SHOW COMPLETED BUTTON */}
        {/* <button
          onClick={() => {
            loadCompletedSprints();
            setShowCompleted(!showCompleted);
          }}
          className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600 px-2 py-2 rounded-lg"
        >
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </button> */}

      </div>

      <div className="flex gap-4 p-4 h-fit mt-15 text-white overflow-x-scroll">
        {Array.isArray(columns) &&
          columns.map((col) => (
            <Column
              key={col.column_info.id}
              col={col}
              onAssign={handleAssignTask}
              onAddTaskClick={handleAddTaskClick}
              onAddTaskInline={handleAddTaskInline}
              isAdding={activeColumnForNewTask === col.column_info.id}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
            />
          ))}
      </div>

      {showCompleted && <CompleteSprints projectId={selectedProject?.id} />}


      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDraggingOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
