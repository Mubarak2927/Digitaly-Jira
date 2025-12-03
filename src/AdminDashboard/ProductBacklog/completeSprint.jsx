import React, { useEffect, useState } from "react";
import { getCompleteSprints } from "../../Api/projectAPI";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ClipboardCheck, Bug, BookOpen } from "lucide-react";


export default function CompleteSprints({ projectId }) {
  const [completedSprints, setCompletedSprints] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  

  const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "task":
      return <ClipboardCheck size={16} className="text-blue-500" />;
    case "bug":
      return <Bug size={16} className="text-red-500" />;
    case "story":
      return <BookOpen size={16} className="text-green-500" />;
    default:
      return null;
  }
};

  const fetchData = async () => {
    if (!projectId) return;
    const data = await getCompleteSprints(projectId);
    setCompletedSprints(data || []);
  };

  useEffect(() => {
    fetchData();

    const handler = (e) => {
      setCompletedSprints(e.detail);
    };

    window.addEventListener("completedSprintsUpdatedFromServer", handler);
    return () =>
      window.removeEventListener("completedSprintsUpdatedFromServer", handler);
  }, [projectId]);


  return (
    <div className="p-2 shadow bg-white rounded-xl mt-4 border border-gray-300">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-3 rounded-md"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="text-black" size={20} />
          ) : (
            <ChevronRight className="text-black" size={20} />
          )}
          <h2 className="text-lg font-semibold text-black">Completed Sprints</h2>
        </div>
        <span className="text-sm text-black">{completedSprints.length} sprints</span>
      </button>

      {/* Body */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {completedSprints.length === 0 ? (
            <p className="text-gray-500">No completed sprints found.</p>
          ) : (
            completedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex items-center justify-between"
              >
                <p className="font-semibold text-black">{sprint.name}</p>
                <button
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  onClick={() => setSelectedSprint(sprint)}
                >
                  View More
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {selectedSprint && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-auto">
          <div className="bg-white w-[95%] max-w-5xl  p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-700">{selectedSprint.name}</h2>
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => setSelectedSprint(null)}
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Completed At: {new Date(selectedSprint.completed_at).toLocaleString()}
            </p>

            {/* Completed Issues Table */}
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Completed Issues ({selectedSprint.completed_issues.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-black">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-4 py-2 border text-left">Type</th>
                    <th className="px-4 py-2 border text-left">Issue Name</th>
                    <th className="px-4 py-2 border text-left">Key</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSprint.completed_issues.map((issue) => (
                    <tr key={issue.id} className="even:bg-black">
                      <td className="px-4 py-2 text-black border-b">{issue.type}</td>

                      <td className="px-4  text-black py-2 border">{issue.name}</td>
                      <td className="px-4 py-2 text-black border">{issue.key}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <button
              className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              onClick={() => setSelectedSprint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
