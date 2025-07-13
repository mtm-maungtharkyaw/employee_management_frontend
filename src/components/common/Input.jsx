import React from 'react';

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
    error = '',
    ...rest
}) => {
    return (
        <div className={`form-control w-full ${containerClassName}`}>
            {label && (
                <label htmlFor={name} className="label block mb-1">
                    <span className={`label-text ${labelClassName}`}>{label}</span>
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`input input-${size} text-black ${inputClassName}`}
                {...rest}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
