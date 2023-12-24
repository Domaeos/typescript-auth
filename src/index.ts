import express from "express";
import authRouter from "./routes/authRouter";
import connectUserDB from "./connections/userDB";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import userRouter from "./routes/userRouter";
import { authenticate } from "./middleware/authMiddleware";
import helmet from "helmet";


interface UserBasicInfo {
    _id: string;
    name: string;
    email: string;
    roles: string[];
}

// tells typescript the global variable exists elsewhere
declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}

dotenv.config();
connectUserDB();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet())


app.use(authRouter);
app.use("/users", authenticate, userRouter);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
