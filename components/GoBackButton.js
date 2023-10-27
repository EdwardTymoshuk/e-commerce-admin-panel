import { useRouter } from "next/router"
import { IoIosArrowBack } from 'react-icons/io'

const GoBackButton = () => {
    const rounter = useRouter()
  return (
    <div>
        <button className="btn-no-bg text-dark-text-color" onClick={() => rounter.back()}><IoIosArrowBack size={18} /></button>
    </div>
  )
}

export default GoBackButton