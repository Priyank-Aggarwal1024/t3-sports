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
//                                         <span className="text-[#2F60F3] font-semibold">${getProductById(product.productId)?.price}</span>
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
    const [open, setOpen] = useState({});
    const handleWarehouseClick = (warehouse) => {
        if (open[warehouse._id]) {
            setOpen({ ...open, [warehouse._id]: false });
        } else {
            setOpen({ ...open, [warehouse._id]: true });
        }
    }
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
                                <div className="">
                                    <div
                                        key={warehouse._id}
                                        className="bg-white dark:bg-darkPrimary shadow-lg rounded-md md:p-9 p-6 transition-transform transform w-full flex flex-col md:gap-9 gap-5"
                                    >
                                        <div className="flex justify-between items-center cursor-pointer"
                                            onClick={() => handleWarehouseClick(warehouse)}
                                        >
                                            <h3 className="text-xl font-semibold text-black dark:text-white ">
                                                {warehouse.name}
                                            </h3>
                                            {
                                                open[warehouse._id] ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
                                                    <path d="M8.2771 0.64099L15.8859 12.5405L0.668299 12.5405L8.2771 0.64099Z" fill="#D9D9D9" />
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                    <path d="M8.34778 12.5387L0.282599 0.639223L16.413 0.639221L8.34778 12.5387Z" fill="#D9D9D9" />
                                                </svg>
                                            }
                                        </div>
                                        {
                                            open[warehouse._id] && <div>
                                                <ul className="pb-3">
                                                    {warehouse.products.map((product) => (
                                                        <li key={product._id} className="flex  items-center md:mb-[18px] mb-3 ">
                                                            <div className="flex justify-between items-center w-full p-2.5 dark:bg-black bg-white  rounded-[5px] shadow-sm">
                                                                <span className="font-medium text-black dark:text-white">
                                                                    {getProductById(product.productId)?.name}
                                                                </span>
                                                                <span className="text-[#2F60F3] font-semibold">
                                                                    ${getProductById(product.productId)?.price}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveProduct(warehouse._id, product.productId)}
                                                                className="dark:text-white text-black rounded-md py-1 pl-1 text-2xl cursor-pointer"
                                                            >
                                                                <IoMdClose />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="my-4 flex gap-2">
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
                                                <div className="text-[#df4f4f] text-center cursor-pointer text-[17px] font-medium font-['Inter']"
                                                    onClick={() => deleteWarehouse(warehouse._id)}
                                                >Delete warehouse</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dark:text-[#e2e2e2] text-black w-full lg:text-3xl md:text-2xl text-xl text-center font-normal md:pt-6 font-['Inter']">No warehouses found</div>
                    )}
                </div>
            )}
        </>
    );
}

export default WarehouseCard;
