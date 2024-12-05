const { KelasKuliah, KelasKuliahSync } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getKelasKuliahFromFeeder(semesterId, req, res, next) {
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
      act: "GetListKelasKuliah",
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

async function getKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await KelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function matchingDataKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get kelas kuliah local dan feeder
    const kelasFeeder = await getKelasKuliahFromFeeder(semesterId);
    const kelasLocal = await getKelasKuliahFromLocal(semesterId);

    // kelas kuliah feeder
    const kelasKuliahFeederMap = kelasFeeder.reduce((map, kelas) => {
      map[kelas.id_kelas_kuliah] = kelas;
      return map;
    }, {});

    // Perbandingan lokal ke feeder (create)
    for (let localKelas of kelasLocal) {
      const feederKelas = kelasKuliahFeederMap[localKelas.id_feeder];

      // Jika data lokal tidak ada di Feeder, maka tambahkan dengan jenis "create"
      if (!feederKelas) {
        const existingSync = await KelasKuliahSync.findOne({
          where: {
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          },
        });

        if (!existingSync) {
          await KelasKuliahSync.create({
            jenis_singkron: "create",
            status: false,
            id_feeder: null,
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          });
          console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
        }
      } else {
        // Jika data ada di Feeder, cek apakah ada perubahan (update)
        const isUpdated =
          localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah ||
          localKelas.sks !== feederKelas.sks ||
          localKelas.jumlah_mahasiswa !== feederKelas.jumlah_mahasiswa ||
          localKelas.apa_untuk_pditt !== feederKelas.apa_untuk_pditt ||
          localKelas.lingkup !== feederKelas.lingkup ||
          localKelas.mode !== feederKelas.mode ||
          localKelas.id_prodi !== feederKelas.id_prodi ||
          localKelas.id_semester !== feederKelas.id_semester ||
          localKelas.id_matkul !== feederKelas.id_matkul ||
          localKelas.id_dosen !== feederKelas.id_dosen;

        if (isUpdated) {
          const existingSync = await KelasKuliahSync.findOne({
            where: {
              id_kelas_kuliah: localKelas.id_kelas_kuliah,
            },
          });

          if (!existingSync) {
            await KelasKuliahSync.create({
              jenis_singkron: "update",
              status: false,
              id_feeder: localKelas.id_feeder,
              id_kelas_kuliah: localKelas.id_kelas_kuliah,
            });
            console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
          }
        }
      }
    }

    // mengecek jikalau data kelas kuliah tidak ada di local namun ada di feeder, maka data kelas kuliah di feeder akan tercatat sebagai delete
    for (let feederKelasId in kelasKuliahFeederMap) {
      const feederKelas = kelasKuliahFeederMap[feederKelasId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "delete"
      const localKelas = kelasLocal.find((kelas) => kelas.id_feeder === feederKelasId);

      if (!localKelas) {
        const existingSync = await KelasKuliahSync.findOne({
          where: {
            id_feeder: feederKelas.id_kelas_kuliah,
          },
        });

        if (!existingSync) {
          await KelasKuliahSync.create({
            jenis_singkron: "delete",
            status: false,
            id_feeder: feederKelas.id_kelas_kuliah,
            id_kelas_kuliah: null,
          });
          console.log(`Data kelas kuliah ${feederKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'delete'.`);
        }
      }
    }

    console.log("Sinkronisasi kelas kuliah selesai.");
  } catch (error) {
    console.error("Error during matchingDataKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataKelasKuliah = async (req, res, next) => {
  try {
    await matchingDataKelasKuliah(req, res, next);
    res.status(200).json({ message: "Matching kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingSyncDataKelasKuliah,
};
