import { SquarePen, Trash2, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
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

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentEpicId, setCurrentEpicId] = useState(null);

  const [openDropdownId, setOpenDropdownId] = useState(null); // For three-dot menu

  // Open comment modal
  const openCommentModal = (epicId) => {
    setCurrentEpicId(epicId);
    setCommentText('');
    setShowCommentModal(true);
    setOpenDropdownId(null);
  };

  // Save comment
  const saveComment = async () => {
    if (!commentText) return;
    try {
      const response = await epicComments(currentEpicId, commentText);
      console.log('Comment Added:', response);
      setShowCommentModal(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-4 border border-black rounded-2xl shadow-lg/60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-black">Epics</h3>
      </div>

      <div className="space-y-2">
        <div
          onClick={() => setSelectedEpic(null)}
          className={`p-2 rounded-lg cursor-pointer ${
            selectedEpic === null ? "bg-white/10" : "hover:bg-white/5"
          }`}
        ></div>

        {epics.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelectedEpic((prev) => (prev?.id === e.id ? null : e))}
            className={`p-3 rounded-lg cursor-pointer group ${
              selectedEpic?.id === e.id ? "bg-white" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center border border-black p-2 rounded-2xl bg-gray-300 justify-between relative">
              <div>
                <div className="font-medium text-black">{e.name}</div>
                <div className="text-xs text-black">Epic ID: {e.id}</div>
              </div>

              <div className="relative">
                {/* Three-dot menu */}
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setOpenDropdownId(openDropdownId === e.id ? null : e.id);
                  }}
                  className="p-1 rounded text-black hover:bg-gray-200"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown menu */}
                {openDropdownId === e.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-black rounded shadow-lg z-50">
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

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleDeleteEpic(e.id);
                        setOpenDropdownId(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 gap-1 text-red-600"
                    >
                      <Trash2 size={14} /> Delete
                    </button>

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openCommentModal(e.id);
                      }}
                      className="flex items-center text-black w-full px-3 py-2 text-sm hover:bg-gray-100 gap-1"
                    >
                       Add Comment
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
          placeholder="New epic title"
          value={createForm.type === "Epic" ? createForm.name : ""}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, type: "Epic", name: e.target.value }))
          }
          className="w-full border-black border text-black px-3 py-2 rounded-md text-sm"
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
              onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-1 bg-gray-400 text-black rounded" onClick={() => setShowEditModal(false)}>Cancel</button>
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

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] border border-black rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-black mb-3">Add Comment</h3>
            <textarea
              className="w-full border border-black px-3 py-2 rounded mb-3 text-black"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-1 bg-gray-400 text-black rounded" onClick={() => setShowCommentModal(false)}>Cancel</button>
              <button className="px-3 py-1 bg-green-500 text-black rounded" onClick={saveComment}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Epic;
