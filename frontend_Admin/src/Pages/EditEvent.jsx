import React, { useRef, useState, useEffect } from "react";
import {
  useLoaderData,
  useParams,
  useNavigate,
  ScrollRestoration,
} from "react-router-dom";
import { loadStates, loadCities, geocodeAddress } from "../utils/Data";
import axios from "axios";
import {
  validateInput,
} from "../constants";
import Poster from "../components/Poster";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Places from "../components/Places"; // Adjust the path as necessary

const EditEvent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const event = useLoaderData();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    Title: event.name,
    Location: event.location,
    State: event.state,
    City: event.city,
    Type: event.type,
    description: event.description,
  });

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
        [id]: "", // Reset error message when input becomes valid
      });
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      setEditingEvent(true); // Set editing state to true while processing the request

      const { latitude, longitude } = await geocodeAddress(formData.location);

      // Make API call to update event details
      const response = await axios.patch(
        `/api/business/update-business/${id}/${currentUser.role}`,
        {
          ...formData,
          coordinates: {
            lat: latitude,
            lng: longitude,
          },
        }
      );


      if (response.status === 200) {
        toast.success("Details updated successfully");

        setEditingEvent(false);
        navigate(-1);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while updating event details.");
      }
      setFormData({
        Title: event.name,
        Location: event.location,
        State: event.state,
        City: event.city,
        Type: event.type,
        description: event.description,
      });
      setEditingEvent(false);
    }
  };

  // Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const states = await loadStates();
        states.sort((a, b) => a[1].localeCompare(b[1]));

        setStates(states);
      } catch (error) {
        console.error("Error loading states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch Cities based on State
  useEffect(() => {
    const fetchCities = async () => {
      const code = states.filter((state) => state[1] === formData.state);

      if (formData.state) {
        try {
          const cities = await loadCities(code[0][0]);
          setCities(cities);
          setLoading(false);
        } catch (error) {
          console.error("Error loading cities:", error);
        }
      }
    };

    fetchCities();
  }, [formData.state, states]);

  // Set current date when component mounts
  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  const onLocationChange = (formattedAddress, state, city) => {
    setFormData({
      ...formData,
      location: formattedAddress,
      state: state || formData.state,
      city: city || formData.city,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-content bg-white dark:bg-black">
      <ScrollRestoration />
      <h2 className="text-black dark:text-white mx-4 text-2xl font-semibold flex flex-col">
        Edit Event <hr className="mt-2 border-gray-400" />
      </h2>
      <div className="p-5 bg-white dark:bg-black dark:text-white flex flex-col-reverse md:flex-row  gap-4 text-black  min-h-screen">
        {editingEvent && <Loader />}
        <Poster formData={formData} file={null} />
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 md:w-1/2"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Title"
                className="block text-sm font-medium required"
              >
                Title:
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                onChange={handleChange}
                value={formData.name}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs md:text-sm rounded-xl bg-transparent "
              />
            </div>
            <div>
              <label
                htmlFor="Location"
                className="block text-sm font-medium required"
              >
                Venue:
              </label>
              <input
                type="text"
                id="Location"
                name="Location"
                onChange={handleChange}
                value={formData.location}
                required
                className={`mt-1 p-2 w-full hidden text-xs md:text-sm border rounded-xl   bg-white   `}
              />
              <Places
                onLocationChange={onLocationChange}
                defaultValue={formData.location}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="State"
                className="block text-sm font-medium required"
              >
                State:
              </label>
              <select
                id="State"
                name="State"
                onChange={handleChange}
                value={formData.state}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs md:text-sm rounded-xl bg-transparent"
              >
                <option className="bg-dullBlack text-white" value="">
                  Select State
                </option>
                {states.map((option, index) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={`${option[0]}-${index}`}
                    value={option[1]}
                  >
                    {option[1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="City"
                className="block text-sm font-medium required"
              >
                City:
              </label>
              <select
                id="City"
                name="City"
                onChange={handleChange}
                value={formData.city}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs md:text-sm rounded-xl bg-transparent"
              >
                <option className="bg-dullBlack text-white" value="">
                  Select City
                </option>
                {cities.map((option, index) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={`${option[0]}-${index}`}
                    value={option[1]}
                  >
                    {option[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Type"
                className="block text-sm font-medium required"
              >
                Type:
              </label>
              <select
                id="Type"
                name="Type"
                onChange={handleChange}
                value={formData.Type}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs md:text-sm rounded-xl bg-transparent"
              >
                <option className="bg-dullBlack text-white" value="">Select Type</option>
                {typeOptions.map((option) => (
                  <option className="bg-dullBlack text-white" key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
          </div>
          <div className="gap-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium required"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                onChange={handleChange}
                value={formData.description}
                rows={10}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs md:text-sm rounded-xl bg-transparent"
              ></textarea>
            </div>
          </div>
          <button
            disabled={editingEvent}
            type="submit"
            className={`rounded-xl bg-black text-white dark:bg-[#2F60F3] dark:text-black py-2 px-4 ${editingEvent ? "opacity-80 cursor-not-allowed" : ""
              }`}
          >
            {editingEvent ? "Updating Details..." : "Confirm Business Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
