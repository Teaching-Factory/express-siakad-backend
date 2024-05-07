const { Semester } = require("../../models");

const getAllSemester = async (req, res) => {
  try {
    // Ambil semua data semester dari database
    const semester = await Semester.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Semester Success",
      jumlahData: semester.length,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

const getSemesterById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SemesterId = req.params.id;

    // Cari data semester berdasarkan ID di database
    const semester = await Semester.findByPk(SemesterId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!semester) {
      return res.status(404).json({
        message: `<===== Semester With ID ${SemesterId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Semester By ID ${SemesterId} Success:`,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSemester,
  getSemesterById,
};