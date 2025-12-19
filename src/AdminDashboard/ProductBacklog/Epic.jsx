import { SquarePen, Trash2, MoreVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { epicComments, getEpicComments } from "../../Api/projectAPI";

const Epic = ({
  epics,
  selectedEpic,
  setSelectedEpic,
  epicForm,
  setEpicForm,
  handleCreateItem,
  handleDeleteEpic,
  handleUpdateEpic,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsEpic, setDetailsEpic] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Load comments for selected epic
  const loadComments = async (id) => {
    try {
      const res = await getEpicComments(id);
      setCommentsList(res || []);
    } catch (err) {
      console.log("Error loading comments", err);
    }
  };

  const saveComment = async () => {
  if (!commentText.trim()) {
    alert("Comment cannot be empty");
    return;
  }

  try {
    const res = await epicComments(detailsEpic.id, commentText);
    console.log(res);
    setCommentText("");
    fetchComments(detailsEpic.id);
  } catch (err) {
    console.log("Error Saving Comment:", err);
  }
};


  const fetchComments = async () => {
    try {
      const res = await getEpicComments(detailsEpic.id);
      console.log(res);
      setCommentsList(res || []);
    } catch (err) {
      console.log("Error Fetching Comments:", err);
    }
  };

  useEffect(() => {
    if (detailsEpic?.id) {
      fetchComments(detailsEpic.id);
    }
  }, [detailsEpic]);

  return (
    <div className="p-4 border border-black rounded-2xl shadow-lg/60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-black  ">Epics</h3>
      </div>

      {/* List */}
      <div className="space-y-2 h-[40vh] overflow-auto">
        <div
          onClick={() => setSelectedEpic(null)}
          className={`p-2 rounded-lg cursor-pointer ${
            selectedEpic === null ? "bg-white/10" : "hover:bg-white/5"
          }`}
        ></div>

        {epics.map((e) => (
          <div
            key={e.id}
            onClick={() =>
              setSelectedEpic((prev) => (prev?.id === e.id ? null : e))
            }
            className={`p-3 rounded-lg cursor-pointer  group ${
              selectedEpic?.id === e.id ? "bg-white" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center  border border-black p-2 rounded-2xl bg-gray-300 justify-between relative">
              <div>
                <div className="font-medium  text-black capitalize">
                  <p>Name:<span className="text-blue-700">{e.name}</span> </p>
                  <p>Description:<span className="text-blue-700">{e.description}</span> </p>
                </div>
              </div>

              {/* Menu */}
              <div className="">
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setOpenDropdownId(openDropdownId === e.id ? null : e.id);
                  }}
                  className=" -ml-3 rounded text-black hover:bg-gray-200"
                >
                  <MoreVertical size={16} />
                </button>

                {openDropdownId === e.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-black rounded shadow-lg z-50">
                    {/* Edit */}
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setEditData(e);
                        setShowEditModal(true);
                        setOpenDropdownId(null);
                      }}
                      className="flex items-center w-full text-black px-3 py-2 text-sm hover:bg-gray-100 gap-1"
                    >
                      <SquarePen size={14} /> Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();

                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this epic?"
                        );

                        if (!confirmDelete) return;

                        handleDeleteEpic(e.id);
                        setOpenDropdownId(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 gap-1 text-red-600"
                    >
                      <Trash2 size={14} /> Delete
                    </button>

                    {/* View Details — replaces Add Comment */}
                    <button
                      onClick={async (ev) => {
                        ev.stopPropagation();
                        setDetailsEpic(e);
                        setShowDetailsModal(true);
                        setOpenDropdownId(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick add epic */}
      <div className="mt-4">
        <input
  placeholder="Epic title"
  value={epicForm.name}
  onChange={(e) =>
    setEpicForm((prev) => ({
      ...prev,
      name: e.target.value,
    }))
  }
  className="w-full border-black border text-black px-3 py-2 rounded-md text-sm mb-2"
/>
<textarea
  placeholder="Epic description"
  value={ epicForm.description}
  onChange={(e) =>
    setEpicForm((prev) => ({
      ...prev,
      description: e.target.value, // ✅ EPIC DESCRIPTION
    }))
  }
  className="w-full border-black border text-black px-3 py-2 rounded-md text-sm mb-2"
/>


        <div className="mt-2 flex justify-between">
          <small className="text-xs text-black">{epics.length} items</small>
          <button
            onClick={handleCreateItem}
            className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
          >
            Add Epic
          </button>
        </div>
      </div>

      {/* Edit Epic Modal */}
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

      {/* DETAILS MODAL — includes comments */}
      {showDetailsModal && detailsEpic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] border border-black rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-black mb-3">
              Epic Details
            </h3>

            <p className="text-black font-medium">Name: {detailsEpic.name}</p>
            <p className="text-black text-sm mb-4">Epic ID: {detailsEpic.id}</p>

            <h4 className="text-black font-semibold mb-2">Comments</h4>

            {/* Show comments */}
            <div className="max-h-32 overflow-auto border border-gray-400 p-2 rounded mb-3 bg-gray-100">
              {commentsList.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                commentsList.map((c, i) => (
                  <div key={i} className="border-b pb-2 mb-2">
                    <p className="text-black font-semibold text-sm">
                      {c.author_name || "Unknown User"}
                    </p>
                    <p className="text-black text-sm">{c.comment}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(c.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add comment */}
            <textarea
              className="w-full border border-black px-3 py-2 rounded mb-2 text-black"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-400 text-black rounded"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>

              <button
                className="px-3 py-1 bg-green-500 text-black rounded"
                onClick={saveComment}
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Epic;
