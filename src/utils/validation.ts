import { PPPKEmployee, ValidasiResult, ValidasiIssue } from '../types/pppk';

/**
 * Validates Indonesian NI PPPK (18 digits)
 * Standard BKN pattern: YYYYMMDD (birth date) + YYYYMM (appointment) + G (gender 1=M, 2=F) + NNN (sequence)
 */
export function validateNIPPPK(nip: string): { valid: boolean; message?: string } {
  const cleaned = nip.replace(/\s+/g, '');
  if (!cleaned) {
    return { valid: false, message: 'NI PPPK wajib diisi' };
  }
  if (!/^\d{18}$/.test(cleaned)) {
    return { valid: false, message: `Panjang NI PPPK harus tepat 18 digit angka (saat ini ${cleaned.length} digit)` };
  }
  
  // Basic date validity in NIP
  const year = parseInt(cleaned.slice(0, 4), 10);
  const month = parseInt(cleaned.slice(4, 6), 10);
  const day = parseInt(cleaned.slice(6, 8), 10);
  
  if (year < 1950 || year > 2010 || month < 1 || month > 12 || day < 1 || day > 31) {
    return { valid: false, message: 'Format tanggal lahir pada NI PPPK (8 digit pertama) tidak valid' };
  }

  return { valid: true };
}

/**
 * Validates Indonesian NIK (16 digits)
 */
export function validateNIK(nik: string): { valid: boolean; message?: string } {
  const cleaned = nik.replace(/\s+/g, '');
  if (!cleaned) {
    return { valid: false, message: 'NIK wajib diisi' };
  }
  if (!/^\d{16}$/.test(cleaned)) {
    return { valid: false, message: `NIK harus tepat 16 digit angka kependudukan (saat ini ${cleaned.length} digit)` };
  }
  return { valid: true };
}

/**
 * Comprehensive automated data and document validation for PPPK extension submission
 */
export function validateEmployeeData(employee: Partial<PPPKEmployee>): ValidasiResult {
  const issues: ValidasiIssue[] = [];

  // 1. NI PPPK Check
  if (employee.nipPppk) {
    const nipCheck = validateNIPPPK(employee.nipPppk);
    if (!nipCheck.valid) {
      issues.push({ field: 'nipPppk', severity: 'error', message: nipCheck.message! });
    }
  } else {
    issues.push({ field: 'nipPppk', severity: 'error', message: 'Nomor Induk PPPK belum diisi' });
  }

  // 2. NIK Check
  if (employee.nik) {
    const nikCheck = validateNIK(employee.nik);
    if (!nikCheck.valid) {
      issues.push({ field: 'nik', severity: 'error', message: nikCheck.message! });
    }
  } else {
    issues.push({ field: 'nik', severity: 'error', message: 'NIK Kependudukan belum diisi' });
  }

  // 3. Name & Unit Check
  if (!employee.namaLengkap || employee.namaLengkap.trim().length < 3) {
    issues.push({ field: 'namaLengkap', severity: 'error', message: 'Nama lengkap wajib diisi minimal 3 karakter' });
  }
  if (!employee.unitKerja) {
    issues.push({ field: 'unitKerja', severity: 'error', message: 'Unit Kerja / Satuan Organisasi belum dipilih' });
  }

  // 4. Absensi Evaluation Checks
  if (employee.evaluasiAbsensi) {
    const abs = employee.evaluasiAbsensi;
    if (abs.persentaseKehadiran < 85) {
      issues.push({
        field: 'persentaseKehadiran',
        severity: 'error',
        message: `Tingkat kehadiran (${abs.persentaseKehadiran}%) berada di bawah standar minimal regulasi (85%)`
      });
    } else if (abs.persentaseKehadiran < 90) {
      issues.push({
        field: 'persentaseKehadiran',
        severity: 'warning',
        message: `Tingkat kehadiran (${abs.persentaseKehadiran}%) mendekati batas toleransi minimal`
      });
    }

    if (abs.tanpaKeterangan > 3) {
      issues.push({
        field: 'tanpaKeterangan',
        severity: 'error',
        message: `Terdapat ${abs.tanpaKeterangan} hari tanpa keterangan (Alpha), melanggar PP Disiplin ASN`
      });
    } else if (abs.tanpaKeterangan > 0) {
      issues.push({
        field: 'tanpaKeterangan',
        severity: 'warning',
        message: `Tercatat ${abs.tanpaKeterangan} hari Alpha yang mempengaruhi skor akhir perpanjangan`
      });
    }
  }

  // 5. SKP Evaluation Checks
  if (employee.evaluasiSKP) {
    const skp = employee.evaluasiSKP;
    if (skp.predikatKinerja === 'Kurang' || skp.predikatKinerja === 'Sangat Kurang') {
      issues.push({
        field: 'predikatKinerja',
        severity: 'error',
        message: `Predikat SKP "${skp.predikatKinerja}" tidak memenuhi kriteria minimal perpanjangan kontrak`
      });
    } else if (skp.predikatKinerja === 'Butuh Perbaikan') {
      issues.push({
        field: 'predikatKinerja',
        severity: 'warning',
        message: 'Predikat SKP "Butuh Perbaikan" memerlukan persetujuan khusus dan rencana aksi pembinaan'
      });
    }
  }

  // 6. Required Documents Checks
  if (employee.dokumenPersyaratan) {
    const docs = employee.dokumenPersyaratan;
    const missingDocs: string[] = [];
    if (!docs.ktp) missingDocs.push('KTP');
    if (!docs.skPengangkatanAwal) missingDocs.push('SK Kontrak Awal');
    if (!docs.rekapPresensiResmi) missingDocs.push('Rekap Presensi Resmi');
    if (!docs.lembarPenilaianSKP) missingDocs.push('Lembar SKP BKN');
    if (!docs.suratBebasHukumanDisiplin) missingDocs.push('Surat Bebas Hukuman Disiplin');
    if (!docs.suratRekomendasiAtasan && !employee.suratRekomendasiUpload) missingDocs.push('Surat Rekomendasi Atasan Langsung');

    if (missingDocs.length > 0) {
      issues.push({
        field: 'dokumenPersyaratan',
        severity: 'error',
        message: `Dokumen persyaratan belum lengkap: ${missingDocs.join(', ')}`
      });
    }
  }

  // 7. Atasan Langsung Check
  if (!employee.atasanNama || !employee.atasanNip) {
    issues.push({
      field: 'atasanLangsung',
      severity: 'warning',
      message: 'Identitas atasan langsung penilai belum lengkap untuk penerbitan surat rekomendasi'
    });
  }

  const hasFatalErrors = issues.some(i => i.severity === 'error');
  const scoreLolos = employee.kelayakan?.status === 'Layak Diperpanjang';

  return {
    isValid: !hasFatalErrors,
    scoreKelayakanLolos: scoreLolos,
    issues
  };
}

export const validatePPPKEmployee = validateEmployeeData;
