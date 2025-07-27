import { useEffect, useState } from 'react'

// react router dom
import { useNavigate } from 'react-router-dom'

// images
import announceImg from '../../assets/images/announce.jpg'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Loading from '../../components/common/Loading'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'

// icons
import { IoAddCircle } from "react-icons/io5"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin5Line } from "react-icons/ri"

// axios instance
import axiosInstance from "../../api/axiosInstance"

// toastify
import { ToastContainer, toast } from 'react-toastify'

// moment
import moment from 'moment'

import { marked } from 'marked'

// editor
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

// auth context
import { useAuth } from '../../contexts/AuthContext'

// Auth Roles
import { AUTH_ROLES } from '../../constants/role'

const BREADCRUMB_ITEMS = [{ label: "Announcements" }]

const Announcement = () => {
	const { authUser } = useAuth()
	const navigate = useNavigate()
	const [announcements, setAnnouncements] = useState([])
	const [pagination, setPagination] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [editAnnouncement, setEditAnnouncement] = useState(null)
	const [modalVisible, setModalVisible] = useState(false)
	const [annoucementToDelete, setAnnouncementToDelete] = useState(null)

	const showToast = (type = "success", message) => {
		if (type === "success") {
			toast.success(message)
		} else if (type === "error") {
			toast.error(message)
		}
	}

	const goToCreatePage = () => {
		navigate("/announcement/create")
	}

	const fetchAnnouncement = async (page = 1, limit = 10) => {
		setIsLoading(true)
		try {
			const { announcements, pagination } = await axiosInstance.post('/announcement/get-list', {
				page,
				limit
			})
			console.log(announcements)
			setAnnouncements(announcements)
			setPagination(pagination)
		} catch (error) {
			console.error(error)
			if (error.response) {
				const message = error.response.data.message
				showToast("error", message)
			} else {
				console.log("reached this")
				showToast("error", "Something Went Wrong")
			}
		} finally {
			setIsLoading(false)
		}
	}

	const onEditAnnouncement = (index) => {
		if (editAnnouncement) return

		if (index < 0 || index >= announcements.length) return;
		const annoucement = announcements[index]
		setEditAnnouncement(annoucement)
	}

	const onEditAnnouncementContent = (value) => {
		setEditAnnouncement(prev => ({
			...prev,
			content: value
		}))
	}

	const openDeleteModal = (index) => {
		console.log("opening delete modal")
		if (index < 0 || index >= announcements.length) return;
		const annoucementToDelete = announcements[index]
		setModalVisible(true)
		setAnnouncementToDelete(annoucementToDelete)
	}

	const closeDeleteModal = () => {
		setModalVisible(false)
		setAnnouncementToDelete(null)
	}

	const onPageChange = async (page) => {
		fetchAnnouncement(page, pagination.limit)
	}

	const onDeleteAnnouncement = async (index) => {
		try {
			const deletedAnnouncement = await axiosInstance.delete(`/announcement/delete/${annoucementToDelete._id}`)
			fetchAnnouncement()
			showToast("success", "Successfully Deleted Announcement")
		} catch (error) {
			console.error(error)
			if (error.response) {
				const message = error.response.data.message
				showToast("error", message)
			} else {
				console.log("reached this")
				showToast("error", "Something Went Wrong")
			}
		} finally {
			closeDeleteModal()
		}
	}

	const onUpdateAnnouncement = async () => {
		if (!editAnnouncement) return
		try {
			const updatedAnnouncement = await axiosInstance.put(`/announcement/update/${editAnnouncement._id}`, {
				content: editAnnouncement.content
			})

			setAnnouncements(prevAnnouncements => {
				const newAnnouncements = prevAnnouncements.map(announcement => {
					return announcement._id === updatedAnnouncement._id ? updatedAnnouncement : announcement
				})
				return newAnnouncements
			})
		} catch (error) {
			console.error(error)
			if (error.response) {
				const message = error.response.data.message
				showToast("error", message)
			} else {
				console.log("reached this")
				showToast("error", "Something Went Wrong")
			}
		} finally {
			onCancelEdit()
		}
	}

	const onCancelEdit = () => {
		setEditAnnouncement(null)
	}

	useEffect(() => {
		fetchAnnouncement()
	}, [])

	return (
		<>
			{modalVisible && (
				<DeleteConfirmModal
					cancel={closeDeleteModal}
					confirm={onDeleteAnnouncement}
				/>
			)}

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

			{/* Breadcrumb */}
			<Breadcrumbs items={BREADCRUMB_ITEMS} />

			{/* Loading */}
			{isLoading && <Loading />}

			{
				authUser.role === AUTH_ROLES.ADMIN && (
					<div className='flex justify-end mb-4'>
						<div>
							<Button
								text='Create'
								onClick={goToCreatePage}
								icon={<IoAddCircle size={22} />}
							/>
						</div>
					</div>
				)
			}

			{(!isLoading && announcements.length == 0) && <h1>There is no announcement lists</h1>}

			{(!isLoading && announcements.length > 0) && announcements.map((announcement, index) => (
				<div key={announcement._id} className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-6 mb-3">
					<div className='flex justify-between mb-5'>
						<div>
							<div className='flex space-x-2 items-center'>
								<img src={announceImg} className='w-[40px] rounded-full' alt="Announce Img" />
								<div>
									<h2 className='text-lg font-semibold'>Various Announcement</h2>
									<span className='text-sm'>{moment(announcement.createdAt).format('MMM DD, YYYY')}</span>
								</div>
							</div>
						</div>
						<div>
							{authUser.role === AUTH_ROLES.ADMIN && (
								<div className='flex space-x-2'>
									<button onClick={() => onEditAnnouncement(index)}><FaEdit size={18} className='text-[#25a8fa] cursor-pointer' /></button>
									<button onClick={() => openDeleteModal(index)}><RiDeleteBin5Line size={18} className='text-[#f73643] cursor-pointer' /></button>
								</div>
							)}
						</div>
					</div>
					{
						(editAnnouncement && editAnnouncement._id === announcement._id) ? (
							<div>
								<SimpleMDE value={editAnnouncement.content} onChange={onEditAnnouncementContent} />
								<div className="flex justify-end mt-2">
									<button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={onUpdateAnnouncement}>Update</button>
									<button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={onCancelEdit}>Cancel</button>
								</div>
							</div>
						) : (
							<div
								className="markdown-preview"
								dangerouslySetInnerHTML={{ __html: marked(announcement?.content) }}
							/>
						)
					}
				</div>
			))}

			{(!isLoading && announcements.length > 0) && (
				<Pagination
					currentPage={pagination.page}
					totalPages={pagination.totalPages}
					onPageChange={onPageChange}
				/>
			)}
		</>
	)
}

export default Announcement