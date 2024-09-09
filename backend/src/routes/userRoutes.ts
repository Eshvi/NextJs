import { SignIn, SignUp } from "../controller/userControl";
import { Router } from "express";

const router = Router();

router.post("/sign-up",SignUp);
router.post("/sign-in",SignIn);


export default router;


