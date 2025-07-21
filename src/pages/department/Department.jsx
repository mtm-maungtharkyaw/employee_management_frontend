import { useEffect, useState } from 'react';

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Modal from '../../components/department/Modal'
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
import { validateData } from '../../utils/helper';

const BREADCRUMB_ITEMS = [{
    label: "Department"
}]

const Department = () => {
    const [departments, setDepartments] = useState([])
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
        description: ''
    })
    const [modal, setModal] = useState({
        visible: false,
        isEdit: false
    })
    const [departmentToDelete, setDepartmentToDelete] = useState(null)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        description: ''
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
        if (index < 0 || index >= departments.length) return;
        const editDepartment = departments[index];

        setModal({
            visible: true,
            isEdit: true
        });

        setForm({
            id: editDepartment._id,
            name: editDepartment.name,
            description: editDepartment.description
        });
    };

    const openDeleteModal = (index) => {
        if (index < 0 || index >= departments.length) return;
        const department = departments[index];
        setIsDeleteModalVisible(true)
        setDepartmentToDelete(department)
    }

    const closeDeleteModal = (index) => {
        setIsDeleteModalVisible(false)
        setDepartmentToDelete(null)
    }


    const closeModal = () => {
        setForm({
            name: '',
            description: ''
        })
        setErrors({
            name: '',
            description: ''
        })
        setModal({
            id: '',
            visible: false,
            isEdit: false
        })
    }

    const clearSearchOptions = () => {
        setSearchOptions({
            name: ""
        })
    }

    const fetchDepartments = async (page = 1, limit = 10, name = "") => {
        setIsLoading(true)
        try {
            const dep_data = await axiosInstance.post('/department', {
                page,
                limit,
                name
            })
            setDepartments(dep_data.list)
            setPagination(dep_data.pagination)
        } catch (error) {
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

    const searchDepartments = () => {
        fetchDepartments(1, pagination.limit, searchOptions.name)
    }

    const createDepartment = async () => {
        const formData = {
            name: form.name,
            description: form.description
        }

        const validationSchema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(500).allow('')
        })

        const validationErrors = validateData(validationSchema, formData)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        try {
            await axiosInstance.post('department/create', formData)
            showToast("success", "Successfully Created department")
            clearSearchOptions()
            fetchDepartments(1, pagination.limit)
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

    const updateDepartment = async () => {
        const formData = {
            name: form.name,
            description: form.description
        }

        const validationSchema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(500).allow('')
        })

        const validationErrors = validateData(validationSchema, formData)

        if (validationErrors) {
            setErrors(validationErrors)
            return
        }

        try {
            await axiosInstance.put(`/department/${form.id}`, formData)
            showToast("success", "Successfully Updated Department")
            clearSearchOptions()
            fetchDepartments(1, pagination.limit)
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

    const deletDepartment = async () => {
        const id = departmentToDelete._id
        closeDeleteModal()
        try {
            await axiosInstance.delete(`/department/${id}`)
            showToast("success", "Successfully Deleted department")
            clearSearchOptions()
            fetchDepartments(1, pagination.limit)
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
        fetchDepartments(page, pagination.limit, searchOptions.name)
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

    const onChangeSearchName = (name) => {
        setSearchOptions(prev => ({
            ...prev,
            name
        }))
    }

    useEffect(() => {
        showToast()
        fetchDepartments(pagination.page, pagination.limit)
    }, [])

    useEffect(() => {
        console.log(errors)
    }, [errors])

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
                    onClose={closeModal}
                    onSubmit={modal.isEdit ? updateDepartment : createDepartment}
                    isEdit={modal.isEdit}
                />
            )}

            {/* Confirm Modal */}
            {isDeleteModalVisible && (
                <DeleteConfirmModal
                    data={departmentToDelete.name}
                    cancel={closeDeleteModal}
                    confirm={deletDepartment}
                />
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className='flex justify-between items-end mb-4'>
                {/* Filter Options */}
                <div className='filter flex items-end space-x-2'>
                    <div>
                        <input type="text" placeholder="Department Name" className="input bg-white w-[200px]" onChange={(e) => onChangeSearchName(e.target.value)} />
                    </div>
                    <Button
                        text='Search'
                        onClick={searchDepartments}
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
            {(!isLoading && departments.length == 0) && (
                <h1>There is no department lists</h1>
            )}
            {(!isLoading && departments.length > 0) && (
                <div>
                    <div className="overflow-x-auto rounded-sm border border-[#e6e5e5] bg-[#fefefe]">
                        <table className='table'>
                            {/* head */}
                            <thead className="bg-gray-100 text-[#00836b] text-sm font-bold">
                                <tr>
                                    <th>No</th>
                                    <th>Department Name</th>
                                    <th>Department Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {departments.map((department, index) => (
                                    <tr key={department._id} className="hover:bg-gray-50 border-b border-[#e6e5e5]">
                                        <th>{(pagination.page - 1) * pagination.limit + index + 1}</th>
                                        <td>{department.name}</td>
                                        <td>{department.description}</td>
                                        <td>
                                            <div className='flex space-x-3'>
                                                <button onClick={() => openEditModal(index)}><FaEdit size={18} className='text-[#25a8fa]' /></button>
                                                <button onClick={() => openDeleteModal(index)}><RiDeleteBin5Line size={18} className='text-[#f73643]' /></button>
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

export default Department