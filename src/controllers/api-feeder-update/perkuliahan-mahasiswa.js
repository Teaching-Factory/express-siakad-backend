const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { PerkuliahanMahasiswa } = require("../../../models");

const getPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    // Ambil parameter angkatan dari query string
    const angkatan = req.query.angkatan;

    // Cek apakah angkatan dikirim dalam bentuk array
    if (!angkatan || angkatan.length === 0) {
      return res.status(400).json({ message: "Parameter angkatan is required" });
    }

    // Buat filter dinamis berdasarkan parameter angkatan
    const angkatanFilter = Array.isArray(angkatan) ? angkatan.map((year) => `angkatan = '${year}'`).join(" OR ") : `angkatan = '${angkatan}'`;

    const requestBody = {
      act: "GetListPerkuliahanMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPerkuliahanMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const perkuliahan_mahasiswa of dataPerkuliahanMahasiswa) {
      // Periksa apakah data sudah ada
      const existingData = await PerkuliahanMahasiswa.findOne({
        where: {
          id_semester: perkuliahan_mahasiswa.id_semester,
          id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          angkatan: perkuliahan_mahasiswa.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await PerkuliahanMahasiswa.create({
          angkatan: perkuliahan_mahasiswa.angkatan,
          ips: perkuliahan_mahasiswa.ips,
          ipk: perkuliahan_mahasiswa.ipk,
          sks_semester: perkuliahan_mahasiswa.sks_semester,
          sks_total: perkuliahan_mahasiswa.sks_total,
          biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          id_semester: perkuliahan_mahasiswa.id_semester,
          id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
          id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Perkuliahan Mahasiswa Success",
      totalData: dataPerkuliahanMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerkuliahanMahasiswa,
};
