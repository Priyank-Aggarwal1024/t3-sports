import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PosterModal from "../components/PosterModal";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const DetailedList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const tableHeaders = [
    "No",
    "Profile Image",
    "Title",
    "Posted by",
    "Plan",
    "Status",
    "ACTION",
    "DELETE",
    "EDIT",
  ];

  useEffect(() => {
    if (posterModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [posterModalOpen]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/business/all-listings`);

      const eventsArray = response.data;
      eventsArray.reverse();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `/api/business/update-business/${id}/${currentUser.role}`,
        { status: "verified" }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const setPromotion = async (id) => {
    try {
      await axios.patch(
        `/api/business/update-business/${id}/${currentUser.role}`,
        { promotion: true }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error in add event to promotions:", error);
    }
  };

  const removePromotion = async (id) => {
    try {
      await axios.patch(
        `/api/business/update-business/${id}/${currentUser.role}`,
        { promotion: false }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error in remove event from promotions:", error);
    }
  };

  const handleDeny = async (id, email) => {
    // Display a confirmation dialog
    const confirmDeny = window.confirm(
      "Are you sure you want to deny this event? This will also delete the event."
    );

    // If user confirms, proceed with denying the event
    if (confirmDeny) {
      try {
        await axios.delete(`/api/business/delete/${id}`);

        fetchEvents();
      } catch (error) {
        console.error("Error denying event:", error);
      }
    }
  };

  const handleApproveAll = async () => {
    try {
      await Promise.all(
        events.map(async (event) => {
          if (event.status !== "verified" && event.status !== "unverified") {
            await axios.patch(
              `/api/business/update-business/${event._id}/${currentUser.role}`,
              { status: "verified" }
            );
          }
        })
      );
      fetchEvents();
      toast.success("All applicable events have been approved.");
    } catch (error) {
      console.error("Error approving all events:", error);
    }
  };

  // Function to filter events based on search text
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchText.toLowerCase()) ||
      event.state.toLowerCase().includes(searchText.toLowerCase()) ||
      event.city.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description.toLowerCase().includes(searchText.toLowerCase()) ||
      event.tagline.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDelete = async (id, postedBy) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this business?"
    );
  
    if (isConfirmed) {
      try {
        // Step 1: Update the role of the business to "user"
        const roleUpdateResponse = await axios.put(`/api/user/update-role/${postedBy}`, {
          role: "user", // Assuming the API expects the role in the request body
        });
  
        // Check if role update is successful
        if (roleUpdateResponse.data.success) {
          // Step 2: Proceed to delete the business
          const deleteResponse = await axios.delete(`/api/business/delete/${id}`);
          const deleteData = deleteResponse.data;
          
          if (deleteData.acknowledged === true) {
            fetchEvents(); // Refresh the list of businesses
            toast.success("Business role updated and deleted successfully");
          }
        } else {
          toast.error("Failed to update role before deletion");
        }
      } catch (error) {
        console.error("Error deleting business or updating role:", error);
        toast.error("An error occurred while deleting the business");
      }
    }
  };
  

  // Pagination:

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const canGoNext = endIndex < filteredEvents.length;
  const canGoPrev = currentPage > 1;

  return (
    <div className=" px-2 min-h-screen bg-white dark:bg-darkPrimary dark:text-white">
      <section className="py-1">
        <div className="w-full  mb-12 xl:mb-0 px-4 mx-auto mt-5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                name="search"
                id="search"
                className="border rounded-xl p-2 bg-white  text-black  w-full"
                placeholder="Search by Title, State, City, or Type"
                value={searchText}
                onChange={handleSearch}
              />

              <button
                className="bg-primary text-black hover:opacity-50  font-bold  w-1/2 rounded"
                onClick={handleApproveAll}
              >
                Approve All
              </button>
            </div>
            
            <div className="block w-full overflow-x-auto">
              {searchText !== "" && filteredEvents.length === 0 ? (
                <p className="text-center">No Business found.</p>
              ) : (
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredEvents
                      .slice(startIndex, endIndex)
                      .map((event, index) => (
                        <Link to={`/business/${event._id}`}>
                        <div key={index} className="bg-primary p-4 rounded-xl">
                          <div className="h-64 w-full">
                            <img className="w-full h-full rounded-xl object-cover" src={event.profileImage} alt="..." />
                          </div>
                          
                          <div className="flex justify-between items-center">
                          <div className="text-2xl text-black font-bold my-2 font-poppins">
                            {event.name}
                          </div>
                          <div className="bg-secondary text-primary px-2 rounded-xl text-sm font-poppins">
                            {event.plan}
                          </div>
                          </div>
                          <div className="inline-flex gap-4 text-black">
                          {/* <div className="">
                            {event.tagline}
                          </div> */}
                          </div>

                          <div className="flex flex-col gap-2">
                          <div className="text-black">
                            {event.status === "unverified" ? (
                              <div className="flex gap-1 flex-row">
                                <button
                                  className=" bg-green-700  rounded-xl py-2 text-white w-full px-4"
                                  onClick={() => handleApprove(event._id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className=" bg-red-600  rounded-xl py-2 text-white w-full px-4"
                                  onClick={() =>
                                    handleDeny(event._id, event.postedBy)
                                  }
                                >
                                  Deny
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs py-1 px-3 font-poppins bg-secondary text-white w-fit rounded-xl">
                              {event.status}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                          {/* Promotion Button */}
                          <div className="">
                            {event.status === "verified" ? (
                              <div>
                                {event.promotion ===true ? (
                                  <button
                                    className=" bg-black text-xs dark:bg-secondary rounded-xl py-2 text-white w-full px-4"
                                    onClick={() => removePromotion(event._id)}
                                  >
                                    Remove Promotion
                                  </button>
                                ) : (
                                  <button
                                    className=" bg-black text-xs dark:bg-secondary rounded-xl py-2 text-white w-full px-4"
                                    onClick={() => setPromotion(event._id)}
                                  >
                                    Add Promotion
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div>
                                <h1 className=" text-black text-xs dark:text-white font-bold py-2 px-6 ">
                                  Not Applicable
                                </h1>
                              </div>
                            )}
                          </div>

                          <div className="">
                            <button
                              onClick={() => handleDelete(event._id, event.postedBy)}
                              className={`bg-black dark:bg-secondary rounded-xl py-2 text-white w-full px-4 `}
                            >
                              <AiFillDelete />
                            </button>
                          </div>

                          <div className="">
                            <Link to={`/edit-event/${event?._id}`}>
                              <button className="bg-black dark:bg-secondary rounded-xl py-2 text-white w-full px-4 ">
                                <FaEdit />
                              </button>
                            </Link>
                          </div>

                          </div>

                          </div>
                        </div>
                        </Link>
                      ))}
                  </div>
                  {/* pagination */}
            <div className="m-2 flex justify-end gap-2">
              <button
                onClick={goToPrevPage}
                disabled={!canGoPrev}
                className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-xl ${
                  !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <IoIosArrowBack className="inline-block mr-1" />
                Prev
              </button>
              <button
                onClick={goToNextPage}
                disabled={!canGoNext}
                className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-xl ${
                  !canGoNext ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
                <IoIosArrowForward className="inline-block ml-1" />
              </button>
            </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailedList;
