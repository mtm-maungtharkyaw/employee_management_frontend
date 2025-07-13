import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const goToPage = (page) => {
        console.log(page)
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    const getVisiblePages = () => {
        const delta = 2
        const range = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            range.unshift('...')
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...')
        }

        range.unshift(1)
        if (totalPages > 1) {
            range.push(totalPages)
        }

        return range
    }

    const renderPages = () => {
        return getVisiblePages().map((page, idx) => {
            if (page === '...') {
                return (
                    <button
                        key={`ellipsis-${idx}`}
                        className="join-item btn btn-disabled bg-white text-gray-400 border border-gray-300 shadow-none"
                    >
                        ...
                    </button>
                )
            }

            return (
                <button
                    key={page}
                    className={`join-item btn ${
                        currentPage === page
                            ? 'bg-soft-green text-white border-none'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-none'
                    }`}
                    onClick={() => goToPage(page)}
                >
                    {page}
                </button>
            )
        })
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-end mt-4">
            <div className="join">
                <button
                    className="join-item btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-none"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>

                {renderPages()}

                <button
                    className="join-item btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-none"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    )
}

export default Pagination
