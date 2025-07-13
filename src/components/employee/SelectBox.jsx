const SelectBox = ({
    label = 'Select Option',
    options = [],
    value,
    onChange,
    size = 'md',
    disabled = false,
    name,
    containerClassName = '',
    inputClassName = '',
    labelClassName = ''
}) => {
    return (
        <div className={`form-control w-full flex items-end ${containerClassName}`}>
            <div className="w-[30%]">
                <label htmlFor={name} className="label">
                    <span className={`label-text ${labelClassName}`}>{label}</span>
                </label>
            </div>
            <div className="w-[70%]">
                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`input input-${size} ${inputClassName} w-full bg-white border border-b-[#9c9c9c] rounded-none`}
                >
                    <option value="" disabled>{label}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectBox;
