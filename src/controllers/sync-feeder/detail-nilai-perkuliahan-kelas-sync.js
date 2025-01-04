const { DetailNilaiPerkuliahanKelas, DetailNilaiPerkuliahanKelasSync, Mahasiswa, RiwayatPendidikanMahasiswa, KelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getDetailNilaiPerkuliahanKelasFromFeeder(semesterId, req, res, next) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getDetailNilaiPerkuliahanKelasFromLocal(semesterId, req, res, next) {
  try {
    // Dapatkan data detail nilai perkuliahan kelas berdasarkan angkatan
    const detailNilaiPerkuliahanKelas = await DetailNilaiPerkuliahanKelas.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_semester: semesterId,
          },
        },
      ],
    });

    return detailNilaiPerkuliahanKelas;
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi pembanding nilai
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
}

async function matchingDataDetailNilaiPerkuliahanKelas(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID required",
      });
    }

    // get detail nilai perkuliahan kelas local dan feeder
    const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeeder(semesterId);
    const detailNilaiPerkuliahankelasLocal = await getDetailNilaiPerkuliahanKelasFromLocal(semesterId);

    let detailNilaiPerkuliahanKelasFeederMap = detailNilaiPerkuliahanKelasFeeder.reduce((map, detail_nilai) => {
      let uniqueKey = `${detail_nilai.id_kelas_kuliah}-${detail_nilai.id_registrasi_mahasiswa}`;
      map[uniqueKey] = detail_nilai;
      return map;
    }, {});

    // Loop untuk proses sinkronisasi
    for (let localDetailNilaiPerkuliahanKelas of detailNilaiPerkuliahankelasLocal) {
      // get data kelas_kuliah.id_feeder dan riwayat_pendidikan_mahasiswa.id_feeder
      let kelas_kuliah = await KelasKuliah.findByPk(localDetailNilaiPerkuliahanKelas.id_kelas_kuliah, {
        attributes: ["id_kelas_kuliah", "id_feeder"],
      });

      if (!kelas_kuliah) {
        return res.status(404).json({
          message: `Kelas Kuliah With ID ${localDetailNilaiPerkuliahanKelas.id_kelas_kuliah} Not Found:`,
        });
      }

      // get data mahasiswa
      let mahasiswa = await Mahasiswa.findByPk(localDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa, {
        attributes: ["id_registrasi_mahasiswa"],
      });

      if (!mahasiswa) {
        return res.status(404).json({
          message: `Mahasiswa With ID ${localDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa} Not Found:`,
        });
      }

      let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        },
        attributes: ["id_riwayat_pend_mhs", "id_feeder"],
      });

      if (!riwayat_pendidikan_mahasiswa) {
        return res.status(404).json({
          message: `Riwayat Pendidikan Mahasiswa With ID ${mahasiswa.id_registrasi_mahasiswa} Not Found:`,
        });
      }

      // Membuat kunci unik dari data lokal
      const uniqueKey = `${kelas_kuliah.id_feeder}-${riwayat_pendidikan_mahasiswa.id_feeder}`;

      // Ambil data feeder berdasarkan kunci unik
      const feederDetailNilaiPerkuliahanKelas = detailNilaiPerkuliahanKelasFeederMap[uniqueKey];

      const existingSync = await DetailNilaiPerkuliahanKelasSync.findOne({
        where: {
          id_detail_nilai_perkuliahan_kelas: localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas,
          jenis_singkron: feederDetailNilaiPerkuliahanKelas ? "update" : "create",
          status: false,
          id_kelas_kuliah_feeder: feederDetailNilaiPerkuliahanKelas ? localDetailNilaiPerkuliahanKelas.id_kelas_kuliah : null,
          id_registrasi_mahasiswa_feeder: feederDetailNilaiPerkuliahanKelas ? localDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa : null,
        },
      });

      if (existingSync) {
        console.log(`Data detail nilai perkuliahan kelas ${localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas} sudah disinkronisasi.`);
        continue;
      }

      if (!feederDetailNilaiPerkuliahanKelas) {
        // Proses create
        await DetailNilaiPerkuliahanKelasSync.create({
          jenis_singkron: "create",
          status: false,
          id_kelas_kuliah_feeder: null,
          id_registrasi_mahasiswa_feeder: null,
          id_detail_nilai_perkuliahan_kelas: localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas,
        });
        console.log(`Data detail nilai perkuliahan kelas ${localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else if (feederDetailNilaiPerkuliahanKelas) {
        let detail_nilai_perkuliahan_kelas_sync_local = await DetailNilaiPerkuliahanKelasSync.findOne({
          where: {
            jenis_singkron: "update",
            status: false,
            id_kelas_kuliah_feeder: feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah,
            id_registrasi_mahasiswa_feeder: feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa,
            id_detail_nilai_perkuliahan_kelas: localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas,
          },
        });

        if (!detail_nilai_perkuliahan_kelas_sync_local) {
          // proses perbandingan nilai local dengan nilai feeder
          const isUpdated = compareNilaiPerkuliahan(localDetailNilaiPerkuliahanKelas, feederDetailNilaiPerkuliahanKelas);

          if (isUpdated) {
            await DetailNilaiPerkuliahanKelasSync.create({
              jenis_singkron: "update",
              status: false,
              id_kelas_kuliah_feeder: feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah,
              id_registrasi_mahasiswa_feeder: feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa,
              id_detail_nilai_perkuliahan_kelas: localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas,
            });
            console.log(`Data detail nilai perkuliahan kelas ${localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
          }
        }
      } else {
        console.error(`Detail lokal untuk detail nilai perkuliahan kelas ${localDetailNilaiPerkuliahanKelas.id_detail_nilai_perkuliahan_kelas} tidak ditemukan.`);
      }
    }

    // Fungsi pembanding detail kelas
    function compareNilaiPerkuliahan(localNilai, feederNilai) {
      // Fungsi untuk membandingkan nilai angka dengan toleransi kecil
      function areEqualWithTolerance(value1, value2, epsilon = 0.01) {
        return Math.abs(value1 - value2) < epsilon;
      }

      // Normalisasi nilai angka untuk perbandingan
      const localNilaiAngka = parseFloat(localNilai.nilai_angka);
      const feederNilaiAngka = parseFloat(feederNilai.nilai_angka);

      // Periksa kesamaan nilai angka, indeks, dan huruf
      return !areEqualWithTolerance(localNilaiAngka, feederNilaiAngka) || localNilai.nilai_indeks !== feederNilai.nilai_indeks || localNilai.nilai_huruf !== feederNilai.nilai_huruf;
    }

    console.log("Matching detail nilai perkuliahan kelas lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataDetailNilaiPerkuliahanKelas:", error.message);
    throw error;
  }
}

const matchingSyncDataDetailNilaiPerkuliahanKelas = async (req, res, next) => {
  try {
    await matchingDataDetailNilaiPerkuliahanKelas(req, res, next);
    res.status(200).json({ message: "Matching detail nilai perkuliahan kelas lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron nilai perkuliahan
const updateNilaiPerkuliahan = async (id, req, res, next) => {
  try {
    // get data detail nilai perkuliahan from local
    let detail_nilai_perkuliahan = await DetailNilaiPerkuliahanKelas.findOne({
      where: {
        id_detail_nilai_perkuliahan_kelas: id,
      },
    });

    if (!detail_nilai_perkuliahan) {
      return res.status(404).json({ message: "Detail Nilai Perkuliahan not found" });
    }

    // get data kelas kuliah yang sudah di singkron ke feeder
    let kelas_kuliah = await KelasKuliah.findOne({
      where: {
        id_kelas_kuliah: detail_nilai_perkuliahan.id_kelas_kuliah,
      },
    });

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    if (kelas_kuliah.id_feeder == null || kelas_kuliah.id_feeder == "") {
      return res.status(404).json({ message: `Kelas kuliah dengan ID ${kelas_kuliah.id_kelas_kuliah} belum dilakukan singkron ke feeder` });
    }

    // get data riwayat pendidikan mahasiswa
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: detail_nilai_perkuliahan.id_registrasi_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
    });

    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa not found" });
    }

    if (riwayat_pendidikan_mahasiswa.id_feeder == null || riwayat_pendidikan_mahasiswa.id_feeder == "") {
      return res.status(404).json({ message: `Riwayat pendidikan mahasiswa dengan ID ${riwayat_pendidikan_mahasiswa.id_riwayat_pend_mhs} belum dilakukan singkron ke feeder` });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // update status pada detail_nilai_perkuliahan_sync local
    let detail_nilai_perkuliahan_sync = await DetailNilaiPerkuliahanKelasSync.findOne({
      where: {
        id_detail_nilai_perkuliahan_kelas: detail_nilai_perkuliahan.id_detail_nilai_perkuliahan_kelas,
        status: false,
        jenis_singkron: "update",
        id_kelas_kuliah_feeder: kelas_kuliah.id_feeder,
        id_registrasi_mahasiswa_feeder: riwayat_pendidikan_mahasiswa.id_feeder,
      },
    });

    if (!detail_nilai_perkuliahan_sync) {
      return res.status(404).json({ message: "Detail Nilai Perkuliahan sync not found" });
    }

    detail_nilai_perkuliahan_sync.status = true;
    await detail_nilai_perkuliahan_sync.save();

    // result
    console.log(`Successfully update nilai perkuliahan with ID ${detail_nilai_perkuliahan_sync.id} to feeder`);

    // akan update data nilai perkuliahan ke feeder
    const requestBody = {
      act: "UpdateNilaiPerkuliahanKelas",
      token: `${token}`,
      key: {
        id_kelas_kuliah: kelas_kuliah.id_feeder,
        id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_feeder,
      },
      record: {
        nilai_angka: detail_nilai_perkuliahan.nilai_angka,
        nilai_indeks: detail_nilai_perkuliahan.nilai_indeks,
        nilai_huruf: detail_nilai_perkuliahan.nilai_huruf,
      },
    };

    // Menggunakan token untuk mengambil data
    await axios.post(url_feeder, requestBody);
  } catch (error) {
    next(error);
  }
};

const syncNilaiPerkuliahans = async (req, res, next) => {
  try {
    const { nilai_perkuliahans } = req.body;

    // Validasi input
    if (!nilai_perkuliahans || !Array.isArray(nilai_perkuliahans)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data nilai perkuliahan berdasarkan jenis singkron
    for (const detail_nilai_sync of nilai_perkuliahans) {
      // get data nilai perkuliahan sync
      const data_detail_nilai_perkuliahan_sync = await DetailNilaiPerkuliahanKelasSync.findByPk(detail_nilai_sync.id);

      if (!data_detail_nilai_perkuliahan_sync) {
        return res.status(404).json({ message: "Data Detail Nilai Perkuliahan sync not found" });
      }

      if (data_detail_nilai_perkuliahan_sync.status === false) {
        if (data_detail_nilai_perkuliahan_sync.jenis_singkron === "update") {
          await updateNilaiPerkuliahan(data_detail_nilai_perkuliahan_sync.id_detail_nilai_perkuliahan_kelas, req, res, next);
        }
      } else {
        console.log(`Data Detail Nilai Perkuliahan Sync dengan ID ${detail_nilai_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    res.status(200).json({ message: "Singkron nilai perkuliahan lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingSyncDataDetailNilaiPerkuliahanKelas,
  syncNilaiPerkuliahans,
};