require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import model Struk yang baru saja dibuat
const Struk = require("./models/Struk");

const app = express();

app.use(cors());
app.use(express.json());

// === KONEKSI KE MONGODB ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Berhasil terhubung ke database MongoDB!"))
  .catch((err) => console.log("❌ Gagal terhubung ke database:", err));

// === JALUR API (ENDPOINTS) ===

// 1. GET: Mengambil semua data history struk (Diurutkan dari yang paling baru)
app.get("/api/struk", async (req, res) => {
  try {
    // sort({ createdAt: -1 }) artinya data terbaru akan muncul paling atas
    const history = await Struk.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data riwayat", error: error.message });
  }
});

// 2. POST: Menyimpan struk baru dari form React
app.post("/api/struk", async (req, res) => {
  try {
    const { nama, tugas, harga, status } = req.body;

    // Logika membuat nomor nota otomatis (Contoh: GM-0001, GM-0002)
    const totalStruk = await Struk.countDocuments();
    const urutanBerikutnya = totalStruk + 1;
    const nomorNotaOtomatis = `GM-${String(urutanBerikutnya).padStart(4, "0")}`;

    // Membuat tanggal hari ini (Format Indonesia)
    const tanggalHariIni = new Date().toLocaleDateString("id-ID");

    // Menyusun data sebelum dimasukkan ke database
    const strukBaru = new Struk({
      nota: nomorNotaOtomatis,
      tanggal: tanggalHariIni,
      nama: nama,
      tugas: tugas,
      harga: Number(harga), // Pastikan harga disimpan sebagai angka
      status: status,
    });

    // Simpan ke MongoDB
    const strukTersimpan = await strukBaru.save();

    // Kirim balasan sukses ke frontend
    res.status(201).json(strukTersimpan);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal membuat struk baru", error: error.message });
  }
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server menyala di http://localhost:${PORT}`);
});
