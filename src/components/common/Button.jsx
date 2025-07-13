const Button = ({
    text = "Click Me",
    icon = null,
    onClick = () => { },
    className = ""
}) => {
    return (
        <button
            className={`btn bg-[#4caf93] text-white border-none flex items-center gap-2 ${className}`}
            onClick={onClick}
        >
            {text}
            {icon && icon}
        </button>
    );
};

export default Button;
