import React from 'react';

function CustomerFormControls({ name, label, type, options, handleChange, customer, placeholder, customerErrorState }) {
    switch (type) {
        case "text":
            return <div className="w-full">
                <label
                    htmlFor={name}
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                </label>
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={customer[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {
                    customerErrorState[name] && <p className="text-red-500 text-[12px] pt-1 pl-1">{customerErrorState[name]}</p>
                }
            </div>
        case "select":
            return <div className="w-full">
                <label
                    htmlFor={name}
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                </label>
                <select
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    // value={value}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {options.map((option) => <option value={option} className="w-full dark:bg-gray-600 dark:text-white">{option}</option>)}
                </select>
                {
                    customer[name] === "Others" && name === "sport" && <div className='w-full pt-4'>
                        <input type="text" name='othersport' value={customer["othersport"]} onChange={handleChange} placeholder='Enter Sport name' className='w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                }
                {
                    customerErrorState["othersport"] && name === "sport" && <p className="text-red-500 text-[12px] pt-1 pl-1">{customerErrorState["othersport"]}</p>
                }
                {
                    customerErrorState[name] && <p className="text-red-500 text-[12px] pt-1 pl-1">{customerErrorState[name]}</p>
                }
            </div>
    }
}

export default CustomerFormControls;