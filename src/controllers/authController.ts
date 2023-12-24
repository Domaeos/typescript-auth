import { Request, Response } from "express";
import User from "../models/User";
import { generateToken, clearToken } from "../utils/auth";

const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "The email already exists" })
        return;
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, {
            userId: user._id,
            userEmail: user.email,
            roles: user.roles,
        });
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
        });
    } else {
        res.status(400).json({ message: "An error occurred in creating the user" });
    }

};

const authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        generateToken(res, {
            userId: user._id,
            userEmail: user.email,
            roles: user.roles,
        });
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
        });
    } else {
        res.status(409).json({ message: "User not found / password incorrect" });
    }
};

const logoutUser = (req: Request, res: Response) => {
    clearToken(res);
    res.status(200).json({ message: "Successfully logged out" });
};

export { registerUser, authenticateUser, logoutUser };