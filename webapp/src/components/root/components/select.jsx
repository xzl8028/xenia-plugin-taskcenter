import React, {Component} from 'react';

// props.name => destructuring {name}
const Select = ({
    name,
    value,
    options,
    onChange,
    small,
    disabled,
    label = '',
}) => {
    const className =
        small === true ? 'custom-select-sm ml-1' : 'custom-select';

    return (
        <React.Fragment>
            {small && <label htmlFor={name}>{label}</label>}
            <select
                id={name}
                name={name}
                className={className}
                onChange={onChange}
                value={value}
                disabled={disabled}
            >
                {!small && <option value=''/>}
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </React.Fragment>
    );
};

export default Select;
