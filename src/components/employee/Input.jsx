const Input = ({
    label = '',
    name = '',
    type = 'text',
    placeholder = '',
    value,
    onChange = () => { },
    size = 'md',
    inputClassName = '',
    labelClassName = '',
    containerClassName = '',
    errorMessage,
    ...rest
}) => {
    return (
        <div className={`form-control w-full ${containerClassName}`}>
            <div className="flex items-center">
                <div className="w-[30%]">
                    <label htmlFor={name} className="label">
                        <span className={`label-text ${labelClassName}`}>{label}</span>
                    </label>
                </div>
                <div className="w-[70%]">
                    <input
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`input input-${size} ${inputClassName} w-full bg-white border border-b-[#9c9c9c] rounded-none`}
                        {...rest}
                    />
                </div>
            </div>
            {
                errorMessage && (
                    <div className="flex">
                        <div className="w-[30%]"></div>
                        <div>
                            <small className="text-[#fc1303]">{errorMessage}</small>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Input;
