export interface EvaluationSchedule {
  id: string;
  namaKegiatan: string;
  jenisEvaluasi: 'Triwulan I' | 'Triwulan II' | 'Triwulan III' | 'Tahunan Akhir' | 'H-60 Habis Kontrak' | 'H-30 Habis Kontrak';
  periodeTahun: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetUnitKerja: string;
  totalPegawaiSasaran: number;
  sudahSelesaiEvaluasi: number;
  status: 'Akan Datang' | 'Sedang Berjalan' | 'Mendekati Batas Akhir' | 'Selesai';
  sisaHari: number;
  channelNotifikasi: ('Email' | 'WhatsApp Gateway' | 'SIMPEG Push' | 'Portal ASN')[];
  pengingatTerakhirDikirim?: string;
}

export interface ApiSyncLog {
  id: string;
  namaLayanan: 'BKN e-Kinerja SIASN' | 'Presensi Biometrik & Geotag' | 'SIMPEG Kepegawaian Pusat';
  endpoint: string;
  metode: 'GET' | 'POST';
  waktuSync: string;
  statusKode: number;
  durasiMs: number;
  jumlahRecord: number;
  status: 'Sukses' | 'Gagal' | 'Sebagian Sinkron';
  detailPayload: string;
}

export interface VerificationAuditLog {
  id: string;
  pppkId: string;
  namaPegawai: string;
  jenisDokumen: 'SPTJM' | 'Rekomendasi Atasan' | 'Paket Usulan Lengkap';
  hashSHA256: string;
  diverifikasiOleh: string;
  waktuVerifikasi: string;
  statusValidasi: 'Valid & Terotentikasi' | 'Integritas Tidak Sesuai' | 'Kedaluwarsa';
  ipAddress: string;
  keterangan: string;
}
