export const createProductValidator = (product) => {
    if (!product?.name || product.name.trim() === "") {
        return { error: true, message: "Product name is required", field: "name" }
    }
    if (!product?.price || product.price === 0) {
        return { error: true, message: "Product price should be valid", field: "price" }
    }
    if (!product?.quantity || product.quantity === 0) {
        return { error: true, message: "Product quantity should be valid", field: "quantity" }
    }
    if (!product?.size || product.size === "") {
        return { error: true, message: "Product size should be required", field: "size" }
    }
    if (!product?.colour || product.colour === "") {
        return { error: true, message: "Product colour should be required", field: "colour" }
    }
    if (!product?.images || product.images.length == 0) {
        return { error: true, message: "Product should have at least 1 image", field: "images" }
    }
    return { error: false, message: "Success True" }
}

export const createCustomerValidator = (customer) => {
    if (!customer?.fname || customer.fname.trim() === "") {
        return { error: true, message: "Customer first name is required", field: "fname" }
    }
    if (!customer?.lname || customer.lname.trim() === "") {
        return { error: true, message: "Customer last name is required", field: "lname" }
    }
    if (!customer?.address || customer.address.trim() === "") {
        return { error: true, message: "Customer address is required", field: "address" }
    }
    if (!customer?.pincode || customer.pincode.trim() === "") {
        return { error: true, message: "Customer pincode is required", field: "pincode" }
    }
    if (!customer?.city || customer.city.trim() === "") {
        return { error: true, message: "Customer city is required", field: "city" }
    }
    if (!customer?.state || customer.state.trim() === "") {
        return { error: true, message: "Customer state is required", field: "state" }
    }
    if (!customer?.phone || customer.phone.trim() === "") {
        return { error: true, message: "Customer phone number is required", field: "phone" }
    }
    if (!customer?.sport || customer.sport.trim() === "") {
        return { error: true, message: "Customer sport is required", field: "sport" }
    }
    if (customer.sport === "Others" && (!customer?.othersport || customer.othersport.trim() === "")) {
        return { error: true, message: "Customer sport is required", field: "othersport" }
    }
    if (!customer?.customertype || customer.customertype.trim() === "") {
        return { error: true, message: "Customer customer type is required", field: "customertype" }
    }
    if (!customer?.email || customer.email.trim() === "") {
        return { error: true, message: "Customer email is required", field: "email" }
    }
    return { error: false, message: "Validation successful" }
}