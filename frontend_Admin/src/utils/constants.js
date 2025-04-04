export const initialProductData = {
    name: "",
    price: 0,
    images: [],
    description: "",
    category: "",
    specification: "",
    size: "",
    sizechart: "",
    collection: ""
}
export const initialErrorMessage = {
    name: "",
    price: "",
    size: "",
    images: "",
}
export const customerInitialState = {
    fname: "",
    lname: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    sport: "",
    customertype: "",
    othercustomertype: "",
    phone: "",
    email: "",
    othersport: ""
}
export const customerFormControls = [
    {
        name: "fname",
        label: "First Name",
        type: "text",
        placeholder: "Enter First Name"
    },
    {
        name: "lname",
        label: "Last Name",
        type: "text",
        placeholder: "Enter Last Name"
    },
    {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Enter address"
    },
    {
        name: "pincode",
        label: "Pincode",
        type: "text",
        placeholder: "Enter pincode"
    },
    {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "Enter city"
    },
    {
        name: "state",
        label: "State",
        type: "text",
        placeholder: "Enter state"
    },
    {
        name: "country",
        label: "Country",
        type: "text",
        placeholder: "Enter Country"
    },
    {
        name: "sport",
        label: "Sport",
        type: "select",
        options: ["Quad Hockey", "Inline Hockey", "Ice Hockey", "Roll ball", "Others"],
        placeholder: "Select sport type"
    },
    {
        name: "customertype",
        label: "Customer Type",
        type: "select",
        options: ["Coach", "Player", "Other"],
        placeholder: "Select customer type"
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "text",
        placeholder: "Enter phone number"
    },
    {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Enter email"
    },
]
export const shippingDetailsValidatorMessage = {
    address: "",
    city: "",
    pincode: "",
    state: "",
    payment_method: ""
}