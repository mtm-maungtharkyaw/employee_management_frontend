// react
import { useState, useEffect } from 'react'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Modal from '../../components/position/Modal'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin5Line } from "react-icons/ri"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// joi validation
import Joi from 'joi';

// helper
import { validateData } from '../../utils/helper'

const BREADCRUMB_ITEMS = [{
    label: "position"
}]

const Position = () => {
    const [positions, setPositions] = useState([])
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1
    })

    const [searchOptions, setSearchOptions] = useState({
        name: ''
    })

    const [form, setForm] = useState({
        id: '',
        name: '',
        salary: '',
        description: ''
    })

    const [modal, setModal] = useState({
        visible: false,
        isEdit: false
    })

    const [positionToDelete, setPositionToDelete] = useState(null)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        salary: ''
    })

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const openCreateModal = () => {
        setModal({
            visible: true,
            isEdit: false
        })
    }

    const openEditModal = (index) => {
        if (index < 0 || index >= positions.length) return
        const editPosition = positions[index]

        setModal({
            visible: true,
            isEdit: true
        });

        setForm({
            id: editPosition._id,
            name: editPosition.name,
            salary: editPosition.basic_salary,
            description: editPosition.description
        });
    }

    const closeModal = () => {
        setForm({
            name: '',
            description: '',
            salary: ''
        })
        setErrors({
            name: '',
            description: '',
            salary: ''
        })
        setModal({
            id: '',
            visible: false,
            isEdit: false
        })
    }

    const openDeleteModal = (index) => {
        if (index < 0 || index >= positions.length) return
        const position = positions[index]

        setIsDeleteModalVisible(true)
        setPositionToDelete(position)
    }

    const closeDeleteModal = (index) => {
        setIsDeleteModalVisible(false)
        setPositionToDelete(null)
    }

    const clearSearchOptions = () => {
        setSearchOptions({
            name: ""
        })
    }

    const onChangeName = (name) => {
        setForm(prev => ({
            ...prev,
            name: name
        }))
    }

    const onChangeDescription = (description) => {
        setForm(prev => ({
            ...prev,
            description: description
        }))
    }

    const onChangeSalary = (salary) => {
        setForm(prev => ({
            ...prev,
            salary: salary
        }))
    }

    const onChangeSearchName = (name) => {
        setSearchOptions(prev => ({
            ...prev,
            name
        }))
    }

    const fetchPositions = async (page = 1, limit = 10, name = "") => {
        setIsLoading(true)
        try {
            const position_data = await axiosInstance.post('/position', {
                page,
                limit,
                name
            })
            console.log(position_data)
            setPositions(position_data.list)
            setPagination(position_data.pagination)
        } catch (error) {
            console.error(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", "Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const searchPositions = () => {
        fetchPositions(1, pagination.limit, searchOptions.name)
    }

    const createPosition = async () => {
        const formData = {
            name: form.name,
            salary: form.salary,
            description: form.description
        }

        const validationSchema = Joi.object({
            name: Joi.string().max(100).required().messages({
                'string.empty': 'Name is required.',
                'any.required': 'Name is required.',
                'string.max': 'Name must be at most 100 characters.'
            }),
            salary: Joi.number().min(0).required().messages({
                'number.base': 'Basic Salary must be a number.',
                'number.min': 'Basic Salary cannot be negative.',
                'any.required': 'Basic Salary is required.'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Description must be at most 500 characters.'
            })
        })

        const validationErrors = validateData(validationSchema, formData)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        try {
            await axiosInstance.post('position/create', {
                name: form.name,
                basic_salary: form.salary,
                description: form.description
            })
            showToast("success", "Successfully Created Position")
            clearSearchOptions()
            fetchPositions(1, pagination.limit)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            closeModal()
        }
    }

    const updatePosition = async () => {
        const formData = {
            name: form.name,
            salary: form.salary,
            description: form.description
        }

        const validationSchema = Joi.object({
            name: Joi.string().max(100).required().messages({
                'string.empty': 'Name is required.',
                'any.required': 'Name is required.',
                'string.max': 'Name must be at most 100 characters.'
            }),
            salary: Joi.number().min(0).required().messages({
                'number.base': 'Basic Salary must be a number.',
                'number.min': 'Basic Salary cannot be negative.',
                'any.required': 'Basic Salary is required.'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Description must be at most 500 characters.'
            })
        })

        const validationErrors = validateData(validationSchema, formData)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        try {
            await axiosInstance.put(`/position/${form.id}`, {
                name: form.name,
                basic_salary: form.salary,
                description: form.description
            })
            showToast("success", "Successfully Updated Position")
            clearSearchOptions()
            fetchPositions(1, pagination.limit)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        } finally {
            closeModal()
        }
    }

    const deletePosition = async () => {
        const id = positionToDelete._id
        closeDeleteModal()
        try {
            await axiosInstance.delete(`/position/${id}`)
            showToast("success", "Successfully Deleted position")
            clearSearchOptions()
            fetchPositions(1, pagination.limit)
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                showToast("error", error.message)
            }
        }
    }

    const onPageChange = async (page) => {
        fetchPositions(page, pagination.limit, searchOptions.name)
    }


    useEffect(() => {
        fetchPositions(pagination.page, pagination.limit)
    }, [])

    useEffect(() => {
        console.log(form)
    }, [form])

    return (
        <>
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Loading */}
            {isLoading && <Loading />}

            {/* Create / Edit Modal */}
            {modal.visible && (
                <Modal
                    form={form}
                    error={errors}
                    onChangeName={onChangeName}
                    onChangeDescription={onChangeDescription}
                    onChangeSalary={onChangeSalary}
                    onClose={closeModal}
                    onSubmit={modal.isEdit ? updatePosition : createPosition}
                    isEdit={modal.isEdit}
                />
            )}

            {/* Confirm Modal */}
            {isDeleteModalVisible && (
                <DeleteConfirmModal
                    data={positionToDelete.name}
                    cancel={closeDeleteModal}
                    confirm={deletePosition}
                />
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className='flex justify-between items-end mb-4'>
                {/* Filter Options */}
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <input type="text" placeholder="Position Name" className="input bg-white w-[200px]" onChange={(e) => onChangeSearchName(e.target.value)} />
                    </div>
                    <Button
                        text='Search'
                        onClick={searchPositions}
                    />
                </div>
                <div>
                    <Button
                        text='Add'
                        onClick={openCreateModal}
                        icon={<IoAddCircle size={22} />}
                    />
                </div>
            </div>

            {(!isLoading && positions.length == 0) && (
                <h1>There is no Position lists</h1>
            )}

            {(!isLoading && positions.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className='table'>
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Position Name</th>
                                    <th>Basic Salary</th>
                                    <th>Position Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {positions.map((position, index) => (
                                    <tr key={position._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                        <td>{position.name}</td>
                                        <td><span className='font-semibold'>{position.basic_salary.toLocaleString()}</span> MMK</td>
                                        <td>{position.description}</td>
                                        <td>
                                            <div className='flex space-x-3'>
                                                <button onClick={() => openEditModal(index)} className='cursor-pointer'><FaEdit size={18} className='text-[#25a8fa]' /></button>
                                                <button onClick={() => openDeleteModal(index)} className='cursor-pointer'><RiDeleteBin5Line size={18} className='text-[#f73643]' /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </>
    )
}

export default Position