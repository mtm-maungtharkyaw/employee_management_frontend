// components
import Breadcrumbs from "../../components/Breadcrumbs"

// icons
import { BiSolidImageAdd } from "react-icons/bi"

// context
import { useAuth } from "../../contexts/AuthContext"


const BREADCRUMB_ITEMS = [{ label: "Profile" }]
const AdminProfile = () => {
    const { authUser } = useAuth()

    return (
        <>
            {/* Bread Crumb */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <div className="mb-3 flex space-x-5">
                    <div className="w-[300px] min-h-[300px] border border-[#e6e5e5] p-3 flex items-center justify-center">
                        <BiSolidImageAdd size={100} />
                    </div>

                    <div className="flex-1 border border-[#e6e5e5] p-3">

                        {/* name */}
                        <div className="from-control w-[500px] mb-3">
                            <div className="flex space-x-10 items-end">
                                <label className="label">
                                    <span className="label-text text-[#5c5c5c] text-sm">Name</span>
                                </label>
                                <div className="flex-1">
                                    <input 
                                        type="text"
                                        className="input input-sm border-0 border-b border-b-[#9c9c9c] w-full bg-white rounded-none"
                                        readOnly={true}
                                        value={authUser?.name}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* email */}
                        <div className="from-control w-[500px]">
                            <div className="flex space-x-10 items-end">
                                <label className="label">
                                    <span className="label-text text-[#5c5c5c] text-sm">Email</span>
                                </label>
                                <div className="flex-1">
                                    <input 
                                        type="text"
                                        className="input input-sm border-0 border-b border-b-[#9c9c9c] w-full bg-white rounded-none"
                                        readOnly={true}
                                        value={authUser?.email}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminProfile