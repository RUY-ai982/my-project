import {
  EvaluasiAbsensi,
  EvaluasiSKP,
  KelayakanPerpanjangan,
  BobotKonfigurasi,
  PredikatSKP,
  StatusKelayakan
} from '../types/pppk';

export const DEFAULT_BOBOT: BobotKonfigurasi = {
  bobotAbsensi: 40, // 40%
  bobotSKP: 60, // 60%
  ambangBatasMinimalAbsensi: 85, // Min 85% attendance
  ambangBatasMinimalSKP: 75, // Min 75 (Predikat Baik)
  ambangMinimalLayak: 75, // Min 75 combined score for 'Layak Diperpanjang'
};

/**
 * Converts SKP verbal rating to numeric equivalent base
 */
export function getSKPBaseScore(predikat: PredikatSKP, skorHasilKerja: number): number {
  if (skorHasilKerja && skorHasilKerja > 0) {
    return skorHasilKerja;
  }
  switch (predikat) {
    case 'Sangat Baik':
      return 96;
    case 'Baik':
      return 85;
    case 'Butuh Perbaikan':
      return 70;
    case 'Kurang':
      return 55;
    case 'Sangat Kurang':
      return 35;
    default:
      return 80;
  }
}

/**
 * Calculates attendance discipline deduction
 * Deducts penalty for unexcused absences (alpha) and excessive tardiness
 */
export function getAdjustedAttendanceScore(absensi: EvaluasiAbsensi): number {
  let score = absensi.persentaseKehadiran;
  
  // Penalty for unexcused absence (alpha) - minus 3.5 pts per alpha day
  if (absensi.tanpaKeterangan > 0) {
    score -= absensi.tanpaKeterangan * 3.5;
  }
  
  // Penalty for extreme cumulative tardiness (> 300 minutes in evaluation period)
  if (absensi.totalKeterlambatanMenit > 300) {
    const penalty = Math.min(5, Math.floor((absensi.totalKeterlambatanMenit - 300) / 100));
    score -= penalty;
  }

  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

/**
 * Calculates total eligibility score and contract extension recommendation
 */
export function calculateKelayakan(
  absensi: EvaluasiAbsensi,
  skp: EvaluasiSKP,
  config: BobotKonfigurasi = DEFAULT_BOBOT,
  manualStatus?: StatusKelayakan
): KelayakanPerpanjangan {
  const adjustedAbsensi = getAdjustedAttendanceScore(absensi);
  const baseSKP = getSKPBaseScore(skp.predikatKinerja, skp.skorHasilKerja || skp.nilaiAkhirSKP);
  
  // Weighted calculation
  const skorBobotAbsensi = (adjustedAbsensi * config.bobotAbsensi) / 100;
  const skorBobotSKP = (baseSKP * config.bobotSKP) / 100;
  const skorTotal = Math.round((skorBobotAbsensi + skorBobotSKP) * 10) / 10;

  // Preserve manual non-performance administrative statuses
  if (manualStatus === 'Mengundurkan Diri') {
    return {
      skorBobotAbsensi: Math.round(skorBobotAbsensi * 10) / 10,
      skorBobotSKP: Math.round(skorBobotSKP * 10) / 10,
      skorTotalKelayakan: skorTotal,
      status: 'Mengundurkan Diri',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai telah mengajukan surat pengunduran diri secara resmi. Perjanjian kerja tidak diperpanjang.'
    };
  }

  if (manualStatus === 'Meninggal Dunia') {
    return {
      skorBobotAbsensi: Math.round(skorBobotAbsensi * 10) / 10,
      skorBobotSKP: Math.round(skorBobotSKP * 10) / 10,
      skorTotalKelayakan: skorTotal,
      status: 'Meninggal Dunia',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai berhalangan tetap (meninggal dunia). Pemrosesan hak purna tugas dan santunan kepegawaian.'
    };
  }

  if (manualStatus === 'Tidak Aktif Bekerja') {
    return {
      skorBobotAbsensi: Math.round(skorBobotAbsensi * 10) / 10,
      skorBobotSKP: Math.round(skorBobotSKP * 10) / 10,
      skorTotalKelayakan: skorTotal,
      status: 'Tidak Aktif Bekerja',
      rekomendasiDurasiTahun: 0,
      catatanRekomendasi: 'Pegawai dalam status tidak aktif bekerja / cuti di luar tanggungan / mangkir penugasan dinas.'
    };
  }

  let status: StatusKelayakan;
  let rekomendasiDurasiTahun = 0;
  let catatanRekomendasi = '';

  // Critical performance/attendance checks
  const isAbsensiKritis = absensi.persentaseKehadiran < config.ambangBatasMinimalAbsensi;
  const isSKPKritis = skp.predikatKinerja === 'Kurang' || skp.predikatKinerja === 'Sangat Kurang';
  const isSkorRendah = skorTotal < config.ambangMinimalLayak;

  if (isSKPKritis || isAbsensiKritis || isSkorRendah || absensi.tanpaKeterangan > 3) {
    status = 'Tidak Layak Diperpanjang';
    rekomendasiDurasiTahun = 0;
    catatanRekomendasi = `Tidak memenuhi kriteria kelayakan perpanjangan kontrak berdasarkan capaian presensi (${absensi.persentaseKehadiran}%), predikat SKP (${skp.predikatKinerja}), atau skor akumulatif (${skorTotal} < ${config.ambangMinimalLayak}).`;
  } else {
    status = 'Layak Diperpanjang';
    rekomendasiDurasiTahun = 1;
    catatanRekomendasi = `Memenuhi standar kelayakan perpanjangan perjanjian kerja berdasarkan kedisiplinan presensi (${absensi.persentaseKehadiran}%) dan predikat SKP (${skp.predikatKinerja}). Direkomendasikan untuk perpanjangan masa kontrak kerja.`;
  }

  return {
    skorBobotAbsensi: Math.round(skorBobotAbsensi * 10) / 10,
    skorBobotSKP: Math.round(skorBobotSKP * 10) / 10,
    skorTotalKelayakan: skorTotal,
    status,
    rekomendasiDurasiTahun,
    catatanRekomendasi
  };
}
