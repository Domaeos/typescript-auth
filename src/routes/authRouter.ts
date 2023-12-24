import express from "express";
import {
    registerUser,
    authenticateUser,
    logoutUser,
} from "../controllers/authController";

const router = express.Router();

// these are for sub paths of app.use() I think
router.post("/register", registerUser);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

export default router;