const express = require("express");

const router = express.Router();

// import controllers
const AgamaController = require("../controllers/api-feeder/agama");
const NegaraController = require("../controllers/api-feeder/negara");
const WilayahController = require("../controllers/api-feeder/wilayah");
const PerguruanTinggiController = require("../controllers/api-feeder/perguruan-tinggi");
const ProfilPTController = require("../controllers/api-feeder/profil-pt");
const JalurMasukController = require("../controllers/api-feeder/jalur-masuk");
const JenisPendaftaranController = require("../controllers/api-feeder/jenis-pendaftaran");
const JenisTinggalController = require("../controllers/api-feeder/jenis-tinggal");
const AlatTransportasiController = require("../controllers/api-feeder/alat-transportasi");
const StatusMahasiswaController = require("../controllers/api-feeder/status-mahasiswa");
const KebutuhanKhususController = require("../controllers/api-feeder/kebutuhan-khusus");
const PenghasilanController = require("../controllers/api-feeder/penghasilan");
const JenisSMSController = require("../controllers/api-feeder/jenis-sms");
const LembagaPengangkatanController = require("../controllers/api-feeder/lembaga-pengangkatan");
const StatusKeaktifanPegawaiController = require("../controllers/api-feeder/status-keaktifan-pegawai");
const PangkatGolonganController = require("../controllers/api-feeder/pangkat-golongan");
const PekerjaanController = require("../controllers/api-feeder/pekerjaan");
const DosenController = require("../controllers/api-feeder/dosen");
const BiodataDosenController = require("../controllers/api-feeder/biodata-dosen");
const JenjangPendidikanController = require("../controllers/api-feeder/jenjang-pendidikan");
const ProdiController = require("../controllers/api-feeder/prodi");
// const PeriodeController = require("../controllers/api-feeder/periode");
const JenisSubstansiController = require("../controllers/api-feeder/jenis-substansi");
const SubstansiController = require("../controllers/api-feeder/substansi");
const SubstansiKuliahController = require("../controllers/api-feeder/substansi-kuliah");

// all routes
router.get("/get-agama", AgamaController.getAgama);
router.get("/get-negara", NegaraController.getNegara);
router.get("/get-wilayah", WilayahController.getWilayah);
router.get("/get-all-pt", PerguruanTinggiController.getAllPerguruanTinggi);
router.get("/get-profil-pt", ProfilPTController.getProfilPT);
router.get("/get-jalur-masuk", JalurMasukController.getJalurMasuk);
router.get("/get-jenis-pendaftaran", JenisPendaftaranController.getJenisPendaftaran);
router.get("/get-jenis-tinggal", JenisTinggalController.getJenisTinggal);
router.get("/get-alat-transportasi", AlatTransportasiController.getAlatTransportasi);
router.get("/get-status-mahasiswa", StatusMahasiswaController.getStatusMahasiswa);
router.get("/get-kebutuhan-khusus", KebutuhanKhususController.getKebutuhanKhusus);
router.get("/get-penghasilan", PenghasilanController.getPenghasilan);
router.get("/get-jenis-sms", JenisSMSController.getJenisSms);
router.get("/get-lembaga-pengangkatan", LembagaPengangkatanController.getLembagaPengangkatan);
router.get("/get-status-keaktifan-pegawai", StatusKeaktifanPegawaiController.getStatusKeaktifanPegawai);
router.get("/get-pangkat-golongan", PangkatGolonganController.getPangkatGolongan);
router.get("/get-pekerjaan", PekerjaanController.getPekerjaan);
router.get("/get-dosen", DosenController.getDosen);
router.get("/get-biodata-dosen", BiodataDosenController.getBiodataDosen);
router.get("/get-jenjang-pendidikan", JenjangPendidikanController.getJenjangPendidikan);
router.get("/get-prodi", ProdiController.getProdi);
// router.get("/get-periode", PeriodeController.getPeriode);
router.get("/get-jenis-substansi", JenisSubstansiController.getJenisSubstansi);
router.get("/get-substansi", SubstansiController.getSubstansi);
router.get("/get-substansi-kuliah", SubstansiKuliahController.getSubstansiKuliah);

module.exports = router;
