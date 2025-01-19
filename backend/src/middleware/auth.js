export const isAdmin = (req, res, next) => {
    // console.log(req.user)
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied", success: false });
    }
    next();
};
export const isWarehouseAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "warehouse-admin")) {
        return res.status(403).json({ message: "Access denied", success: false });
    }
    next();
};
