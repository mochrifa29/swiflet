import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Barang harus diisi"],
  },
  berat: {
    type: Number,
    required: [true, "Berat wajib diisi"], 
  },
  harga: {
    type: Number,
    required: [true, "Harga wajib diisi"], 
  },
  sub_total: {
    type: Number,
    default : 0
  },
});



const TransaksiSchema = new Schema({
  invoice: {
    type: String,
  },
  nama_pembeli: {
    type: String,
    required: [true, "Nama harus diisi"],
  },
  tanggal_transaksi: {
    type: Date,
    default: Date.now
  },
  items : [itemSchema],
  total_berat : {
    type : Number,
    default : 0
  },
  total_belanja : {
    type : Number,
    default : 0
  },
  bayar : {
    type : Number,
    default : 0
  },
  kembalian : {
    type : Number,
    default : 0
  },
  keterangan : {
    type : String
  }
}, { timestamps: true });



const Transaksi = mongoose.model('Transaksi',TransaksiSchema);

export default Transaksi;