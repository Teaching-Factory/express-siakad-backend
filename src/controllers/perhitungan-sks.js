const { PerhitunganSKS } = require("../../models");

const getAllPerhitunganSKS = async (req, res) => {
  try {
    // Ambil semua data perhitungan_sks dari database
    const perhitungan_sks = await PerhitunganSKS.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perhitungan SKS Success",
      jumlahData: perhitungan_sks.length,
      data: perhitungan_sks,
    });
  } catch (error) {
    next(error);
  }
};

const getPerhitunganSKSById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PerhitunganSKSId = req.params.id;

    // Cari data perhitungan_sks berdasarkan ID di database
    const perhitungan_sks = await PerhitunganSKS.findByPk(PerhitunganSKSId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!perhitungan_sks) {
      return res.status(404).json({
        message: `<===== Perhitungan SKS With ID ${PerhitunganSKSId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Perhitungan SKS By ID ${PerhitunganSKSId} Success:`,
      data: perhitungan_sks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerhitunganSKS,
  getPerhitunganSKSById,
};