import mongoose from "mongoose";
const { Schema } = mongoose;

const barangSchema = new Schema({
  nama_barang: {
    type: String,
    required: [true, "Barang harus diisi"],
  },
  grade: {
    type: String,
    required: [true, "Grade harus diisi"],
  },
  foto: {
    type: String, 
    required: [true, "Foto harus diisi"], // jika opsional, bisa true kalau wajib
  },
  fileName: {
    type: String,
    required: true, // wajib diisi, karena ini untuk delete
 }
});

const Barang = mongoose.model("Barang", barangSchema);
export default Barang;
