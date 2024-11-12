const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../middlewares/check-role");

// import controllers
const SyncListDosenController = require("../controllers/sync-feeder/list-dosen");
const SyncTahunAjaranController = require("../controllers/sync-feeder/tahun-ajaran");
const SyncProdiController = require("../controllers/sync-feeder/prodi");
const SyncSubstansiController = require("../controllers/sync-feeder/substansi");
const SyncListMataKuliahController = require("../controllers/sync-feeder/list-mata-kuliah");
const SyncSemesterController = require("../controllers/sync-feeder/semester");
const SyncKurikulumController = require("../controllers/sync-feeder/kurikulum");
const SyncKelasKuliahController = require("../controllers/sync-feeder/list-kelas-kuliah");

// controller belum digunakan dan belum dicoba
// const SyncDetailNilaiPerkuliahanKelasController = require("../controllers/sync-feeder/detail-nilai-perkuliahan-kelas");
// const SyncDetailKelasKuliahController = require("../controllers/sync-feeder/detail-kelas-kuliah");

// all routes
router.get("/list-dosen", checkRole(["admin"]), SyncListDosenController.syncListDosen);
router.get("/tahun-ajaran", checkRole(["admin"]), SyncTahunAjaranController.syncTahunAjaran);
router.get("/prodi", checkRole(["admin"]), SyncProdiController.syncProdi);
router.get("/substansi", checkRole(["admin"]), SyncSubstansiController.syncSubstansi);
router.get("/list-mata-kuliah", checkRole(["admin"]), SyncListMataKuliahController.syncListMataKuliah);
router.get("/semester", checkRole(["admin"]), SyncSemesterController.syncSemester);
router.get("/kurikulum", checkRole(["admin"]), SyncKurikulumController.syncKurikulum);
router.get("/:id_semester/list-kelas-kuliah", checkRole(["admin"]), SyncKelasKuliahController.syncKelasKuliah);

// route belum digunakan dan belum dicoba
// router.get("/semester/:id_semester/detail-nilai-perkuliahan-kelas", checkRole(["admin"]), SyncDetailNilaiPerkuliahanKelasController.synceDetailNilaiPerkuliahanKelas);
// router.get("/semester/:id_semester/detail-kelas-kuliah", checkRole(["admin"]), SyncDetailKelasKuliahController.syncDetailKelasKuliah);

module.exports = router;