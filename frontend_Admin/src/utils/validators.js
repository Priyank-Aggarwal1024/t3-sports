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
