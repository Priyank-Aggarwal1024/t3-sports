import React, { useEffect, useState } from "react";
import { Link, ScrollRestoration, useLoaderData } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegStar, FaStar } from "react-icons/fa";
import { TbLocationFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

// import useEvents from "../hooks/useEvents";
import toast from "react-hot-toast";
import { MdEmail, MdVerified } from "react-icons/md";

import { VscUnverified } from 'react-icons/vsc'
// import OfferCards from "../components/OfferCards";
import { BiSolidCategory } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  Navigation,
  Mousewheel,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const baseURL = import.meta.env.VITE_BASE_URL;

const BusinessPage = () => {
  const dispatch = useDispatch();
  const event = useLoaderData();
  const { currentUser } = useSelector((state) => state.user);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [organizer, setOrganizer] = useState("");
  const [businessData, setBusinessData] = useState(event);

  const handleReviewAdded = (updatedBusiness) => {
    setBusinessData(updatedBusiness);
  };

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (event && event.postedBy) {
        try {
          const response = await axios.get(
            `/api/user/get-user-by-id/${event.postedBy}`
          );
          const { password, ...userData } = response.data;
          setOrganizer(userData);
        } catch (error) {
          console.error("Error fetching organizer:", error);
        }
      }
    };

    fetchOrganizer();
  }, [event]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Check if event is fully loaded before rendering the component
  if (!event) {
    return <div>Loading...</div>; // Show a loading state if event is not available yet
  }

  return (
    <div className="bg-white dark:bg-darkPrimary dark:text-white gap-8 text-black min-h-screen flex flex-col items-center">
      <ScrollRestoration />
      <div className="relative w-11/12 h-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, Mousewheel, Keyboard]} // Register Swiper modules
          spaceBetween={20}
          pagination={{ clickable: true, dynamicBullets: true }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {event.bannerImages?.map((val, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full aspect-square md:aspect-video md:h-[65vh] rounded-xl bg-cover bg-center" // Ensure height is set
                style={{ backgroundImage: `url(${val})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-full flex items-center justify-center -mt-8">
          <img
            className="md:absolute -mt-6 md:bottom-0 left-5 rounded-xl z-10 w-28 h-28 flex justify-center md:w-56 md:h-56 object-cover"
            src={event.profileImage}
            alt={event.name}
          />
        </div>
      </div>
      <div className="w-full px-4 md:px-12">
        <div className="md:p-4">
          <div className="flex md:flex-row flex-col mb-3 justify-between items-center">
            <p className="text-xs flex gap-2 items-center capitalize">
              {event.status === "verified" ? (
                <MdVerified size={20} />
              ) : (
                <VscUnverified size={20} />
              )}
              {event.status} Business
            </p>
            <h2 className="text-xl md:text-3xl font-bold">{event.name}</h2>
            <div className="flex gap-2 items-center justify-center">
              <button
                className={`flex items-center gap-2 bg-[#2F60F3] text-black px-3 py-2 rounded-xl hover:bg-[#2F60F3] `}
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please log in to call");
                    return;
                  }
                  window.location.href = `tel:${event.contactDetails.phoneNumber}`;
                }}
              >
                <FaPhoneAlt size={20} />
                {event.contactDetails?.phoneNumber}
              </button>
              <button
                className="flex items-center gap-2 bg-[#2F60F3] text-black px-3 py-2 rounded-xl hover:bg-[#2F60F3] "
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please log in to Email");
                    return;
                  }
                  window.location.href = `mailto:${event.contactDetails?.email}`;
                }}
              >
                <MdEmail size={20} />
                {event.contactDetails?.email}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 relative">
          <div className="w-full relative md:w-1/2 md:mt-0 z-10 border bg-lightSecondary dark:bg-dullBlack dark:shadow-lg dark:border-0 p-4 rounded-xl md:rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Description & Details</h2>
              <p className="flex items-center gap-1 text-xs">
                <FaStar className="text-[#2F60F3] " />
                {event.rating}
              </p>
            </div>
            <div className="mt-4 md:mb-8 md:overflow-scroll no-scrollbar">
              <p className="text-xs md:text-sm whitespace-pre-wrap">
                {showFullDescription
                  ? event.description
                  : `${event.description?.slice(0, 300)}...`}
                {event.description?.length > 150 && (
                  <span
                    className="text-black font-semibold dark:text-[#2F60F3] cursor-pointer ml-1"
                    onClick={toggleDescription}
                  >
                    {showFullDescription ? " Read less" : " Read more"}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 border dark:border-0 flex flex-col gap-4 h-fit bg-lightSecondary dark:bg-dullBlack dark:shadow-lg p-4 rounded-xl md:rounded-xl">
            <div className="w-full flex justify-center flex-col md:flex-row h-fit gap-2 items-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  event.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2F60F3] w-full items-center flex justify-center gap-2 p-3 rounded-xl text-[#2F60F3] underline"
              >
                <TbLocationFilled className="wiggle" color="black" size={20} />{" "}
                <span className="text-black">Go To Map</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;

