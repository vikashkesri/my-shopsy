import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Route Middleware (Token-Based Authentication)
export const requireSignIn = async (req, res, next) => {
    try {
        
        // Verify the token
            const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
            req.user = decoded; // Store decoded user data in request
            next(); 
        } catch (error) {
            console.log(error);
        }

    };

// Admin Access Middleware
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (user.role !== 1) {
            return res.status(403).send({
                success: false,
                message: "UnAuthorized Access",
            });
        }else{
        }
        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in admin middelware",
        });
    }
};
