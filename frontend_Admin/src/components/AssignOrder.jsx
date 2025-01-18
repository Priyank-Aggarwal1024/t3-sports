import React from 'react';
// import {} from "react-router"
function AssignOrder(props) {
    // const {id} = useParams
    const [dimensions, setDimensions] = useState({
        weight: 0,
        height: 0,
        length: 0,
        breadth: 0,
    });
    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setDimensions((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };
    // if (orderDetails.weight == 0) {
    //   setValidationMessage("Weight should not be 0.");
    //   return;
    // }
    // if (orderDetails["length"] == 0) {
    //   setValidationMessage("Length should not be 0.");
    //   return;
    // }
    // if (orderDetails.height == 0) {
    //   setValidationMessage("Height should not be 0.");
    //   return;
    // }
    // if (orderDetails.breadth == 0) {
    //   setValidationMessage("Breadth should not be 0.");
    //   return;
    // }
    return (
        <div>
            <div className="w-full">
                <label
                    htmlFor="weight"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                    Weight (in grams):
                </label>
                <input
                    name="weight"
                    type="number"
                    min={0}
                    placeholder="Weight (g)"
                    value={dimensions.weight}
                    onChange={handleDimensionChange}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
            </div>
            <div className="w-full">
                <label
                    htmlFor="height"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                    Height (in cm):
                </label>
                <input
                    name="height"
                    type="number"
                    min={0}
                    placeholder="Height (cm)"
                    value={dimensions.height}
                    onChange={handleDimensionChange}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
            </div>
            <div className="w-full">
                <label
                    htmlFor="length"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                    Length (in cm):
                </label>
                <input
                    name="length"
                    type="number"
                    min={0}
                    placeholder="Length (cm)"
                    value={dimensions.length}
                    onChange={handleDimensionChange}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
            </div>
            <div className="w-full">
                <label
                    htmlFor="breadth"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                    Breadth (in cm):
                </label>
                <input
                    name="breadth"
                    type="number"
                    min={0}
                    placeholder="Breadth (cm)"
                    value={dimensions.breadth}
                    onChange={handleDimensionChange}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
            </div>
        </div>
    );
}

export default AssignOrder;