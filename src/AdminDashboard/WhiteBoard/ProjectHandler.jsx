// src/Pages/WhiteBoard/ProjectHandler.jsx
import {
  createProject,
  getProjectById,
  manageProjectMember,
  getBoardById,
  boardData,
} from "../../Api/projectAPI";

const ProjectHandler = ({
  projects,
  setProjects,
  selectedProject,
  setSelectedProject,
  newProject,
  setNewProject,
  newColumnTitle,
  setNewColumnTitle,
  setShowSidebarProjectModal,
  setShowAddColumnModal,
}) => {
  const handleAddSidebarProject = async () => {
    if (!newProject.name.trim() || !newProject.projectLead)
      return alert("Please fill all required fields.");

    const member_roles = {};
    newProject.assignedEmployees.forEach((empId) => {
      member_roles[empId] = "developer";
    });

    const payload = {
      key: newProject.key || newProject.name.slice(0, 6).toUpperCase(),
      name: newProject.name,
      description: newProject.description || "No description",
      avatar_url: newProject.avatar || "",
      start_date: newProject.startDate
        ? new Date(newProject.startDate).toISOString()
        : null,
      end_date: newProject.endDate
        ? new Date(newProject.endDate).toISOString()
        : null,
      project_lead: newProject.projectLead,
      member_roles,
    };

    try {
      const created = await createProject(payload);
      setSelectedProject(created);
      setShowSidebarProjectModal(false);

      setNewProject({
        name: "",
        key: "",
        startDate: "",
        endDate: "",
        projectLead: "",
        assignedEmployees: [],
        platform: "",
        description: "",
        avatar: "",
        labels: [],
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleSelectProject = async (id) => {
    try {
      const data = await getProjectById(id);
      const columns = await getBoardById(id);
      const withColumns = { ...data, columns };
      await boardData(id);
      setSelectedProject(withColumns);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleAddMember = async (newMemberId) => {
    if (!selectedProject) return;
    const payload = { user_id: newMemberId, role: "developer", action: "add" };

    try {
      await manageProjectMember(selectedProject.id, payload);
      const updated = await getProjectById(selectedProject.id);
      setSelectedProject(updated);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim() || !selectedProject) return;
    const newCol = { id: Date.now().toString(), title: newColumnTitle, tasks: [] };

    const updatedProj = {
      ...selectedProject,
      columns: [...selectedProject.columns, newCol],
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProj : p))
    );
    setSelectedProject(updatedProj);
    setNewColumnTitle("");
    setShowAddColumnModal(false);
  };

  return { handleAddSidebarProject, handleSelectProject, handleAddMember, handleAddColumn };
};

export default ProjectHandler;
