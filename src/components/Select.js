import React from 'react';
import Select from 'react-select';

export default (array) => {
    if (array) {
        const customStyles = {
            menu: (provided, state) => ({
                ...provided,
                width: 300,
            }),
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#ad0426' : '#fff'
            }),
            control: (provided, state) => ({
                ...provided,
                borderRadius: 40,
                padding: '7px 13px',
                borderColor: state.isFocused ? '#ad0426' : '#ddd',
                boxShadow: 0
            }),
            container: (provided) => ({
                ...provided,
                width: 300,
            }),
        }
        return (
            <Select
                styles={customStyles}
                defaultValue={array.defaultValue}
                options={array.options}
            />
        )
    } else {
        return false
    }
};