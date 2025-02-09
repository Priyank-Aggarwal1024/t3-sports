import React, { useEffect, useState } from "react";
import axios from "axios";
import { createProductValidator } from "../utils/validators";
import toast from "react-hot-toast";
import { initialErrorMessage, initialProductData } from "../utils/constants";
import FileUpload from "./FileUpload";
import useProducts from "../contexts/useProducts";

const ProductForm = () => {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState(initialProductData);
  const [messageTxt, setMessageTxt] = useState(initialErrorMessage);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serachText, setSearchText] = useState();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, message, field } = createProductValidator(formData);
    if (error) {
      setMessageTxt({ ...initialErrorMessage, [field]: message });
      return;
    } else {
      setMessageTxt(initialErrorMessage);
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/products", formData);
      toast.success(data.message);
      setFormData(initialProductData);
      setMessageTxt(initialErrorMessage);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      console.error(error.message);
    }
    setLoading(false);
  };
  const handleProductClick = (product) => {
    console.log(product)
    setFormData({
      ...formData,
      ["name"]: product.name,
      ["description"]: product.description,
      ["price"]: product.price,
      ["images"]: product.images,
      ["category"]: product.category,
      ["specification"]:product.specification||"",
      ["sizechart"]:product.sizechart||""
    });
    setIsFocused(false);
    setSearchText("")
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("/api/collections");
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Error fetching collections", error);
      }
    };

    fetchCollections();
  }, []);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  useEffect(() => {
    if(serachText){
      setIsFocused(true)
    }
    setFilteredProducts(
      products.filter((product) => {
        const regex = new RegExp(serachText, "i"); // "i" makes it case-insensitive
        return regex.test(product.name);
      })
    );
  }, [serachText]);
  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md dark:shadow-md"
      >
        <div className="gap-x-[74px] md:gap-y-12 gap-y-6  md:grid md:grid-cols-2 flex flex-col">
          <div className="md:col-span-2 relative"

          >
            <label
              htmlFor={"collection"}
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Clone Product
            </label>
            <input
              id={"clone"}
              name={"clone"}
              onChange={({ target }) => setSearchText(target.value)}
              onFocus={() => setIsFocused(true)}
              // onBlur={() => setIsFocused(false)}
              placeholder="Search Product by Name"
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(isFocused || serachText)&& (
              <div className="absolute z-[11] top-[101%] w-full bg-white dark:bg-black max-h-[50vh] overflow-y-auto h-60"
              
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product)}

                    className="p-4 rounded-xl w-full shadow-md flex items-center hover:cursor-pointer justify-between bg-white hover:opacity-75 dark:bg-gray-900 text-gray-900 dark:text-white min-w-[250px]"
                  >
                    <h2 className="font-bold w-3/6">{product.name}</h2>
                    <div className="w-1/6">
                      <img className="w-8 h-8" src={product.images[0]} alt="" />
                    </div>
                    <p className="text-sm font-semibold w-1/6">
                      ₹ {(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageTxt.name && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageTxt.name}
              </p>
            )}
          </div>
          {/* Price */}
          <div className="w-full">
            <label
              htmlFor="price"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageTxt.price && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageTxt.price}
              </p>
            )}
          </div>

          {/* Original Price Optional
          <div className="w-full">
            <label
              htmlFor="originalprice"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Original Price
            </label>
            <input
              type="number"
              min={0}
              id="originalprice"
              name="originalprice"
              placeholder="Enter original price"
              value={formData.originalprice}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {
              messageTxt.originalprice && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.originalprice}</p>
            }
          </div> */}

          {/* Quantity
          <div className="w-full">
            <label
              htmlFor="quantity"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {
              messageTxt.quantity && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.quantity}</p>
            }
          </div> */}

          {/* Specifications */}
          <div className="w-full">
            <label
              htmlFor="specification"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Specifications
            </label>
            <input
              type="text"
              id="specification"
              name="specification"
              placeholder="Enter specifications"
              value={formData.specification}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Size */}
          <div className="w-full">
            <label
              htmlFor="size"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Size - Colour
            </label>
            <input
              type="text"
              id="size"
              name="size"
              placeholder="Enter size - colour"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageTxt.size && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageTxt.size}
              </p>
            )}
          </div>

          {/* Colour
          <div className="w-full">
            <label
              htmlFor="colour"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Colour
            </label>
            <input
              type="text"
              id="colour"
              name="colour"
              placeholder="Enter colour"
              value={formData.colour}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {
              messageTxt.colour && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.colour}</p>
            }
          </div> */}

          {/* Category */}
          <div className="w-full">
            <label
              htmlFor="category"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Select Collection */}
          <div className="md:col-span-2">
            <label
              htmlFor={"collection"}
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Select Collection
            </label>
            <select
              id={"collection"}
              name={"collection"}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option
                value={""}
                className="w-full dark:bg-gray-600 dark:text-white"
              >
                Select Collection
              </option>
              {collections.map((collection, ide) => (
                <option
                  key={ide}
                  value={collection._id}
                  className="w-full dark:bg-gray-600 dark:text-white"
                >
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Product Images */}
          <FileUpload
            productImages={true}
            setFormData={setFormData}
            formData={formData}
            sizechart={false}
            messageTxt={messageTxt}
            setMessageTxt={setMessageTxt}
            label={"Upload Product Images"}
            name={"images"}
          />
          <FileUpload
            productImages={false}
            setFormData={setFormData}
            formData={formData}
            sizechart={true}
            messageTxt={messageTxt}
            setMessageTxt={setMessageTxt}
            label={"Upload Sizechart Image"}
            name={"sizechart"}
          />

          {/* Description */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 flex items-center justify-center gap-4 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading && <span className="loader"></span>}
          <span>Create Product</span>
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
