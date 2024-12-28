import ImageKit from "imagekit-javascript";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUpload({ sizechart, productImages, setFormData, formData, messageTxt, setMessageTxt, name, label }) {
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    const imagekit = new ImageKit({
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
        authenticationEndpoint: `${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`,
    });
    const onDrop = useCallback(async (acceptedFiles) => {
        const files = productImages ? acceptedFiles : [acceptedFiles[0]];
        setUploadImageLoading(true);
        try {
            const images = await Promise.all(
                files.map((file) => {
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
                                console.log(result.url);
                                resolve(result.url); // Resolve with the uploaded image URL
                            }
                        });
                    });
                })
            );
            console.log(images)
            if (productImages) {
                setFormData({ ...formData, images })
            } else {
                setFormData({ ...formData, sizechart: images[0] })
            }


        } catch (err) {
            console.log(err);
        }
        setUploadImageLoading(false);
    }, [imagekit]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
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
                className="min-h-24 flex justify-center items-center cursor-pointer dark:bg-transparent  bg-white rounded-[12px] border-[2px] border-dashed dark:border-[#cccccc] border-[#000000] text-center lg:p-16 py-9 px-16"
                {...getRootProps()}
            >
                <input {...getInputProps()}
                    id={name}
                    name={name} className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <div className="flex flex-col gap-[43px] items-center text-[13px] md:text-[16px] lg:text-[20px]">

                    {uploadImageLoading ? <p className=" dark:text-white text-black">Uploading...</p> : isDragActive ? (
                        <p className=" dark:text-white text-black">Drop your images here...</p>
                    ) : (
                        <p className="dark:text-white text-black \font-normal font-['Inter']">Drag 'n' drop your JPG, JPEG, or PNG files here, or click to select them</p>
                    )}

                    <div className="h-9 px-5 py-2.5 dark:bg-[#e2e2e2] bg-black rounded-[5px] justify-center items-center gap-2.5 inline-flex">
                        <div className="dark:text-black text-white text-[13px] font-semibold font-['Inter']">Choose File</div>
                    </div>
                </div>
            </div>
            {
                messageTxt[name] && <p className="text-red-500 text-[12px] pt-1 pl-1">{messageTxt[name]}</p>
            }
            {
                productImages ? formData[name].length > 0 && <div className="w-full py-4 rounded-lg mt-4 grid grid-cols-4 min-h-18 gap-4">
                    {formData[name].slice(0, sizechart ? 1 : Math.min(4, formData[name].length)).map((image, index) => <img className="w-full aspect-square h-full border p-2 rounded-lg" src={image} key={index} />)}
                </div> : formData[name] && <img className="lg:max-h-48 max-h-36 mt-4 aspect-square h-full border p-2 rounded-lg" src={formData[name]} />
            }
            {
                productImages && formData[name].length > 4 && <p className="dark:text-white text-black">& More</p>
            }

        </div>
    );
}

export default FileUpload;