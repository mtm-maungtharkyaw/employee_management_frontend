import { IoMdClose } from "react-icons/io";

const Modal = ({
  form,
  error,
  onChangeName,
  onChangeDescription,
  onSubmit,
  onClose,
  isEdit = false
}) => {
  return (
    <div className="create-modal w-full h-full bg-black/20 flex justify-center items-center absolute top-0 left-0 z-50">
      <div className="bg-white rounded-sm p-5 w-[450px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Department" : "Create Department" }</h2>
          <button onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium label">Department Name</label>
          <input
            type="text"
            placeholder="Department Name"
            className="input border border-[#9c9c9c] bg-white w-full mt-1 p-2 rounded"
            value={form.name}
            onChange={(e) => onChangeName(e.target.value)}
          />
          {error?.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium label">Department Description</label>
          <input
            type="text"
            placeholder="Department Description"
            className="input border border-[#9c9c9c] bg-white w-full mt-1 p-2 rounded"
            value={form.description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
          {error?.description && (
            <p className="text-red-500 text-sm mt-1">{error.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="btn bg-gray-500 text-white border-none px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-[#4caf93] text-white border-none px-4 py-2 rounded"
            onClick={onSubmit}
          >
            { isEdit ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
