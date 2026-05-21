const mongoose = require("mongoose");

// Membuat cetakan (schema) untuk data struk
const strukSchema = new mongoose.Schema(
  {
    nota: { type: String, required: true, unique: true },
    tanggal: { type: String, required: true },
    nama: { type: String, required: true },
    tugas: { type: String, required: true },
    harga: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true, // Otomatis mencatat waktu data dibuat (createdAt/updatedAt)
  },
);

module.exports = mongoose.model("Struk", strukSchema);
