import React from 'react'

const Epic = ({
    epics,
selectedEpic,
setSelectedEpic,
createForm,
setCreateForm,
handleCreateItem
}) => {
  return (
    <div className=" p-4  border border-black rounded-2xl shadow-lg/60 ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-black">Epics</h3>
        {/* <small className="text-xs text-gray-400">{epics.length}</small> */}
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
            onClick={() => {
              setSelectedEpic((prev) => (prev && prev.id === e.id ? null : e));
              console.log(selectedEpic, "10000000");
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedEpic?.id === e.id
                ? "bg-white"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center border border-black p-2 rounded-2xl bg-gray-300 justify-between">
              <div>
                <div className="font-medium text-black">{e.name}</div>
                <div className="text-xs text-black">Epic ID: {e.id}</div>
              </div>
              <div className="text-xs text-purple-200">●</div>
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
            setCreateForm((prev) => ({
              ...prev,
              type: "Epic",
              name: e.target.value,
            }))
          }
          className="w-full border-black border text-black px-3 py-2 rounded-md text-sm"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleCreateItem}
            className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
          >
            Add Epic
          </button>
        </div>
      </div>
    </div>
    
  )
}

export default Epic