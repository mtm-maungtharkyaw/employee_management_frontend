const SelectBox = ({
    label = 'Select Option',
    options = [],
    value,
    onChange,
    disabled = false,
    name,
    containerClassName = '',
    inputClassName = '',
    labelClassName = '',
    errorMessage
}) => {
    return (
        <div className={`${containerClassName}`}>
            <div className={`form-control w-full flex items-end justify-between`}>
                <div>
                    <label htmlFor={name} className="label">
                        <span className={`label-text ${labelClassName}`}>{label}</span>
                    </label>
                </div>
                <div className="w-[70%]">
                    <select
                        name={name}
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value)
                        }}
                        disabled={disabled}
                        className={`select ${inputClassName} w-full bg-white border border-b-[#9c9c9c] rounded-none focus:outline-none focus:border-inherit`}
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

export default SelectBox;
