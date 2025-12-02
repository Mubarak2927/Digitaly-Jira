import axios from "axios";

const API = axios.create({
  // baseURL: "https://project-management-1409.onrender.com/api/v1",
  baseURL: "https://project-management-sfrn.onrender.com/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Get all projects
export const getAllProjects = async () => {
  const res = await API.get("/projects");
  console.log(res, "response");

  return res.data;
};

//  Get project by ID
export const getProjectById = async (projectId) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data;
};

//  Create new project
export const createProject = async (projectData) => {
  const res = await API.post("/projects/", projectData);
  return res.data;
};

//  Update project
export const updateProject = async (projectId, projectData) => {
  const res = await API.put(`/projects/${projectId}`, projectData);
  return res.data;
};

//  Delete project
export const deleteProject = async (projectId) => {
  const res = await API.delete(`/projects/${projectId}`);
  return res.data;
};


//  Get work items
export const getWorkItems = async (projectId) => {
  const res = await API.get(`/projects/${projectId}/workitems`);
  return res.data.workitems;
};

//  Manage project members
export const manageProjectMember = async (projectId, payload) => {
  const res = await API.post(`/projects/${projectId}/members`, payload);
  return res.data;
};
//  Get all users (for dropdowns)
export const getAllUsers = async () => {
  const res = await API.get("/users"); // This will automatically attach token
  return res.data; // returns array of users
};

//  Get All Boards by Project
export const getBoards = async (project_id) => {
  const res = await API.get(`/boards`, {
    params: { project_id }
  });
  return res.data;
};

//  Create Board
export const createBoard = async (boardData) => {
  const res = await API.post(`/boards`, boardData);
  return res.data;
};

//  Get Board by ID
export const getBoardById = async (board_id) => {
  const res = await API.get(`/boards?project_id=${board_id}`);
  return res.data;
};

//  Update Board
export const updateBoard = async (board_id, updateData) => {
  const res = await API.put(`/boards/${board_id}`, updateData);
  return res.data;
};

//  Add Column to Board
export const addColumnToBoard = async (board_id, columnData) => {
  const res = await API.post(`/boards/${board_id}/columns`, columnData);
  return res.data;
};

//  Get Backlog (By Project)
export const getBacklog = async (project_id) => {
  const res = await API.get(`/boards/backlog/${project_id}`);
  return res.data;
};

//  Get Sprint Board
export const getSprintBoard = async (sprint_id) => {
  const res = await API.get(`/boards/sprint/${sprint_id}`);
  return res.data;
};

//  Delete Board
export const deleteBoard = async (board_id) => {
  const res = await API.delete(`/boards/${board_id}`);
  return res.data;
};


export const getEpic = async (project_id) => {
  const res = await API.get(`/epics/?project_id=${project_id}`);
  return res.data;
};


export const createEpic = async (boardData) => {
  const res = await API.post(`/epics/`, boardData);
  return res.data;
};

export const createIssues = async (payload) => {
  const res = await API.post(`/issues/`, payload);
  return res.data;
};

export const getIssues = async (projectId) => {
  const res = await API.get(`/issues/?project_id=${projectId}`);
  return res.data;
};

export const getSprint = async (projectId) => {
  const res = await API.get(`/sprints/?project_id=${projectId}`);
  return res.data;
};

export const createSprint = async (payload) => {
  const res = await API.post(`/sprints/`, payload);
  return res.data;
};

export const sprintTaskMove = async (sprintId, payload) => {
  const res = await API.post(`/issues/move-multiple?to=sprint&sprint_id=${sprintId}`, payload);
  return res.data;
};

export const sprintById= async (project_id) => {
  const res = await API.get(`/sprints/${project_id}`);
  return res.data;
}

export const fetchIssuesbySprintId = async (sprintId) => {
  const res = await API.get(`/sprints/${sprintId}`);
  return res.data;
};

export const startSprints = async (sprintId) => {
  const res = await API.post(`/sprints/${sprintId}/start`);
  return res.data;
};

export const boardData= async (project_id) => {
  const res = await API.get(`/boards/?project_id=${project_id}`);
  return res.data;
}

export const sprintTaskMoveColumn = async (issuesID, payload) => {
  const res = await API.put(`/issues/${issuesID}`,payload);
  return res.data;
};

//create Employee profile
export const createEmployee = async (payload) => {
  const res = await API.post("/employees/admin/create", payload);
  return res.data;
};
// list employee profile
export const getAllEmployeesList = async (page = 1, limit = 50) => {
  const res = await API.get(`/employees/admin/list`, {
    params: { page, limit }
  });
  return res.data;
};
export const checkInAttendance = async (note = "") => {
  try {
    const res = await API.post("/employees/me/attendance/checkin", note ? { note } : {});
    return res.data;
  } catch (err) {
    console.error("Check-in failed", err);
    throw err;
  }
};

// Check-out API
export const checkOutAttendance = async (note = "") => {
  try {
    const res = await API.post("/employees/me/attendance/checkout", note ? { note } : {});
    return res.data;
  } catch (err) {
    console.error("Check-out failed", err);
    throw err;
  }
};
// projectAPI.js (add this at the bottom or with other employee APIs)

// Create a leave request
export const createLeaveRequest = async (payload) => {
  const res = await API.post("/employees/me/leaves", payload);
  return res.data;
};


export const getMyProfile = async () => {
  const res = await API.get("/employees/me");
  return res.data;
};


// Delete Issue from Sprint
export const deleteIssueFromSprint = async (sprintId, issueId) => {
  const res = await API.delete(`/issues/sprints/${sprintId}/issues/${issueId}`);
  return res.data;
};

//complete sprint



export const completeSprint = async (SprintId) => {
  const res = await API.post(
    `/sprints/${SprintId}/complete?auto_move_incomplete_to=backlog`
  );
  return res.data;
};

export const getRunningSprints = async (project_id) => {
  const res = await API.get(`/sprints/running/all?project_id=${project_id}`);
  return res.data;
};


export const assignIssueToUser = async (issue_id, assignee_id) => {
  const res = await API.patch(`/issues/${issue_id}/assign`, {
    assignee_id,
  });
  return res.data;
};

export const getCompleteSprints = async (projectId) => {
  const res = await API.get(`/sprints/completed?project_id=${projectId}`);
  return res.data;
};
  

