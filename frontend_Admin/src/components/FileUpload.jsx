import React from "react";
import ImageKit from "imagekit-javascript";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";

function FileUpload({
  productImages,
  setFormData,
  formData,
  messageTxt,
  name,
  label,
}) {
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
    authenticationEndpoint: `${
      import.meta.env.VITE_BASE_URL
    }/product/imagekit/auth`,
  });
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const files = acceptedFiles;
      if (productImages) {
        if (files.length > 7) {
          toast.error("Maximum limit 7 images");
          return;
        }
      } else if (files.length > 1) {
        toast.error("Maximum limit 1 image for sizechart.");
        return;
      }
      setUploadImageLoading(true);
      try {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let currentLoaded = 0;
        const images = await Promise.all(
          files.map(async (file) => {
            const response = await fetch(
              `${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`
            );
            if (!response.ok)
              throw new Error("Failed to fetch authentication parameters");
            const authParams = await response.json();
            var customXHR = new XMLHttpRequest();
            customXHR.upload.addEventListener("progress", function (e) {
              if (e.loaded <= file.size) {
                setUploadPercentage(
                  Math.round(((currentLoaded + e.loaded) / totalSize) * 100)
                );
              }

              if (e.loaded == e.total) {
                currentLoaded = currentLoaded + e.total;
                setUploadPercentage(
                  Math.round((currentLoaded / totalSize) * 100)
                );
              }
            });
            const uploadParams = {
              xhr: customXHR,
              file,
              fileName: file.name,
              folder: "/uploads",
              ...authParams,
            };

            return new Promise((resolve, reject) => {
              imagekit.upload(uploadParams, (error, result) => {
                if (error) reject(error);
                else resolve(result.url);
              });
            });
          })
        );

        if (productImages) {
          setFormData((prevData) => ({
            ...prevData,
            images: [...formData["images"], ...images],
          }));
        } else {
          setFormData((prevData) => ({ ...prevData, sizechart: images[0] }));
        }
        setUploadPercentage(0);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
        setUploadPercentage(0);
      }
      setUploadImageLoading(false);
    },
    [imagekit]
  );
  const handleformdataimage = (indx, name) => {
    if (name == "images") {
      let images = formData[name].filter((item, idx) => idx != indx);
      setFormData((prevdata) => ({ ...prevdata, images }));
    } else {
      setFormData((prevdata) => ({ ...prevdata, [name]: "" }));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });
  return (
    <div className="w-full col-span-2 min-h-20 h-full">
      <label
        htmlFor={name}
        className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
      >
        {label}
      </label>
      <div
        className="min-h-24 flex justify-center items-center cursor-pointer dark:bg-transparent  bg-white rounded-[12px] border-[2px] border-dashed dark:border-[#cccccc] border-[#000000] text-center lg:p-16 py-6 px-8"
        {...getRootProps()}
      >
        <input
          {...getInputProps()}
          id={name}
          name={name}
          className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-col md:gap-[43px] gap-5 items-center text-[13px] md:text-[16px] lg:text-[20px]">
          {uploadImageLoading ? (
            <div className="flex items-center justify-center flex-col gap-3">
              <p className="text-xl dark:text-white text-black">
                {uploadPercentage}%
              </p>{" "}
              <p className=" dark:text-white text-black">Uploading...</p>{" "}
            </div>
          ) : isDragActive ? (
            <p className=" dark:text-white text-black">
              Drop your images here...
            </p>
          ) : (
            <p className="dark:text-white text-black \font-normal font-['Inter']">
              Drag &apos;n&apos; drop your JPG, JPEG, or PNG files here, or
              click to select them
            </p>
          )}

          <div className="h-9 px-5 md:py-2.5 py-1.5 dark:bg-[#e2e2e2] bg-black rounded-[5px] justify-center items-center gap-2.5 inline-flex">
            <div className="dark:text-black text-white text-[13px] font-semibold font-['Inter']">
              Choose File
            </div>
          </div>
        </div>
      </div>
      {messageTxt[name] && (
        <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt[name]}</p>
      )}
      <div className="w-full overflow-x-auto max-w-full">
        {productImages
          ? formData[name].length > 0 && (
              <div className="w-full py-4 rounded-lg mt-4 flex items-center min-h-18 gap-4">
                {formData[name].map((image, index) => (
                  <div
                    className="w-48 aspect-square h-48 border p-2 rounded-lg relative"
                    key={index}
                  >
                    <div className="absolute bg-white rounded-[10px] top-1 right-1 cursor-pointer z-[1] p-1">
                      <MdDelete
                        onClick={() => handleformdataimage(index, name)}
                        className="text-4xl text-red-700 "
                      />
                    </div>
                    <img className="w-full h-full" src={image} key={index} />
                  </div>
                ))}
              </div>
            )
          : formData[name] && (
              <div className="w-48 aspect-square h-48 border p-2 rounded-lg relative mt-4">
                <div className="absolute bg-white rounded-[10px] top-1 right-1 cursor-pointer z-[1] p-1">
                  <MdDelete
                    onClick={() => handleformdataimage(0, name)}
                    className="text-4xl text-red-700 "
                  />
                </div>
                <img
                  className="w-full h-full"
                  src={formData[name]}
                  alt={name}
                />
              </div>
            )}
      </div>
    </div>
  );
}

FileUpload.propTypes = {
  productImages: PropTypes.bool,
  setFormData: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  messageTxt: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default FileUpload;
