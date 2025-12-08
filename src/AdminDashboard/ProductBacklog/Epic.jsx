// import { SquarePen, Trash2 } from 'lucide-react';
// import React, { useState } from 'react'
// import { epicComments } from '../../Api/projectAPI';

// const Epic = ({
//     epics,
// selectedEpic,
// setSelectedEpic,
// createForm,
// setCreateForm,
// handleCreateItem,
// handleDeleteEpic,
// handleUpdateEpic
// }) => {

//   const [showEditModal, setShowEditModal] = useState(false);
// const [editData, setEditData] = useState(null);


// const hanldeComment = async () => {
//   try {
//     const comments =await epicComments()
//     console.log("Comment Added:", comments);
//   } catch (error) {
    
//   }
// }

//   return (
//     <div className=" p-4  border border-black rounded-2xl shadow-lg/60 ">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-lg font-semibold text-black">Epics</h3>
        
       
//       </div>
//       <div className="space-y-2">
//         <div
//           onClick={() => setSelectedEpic(null)}
//           className={`p-2 rounded-lg cursor-pointer ${
//             selectedEpic === null ? "bg-white/10" : "hover:bg-white/5"
//           }`}
//         ></div>

//         {epics.map((e) => (
//          <div
//   key={e.id}
//   onClick={() => {
//     setSelectedEpic((prev) => (prev && prev.id === e.id ? null : e));
//   }}
//   className={`p-3 rounded-lg cursor-pointer group
//     ${selectedEpic?.id === e.id ? "bg-white" : "hover:bg-white/5"}
//   `}
// >
//   <div className="flex items-center border border-black p-2 rounded-2xl bg-gray-300 justify-between">
//     <div>
//       <div className="font-medium text-black">{e.name}</div>
//       <div className="text-xs text-black">Epic ID: {e.id}</div>
//     </div>

//     <div className="flex items-center ">
//       <button
//       onClick={hanldeComment}
//        className='bg-blue-600 text-xs p-1 rounded-xs  cursor-pointer hover:scale-110'>
//           Add Comment
//         </button>

//       {/* DELETE BUTTON */}
//       <button
//         onClick={(ev) => {
//           ev.stopPropagation();
//           handleDeleteEpic(e.id);
//         }}
//         className="text-red-600 opacity-100 font-bold px-2 py-1 rounded hover:scale-110 cursor-pointer transition-all"
//       >
//         <Trash2 size={15} />
//       </button>

//       {/* EDIT BUTTON — hidden until hover */}
//       <button
//   onClick={(ev) => {
//     ev.stopPropagation();
//     setEditData(e);            
//     setShowEditModal(true);     
//   }}
//   className="text-blue-700 flex items-center transition-all hover:scale-110  cursor-pointer"
// >
// <SquarePen size={15}/>
// </button>


//     </div>
//   </div>
// </div>

//         ))}
//       </div>

//       {/* Quick add epic */}
//       <div className="mt-4">
//         <input
//           placeholder="New epic title"
//           value={createForm.type === "Epic" ? createForm.name : ""}
//           onChange={(e) =>
//             setCreateForm((prev) => ({
//               ...prev,
//               type: "Epic",
//               name: e.target.value,
//             }))
//           }
//           className="w-full border-black border text-black px-3 py-2 rounded-md text-sm"
//         />
//         <div className="mt-2 flex justify-between">
//         <small className="text-xs text-black">{epics.length} items</small>

//           <button
//             onClick={handleCreateItem}
//             className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
//           >
//             Add Epic
//           </button>
//         </div>
//       </div>

//       {showEditModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white w-[350px] border border-black rounded-2xl p-5">
//       <h3 className="text-lg font-semibold text-black mb-3">Edit Epic</h3>

//       <input
//         className="w-full border border-black px-3 py-2 rounded mb-3 text-black"
//         value={editData?.name || ""}
//         onChange={(e) =>
//           setEditData((prev) => ({ ...prev, name: e.target.value }))
//         }
//       />

//       <div className="flex justify-end gap-2 mt-3">
//         <button
//           className="px-3 py-1 bg-gray-400 text-black rounded"
//           onClick={() => setShowEditModal(false)}
//         >
//           Cancel
//         </button>

//         <button
//           className="px-3 py-1 bg-green-500 text-black rounded"
//           onClick={async () => {
//             await handleUpdateEpic(editData.id, { name: editData.name });
//             setShowEditModal(false);
//           }}
//         >
//           Update
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
    
//   )
// }

// export default Epic

import { SquarePen, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { epicComments } from '../../Api/projectAPI';

const Epic = ({
    epics,
    selectedEpic,
    setSelectedEpic,
    createForm,
    setCreateForm,
    handleCreateItem,
    handleDeleteEpic,
    handleUpdateEpic
}) => {

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // ----- COMMENT STATES -----
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeEpicID, setActiveEpicID] = useState(null);
  const [commentsData, setCommentsData] = useState({}); // { epicID: [comment1, comment2] }

  // ----- HANDLE COMMENT SAVE -----
  const handleCommentSave = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await epicComments(activeEpicID, commentText);

      // Add comment to local UI
      setCommentsData(prev => ({
        ...prev,
        [activeEpicID]: [...(prev[activeEpicID] || []), commentText]
      }));

      setCommentText("");
      setShowCommentModal(false);

    } catch (error) {
      console.log("Comment Error:", error);
    }
  };

  return (
    <div className=" p-4  border border-black rounded-2xl shadow-lg/60 ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-black">Epics</h3>
      </div>

      <div className="space-y-2">

        {epics.map((e) => (
          <div key={e.id}>

            {/* ---- EPIC BOX ---- */}
            <div
              onClick={() => setSelectedEpic((prev) => (prev?.id === e.id ? null : e))}
              className={`p-3 rounded-lg cursor-pointer group
                ${selectedEpic?.id === e.id ? "bg-white" : "hover:bg-white/5"}
              `}
            >
              <div className="flex items-center border border-black p-2 rounded-2xl bg-gray-300 justify-between">
                <div>
                  <div className="font-medium text-black">{e.name}</div>
                  <div className="text-xs text-black">Epic ID: {e.id}</div>
                </div>

                <div className="flex items-center gap-2">

                  {/* ADD COMMENT BUTTON */}
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setActiveEpicID(e.id);
                      setShowCommentModal(true);
                    }}
                    className="bg-blue-600 text-xs p-1 rounded-xs cursor-pointer hover:scale-110"
                  >
                    Add Comment
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDeleteEpic(e.id);
                    }}
                    className="text-red-600 opacity-100 font-bold px-2 py-1 rounded hover:scale-110"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setEditData(e);
                      setShowEditModal(true);
                    }}
                    className="text-blue-700 hover:scale-110"
                  >
                    <SquarePen size={15} />
                  </button>

                </div>
              </div>
            </div>

            {/* ---- COMMENTS SECTION ---- */}
            {commentsData[e.id] && commentsData[e.id].length > 0 && (
              <div className="ml-5 mt-2">
                {commentsData[e.id].map((c, i) => (
                  <div key={i} className="text-sm bg-gray-200 p-1 rounded mb-1">
                    {c}
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* ---- COMMENT MODAL ---- */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] border border-black rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-black mb-3">
              Add Comment
            </h3>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border border-black text-black px-3 py-2 rounded h-24"
              placeholder="Type comment..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-400 text-black rounded"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-green-500 text-black rounded"
                onClick={handleCommentSave}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- EDIT MODAL ---- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] border border-black rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-black mb-3">Edit Epic</h3>

            <input
              className="w-full border border-black px-3 py-2 rounded mb-3 text-black"
              value={editData?.name || ""}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-400 text-black rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-green-500 text-black rounded"
                onClick={async () => {
                  await handleUpdateEpic(editData.id, { name: editData.name });
                  setShowEditModal(false);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Epic;
