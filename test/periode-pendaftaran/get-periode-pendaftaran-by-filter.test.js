const httpMocks = require("node-mocks-http");
const { getPeriodePendaftaranByFilter } = require("../../src/controllers/periode-pendaftaran");
const { PeriodePendaftaran, Semester, SistemKuliah, JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getPeriodePendaftaranByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return filtered periode_pendaftarans with status 200", async () => {
    // Setup mock data
    const mockPeriodePendaftarans = [
      {
        id: 1,
        nama_periode_pendaftaran: "Periode 1",
        Semester: { id: 1, nama_semester: "Semester 1" },
        SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
        JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
      },
      {
        id: 2,
        nama_periode_pendaftaran: "Periode 2",
        Semester: { id: 1, nama_semester: "Semester 1" },
        SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
        JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
      }
    ];

    // Set up mock implementation
    PeriodePendaftaran.findAll.mockResolvedValue(mockPeriodePendaftarans);

    // Set request parameters
    req.params.id_semester = 1;
    req.params.id_jalur_masuk = 1;
    req.params.id_sistem_kuliah = 1;

    // Call the controller function
    await getPeriodePendaftaranByFilter(req, res, next);

    // Assertions
    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: 1,
        id_jalur_masuk: 1,
        id_sistem_kuliah: 1
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Pendaftaran By Filter Success",
      jumlahData: mockPeriodePendaftarans.length,
      data: mockPeriodePendaftarans
    });
  });

  it("should return 400 if semesterId is missing", async () => {
    req.params.id_jalur_masuk = 1;
    req.params.id_sistem_kuliah = 1;

    await getPeriodePendaftaranByFilter(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if jalurMasukId is missing", async () => {
    req.params.id_semester = 1;
    req.params.id_sistem_kuliah = 1;

    await getPeriodePendaftaranByFilter(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jalur Masuk ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if sistemKuliahId is missing", async () => {
    req.params.id_semester = 1;
    req.params.id_jalur_masuk = 1;

    await getPeriodePendaftaranByFilter(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Sistem Kuliah ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.findAll.mockRejectedValue(error);

    req.params.id_semester = 1;
    req.params.id_jalur_masuk = 1;
    req.params.id_sistem_kuliah = 1;

    await getPeriodePendaftaranByFilter(req, res, next);

    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: 1,
        id_jalur_masuk: 1,
        id_sistem_kuliah: 1
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});