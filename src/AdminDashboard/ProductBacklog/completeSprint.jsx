// import React from "react";

// export default function completeSprint({ completedSprints }) {
//   return (
//     <div className="p-5 bg-gray-900 text-white rounded-xl mt-4 border border-gray-700">

//       <h2 className="text-xl font-bold mb-4">Completed Sprints</h2>

//       {completedSprints.length === 0 ? (
//         <p>No completed sprints found.</p>
//       ) : (
//         completedSprints.map((sprint) => (
//           <div
//             key={sprint.id}
//             className="bg-gray-800 p-4 rounded-xl mb-4 border border-gray-600"
//           >
//             <h3 className="font-semibold text-green-400 text-lg">
//               {sprint.name}
//             </h3>

//             <p className="text-sm text-gray-300">
//               Completed At: {new Date(sprint.completed_at).toLocaleString()}
//             </p>

//             <h4 className="mt-3 font-semibold text-blue-300">
//               Completed Issues ({sprint.completed_issues.length})
//             </h4>

//             <div className="flex flex-col gap-2 mt-2">
//               {sprint.completed_issues.map((issue) => (
//                 <div
//                   key={issue.id}
//                   className="bg-gray-700 p-3 rounded-lg border border-gray-600"
//                 >
//                   <p className="font-bold">{issue.name}</p>
//                   <p className="text-sm text-gray-300">{issue.key}</p>
//                   <p className="text-sm text-gray-300">Type: {issue.type}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { getCompleteSprints } from "../../Api/projectAPI";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function CompleteSprints({ projectId }) {
  const [completedSprints, setCompletedSprints] = useState([]);
  const [expanded, setExpanded] = useState(false);

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
    <div className="p-2 shadow  bg-white text-white rounded-xl mt-4 border border-gray-700">
      <button
        className="w-full flex items-center cursor-pointer  justify-between p-3  rounded-md"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          
          <h2 className="text-lg font-semibold text-black">Completed Sprints</h2>
        </div>
        <span className="text-sm text-black">
          {completedSprints.length} sprints
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {completedSprints.length === 0 ? (
            <p className="text-gray-400">No completed sprints found.</p>
          ) : (
            completedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-600"
              >
                <h3 className="font-semibold text-green-400 text-lg">
                  {sprint.name}
                </h3>

                <p className="text-sm text-gray-300">
                  Completed At:{" "}
                  {new Date(sprint.completed_at).toLocaleString()}
                </p>

                <h4 className="mt-3 font-semibold text-blue-300">
                  Completed Issues ({sprint.completed_issues.length})
                </h4>

                <div className="flex flex-col gap-2 mt-2">
                  {sprint.completed_issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                    >
                      <p className="font-bold">{issue.name}</p>
                      <p className="text-sm text-gray-300">{issue.key}</p>
                      <p className="text-sm text-gray-300">
                        Type: {issue.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
