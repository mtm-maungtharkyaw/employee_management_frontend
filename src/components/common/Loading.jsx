const Loading = () => {
    return (
        <div className="bg-black/50 flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 z-1">
            <div className="w-[400px] rounded-sm bg-white p-5">
                <span className="loading loading-spinner loading-xl bg-dark-blue mr-5"></span>
                <span className="dark-blue">Loading...</span>
            </div>
        </div>
    )
}

export default Loading;