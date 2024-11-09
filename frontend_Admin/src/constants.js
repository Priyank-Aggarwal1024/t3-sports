// Form Validations
export const validateInput = (name, value) => {
  switch (name) {
    case "username":
      // Allow only lowercase letters, hyphen, number, underscore (no space)
      const usernamePattern = /^[a-z0-9_-]+$/;
      return usernamePattern.test(value)
        ? ""
        : "Username can only include lowercase letters, hyphen, number, and underscore (no space)";
    case "Price":
      return /^\d+$/.test(value) ? "" : "Only numbers allowed for this field";
    case "Location":
      // Validate Location here
      const locationPattern = /^(ftp|http|https):\/\/[^ "]+$/;
      return locationPattern.test(value) ? "" : "Invalid location URL";
    case "name":
      return /^[A-Za-z\s]+$/.test(value)
        ? ""
        : "Name must contain only alphabets";
    case "description":
      if (value.trim().length === 0) {
        return "Description is required.";
      } else if (value.length > 600) {
        // Adjust the maximum length as per your requirement
        return "Description must be less than 100 characters.";
      } else {
        return ""; // Valid description
      }

    case "otp":
      if (value.length < 6 || value.length > 6) {
        return "Otp must be 6 characters long";
      } else if (!/^\d+$/.test(value)) {
        return "OTP must contain only digits";
      } else {
        return "";
      }
    case "password":
      // Password strength check
      if (value.length < 8) {
        return "Password must be at least 8 characters long";
      } else if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter";
      } else if (!/\d/.test(value)) {
        return "Password must contain at least one digit";
      } else {
        return "";
      }
    case "phoneNo":
      // Phone number validation (Indian format)
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(value)
        ? ""
        : "Phone number must be exactly 10 digits";
    default:
      return "";
  }
};





// Month names array
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

