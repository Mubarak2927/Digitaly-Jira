import axios from "axios";

const API = axios.create({
  baseURL: "https://project-management-1409.onrender.com/api/v1",
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
  const res = await API.patch(`/boards/${board_id}/columns`, columnData);
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

