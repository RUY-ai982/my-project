export type PredikatSKP = 'Sangat Baik' | 'Baik' | 'Butuh Perbaikan' | 'Kurang' | 'Sangat Kurang';
export type PredikatPerilaku = 'Diatas Ekspektasi' | 'Sesuai Ekspektasi' | 'Dibawah Ekspektasi';

export type StatusKelayakan = 
  | 'Layak Diperpanjang'
  | 'Tidak Layak Diperpanjang'
  | 'Mengundurkan Diri'
  | 'Meninggal Dunia'
  | 'Tidak Aktif Bekerja';

export type StatusDokumen = 
  | 'Draft'
  | 'Menunggu Verifikasi Atasan'
  | 'Validasi BKPSDM'
  | 'Disetujui'
  | 'Dokumen Terbit'
  | 'Perlu Revisi';

export interface EvaluasiAbsensi {
  persentaseKehadiran: number; // e.g., 97.4
  totalHariKerja: number;
  hadir: number;
  izin: number;
  sakit: number;
  cuti: number;
  tanpaKeterangan: number; // Alpha
  totalKeterlambatanMenit: number;
  terlambatFrekuensi: number;
  catatanDisiplin: string;
  terakhirDisinkronkan: string;
}

export interface EvaluasiSKP {
  tahunEvaluasi: number;
  predikatKinerja: PredikatSKP;
  skorHasilKerja: number; // 0 - 100
  skorPerilaku: number; // 0 - 100
  predikatPerilaku: PredikatPerilaku;
  nilaiAkhirSKP: number; // combined score
  capaianTargetUtama: string;
  perilakuBerAKHLAK: {
    berorientasiPelayanan: string;
    akuntabel: string;
    kompeten: string;
    harmonis: string;
    loyal: string;
    adaptif: string;
    kolaboratif: string;
  };
  nomorSKPBKN: string;
  terakhirDisinkronkan: string;
}

export interface KelayakanPerpanjangan {
  skorBobotAbsensi: number; // score after attendance weight applied
  skorBobotSKP: number; // score after SKP weight applied
  skorTotalKelayakan: number; // 0 - 100
  status: StatusKelayakan;
  rekomendasiDurasiTahun: number;
  catatanRekomendasi: string;
}

export interface DokumenPersyaratan {
  ktp: boolean;
  skPengangkatanAwal: boolean;
  rekapPresensiResmi: boolean;
  lembarPenilaianSKP: boolean;
  suratKeteranganSehat: boolean;
  suratBebasHukumanDisiplin: boolean;
  suratRekomendasiAtasan: boolean;
}

export interface SuratRekomendasiUpload {
  fileName: string;
  fileSize: number | string;
  fileType?: string;
  uploadedAt: string;
  uploadTimestamp?: string;
  fileDataUrl?: string; // base64 or preview url
  hashSHA256?: string;
  catatan?: string;
  diverifikasiOleh?: string;
}

export interface ValidasiIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ValidasiResult {
  isValid: boolean;
  scoreKelayakanLolos: boolean;
  issues: ValidasiIssue[];
}

export interface EnkripsiDokumen {
  sptjmHashSHA256: string;
  rekomendasiHashSHA256: string;
  algorithm: string;
  signatureTimestamp: string;
  bsreDigitalCertId: string;
  isVerified: boolean;
}

export interface PPPKEmployee {
  id: string;
  nipPppk: string; // 18-digit NI PPPK format
  nik: string; // 16-digit NIK
  namaLengkap: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  jabatan: string;
  golongan: string; // e.g., 'IX', 'X', 'VII'
  unitKerja: string; // OPD / Satuan Kerja
  instansi: string; // Pemerintah Kota / Dinas / BUMD
  tmtKontrakAwal: string; // YYYY-MM-DD
  tmtKontrakAkhir: string; // YYYY-MM-DD
  sisaHariKontrak: number;
  
  // Evaluation components
  evaluasiAbsensi: EvaluasiAbsensi;
  evaluasiSKP: EvaluasiSKP;
  kelayakan: KelayakanPerpanjangan;
  
  // Document workflow
  statusDokumen: StatusDokumen;
  dokumenPersyaratan: DokumenPersyaratan;
  suratRekomendasiUpload?: SuratRekomendasiUpload;
  
  // Official references
  sptjmNomor: string;
  sptjmTanggal: string;
  rekomendasiNomor: string;
  rekomendasiTanggal: string;
  
  // Superior (Atasan Langsung)
  atasanNama: string;
  atasanNip: string;
  atasanJabatan: string;
  
  // Pejabat Pembina / Kepala Dinas
  kepalaOpdNama: string;
  kepalaOpdNip: string;
  kepalaOpdJabatan: string;
  
  // Validation & Security
  validasi: ValidasiResult;
  enkripsi: EnkripsiDokumen;
  
  catatanAdmin?: string;
  updatedAt: string;
}

export interface BobotKonfigurasi {
  bobotAbsensi: number; // default 40%
  bobotSKP: number; // default 60%
  ambangBatasMinimalAbsensi: number; // default 85%
  ambangBatasMinimalSKP: number; // default 75 (Baik)
  ambangMinimalLayak: number; // default 75 (Passing score for Layak Diperpanjang)
}
