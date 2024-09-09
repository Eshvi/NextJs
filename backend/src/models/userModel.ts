import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the user schema
interface IUser extends Document {
  email: string;
  password: string;
  contact?: number;
  checkPassword(password: string): boolean;
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true, // Ensure required fields are specified
    },
    password: {
      type: String,
      trim: true,
      required: true,
      set: function (password: string) {
        const saltKey = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, saltKey);
      },
    },
    contact: {
      type: Number,
      trim: true,
      // unique: true
    },
  },
  { versionKey: false }
);

// Add a method to check the password
userSchema.methods.checkPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

// Create the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
