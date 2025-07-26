import React from 'react'

// components
import Breadcrumbs from '../components/Breadcrumbs'
import Calendar from 'react-calendar'

// icons
import { FaUsers } from "react-icons/fa"

export default function Dashboard() {
    const breadcrumb_items = [{ label: 'Dashboard' }]
    return (
        <>
            <Breadcrumbs items={breadcrumb_items} />

            <div className='grid grid-cols-6 gap-5'>
                <div className='col-span-4'>
                    <div className='grid grid-cols-3 gap-5'>
                        <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                            <div className='bg-[#07257D] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                <FaUsers size={25} className="text-white" />
                            </div>
                            <div>
                                <p>Total Employee</p>
                                <span className='text-lg font-semibold'>10</span>
                            </div>
                        </div>
                        <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                            <div className='bg-[#07257D] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                <FaUsers size={25} className="text-white" />
                            </div>
                            <div>
                                <p>Total Employee</p>
                                <span className='text-lg font-semibold'>10</span>
                            </div>
                        </div>
                        <div className='rounded-sm bg-[#fefefe] py-5 flex justify-center items-center space-x-8'>
                            <div className='bg-[#07257D] w-[60px] h-[60px] rounded-full flex justify-center items-center'>
                                <FaUsers size={25} className="text-white" />
                            </div>
                            <div>
                                <p>Total Employee</p>
                                <span className='text-lg font-semibold'>10</span>
                            </div>
                        </div>

                    </div>
                    <div></div>
                </div>
                <div className='col-span-2'>
                    <div className="bg-white rounded-sm shadow-md p-4 max-w-sm">
                        {/* <Calendar /> */}
                    </div>
                </div>
            </div>
        </>
    )
}
