import React, { useRef } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

const Places = ({ onLocationChange, defaultValue = "" }) => {
  const inputRef = useRef();

  const handlePlacesChanged = () => {
    const [place] = inputRef.current.getPlaces();

    if (place) {
      onLocationChange(place.formatted_address);
    }
  };

  return (
    <StandaloneSearchBox
      onLoad={(ref) => (inputRef.current = ref)}
      onPlacesChanged={handlePlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter Address"
        defaultValue={defaultValue}
        className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white placeholder:text-xs text-inherit rounded-xl text-xs md:text-sm bg-transparent"
        required
      />
    </StandaloneSearchBox>
  );
};

export default Places;
