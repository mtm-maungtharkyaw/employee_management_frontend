import { IoAlertCircleOutline } from "react-icons/io5";

const DeleteConfirmModal = ({
    data = "",
    confirm = () => { },
    cancel = () => { }
}) => {
    return (
        <div className="create-modal w-full h-full bg-black/20 flex justify-center items-center absolute top-0 left-0 z-50">
            <div className="bg-white rounded-sm p-5 min-w-[350px] flex flex-col justify-center items-center">
                <span className="text-6xl text-[#FFC107]"><IoAlertCircleOutline /></span>
                <h1 className="mb-5 mt-2">Are You Sure To Delete <span className="font-semibold">{data}</span> ? </h1>
                <div className="flex space-x-5">
                    <button
                        className="btn bg-[#EF4444] text-white border-none px-4 py-2 rounded"
                        onClick={confirm}
                    >
                        Delete
                    </button>
                    <button
                        className="btn bg-gray-500 text-white border-none px-4 py-2 rounded"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal