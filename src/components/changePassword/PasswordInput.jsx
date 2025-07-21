import { useState } from "react"

// icons
import { VscEye, VscEyeClosed } from "react-icons/vsc"

const PasswordInput = ({
    customClass,
    label,
    name,
    value,
    onChangeValue,
    error
}) => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisible = () => {
        setIsVisible(prev => !prev)
    }

    return (
        <div className={customClass}>
            <label htmlFor={name}>{label}</label>
            <div className="relative mt-2">
                <input
                    id={name}
                    className="input input-md w-full tracking-widest font-semibold"
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                />
                <button onClick={toggleVisible} className="absolute z-5 top-1/2 right-5 translate-y-[-50%] cursor-pointer">
                    {isVisible ? <VscEyeClosed size={18}/> : <VscEye size={18}/>}
                </button>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}

export default PasswordInput