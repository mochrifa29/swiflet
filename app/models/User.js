import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt"

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Username harus diisi"],
    minlength: [3, "Username minimal 3 karakter"],
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    match: [/.+@.+\..+/, "Email tidak valid"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
    minlength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// compare password function
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
