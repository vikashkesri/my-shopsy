import { comparePasword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body;
        // validations 
        if (!name){
            return res.send({message:"name is Required"});
        }
        if (!email){
            return res.send({message:"Email is Required"});
        }
        if (!password){
            return res.send({message:"Password is Required"});
        }
        if (!phone){
            return res.send({message:"Phone no is Required"});
        }
        if (!address){
            return res.send({message:"Address is Required"});
        }

        if (!answer){
            return res.send({message:"Answer is Required"});
        }
        //check user
         const exisitingUser = await userModel.findOne({email});
         //existing user 
         if (exisitingUser){
            return res.status(200).send({
                success:false,
                message:"Already Register please login",
            });
         }
         //register user 
         const hashedPassword = await hashPassword(password);
         //save 
         const user = await new userModel ({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save();

         res.status(201).send({
            success:true,
            message:"User Regidter Successfully",
            user,
         });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Registeration",
            error,
        });
    }
};

//POST LOGIN
export const loginController = async (req,res) => {
    try {
        const {email, password} = req.body
        //validation 
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registerd",
            });
        }
        const match = await comparePasword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: "15d",
        });
        res.status(200).send({
            success:true,
            message:"login successfully",
            user:{
                _id: user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error,
    });
    }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Check for missing fields and return early with an error message
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is required" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New Password is required" });
        }

        // Check if the user exists with the provided email and answer
        const user = await userModel.findOne({ email, answer });

        // If user is not found, return an error response
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer"
            });
        }

        // Hash the new password
        const hashed = await hashPassword(newPassword);
        
        // Update the password in the database
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        // Send success response
        return res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
};

//test controller
export const testController = (req, res) => {
    try {
    res.send("Protected Routes");;
} catch (error) {
    console.log(error);
    res.send({ error });
}
};