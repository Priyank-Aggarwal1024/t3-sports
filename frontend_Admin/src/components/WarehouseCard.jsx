// import React, { useState } from 'react';
// import useWarehouse from '../contexts/useWarehouse';
// import useProducts from '../contexts/useProducts';
// import { MdDelete } from "react-icons/md";
// import { IoMdClose, IoMdAdd } from "react-icons/io";

// function WarehouseCard(props) {
//     const { products, getProductById } = useProducts();
//     const { warehouses, deleteWarehouse, addProductInWarehouse, wloading } = useWarehouse();
//     const [selectedProductId, setSelectedProductId] = useState(null);
//     const handleAddProduct = (pid) => {

//     };
//     const handleRemoveProduct = (pid) => {

//     }
//     return (
//         <>
//             {warehouses && <div className="mb-12">
//                 <h2 className="text-3xl font-bold dark:text-white text-black mb-6">Our Warehouses</h2>
//                 {wloading ? <div className="text-white text-xl">Loading...</div> : warehouses.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {warehouses.map((warehouse) => (
//                         <div
//                             key={warehouse._id}
//                             className="bg-white dark:bg-darkPrimary shadow-lg rounded-md p-6 transition-transform transform "
//                         >
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-xl font-semibold text-black dark:text-white mb-4">{warehouse.name}</h3>
//                                 <button
//                                     onClick={() => deleteWarehouse(warehouse._id)}
//                                     className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition duration-200"
//                                 >
//                                     <MdDelete />
//                                 </button>
//                             </div>
//                             <hr className="my-8" />
//                             <ul className="space-y-3">
//                                 {warehouse.products.map((product) => (
//                                     <li key={product._id} className="flex justify-between items-center">
//                                         <span className="font-medium text-black dark:text-white">{getProductById(product.productId)?.name}</span>
//                                         <span className="text-primary font-semibold">${getProductById(product.productId)?.price}</span>
//                                         <button
//                                             onClick={() => handleRemoveProduct(warehouse._id, product._id)}
//                                             className="bg-red-500 hover:bg-red-600 text-white rounded-md py-1 px-2 ml-4"
//                                         >
//                                             <IoMdClose />
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                             <div className="mt-4 flex gap-2">
//                                 <select
//                                     name={warehouse._id}
//                                     value={selectedProductId || ""}
//                                     onChange={(e) => setSelectedProductId(e.target.value)}
//                                     className="border rounded-md w-full text-sm pl-2 hover:cursor-pointer"
//                                 >
//                                     <option value="" disabled>
//                                         Select product to add
//                                     </option>
//                                     {products.map((product) => (
//                                         <option key={warehouse._id} value={product._id}>
//                                             {product.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <button
//                                     onClick={() => addProductInWarehouse(warehouse._id, selectedProductId)}
//                                     className=" bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition duration-200"
//                                 >
//                                     <IoMdAdd />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div> : <p className="text-center text-black dark:text-white">No Warehouse found.</p>
//                 }
//             </div>}
//         </>
//     );
// }

// export default WarehouseCard;


import React, { useState } from 'react';
import useWarehouse from '../contexts/useWarehouse';
import useProducts from '../contexts/useProducts';
import { MdDelete } from "react-icons/md";
import { IoMdClose, IoMdAdd } from "react-icons/io";

function WarehouseCard() {
    const { products, getProductById } = useProducts();
    const { warehouses, deleteWarehouse, addProductInWarehouse, wloading, removeProductInWarehouse } = useWarehouse();
    const [selectedProducts, setSelectedProducts] = useState({}); // Track selected product per warehouse
    console.log(selectedProducts)
    // Handle product addition
    const handleAddProduct = (warehouseId) => {
        const productId = selectedProducts[warehouseId];
        if (productId) {
            addProductInWarehouse(warehouseId, productId);
            setSelectedProducts((prev) => ({ ...prev, [warehouseId]: "" }));
        }
    };

    // Handle product removal
    const handleRemoveProduct = (warehouseId, productId) => {
        if (productId) {
            removeProductInWarehouse(warehouseId, productId);
            setSelectedProducts((prev) => ({ ...prev, [warehouseId]: "" }));
        }
    };

    return (
        <>
            {warehouses && (
                <div className="mb-12">
                    <h2 className="text-3xl font-bold dark:text-white text-black mb-6">Our Warehouses</h2>
                    {wloading ? (
                        <div className="text-white text-xl">Loading...</div>
                    ) : warehouses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {warehouses.map((warehouse) => (
                                <div
                                    key={warehouse._id}
                                    className="bg-white dark:bg-darkPrimary shadow-lg rounded-md p-6 transition-transform transform"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                                            {warehouse.name}
                                        </h3>
                                        <button
                                            onClick={() => deleteWarehouse(warehouse._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition duration-200"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                    <hr className="my-8" />
                                    <ul className="space-y-3">
                                        {warehouse.products.map((product) => (
                                            <li key={product._id} className="flex justify-between items-center">
                                                <span className="font-medium text-black dark:text-white">
                                                    {getProductById(product.productId)?.name}
                                                </span>
                                                <span className="text-primary font-semibold">
                                                    ${getProductById(product.productId)?.price}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveProduct(warehouse._id, product.productId)}
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-md py-1 px-2 ml-4"
                                                >
                                                    <IoMdClose />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 flex gap-2">
                                        <select
                                            name={warehouse._id}
                                            value={selectedProducts[warehouse._id] || ""}
                                            onChange={(e) =>
                                                setSelectedProducts((prev) => ({
                                                    ...prev,
                                                    [warehouse._id]: e.target.value,
                                                }))
                                            }
                                            className="border rounded-md w-full text-sm pl-2 hover:cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                Select product to add
                                            </option>
                                            {products
                                                .filter(
                                                    (product) =>
                                                        !warehouse.products.some(
                                                            (wp) => wp.productId === product._id
                                                        )
                                                )
                                                .map((product) => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <button
                                            onClick={() => handleAddProduct(warehouse._id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition duration-200"
                                            disabled={!selectedProducts[warehouse._id]}
                                        >
                                            <IoMdAdd />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-black dark:text-white">No Warehouse found.</p>
                    )}
                </div>
            )}
        </>
    );
}

export default WarehouseCard;
