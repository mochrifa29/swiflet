import mongoose from "mongoose";
const { Schema } = mongoose;

const stokSchema = new Schema({
  barang: {
    type: Schema.Types.ObjectId,   // foreign key ke Barang
    ref: "Barang",                 // nama model Barang
    required: [true, "Barang harus dipilih"]
  },
  berat: {
    type: Number,// berat dalam gram atau satuan lain
    required: [true, "Berat wajib diisi"],
  },
  ready: {
    type: Boolean,
    default: false, // false = belum ready, true = ready
  },
  video_url:{
    type:String,
    default: ""
  },
  video_path:{
    type:String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Stok = mongoose.model("Stok", stokSchema);
export default Stok;
