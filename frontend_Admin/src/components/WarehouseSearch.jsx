import React, { useState } from 'react';
import useWarehouse from '../contexts/useWarehouse';

const WarehouseSearch = ({ selectedWarehouse, setSelectedWarehouse }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { warehouses } = useWarehouse();
    const warehouseFilter = (warehouse) => {
        const regex = new RegExp(searchQuery, 'i');
        return regex.test(warehouse.name)
    }
    return (
        <div className="p-2 dark:text-white text-black">
            <div className="mb-4 flex flex-col md:flex-row items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 rounded-lg w-full placeholder:text-sm text-sm dark:bg-black dark:text-white text-black bg-white shadow-md"
                />
            </div>
            <div>
                {warehouses.length > 0 ? (
                    <ul className="bg-white dark:bg-black max-h-[150px] overflow-y-auto rounded-md shadow-md p-4 dark:text-white text-black">
                        {warehouses.map((warehouse) => warehouseFilter(warehouse) && (
                            <li
                                key={warehouse._id}
                                onClick={() => setSelectedWarehouse(warehouse)}
                                className={`p-2 border-b border-gray-300 dark:border-gray-700 cursor-pointer ${selectedWarehouse?._id === warehouse._id ? 'bg-primary text-white' : ''
                                    }`}
                            >
                                {warehouse.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No warehouses found. Try a different search query.</p>
                )}
            </div>
            {selectedWarehouse && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold dark:text-white text-black">
                        Selected Warehouse: {selectedWarehouse.name}
                    </h3>
                </div>
            )}
        </div>
    );
};

export default WarehouseSearch;
