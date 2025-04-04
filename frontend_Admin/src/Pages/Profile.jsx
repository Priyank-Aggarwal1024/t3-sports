import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import toast from "react-hot-toast";
import axios from "axios";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { ScrollRestoration } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { validateInput } from "../constants";
import ImageKit from "imagekit-javascript";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);

  const updateUser = async (userData) => {
    try {
      dispatch(updateUserStart());

      const response = await axios.post(
        `/api/user/update/${currentUser._id}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("User details updated successfully");
      closeModal();
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Error in updating Details");
    }
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const allowedFormats = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      toast.error(
        "Invalid file format. Please select a JPG, JPEG, or PNG file."
      );

      return;
    }

    const maxSizeInBytes = 4000 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds the limit of 4MB.");
      return;
    }

    setUploadingImage(true);

    const imagekit = new ImageKit({
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
      authenticationEndpoint: `${
        import.meta.env.VITE_BASE_URL
      }/product/imagekit/auth`,
    });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/product/imagekit/auth`
      );
      if (!response.ok)
        throw new Error("Failed to fetch authentication parameters");
      const authParams = await response.json();
      const res = await imagekit.upload({
        file,
        fileName: file.name,
        folder: "/uploads",
        ...authParams,
      });
      await updateUser({ avatar: res.url });
      setFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      console.log(error);
      toast.error("Error uploading file");
    } finally {
      setUploadingImage(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleTypeChange = (e) => {
  //   const value = e.target.value;
  //   const isSelected = selectedInterests.includes(value);
  //   setSelectedInterests((prevInterests) =>
  //     isSelected
  //       ? prevInterests.filter((interest) => interest !== value)
  //       : [...prevInterests, value]
  //   );
  // };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const errorMessage = validateInput(id, value);
    setErrors({
      ...errors,
      [id]: errorMessage,
    });

    if (!errorMessage || value === "") {
      setErrors({
        ...errors,
        [id]: "",
      });
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    if (formData.password === "") {
      delete formData.password;
    }

    if (currentUser.role === "admin" || currentUser.role === "Admin") {
      if (
        (!formData.phoneNo && !currentUser.phoneNo) ||
        (formData.phoneNo === "" && currentUser.phoneNo)
      ) {
        toast.error("Admins and organizers must have a phone number");
        return;
      }
    }

    const updatedFormData = { ...formData };

    await updateUser(updatedFormData);
  };
  return (
    <div className="">
      <ScrollRestoration />

      <div
        className={`flex md:page-content flex-col items-center bg-white dark:bg-black min-h-screen text-black dark:text-white`}
      >
        <div className="">
          <h2 className="my-4 md:mt-12 text-black dark:text-white text-2xl font-semibold flex flex-col">
            My Profile <hr className="mt-2 border-gray-400" />
          </h2>
          <div className="w-full">
            <div className="p-6 md:mt-6 bg-dullBlack dark:text-white text-medium text-white rounded-xl">
              <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between w-full md:w-[50vw] border border-solid border-white dark:border-white rounded-xl p-4">
                <div className="flex flex-col md:flex-row p-4 gap-4 items-center">
                  <form
                    onSubmit={handleFileSubmit}
                    encType="multipart/form-data"
                    className="flex flex-col gap-4 items-center justify-center mt-4"
                  >
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                      />
                      <img
                        onClick={() => fileInputRef.current.click()}
                        src={previewUrl || currentUser.avatar}
                        alt="profile"
                        className="rounded-xl h-24 w-24 object-cover cursor-pointer"
                      />
                      <label
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bg-white border border-[#2F60F3] p-2 bottom-0 right-0 rounded-xl bg-gray  px-2 py-1 cursor-pointer"
                      >
                        <MdModeEditOutline className="text-black" />
                      </label>
                    </div>

                    <button
                      disabled={uploadingImage} // Disable button during image upload
                      className={`border flex items-center gap-2 justify-center text-sm rounded-xl bg-transparent border-slate-300 py-2 px-4 ${
                        uploadingImage ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                      type="submit"
                    >
                      <CgProfile />
                      {uploadingImage ? "Uploading..." : "Update Profile Image"}
                    </button>
                  </form>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-medium">{currentUser.name}</h2>
                    <p className="text-sm leading-3 opacity-50">
                      @{currentUser.username}
                    </p>
                    <p className="text-sm leading-3 opacity-50">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={openModal}
                  className="border border-solid border-slate-300 rounded-xl px-4 py-2 w-20 h-fit flex items-center gap-2 justify-center text-sm"
                >
                  <AiOutlineEdit />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 max-w-md w-full"></div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dullBlack text-black dark:text-white md:w-1/3 w-3/4 p-6 rounded-xl shadow-lg">
            <div className="text-xs md:text-sm">
              <div className="flex justify-between">
                <button onClick={closeModal} className="  text-red-500 ">
                  <FaTimes />
                </button>
                <h2 className="text-xl text-center font-semibold mt-4 flex-1">
                  Update Profile
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 items-center w-full"
              >
                {/* Input fields  */}
                <div className="flex flex-col gap-2 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs md:text-sm font-semibold"
                    >
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Name"
                      defaultValue={currentUser.name}
                      id="name"
                      className={`border p-2 md:p-3  text-black rounded-xl w-full ${
                        errors.name ? "border-red" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs italic">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="text-xs md:text-sm font-semibold"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      defaultValue={currentUser.username}
                      id="username"
                      className={`border p-2 md:p-3 text-black rounded-xl w-full ${
                        errors.username ? "border-red" : ""
                      }`}
                      onChange={handleChange}
                      required
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs italic">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs md:text-sm font-semibold"
                    >
                      E-mail
                    </label>

                    <input
                      required
                      type="email"
                      placeholder="Email"
                      id="email"
                      defaultValue={currentUser.email}
                      className="border p-2 md:p-3  text-black   rounded-xl w-full"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNo"
                      className="text-xs md:text-sm font-semibold"
                    >
                      Phone
                    </label>

                    <input
                      type="number"
                      placeholder="PhoneNo"
                      id="phoneNo"
                      defaultValue={currentUser.phoneNo}
                      className={`border p-2 md:p-3  text-black   rounded-xl w-full ${
                        errors.name ? "border-red" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {errors.phoneNo && (
                      <p className="text-red-500 text-xs italic">
                        {errors.phoneNo}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="text-xs md:text-sm font-semibold"
                    >
                      Password
                    </label>
                    <div className="relative h-fit">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={handleChange}
                        id="password"
                        className={`border p-2 md:p-3  text-black  rounded-xl w-full ${
                          errors.password ? "border-red" : ""
                        }`}
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute h-full flex items-center top-0 inset-y-4 right-0 px-3 py-2 text-[#2F60F3] focus:outline-none"
                      >
                        {showPassword ? (
                          <RiEyeOffFill size={24} />
                        ) : (
                          <RiEyeFill size={24} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs italic">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs md:text-sm font-semibold">
                      Choose your Interests
                    </label>
                    {/* <div className="grid grid-cols-2 gap-4 mt-2">
                      {typeOptions.map((type) => (
                        <div
                          key={type}
                          onClick={() =>
                            handleTypeChange({ target: { value: type } })
                          }
                          className={`cursor-pointer p-2 md:p-4 rounded-xl shadow-md flex items-center justify-center ${selectedInterests.includes(type)
                            ? "dark:bg-[#2F60F3] font-poppins bg-black text-white dark:text-black"
                            : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                            }`}
                        >
                          {type}
                        </div>
                      ))}
                    </div> */}
                  </div>

                  <button
                    disabled={loading}
                    className="bg-[#2F60F3] text-black rounded-xl p-2 md:p-3 uppercase hover:opacity-95 disabled:opacity-80"
                  >
                    {loading ? "Loading..." : "Update"}
                  </button>
                </div>
              </form>
              <p className="text-[#2F60F3] mt-5">{error ? error : ""}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
