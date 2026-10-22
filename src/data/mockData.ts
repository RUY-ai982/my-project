import { PPPKEmployee, StatusDokumen, PredikatSKP, PredikatPerilaku } from '../types/pppk';
import { EvaluationSchedule, VerificationAuditLog } from '../types/schedule';

export const INITIAL_EMPLOYEES: PPPKEmployee[] = [
  {
    id: 'pppk-001',
    nipPppk: '199204122023211005',
    nik: '3201081204920003',
    namaLengkap: 'dr. Hendra Pratama',
    gelarDepan: 'dr.',
    gelarBelakang: 'Sp.A',
    jabatan: 'Dokter Ahli Pertama',
    golongan: 'X',
    unitKerja: 'RSUD dr. Chasbullah / Dinas Kesehatan',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 98.6,
      totalHariKerja: 240,
      hadir: 236,
      izin: 2,
      sakit: 2,
      cuti: 0,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 35,
      terlambatFrekuensi: 2,
      catatanDisiplin: 'Disiplin sangat prima, hadir tepat waktu dalam shift IGD dan poli spesialis anak.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Sangat Baik',
      skorHasilKerja: 96,
      skorPerilaku: 95,
      predikatPerilaku: 'Diatas Ekspektasi',
      nilaiAkhirSKP: 95.5,
      capaianTargetUtama: 'Menuntaskan 1.450 layanan konsultasi pediatrik, penurunan angka stunting di wilayah binaan RSUD sebesar 18.4%.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Memberikan respons cepat tanggap gawat darurat pediatrik dengan standar empati tinggi',
        akuntabel: 'Pengelolaan resep dan rekam medis elektronik 100% tepat waktu dan tertib regulasi BPJS',
        kompeten: 'Menjadi narasumber sosialisasi tatalaksana gizi klinis anak tingkat kabupaten',
        harmonis: 'Kolaboratif antar tim paramedis, dokter jaga, dan keluarga pasien',
        loyal: 'Selalu bersedia siaga panggilan on-call kondisi bencana maupun wabah',
        adaptif: 'Mengimplementasikan sistem telemedicine RSUD secara proaktif',
        kolaboratif: 'Bekerja sama erat dengan puskesmas jejaring rujukan anak'
      },
      nomorSKPBKN: 'SKP-BKN/RSUD/2026/0892',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 39.4,
      skorBobotSKP: 57.6,
      skorTotalKelayakan: 97.0,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Kinerja prima dengan kedisiplinan presensi 98.6%. Sangat memenuhi standar kelayakan perpanjangan kontrak.'
    },
    statusDokumen: 'Dokumen Terbit',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Surat_Rekomendasi_Atasan_dr_Hendra_RSUD.pdf',
      fileSize: '418 KB',
      uploadedAt: '15 Okt 2026, 09:30 WIB',
      hashSHA256: '14e857be938173ef0b22a597a741f0cf2da8853a4f63c87e8e4530062b8c9d2f',
      diverifikasiOleh: 'Direktur Utama RSUD dr. Chasbullah'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/DINKES/2026/041',
    sptjmTanggal: '15 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/RSUD/2026/108',
    rekomendasiTanggal: '14 Oktober 2026',
    atasanNama: 'dr. Hj. Farida Kusuma, M.Kes',
    atasanNip: '197405101999032001',
    atasanJabatan: 'Direktur Utama RSUD dr. Chasbullah',
    kepalaOpdNama: 'dr. Raden Arya Wijaya, Sp.PK',
    kepalaOpdNip: '196811201996031002',
    kepalaOpdJabatan: 'Kepala Dinas Kesehatan Provinsi',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: true,
      issues: []
    },
    enkripsi: {
      sptjmHashSHA256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      rekomendasiHashSHA256: '14e857be938173ef0b22a597a741f0cf2da8853a4f63c87e8e4530062b8c9d2f',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-15T09:12:44Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-1005-9241',
      isVerified: true
    },
    catatanAdmin: 'Berkas lengkap dan seluruh instrumen telah tervalidasi oleh tim verifikator BKPSDM.',
    updatedAt: '2026-10-15'
  },
  {
    id: 'pppk-002',
    nipPppk: '199507202023212011',
    nik: '3204126007950002',
    namaLengkap: 'Siti Nurhaliza, S.Pd',
    gelarDepan: '',
    gelarBelakang: 'S.Pd',
    jabatan: 'Ahli Pertama - Guru Matematika',
    golongan: 'IX',
    unitKerja: 'SMP Negeri 1 Bojongsoang / Dinas Pendidikan',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 96.2,
      totalHariKerja: 240,
      hadir: 231,
      izin: 4,
      sakit: 4,
      cuti: 1,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 70,
      terlambatFrekuensi: 4,
      catatanDisiplin: 'Disiplin mengajar aktif, kehadiran tatap muka kelas mencapai 98%.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 88,
      skorPerilaku: 87,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 87.5,
      capaianTargetUtama: 'Ketuntasan belajar klasikal siswa mencapai 88.5%, memfasilitasi modul olimpiade matematika sekolah.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Menyediakan klinik belajar tambahan sore untuk murid tertinggal pelajaran',
        akuntabel: 'Nilai ulangan dan portofolio rapor digital diunggah tepat waktu',
        kompeten: 'Mengikuti pelatihan Kurikulum Merdeka tingkat provinsi',
        harmonis: 'Menjaga hubungan kondusif dengan orang tua murid dan komite sekolah',
        loyal: 'Mematuhi tugas kepanitiaan ANBK dan ujian sekolah',
        adaptif: 'Mengembangkan media ajar digital interaktif berbasis Canva & Quizizz',
        kolaboratif: 'Berbagi modul pembelajaran di MGMP Matematika'
      },
      nomorSKPBKN: 'SKP-BKN/DISDIK/2026/1942',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 38.5,
      skorBobotSKP: 52.5,
      skorTotalKelayakan: 91.0,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Kinerja Baik dan kehadiran stabil 96.2%. Memenuhi syarat perpanjangan perjanjian kerja.'
    },
    statusDokumen: 'Validasi BKPSDM',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Rekomendasi_Kepsek_SMPN1_Siti_Nurhaliza.pdf',
      fileSize: '342 KB',
      uploadedAt: '18 Okt 2026, 11:20 WIB',
      hashSHA256: '4837fc9a1e809cb8d9e03498b82c3f198e09f58a74e5033bc6f0183204c38210',
      diverifikasiOleh: 'Kepala SMP Negeri 1 Bojongsoang'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/DISDIK/2026/112',
    sptjmTanggal: '18 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/SMPN1/2026/054',
    rekomendasiTanggal: '16 Oktober 2026',
    atasanNama: 'Drs. H. Maman Suryaman, M.M.Pd',
    atasanNip: '196903141994121001',
    atasanJabatan: 'Kepala SMP Negeri 1 Bojongsoang',
    kepalaOpdNama: 'H. Agus Firman, S.Sos, M.Si',
    kepalaOpdNip: '197108251996021001',
    kepalaOpdJabatan: 'Kepala Dinas Pendidikan',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: true,
      issues: []
    },
    enkripsi: {
      sptjmHashSHA256: '9b2c34d588e1e7920ab3ef52f10d938b8ca711824efb4a16f2898436cd932aa1',
      rekomendasiHashSHA256: '4837fc9a1e809cb8d9e03498b82c3f198e09f58a74e5033bc6f0183204c38210',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-18T11:40:12Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-2011-3829',
      isVerified: true
    },
    catatanAdmin: 'Rekomendasi atasan sudah diunggah dan diteken digital. Menunggu paraf Kepala BKPSDM.',
    updatedAt: '2026-10-18'
  },
  {
    id: 'pppk-003',
    nipPppk: '199311052023211008',
    nik: '3273100511930005',
    namaLengkap: 'Bambang Eko Wicaksono, S.Kom',
    gelarDepan: '',
    gelarBelakang: 'S.Kom',
    jabatan: 'Ahli Pertama - Pranata Komputer',
    golongan: 'IX',
    unitKerja: 'Bidang Aplikasi & Informatika / Diskominfo',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 99.2,
      totalHariKerja: 240,
      hadir: 238,
      izin: 1,
      sakit: 1,
      cuti: 0,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 15,
      terlambatFrekuensi: 1,
      catatanDisiplin: 'Kedisiplinan sangat baik, sering melakukan backup sistem dan maintenance malam hari.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Sangat Baik',
      skorHasilKerja: 97,
      skorPerilaku: 96,
      predikatPerilaku: 'Diatas Ekspektasi',
      nilaiAkhirSKP: 96.5,
      capaianTargetUtama: 'Mengembangkan portal integrasi SPBE, pemeliharaan 42 server dinas dengan SLA uptime 99.8%.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Menangani insiden tiket gangguan sistem OPD rata-rata di bawah 45 menit',
        akuntabel: 'Dokumentasi source code dan lisensi software tertata rapi dalam repositori privat pemerintah',
        kompeten: 'Sertifikasi Keamanan Siber CSIRT Pemerintah Daerah',
        harmonis: 'Membimbing tenaga operator pemula di seluruh dinas',
        loyal: 'Menjaga kerahasiaan data master kependudukan dan basis data ASN',
        adaptif: 'Mengimplementasikan teknologi containerisasi microservices di cloud pemda',
        kolaboratif: 'Integrasi API Satu Data dengan BPS dan Kementerian Dalam Negeri'
      },
      nomorSKPBKN: 'SKP-BKN/DISKOMINFO/2026/0211',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 39.7,
      skorBobotSKP: 58.2,
      skorTotalKelayakan: 97.9,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Kinerja sangat tinggi di bidang SPBE, kehadiran nyaris sempurna. Direkomendasikan perpanjangan perjanjian kerja.'
    },
    statusDokumen: 'Dokumen Terbit',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Surat_Rekomendasi_Kabid_Aptika_Bambang.pdf',
      fileSize: '512 KB',
      uploadedAt: '12 Okt 2026, 14:15 WIB',
      hashSHA256: '9845ef2091c78411d3840742ff82c9e7428bc41029e842410a8c2794cb10e742',
      diverifikasiOleh: 'Kepala Bidang Aplikasi dan Telematika'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/KOMINFO/2026/019',
    sptjmTanggal: '12 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/APTIKA/2026/043',
    rekomendasiTanggal: '11 Oktober 2026',
    atasanNama: 'Ir. Ahmad Zulkifli, M.T',
    atasanNip: '197509182001121002',
    atasanJabatan: 'Kepala Bidang Aplikasi dan Telematika',
    kepalaOpdNama: 'Dra. Yayan Maryana, M.Si',
    kepalaOpdNip: '196706121992032003',
    kepalaOpdJabatan: 'Kepala Dinas Komunikasi dan Informatika',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: true,
      issues: []
    },
    enkripsi: {
      sptjmHashSHA256: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
      rekomendasiHashSHA256: '9845ef2091c78411d3840742ff82c9e7428bc41029e842410a8c2794cb10e742',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-12T14:22:01Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-1008-8190',
      isVerified: true
    },
    catatanAdmin: 'Dokumen SPTJM dan Rekomendasi sudah terbit resmi dan tersimpan dalam enkripsi vault.',
    updatedAt: '2026-10-12'
  },
  {
    id: 'pppk-004',
    nipPppk: '199002182023211003',
    nik: '3205191802900007',
    namaLengkap: 'Rian Kurniawan, S.T',
    gelarDepan: '',
    gelarBelakang: 'S.T',
    jabatan: 'Ahli Pertama - Teknik Jalan dan Jembatan',
    golongan: 'IX',
    unitKerja: 'Dinas Bina Marga & Penataan Ruang',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 87.5,
      totalHariKerja: 240,
      hadir: 210,
      izin: 12,
      sakit: 14,
      cuti: 4,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 290,
      terlambatFrekuensi: 11,
      catatanDisiplin: 'Sering izin karena tugas lapangan jarak jauh, namun ada beberapa catatan keterlambatan presensi finger.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 83,
      skorPerilaku: 82,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 82.5,
      capaianTargetUtama: 'Pengawasan berkala 14 paket rekonstruksi jalan provinsi wilayah Priangan Timur, progres fisik 96%.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Merespons laporan lubang jalan dari aplikasi warga Sapawarga dalam waktu 24 jam',
        akuntabel: 'Laporan mutu beton dan aspal uji laboratorium valid dan terarsip',
        kompeten: 'Menguasai software estimasi anggaran dan pengawasan struktur jembatan',
        harmonis: 'Menjalin koordinasi teknis yang baik dengan konsultan pengawas',
        loyal: 'Bersedia ditugaskan inspeksi tanggap darurat longsor pada hari libur',
        adaptif: 'Memanfaatkan drone pemetaan untuk survey topografi lereng jalan',
        kolaboratif: 'Koordinasi lintas instansi dengan Balai Besar Jalan Nasional'
      },
      nomorSKPBKN: 'SKP-BKN/DBMPR/2026/0491',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 35.0,
      skorBobotSKP: 49.8,
      skorTotalKelayakan: 84.8,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Capaian fisik lapangan sangat baik, absensi 87.5% di atas standar minimal. Direkomendasikan perpanjangan.'
    },
    statusDokumen: 'Menunggu Verifikasi Atasan',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: false
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/DBMPR/2026/088',
    sptjmTanggal: '19 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/UPTD4/2026/019',
    rekomendasiTanggal: '18 Oktober 2026',
    atasanNama: 'Ir. Dadan Hamdani, M.Sc',
    atasanNip: '197204111998031003',
    atasanJabatan: 'Kepala UPTD Pengelolaan Jalan dan Jembatan Wilayah IV',
    kepalaOpdNama: 'Ir. H. Bambang Tirto, M.Eng',
    kepalaOpdNip: '196502041991031004',
    kepalaOpdJabatan: 'Kepala Dinas Bina Marga dan Penataan Ruang',
    validasi: {
      isValid: false,
      scoreKelayakanLolos: true,
      issues: [
        {
          field: 'dokumenPersyaratan',
          severity: 'error',
          message: 'Dokumen persyaratan belum lengkap: Surat Rekomendasi Atasan Langsung'
        }
      ]
    },
    enkripsi: {
      sptjmHashSHA256: '5d41402abc4b2a76b9719d911017c592ef9687e1f6e56847c5d9472cb9a239b6',
      rekomendasiHashSHA256: '099f830453531b402e3b610c324f92fa4441544a4964b77209ff8b49e2954848',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-19T08:15:30Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-1003-7721',
      isVerified: true
    },
    catatanAdmin: 'Menunggu atasan langsung mengunggah scan Surat Rekomendasi bertanda tangan basah atau TTE.',
    updatedAt: '2026-10-19'
  },
  {
    id: 'pppk-005',
    nipPppk: '198906152023211004',
    nik: '3206211506890001',
    namaLengkap: 'Dewi Anggraeni, S.Tr.Keb',
    gelarDepan: '',
    gelarBelakang: 'S.Tr.Keb',
    jabatan: 'Ahli Pertama - Bidan',
    golongan: 'IX',
    unitKerja: 'Puskesmas Cicalengka DTP / Dinas Kesehatan',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 94.8,
      totalHariKerja: 240,
      hadir: 227,
      izin: 6,
      sakit: 5,
      cuti: 2,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 85,
      terlambatFrekuensi: 5,
      catatanDisiplin: 'Tertib piket persalinan 24 jam di puskesmas rawat inap DTP.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 86,
      skorPerilaku: 85,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 85.5,
      capaianTargetUtama: 'Melayani 320 pertolongan persalinan normal dengan zero maternal mortality rate di wilayah kerja.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Pelayanan kebidanan ramah ibu dan bayi dengan senyum, sapa, salam',
        akuntabel: 'Laporan kohort ibu hamil terinput lengkap di aplikasi e-Kohort Kemkes',
        kompeten: 'Mengikuti re-sertifikasi Asuhan Persalinan Normal (APN)',
        harmonis: 'Membina kader posyandu di 12 desa dengan harmonis',
        loyal: 'Siap menjalankan tugas jemput bola skrining anemia pada remaja putri',
        adaptif: 'Pemanfaatan USG 2D portable puskesmas untuk deteksi dini komplikasi kehamilan',
        kolaboratif: 'Rujukan terencana dengan RSUD rujukan regional'
      },
      nomorSKPBKN: 'SKP-BKN/PKM-CKL/2026/0154',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 37.9,
      skorBobotSKP: 51.3,
      skorTotalKelayakan: 89.2,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Kinerja Baik, dedikasi pelayanan kesehatan ibu anak tinggi. Layak diperpanjang.'
    },
    statusDokumen: 'Disetujui',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Scan_Rekomendasi_Puskesmas_Cicalengka.pdf',
      fileSize: '298 KB',
      uploadedAt: '17 Okt 2026, 09:40 WIB',
      hashSHA256: 'f1e2d3c4b5a69780123456789abcdef0123456789abcdef0123456789abcdef0',
      diverifikasiOleh: 'Kepala UPTD Puskesmas Cicalengka'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/PKM/2026/067',
    sptjmTanggal: '17 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/PKM/2026/029',
    rekomendasiTanggal: '16 Oktober 2026',
    atasanNama: 'dr. Nenden Siti Rohmah',
    atasanNip: '197808242006042011',
    atasanJabatan: 'Kepala UPTD Puskesmas Cicalengka DTP',
    kepalaOpdNama: 'dr. H. Wahyudi, M.H.Kes',
    kepalaOpdNip: '197003191999031005',
    kepalaOpdJabatan: 'Kepala Dinas Kesehatan',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: true,
      issues: []
    },
    enkripsi: {
      sptjmHashSHA256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      rekomendasiHashSHA256: 'f1e2d3c4b5a69780123456789abcdef0123456789abcdef0123456789abcdef0',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-17T10:05:18Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-1004-6291',
      isVerified: true
    },
    catatanAdmin: 'Verifikasi BKPSDM rampung, telah memenuhi syarat untuk penerbitan SK Perpanjangan.',
    updatedAt: '2026-10-17'
  },
  {
    id: 'pppk-006',
    nipPppk: '199110252023211002',
    nik: '3204282510910004',
    namaLengkap: 'Fajar Nugraha, S.Sos',
    gelarDepan: '',
    gelarBelakang: 'S.Sos',
    jabatan: 'Ahli Pertama - Analis Kebijakan',
    golongan: 'IX',
    unitKerja: 'Bappeda / Badan Perencanaan Pembangunan Daerah',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 84.1,
      totalHariKerja: 240,
      hadir: 202,
      izin: 15,
      sakit: 19,
      cuti: 2,
      tanpaKeterangan: 2,
      totalKeterlambatanMenit: 340,
      terlambatFrekuensi: 14,
      catatanDisiplin: 'Terdapat 2 hari tanpa keterangan (Alpha) dan total keterlambatan akumulatif melebihi ambang 300 menit.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Butuh Perbaikan',
      skorHasilKerja: 71,
      skorPerilaku: 73,
      predikatPerilaku: 'Dibawah Ekspektasi',
      nilaiAkhirSKP: 72.0,
      capaianTargetUtama: 'Penyusunan naskah kajian RPJMD selesai terlambat 3 minggu dari target milestone triwulan III.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Cukup komunikatif dalam audiensi perencanaan kecamatan',
        akuntabel: 'Pengelolaan data dukung indikator makro daerah belum konsisten divalidasi',
        kompeten: 'Perlu penguatan metodologi perumusan indikator kinerja utama daerah',
        harmonis: 'Hubungan kerja baik dengan rekan sejawat',
        loyal: 'Mengikuti arahan pimpinan namun target waktu perlu ditingkatkan',
        adaptif: 'Masih lambat dalam transisi pengisian aplikasi SIPD-RI Kemendagri',
        kolaboratif: 'Cukup aktif dalam forum Musrenbang'
      },
      nomorSKPBKN: 'SKP-BKN/BAPPEDA/2026/0081',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 30.6,
      skorBobotSKP: 42.6,
      skorTotalKelayakan: 73.2,
      status: 'Tidak Layak Diperpanjang',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Kehadiran di bawah standar (84.1%) dan terdapat 2 hari Alpha. SKP Butuh Perbaikan (skor 73.2 < 75). Tidak memenuhi syarat minimal perpanjangan kontrak.'
    },
    statusDokumen: 'Perlu Revisi',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: false,
      suratRekomendasiAtasan: false
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/BAPPEDA/2026/PENDING',
    sptjmTanggal: '19 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/BAPPEDA/2026/012',
    rekomendasiTanggal: '19 Oktober 2026',
    atasanNama: 'Drs. H. Dedi Supriadi, M.Si',
    atasanNip: '197302141997031002',
    atasanJabatan: 'Kepala Bidang Perencanaan & Evaluasi Pembangunan',
    kepalaOpdNama: 'H. Erwin Rinaldi, S.T, M.T',
    kepalaOpdNip: '196904121995031003',
    kepalaOpdJabatan: 'Kepala Bappeda',
    validasi: {
      isValid: false,
      scoreKelayakanLolos: false,
      issues: [
        {
          field: 'persentaseKehadiran',
          severity: 'error',
          message: 'Tingkat kehadiran (84.1%) berada di bawah standar minimal regulasi (85%)'
        },
        {
          field: 'dokumenPersyaratan',
          severity: 'error',
          message: 'Dokumen persyaratan belum lengkap: Surat Bebas Hukuman Disiplin, Surat Rekomendasi Atasan Langsung'
        }
      ]
    },
    enkripsi: {
      sptjmHashSHA256: 'e892c4b18974a6210ef82194a00472e90c8a529348b6107294821cde91048a12',
      rekomendasiHashSHA256: '7291a4b802149e8a719c8241072049e8174b29c480172e94817a02c81940e712',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-19T16:00:20Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-1002-PENDING',
      isVerified: false
    },
    catatanAdmin: 'Pengajuan ditahan oleh BKPSDM: Surat Bebas Hukuman Disiplin dan Surat Rekomendasi belum diunggah.',
    updatedAt: '2026-10-19'
  },
  {
    id: 'pppk-007',
    nipPppk: '198703122023211001',
    nik: '3204091203870009',
    namaLengkap: 'Ir. Agus Sunandar',
    gelarDepan: 'Ir.',
    gelarBelakang: '',
    jabatan: 'Ahli Pertama - Pengendali Dampak Lingkungan',
    golongan: 'IX',
    unitKerja: 'Dinas Lingkungan Hidup',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-11-20',
    sisaHariKontrak: 30, // H-30 Critical!
    evaluasiAbsensi: {
      persentaseKehadiran: 71.2,
      totalHariKerja: 240,
      hadir: 171,
      izin: 22,
      sakit: 41,
      cuti: 1,
      tanpaKeterangan: 5,
      totalKeterlambatanMenit: 620,
      terlambatFrekuensi: 24,
      catatanDisiplin: 'Mangkir dan tidak aktif bekerja selama 3 bulan terakhir berturut-turut.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Kurang',
      skorHasilKerja: 54,
      skorPerilaku: 58,
      predikatPerilaku: 'Dibawah Ekspektasi',
      nilaiAkhirSKP: 56.0,
      capaianTargetUtama: 'Target pengawasan baku mutu limbah industri hanya tercapai 35% dari target tahunan.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Lambat merespons aduan pencemaran sungai dari masyarakat',
        akuntabel: 'Laporan berita acara uji laboratorium tidak selesai sesuai jadwal kerja',
        kompeten: 'Belum memperbarui sertifikasi keahlian analis lingkungan',
        harmonis: 'Kurang proaktif koordinasi dengan seksi penegakan hukum lingkungan',
        loyal: 'Sering tidak hadir pada apel dinas dan penugasan khusus',
        adaptif: 'Menolak penggunaan aplikasi pelaporan digital lingkungan',
        kolaboratif: 'Koordinasi lintas instansi minim'
      },
      nomorSKPBKN: 'SKP-BKN/DLH/2026/0019',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 21.5,
      skorBobotSKP: 32.4,
      skorTotalKelayakan: 53.9,
      status: 'Tidak Aktif Bekerja',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai berstatus Tidak Aktif Bekerja / mangkir tugas dinas. Disarankan pemberhentian dengan hormat tidak atas permintaan sendiri.'
    },
    statusDokumen: 'Perlu Revisi',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: false,
      suratBebasHukumanDisiplin: false,
      suratRekomendasiAtasan: false
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/DLH/2026/DITOLAK',
    sptjmTanggal: '20 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/DLH/2026/TMS-02',
    rekomendasiTanggal: '20 Oktober 2026',
    atasanNama: 'H. Tatang Supriatna, S.T, M.M',
    atasanNip: '197008121996031002',
    atasanJabatan: 'Kepala Bidang Pengendalian Pencemaran & Kerusakan LH',
    kepalaOpdNama: 'Drs. H. Asep Kusumah, M.Si',
    kepalaOpdNip: '196803251993031002',
    kepalaOpdJabatan: 'Kepala Dinas Lingkungan Hidup',
    validasi: {
      isValid: false,
      scoreKelayakanLolos: false,
      issues: [
        {
          field: 'persentaseKehadiran',
          severity: 'error',
          message: 'Tingkat kehadiran (71.2%) sangat jauh di bawah standar minimal 85%'
        },
        {
          field: 'tanpaKeterangan',
          severity: 'error',
          message: 'Terdapat 5 hari tanpa keterangan (Alpha), melanggar PP Disiplin ASN'
        }
      ]
    },
    enkripsi: {
      sptjmHashSHA256: 'f87a6c9e0b1274a89c72e91048b172a91048b6107294821cde91048a12847291',
      rekomendasiHashSHA256: '9182736450192837465019283746501928374650192837465019283746501928',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-20T17:10:00Z',
      bsreDigitalCertId: 'BSrE-2026-REKOM-1001-DITOLAK',
      isVerified: false
    },
    catatanAdmin: 'Pegawai tidak aktif bekerja. Menunggu sidang majelis kode etik dan disiplin ASN.',
    updatedAt: '2026-10-20'
  },
  {
    id: 'pppk-008',
    nipPppk: '199401182023212009',
    nik: '3204355801940003',
    namaLengkap: 'apt. Rina Marlina, S.Farm',
    gelarDepan: 'apt.',
    gelarBelakang: 'S.Farm',
    jabatan: 'Ahli Pertama - Apoteker',
    golongan: 'X',
    unitKerja: 'Instalasi Farmasi RSUD Soreang',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 97.5,
      totalHariKerja: 240,
      hadir: 234,
      izin: 3,
      sakit: 3,
      cuti: 0,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 40,
      terlambatFrekuensi: 3,
      catatanDisiplin: 'Sangat disiplin dalam tata kelola perbekalan farmasi rumah sakit.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 89,
      skorPerilaku: 88,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 88.5,
      capaianTargetUtama: 'Pengelolaan obat buffer stock aman zero expired stock, kecepatan penyerahan resep rawat jalan < 15 menit.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Konseling obat pasien kronis ramah dan edukatif',
        akuntabel: 'Laporan narkotika dan psikotropika (SIPNAP) terinput 100% tepat waktu ke Kemenkes',
        kompeten: 'Mengikuti seminar formularium obat nasional terkini',
        harmonis: 'Kolaborasi sinergis dengan dokter spesialis dan perawat ruangan',
        loyal: 'Siap piket ketersediaan logistik obat saat libur hari raya',
        adaptif: 'Mengoptimalkan barcode scanning verifikasi 5 benar obat',
        kolaboratif: 'Kerja sama dengan BPOM dan Dinkes dalam uji petik obat'
      },
      nomorSKPBKN: 'SKP-BKN/RSUD-SRG/2026/0309',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 39.0,
      skorBobotSKP: 53.4,
      skorTotalKelayakan: 92.4,
      status: 'Layak Diperpanjang',
      rekomendasiDurasiTahun: 1,
      catatanRekomendasi: 'Kinerja Baik dengan kedisiplinan 97.5%. Memenuhi syarat perpanjangan perjanjian kerja.'
    },
    statusDokumen: 'Disetujui',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Surat_Rekomendasi_Direktur_RSUD_Soreang.pdf',
      fileSize: '462 KB',
      uploadedAt: '16 Okt 2026, 15:10 WIB',
      hashSHA256: 'c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
      diverifikasiOleh: 'Direktur RSUD Soreang'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/RSUD-SRG/2026/045',
    sptjmTanggal: '16 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/IFRS/2026/018',
    rekomendasiTanggal: '15 Oktober 2026',
    atasanNama: 'dr. H. Rahmat Mulyadi, Sp.B',
    atasanNip: '197105151999031004',
    atasanJabatan: 'Direktur RSUD Soreang',
    kepalaOpdNama: 'dr. H. Wahyudi, M.H.Kes',
    kepalaOpdNip: '197003191999031005',
    kepalaOpdJabatan: 'Kepala Dinas Kesehatan',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: true,
      issues: []
    },
    enkripsi: {
      sptjmHashSHA256: 'b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
      rekomendasiHashSHA256: 'c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-16T15:20:10Z',
      bsreDigitalCertId: 'BSrE-2026-SPTJM-2009-4412',
      isVerified: true
    },
    catatanAdmin: 'Seluruh berkas memenuhi syarat teknis BKN. Telah diajukan ke BKN Regional III.',
    updatedAt: '2026-10-16'
  },
  {
    id: 'pppk-009',
    nipPppk: '199305142023211006',
    nik: '3204121405930007',
    namaLengkap: 'Yusuf Maulana, S.AP',
    gelarDepan: '',
    gelarBelakang: 'S.AP',
    jabatan: 'Ahli Pertama - Arsiparis',
    golongan: 'IX',
    unitKerja: 'Dinas Perpustakaan & Kearsipan Daerah',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 93.5,
      totalHariKerja: 240,
      hadir: 224,
      izin: 8,
      sakit: 8,
      cuti: 0,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 60,
      terlambatFrekuensi: 3,
      catatanDisiplin: 'Tertib administrasi kearsipan.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik (08:31 WIB)'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 84,
      skorPerilaku: 85,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 84.5,
      capaianTargetUtama: 'Digitalisasi 8.500 warkat arsip dinas statis daerah.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Melayani temu kembali arsip cepat',
        akuntabel: 'Berita acara pemusnahan arsip tertib',
        kompeten: 'Sertifikasi kearsipan nasional ANRI',
        harmonis: 'Kolaboratif dengan unit kearsipan OPD',
        loyal: 'Menjaga kerahasiaan arsip daerah',
        adaptif: 'Implementasi aplikasi SRIKANDI',
        kolaboratif: 'Bimtek arsip desa'
      },
      nomorSKPBKN: 'SKP-BKN/DISPUSIP/2026/0122',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN (08:30 WIB)'
    },
    kelayakan: {
      skorBobotAbsensi: 37.4,
      skorBobotSKP: 50.7,
      skorTotalKelayakan: 88.1,
      status: 'Mengundurkan Diri',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai telah mengajukan permohonan pengunduran diri atas permintaan sendiri per 1 November 2026.'
    },
    statusDokumen: 'Disetujui',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Surat_Pengunduran_Diri_dan_Rekomendasi_Yusuf.pdf',
      fileSize: '310 KB',
      uploadedAt: '14 Okt 2026, 10:15 WIB',
      hashSHA256: 'aa11bb22cc33dd44ee55ff6677889900aabbccddeeff00112233445566778899',
      diverifikasiOleh: 'Kepala Dispusip'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/DISPUSIP/2026/018',
    sptjmTanggal: '14 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/DISPUSIP/2026/009',
    rekomendasiTanggal: '13 Oktober 2026',
    atasanNama: 'Dra. Hj. Tri Astuti, M.Si',
    atasanNip: '197305111997032001',
    atasanJabatan: 'Kepala Bidang Pengelolaan Arsip',
    kepalaOpdNama: 'Drs. H. Yosep Nugraha, M.Si',
    kepalaOpdNip: '196908151995031003',
    kepalaOpdJabatan: 'Kepala Dinas Perpustakaan dan Kearsipan',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: false,
      issues: [
        {
          field: 'status',
          severity: 'info',
          message: 'Pegawai dalam proses penetapan pemberhentian atas permintaan sendiri (Mengundurkan Diri)'
        }
      ]
    },
    enkripsi: {
      sptjmHashSHA256: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff',
      rekomendasiHashSHA256: 'aa11bb22cc33dd44ee55ff6677889900aabbccddeeff00112233445566778899',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-14T10:20:00Z',
      bsreDigitalCertId: 'BSrE-2026-RESIGN-1006-8812',
      isVerified: true
    },
    catatanAdmin: 'Surat pengunduran diri sah dan telah disetujui Kepala Perangkat Daerah.',
    updatedAt: '2026-10-14'
  },
  {
    id: 'pppk-010',
    nipPppk: '198509212023211003',
    nik: '3204192109850005',
    namaLengkap: 'Alm. Wahyu Hidayat, A.Md',
    gelarDepan: 'Alm.',
    gelarBelakang: 'A.Md',
    jabatan: 'Terampil - Pranata Laboratorium Kesehatan',
    golongan: 'VII',
    unitKerja: 'Laboratorium Kesehatan Daerah / Dinkes',
    instansi: 'Pemerintah Kabupaten Bangkalan',
    tmtKontrakAwal: '2022-01-01',
    tmtKontrakAkhir: '2026-12-31',
    sisaHariKontrak: 71,
    evaluasiAbsensi: {
      persentaseKehadiran: 90.0,
      totalHariKerja: 240,
      hadir: 216,
      izin: 4,
      sakit: 20,
      cuti: 0,
      tanpaKeterangan: 0,
      totalKeterlambatanMenit: 30,
      terlambatFrekuensi: 2,
      catatanDisiplin: 'Berhalangan tetap karena wafat dalam masa penugasan kedinasan.',
      terakhirDisinkronkan: 'Terverifikasi Live Biometrik'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja: 'Baik',
      skorHasilKerja: 85,
      skorPerilaku: 85,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: 85.0,
      capaianTargetUtama: 'Pemeriksaan spesimen mikrobiologi air bersih dan makanan daerah.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Pelayanan uji lab cepat',
        akuntabel: 'Kalibrasi alat berkala',
        kompeten: 'Ahli uji kultur bakteri',
        harmonis: 'Rekan kerja kooperatif',
        loyal: 'Dedikasi tinggi terhadap laboratorium',
        adaptif: 'Penggunaan LIS digital',
        kolaboratif: 'Rujukan lab kesda'
      },
      nomorSKPBKN: 'SKP-BKN/LABKESDA/2026/0074',
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN'
    },
    kelayakan: {
      skorBobotAbsensi: 36.0,
      skorBobotSKP: 51.0,
      skorTotalKelayakan: 87.0,
      status: 'Meninggal Dunia',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai telah meninggal dunia (berhalangan tetap). Berkas diproses untuk pemberian santunan dan hak pensiun/purna tugas kepegawaian.'
    },
    statusDokumen: 'Disetujui',
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: false,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    suratRekomendasiUpload: {
      fileName: 'Surat_Keterangan_Kematian_dan_Rekomendasi.pdf',
      fileSize: '380 KB',
      uploadedAt: '05 Okt 2026, 14:00 WIB',
      hashSHA256: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
      diverifikasiOleh: 'Kepala Labkesda'
    },
    sptjmNomor: '800.1.2/SPTJM-PPPK/LABKESDA/2026/WAFAT',
    sptjmTanggal: '05 Oktober 2026',
    rekomendasiNomor: '800/REKOM-PPPK/LABKESDA/2026/004',
    rekomendasiTanggal: '04 Oktober 2026',
    atasanNama: 'dr. Hj. Euis Kurniasih, Sp.PK',
    atasanNip: '197604182003122002',
    atasanJabatan: 'Kepala UPTD Labkesda',
    kepalaOpdNama: 'dr. H. Wahyudi, M.H.Kes',
    kepalaOpdNip: '197003191999031005',
    kepalaOpdJabatan: 'Kepala Dinas Kesehatan',
    validasi: {
      isValid: true,
      scoreKelayakanLolos: false,
      issues: [
        {
          field: 'status',
          severity: 'info',
          message: 'Status kepegawaian: Meninggal Dunia. Telah melampirkan akta kematian resmi.'
        }
      ]
    },
    enkripsi: {
      sptjmHashSHA256: '3344556677889900aabbccddeeff0011223344556677889900aabbccddeeff00',
      rekomendasiHashSHA256: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
      algorithm: 'SHA-256 + AES-256-GCM',
      signatureTimestamp: '2026-10-05T14:10:00Z',
      bsreDigitalCertId: 'BSrE-2026-WAFAT-1003-9941',
      isVerified: true
    },
    catatanAdmin: 'Pengurusan hak santunan duka cita dan asuransi Taspen sedang diproses.',
    updatedAt: '2026-10-05'
  }
];

export const INITIAL_SCHEDULES: EvaluationSchedule[] = [
  {
    id: 'eval-sch-01',
    namaKegiatan: 'Evaluasi Kinerja Triwulan IV & Finalisasi Rekapitulasi Tahunan',
    jenisEvaluasi: 'Tahunan Akhir',
    periodeTahun: 2026,
    tanggalMulai: '2026-10-01',
    tanggalSelesai: '2026-11-15',
    targetUnitKerja: 'Seluruh Perangkat Daerah (OPD, Dinas, RSUD, Kecamatan)',
    totalPegawaiSasaran: 148,
    sudahSelesaiEvaluasi: 122,
    status: 'Sedang Berjalan',
    sisaHari: 25,
    channelNotifikasi: ['Email', 'WhatsApp Gateway', 'SIMPEG Push'],
    pengingatTerakhirDikirim: 'Kemarin, 09:00 WIB'
  },
  {
    id: 'eval-sch-02',
    namaKegiatan: 'Pemberkasan Khusus Masa Kontrak Habis H-60 (Angkatan Formasi 2022)',
    jenisEvaluasi: 'H-60 Habis Kontrak',
    periodeTahun: 2026,
    tanggalMulai: '2026-10-10',
    tanggalSelesai: '2026-11-05',
    targetUnitKerja: 'Dinas Pendidikan, Dinas Kesehatan, Diskominfo',
    totalPegawaiSasaran: 56,
    sudahSelesaiEvaluasi: 48,
    status: 'Sedang Berjalan',
    sisaHari: 15,
    channelNotifikasi: ['WhatsApp Gateway', 'Portal ASN'],
    pengingatTerakhirDikirim: '18 Oktober 2026'
  },
  {
    id: 'eval-sch-03',
    namaKegiatan: 'Peringatan Batas Akhir Unggah Rekomendasi Atasan & SPTJM H-30',
    jenisEvaluasi: 'H-30 Habis Kontrak',
    periodeTahun: 2026,
    tanggalMulai: '2026-10-20',
    tanggalSelesai: '2026-10-31',
    targetUnitKerja: 'Dinas Lingkungan Hidup, Satpol PP, Dishub',
    totalPegawaiSasaran: 12,
    sudahSelesaiEvaluasi: 4,
    status: 'Mendekati Batas Akhir',
    sisaHari: 10,
    channelNotifikasi: ['Email', 'WhatsApp Gateway', 'SIMPEG Push', 'Portal ASN'],
    pengingatTerakhirDikirim: 'Hari ini, 07:30 WIB'
  },
  {
    id: 'eval-sch-04',
    namaKegiatan: 'Kickoff Rencana Penetapan SKP BerAKHLAK Triwulan I Tahun Depan',
    jenisEvaluasi: 'Triwulan I',
    periodeTahun: 2027,
    tanggalMulai: '2027-01-05',
    tanggalSelesai: '2027-01-31',
    targetUnitKerja: 'Seluruh Unit Kerja',
    totalPegawaiSasaran: 160,
    sudahSelesaiEvaluasi: 0,
    status: 'Akan Datang',
    sisaHari: 75,
    channelNotifikasi: ['SIMPEG Push', 'Portal ASN']
  }
];

export const INITIAL_AUDIT_LOGS: VerificationAuditLog[] = [
  {
    id: 'audit-01',
    pppkId: 'pppk-001',
    namaPegawai: 'dr. Hendra Pratama',
    jenisDokumen: 'SPTJM',
    hashSHA256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    diverifikasiOleh: 'Verifikator BKPSDA Kab. Bangkalan (NIP: 198205152008011006)',
    waktuVerifikasi: '15 Okt 2026, 09:15 WIB',
    statusValidasi: 'Valid & Terotentikasi',
    ipAddress: '10.24.112.45 (Intranet ASN)',
    keterangan: 'Tanda tangan digital BSrE valid, naskah rekomendasi terunggah resmi.'
  },
  {
    id: 'audit-02',
    pppkId: 'pppk-003',
    namaPegawai: 'Bambang Eko Wicaksono, S.Kom',
    jenisDokumen: 'Rekomendasi Atasan',
    hashSHA256: '9845ef2091c78411d3840742ff82c9e7428bc41029e842410a8c2794cb10e742',
    diverifikasiOleh: 'Inspektorat Kab. Bangkalan (Tim Audit Kepatuhan)',
    waktuVerifikasi: '13 Okt 2026, 14:30 WIB',
    statusValidasi: 'Valid & Terotentikasi',
    ipAddress: '10.24.88.19 (Pemerintah Kota)',
    keterangan: 'Surat Rekomendasi terunggah dan diverifikasi valid tanpa modifikasi.'
  },
  {
    id: 'audit-03',
    pppkId: 'pppk-006',
    namaPegawai: 'Fajar Nugraha, S.Sos',
    jenisDokumen: 'Paket Usulan Lengkap',
    hashSHA256: 'e892c4b18974a6210ef82194a00472e90c8a529348b6107294821cde91048a12',
    diverifikasiOleh: 'Sistem Validasi Otomatis SIM-PPPK',
    waktuVerifikasi: '19 Okt 2026, 16:02 WIB',
    statusValidasi: 'Integritas Tidak Sesuai',
    ipAddress: '127.0.0.1 (Local Engine)',
    keterangan: 'Peringatan: Surat Rekomendasi Atasan Langsung belum diunggah.'
  }
];
