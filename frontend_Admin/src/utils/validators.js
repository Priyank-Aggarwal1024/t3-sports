export const createProductValidator = (product) => {
    if (!product?.name || product.name.trim() === "") {
        return { error: true, message: "Product name is required", field: "name" }
    }
    if (!product?.price || product.price === 0) {
        return { error: true, message: "Product price should be valid", field: "price" }
    }
    if (!product?.size || product.size === "") {
        return { error: true, message: "Product size should be required", field: "size" }
    }
    if (!product?.images || product.images.length == 0) {
        return { error: true, message: "Product should have at least 1 image", field: "images" }
    }
    if (product.images.length > 7) {
        return { error: true, message: "Product should have max 7 images", field: "images" }
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
    if (isNaN(Number(customer.pincode))) {
        return { error: true, message: "Enter a valid pincode", field: "pincode" }
    }
    if (String(customer.pincode).length != 6) {
        return { error: true, message: "Pincode should have 6 digit", field: "pincode" }
    }
    if (!customer?.city || customer.city.trim() === "") {
        return { error: true, message: "Customer city is required", field: "city" }
    }
    if (!customer?.state || customer.state.trim() === "") {
        return { error: true, message: "Customer state is required", field: "state" }
    }
    if (!customer?.country || customer.country.trim() === "") {
        return { error: true, message: "Customer country is required", field: "country" }
    }
    if (!customer?.phone || customer.phone.trim() === "") {
        return { error: true, message: "Customer phone number is required", field: "phone" }
    }
    if (isNaN(Number(customer.phone))) {
        return { error: true, message: "Enter a valid phone number", field: "phone" }
    }
    if (String(customer.phone).length != 10) {
        return { error: true, message: "Phone number should have 10 digits", field: "phone" }
    }
    if (!customer?.sport || customer.sport.trim() === "") {
        return { error: true, message: "Customer sport is required", field: "sport" }
    }
    if (customer.sport === "Others" && (!customer?.othersport || customer.othersport.trim() === "")) {
        return { error: true, message: "Customer sport is required", field: "othersport" }
    }
    if (customer.customertype === "Other" && (!customer?.othercustomertype || customer.othercustomertype.trim() === "")) {
        return { error: true, message: "Customer type is required", field: "othercustomertype" }
    }
    if (!customer?.customertype || customer.customertype.trim() === "") {
        return { error: true, message: "Customer customer type is required", field: "customertype" }
    }
    return { error: false, message: "Validation successful" }
}
export const shippingValidator = (shippingDetails) => {
    if (!shippingDetails.shippingDetails.shippingAddress
    ) {
        return { message: "Enter address correctly" }
    }
    if (!shippingDetails.products || shippingDetails.products.length == 0
    ) {
        return { message: "Select products" }
    }
    if (!shippingDetails.payment_method
    ) {
        return { message: "Enter payment method" }
    }
    if (!shippingDetails.customer
    ) {
        return { message: "Select Customer first" }
    }
    return { message: "" };

}