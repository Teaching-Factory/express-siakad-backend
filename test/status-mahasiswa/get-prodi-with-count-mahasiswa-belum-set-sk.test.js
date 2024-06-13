const httpMocks = require("node-mocks-http");
const { getProdiWithCountMahasiswaBelumSetSK } = require("../../src/controllers/status-mahasiswa");
const { Prodi } = require("../../models");

jest.mock("../../models");

describe("getProdiWithCountMahasiswaBelumSetSK", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dan mendapatkan data prodi dengan jumlah mahasiswa belum set SK
  it("should return all prodi with count of mahasiswa belum set SK with status 200", async () => {
    const mockProdiData = [
      {
        id_prodi: "prodi1",
        nama_program_studi: "Prodi 1",
        status: "active",
        Periodes: [
          {
            Mahasiswas: [
              { id_mahasiswa: "mhs1", nama_status_mahasiswa: null },
              { id_mahasiswa: "mhs2", nama_status_mahasiswa: null },
            ],
          },
        ],
      },
      {
        id_prodi: "prodi2",
        nama_program_studi: "Prodi 2",
        status: "inactive",
        Periodes: [
          {
            Mahasiswas: [{ id_mahasiswa: "mhs3", nama_status_mahasiswa: null }],
          },
        ],
      },
    ];

    Prodi.findAll.mockResolvedValue(mockProdiData);

    await getProdiWithCountMahasiswaBelumSetSK(req, res, next);

    expect(Prodi.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "GET ALL Prodi With Count Mahasiswa Belum Set SK Success",
      data: [
        {
          id_prodi: "prodi1",
          nama_prodi: "Prodi 1",
          status: "active",
          jumlahMahasiswa: 2,
        },
        {
          id_prodi: "prodi2",
          nama_prodi: "Prodi 2",
          status: "inactive",
          jumlahMahasiswa: 1,
        },
      ],
    });
  });

  // Kode uji 2 - Menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Prodi.findAll.mockRejectedValue(new Error(errorMessage));

    await getProdiWithCountMahasiswaBelumSetSK(req, res, next);

    expect(Prodi.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
