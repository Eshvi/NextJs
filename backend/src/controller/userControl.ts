import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';

export const SignUp = (req: Request, res: Response, next: NextFunction): void => {
    const email: string = req.body.email;
    const payload = { email };
    const secretKey = "";
    const token = jwt.sign(payload, secretKey);

    User.create(req.body)
        .then(result => {
            return res.status(200).json({ message: "User Sign up successfully...", user: result, token });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({ message: "Internal server error...", err });
        });
};

export const SignIn = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            const isPasswordCorrect = await user.checkPassword(password); // Use the instance method

            if (isPasswordCorrect) {
                return res.status(200).json({ message: "User signed in successfully", user });
            } else {
                return res.status(403).json({ error: "Invalid password", message: "Wrong password" });
            }
        } else {
            return res.status(404).json({ error: "User not found", message: "Unauthorized user" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const findByEmail = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const user = await User.findOne({ email: req.body.email });
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Something went wrong" });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, contact, userId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { name, email, contact }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized User..." });
        }
        const isPasswordCorrect = user.checkPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Password does not match" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
