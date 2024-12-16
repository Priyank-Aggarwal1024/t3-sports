import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageKit from 'imagekit-javascript';
import axios from "axios";
import { createProductValidator } from "../utils/validators";
import toast from "react-hot-toast";
import { initialErrorMessage, initialProductData } from '../utils/constants';


const ProductForm = () => {
  const [formData, setFormData] = useState(initialProductData);
  const [messageTxt, setMessageTxt] = useState(initialErrorMessage);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
    authenticationEndpoint: `${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`,
  });
  const onDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      setUploadImageLoading(true);
      try {
        const images = await Promise.all(
          acceptedFiles.map((file) => {
            return new Promise(async (resolve, reject) => {
              const response = await fetch(`${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`);
              const authParams = await response.json();
              const uploadParams = {
                file,
                fileName: file.name,
                folder: "/uploads", // Optional: specify folder in ImageKit
                ...authParams, // Include token, signature, and expire
              };

              // Upload the file using ImageKit
              imagekit.upload(uploadParams, (error, result) => {
                if (error) {
                  console.error("Upload error:", error);
                  reject(error);
                } else {
                  resolve(result.url); // Resolve with the uploaded image URL
                }
              });
            });
          })
        );
        console.log(images)
        setUploadedImageUrl(images);
        setFormData({ ...formData, images })
      } catch (err) {
        console.log(err);
      }
      setUploadImageLoading(false);
    });
  }, [imagekit]);
  const handlesizeChart = async (e) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`);
    const authParams = await response.json();
    console.log(e.target.files[0])
    const file = e.target.files[0];
    const uploadParams = {
      file,
      fileName: file.name,
      folder: "/uploads", // Optional: specify folder in ImageKit
      ...authParams, // Include token, signature, and expire
    };

    // Upload the file using ImageKit
    imagekit.upload(uploadParams, (error, result) => {
      if (error) {
        console.error("Upload error:", error);
      } else {
        console.log(result.url)
        setFormData({ ...formData, sizechart: result.url }) // Resolve with the uploaded image URL
      }
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
  });
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
    try {
      const res = await axios.post("/api/products", formData);
      toast.success("Product added successfully");
      setFormData(initialProductData);
      setUploadedImageUrl([]);
      setMessageTxt(initialErrorMessage)
    } catch (error) {
      console.error("Error creating product", error);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md dark:shadow-md"
      >
        <div className="gap-4 md:grid md:grid-cols-2 flex flex-col">

          {/* Product Name */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300 mb-2"
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
            {
              messageTxt.name && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.name}</p>
            }
          </div>

          {/* Price */}
          <div className="w-full">
            <label
              htmlFor="price"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {
              messageTxt.price && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.price}</p>
            }
          </div>

          {/* Original Price Optional */}
          <div className="w-full">
            <label
              htmlFor="originalprice"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Original Price / Optional
            </label>
            <input
              type="number"
              id="originalprice"
              name="originalprice"
              placeholder="Enter original price"
              value={formData.originalprice}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Quantity */}
          <div className="w-full">
            <label
              htmlFor="quantity"
              className="block text-gray-700 dark:text-gray-300 mb-2"
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
          </div>

          {/* Specifications */}
          <div className="w-full">
            <label
              htmlFor="specification"
              className="block text-gray-700 dark:text-gray-300 mb-2"
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
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              placeholder="Enter size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {
              messageTxt.size && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.size}</p>
            }
          </div>
          {/* Colour */}
          <div className="w-full">
            <label
              htmlFor="colour"
              className="block text-gray-700 dark:text-gray-300 mb-2"
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
          </div>



          {/* Category */}
          <div className="w-full">
            <label
              htmlFor="category"
              className="block text-gray-700 dark:text-gray-300 mb-2"
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
          {/* Upload Product Images */}
          <div className="w-full col-span-2 min-h-20 h-full">
            <label
              htmlFor="images"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Upload Product Images
            </label>
            <div
              className="min-h-24 flex justify-center items-center cursor-pointer"
              {...getRootProps()}
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <input {...getInputProps()}
                id="images"
                name="images" className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {uploadImageLoading ? <p className=" dark:text-white text-black">Uploading...</p> : isDragActive ? (
                <p className=" dark:text-white text-black">Drop your images here...</p>
              ) : (
                <p className="max-w-[300px] dark:text-white text-black">Drag 'n' drop your JPG, JPEG, or PNG files here, or click to select them</p>
              )}
            </div>
            {
              messageTxt.images && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt.images}</p>
            }
            {
              uploadedImageUrl.length > 0 && <div className="w-full py-4 rounded-lg mt-4 grid grid-cols-4 min-h-18 gap-4">
                {uploadedImageUrl.slice(0, Math.min(4, uploadedImageUrl.length)).map((image, index) => <img className="w-full h-full border p-2 rounded-lg" src={image} key={index} />)}
              </div>
            }
            {
              uploadedImageUrl.length > 4 && <p className="dark:text-white text-black">& More</p>
            }

          </div>

          {/* Upload size chart */}
          <div className="w-full col-span-2 min-h-20 h-full">
            <label
              htmlFor="sizechart"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Upload Size Chart Image
            </label>
            <input className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" type="file" accept=".jpeg, .png, .jpg" onChange={handlesizeChart} name='sizechart' id='sizechart' />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
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
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
