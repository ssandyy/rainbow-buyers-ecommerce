import loading from "@/public/images/loading.svg"
import Image from "next/image"

const Loading = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Image src={loading.src} width={100} height={100} alt="loading" />
        </div>
    )
}

export default Loading