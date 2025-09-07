import Image from "next/image"

const Loading = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

export default Loading