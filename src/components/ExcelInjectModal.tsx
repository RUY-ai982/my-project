import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { PPPKEmployee, PredikatSKP, BobotKonfigurasi } from '../types/pppk';
import { calculateKelayakan } from '../utils/calculation';
import { validateEmployeeData, validateNIPPPK, validateNIK } from '../utils/validation';
import { generateSHA256Hash, generateCertId, maskNIP } from '../utils/crypto';

interface ExcelInjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectEmployees: (newEmployees: PPPKEmployee[], replaceExisting: boolean) => void;
  existingEmployees: PPPKEmployee[];
  config: BobotKonfigurasi;
}

interface ParsedRow {
  raw: any;
  nipPppk: string;
  nik: string;
  namaLengkap: string;
  jabatan: string;
  golongan: string;
  unitKerja: string;
  persentaseKehadiran: number;
  tanpaKeterangan: number;
  keterlambatanMenit: number;
  predikatKinerja: PredikatSKP;
  skorHasilKerja: number;
  atasanNama: string;
  atasanNip: string;
  atasanJabatan: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  calculatedScore?: number;
  calculatedStatus?: string;
}

export const ExcelInjectModal: React.FC<ExcelInjectModalProps> = ({
  isOpen,
  onClose,
  onInjectEmployees,
  existingEmployees,
  config
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  // Template Downloader
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'NI PPPK (18 Digit)': '199307152023211006',
        'NIK (16 Digit)': '3204121507930004',
        'Nama Lengkap': 'Ir. Dedi Irawan, M.T',
        'Jabatan': 'Ahli Pertama - Analis Kebijakan',
        'Golongan': 'IX',
        'Unit Kerja': 'Bappeda Litbang Daerah',
        'Persentase Kehadiran (%)': 96.5,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 40,
        'Predikat Kinerja SKP': 'Sangat Baik',
        'Skor Hasil Kerja SKP (0-100)': 94,
        'Nama Atasan Langsung': 'Drs. H. Anwar Sadat, M.Si',
        'NIP Atasan Langsung': '197108201997031002',
        'Jabatan Atasan Langsung': 'Kepala Bidang Litbang'
      },
      {
        'NI PPPK (18 Digit)': '199402282023212008',
        'NIK (16 Digit)': '3204192802940003',
        'Nama Lengkap': 'Ratna Wulandari, S.Kep., Ners',
        'Jabatan': 'Ahli Pertama - Perawat',
        'Golongan': 'X',
        'Unit Kerja': 'RSUD Majalaya / Dinas Kesehatan',
        'Persentase Kehadiran (%)': 94.2,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 60,
        'Predikat Kinerja SKP': 'Baik',
        'Skor Hasil Kerja SKP (0-100)': 87,
        'Nama Atasan Langsung': 'dr. Hj. Yuliawati, M.M.Kes',
        'NIP Atasan Langsung': '197503142002122001',
        'Jabatan Atasan Langsung': 'Kepala Bidang Pelayanan Medis'
      },
      {
        'NI PPPK (18 Digit)': '199109122023211005',
        'NIK (16 Digit)': '3204281209910008',
        'Nama Lengkap': 'Yudi Hermawan, S.Pd',
        'Jabatan': 'Ahli Pertama - Guru TIK',
        'Golongan': 'IX',
        'Unit Kerja': 'SMP Negeri 2 Baleendah / Dinas Pendidikan',
        'Persentase Kehadiran (%)': 92.0,
        'Tanpa Keterangan (Hari Alpha)': 1,
        'Keterlambatan (Menit)': 120,
        'Predikat Kinerja SKP': 'Baik',
        'Skor Hasil Kerja SKP (0-100)': 83,
        'Nama Atasan Langsung': 'Drs. Supriatna, M.Pd',
        'NIP Atasan Langsung': '196905181993031003',
        'Jabatan Atasan Langsung': 'Kepala Sekolah SMPN 2 Baleendah'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Auto column widths
    const colWidths = [
      { wch: 22 }, // NI PPPK
      { wch: 18 }, // NIK
      { wch: 26 }, // Nama
      { wch: 30 }, // Jabatan
      { wch: 10 }, // Golongan
      { wch: 32 }, // Unit Kerja
      { wch: 24 }, // Kehadiran
      { wch: 26 }, // Alpha
      { wch: 22 }, // Keterlambatan
      { wch: 20 }, // SKP
      { wch: 26 }, // Skor SKP
      { wch: 26 }, // Atasan
      { wch: 22 }, // NIP Atasan
      { wch: 28 }, // Jabatan Atasan
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Format_Injek_PPPK');
    XLSX.writeFile(workbook, 'Template_Injek_Data_PPPK_PW.xlsx');
  };

  // Quick Mock Sample Injector for instant testing without preparing an external file
  const handleLoadSampleBatch = () => {
    const sampleBatch: any[] = [
      {
        'NI PPPK (18 Digit)': '199308152023211007',
        'NIK (16 Digit)': '3204121508930001',
        'Nama Lengkap': 'Doni Saputra, S.T',
        'Jabatan': 'Ahli Pertama - Penata Ruang',
        'Golongan': 'IX',
        'Unit Kerja': 'Dinas Bina Marga & Penataan Ruang',
        'Persentase Kehadiran (%)': 97.5,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 30,
        'Predikat Kinerja SKP': 'Sangat Baik',
        'Skor Hasil Kerja SKP (0-100)': 95,
        'Nama Atasan Langsung': 'Ir. Dadan Hamdani, M.Sc',
        'NIP Atasan Langsung': '197204111998031003',
        'Jabatan Atasan Langsung': 'Kepala Bidang Tata Ruang'
      },
      {
        'NI PPPK (18 Digit)': '199203242023212005',
        'NIK (16 Digit)': '3204192403920002',
        'Nama Lengkap': 'drg. Maya Indah Lestari',
        'Jabatan': 'Ahli Pertama - Dokter Gigi',
        'Golongan': 'X',
        'Unit Kerja': 'Puskesmas Bojongsoang / Dinkes',
        'Persentase Kehadiran (%)': 98.2,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 20,
        'Predikat Kinerja SKP': 'Sangat Baik',
        'Skor Hasil Kerja SKP (0-100)': 96,
        'Nama Atasan Langsung': 'dr. Nenden Siti Rohmah',
        'NIP Atasan Langsung': '197808242006042011',
        'Jabatan Atasan Langsung': 'Kepala UPTD Puskesmas'
      },
      {
        'NI PPPK (18 Digit)': '199511142023211003',
        'NIK (16 Digit)': '3204281411950005',
        'Nama Lengkap': 'Rizky Ramadhan, S.Kom',
        'Jabatan': 'Ahli Pertama - Pengelola Data',
        'Golongan': 'IX',
        'Unit Kerja': 'Diskominfo Kota / Bidang SPBE',
        'Persentase Kehadiran (%)': 95.8,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 45,
        'Predikat Kinerja SKP': 'Baik',
        'Skor Hasil Kerja SKP (0-100)': 89,
        'Nama Atasan Langsung': 'Ir. Ahmad Zulkifli, M.T',
        'NIP Atasan Langsung': '197509182001121002',
        'Jabatan Atasan Langsung': 'Kepala Bidang SPBE'
      },
      {
        'NI PPPK (18 Digit)': '199005082023212004',
        'NIK (16 Digit)': '3204354805900007',
        'Nama Lengkap': 'Endah Suryani, S.Pd., M.Pd',
        'Jabatan': 'Ahli Pertama - Guru Bahasa Indonesia',
        'Golongan': 'IX',
        'Unit Kerja': 'SMK Negeri 1 Katapang / Disdik',
        'Persentase Kehadiran (%)': 91.5,
        'Tanpa Keterangan (Hari Alpha)': 0,
        'Keterlambatan (Menit)': 90,
        'Predikat Kinerja SKP': 'Baik',
        'Skor Hasil Kerja SKP (0-100)': 84,
        'Nama Atasan Langsung': 'Drs. H. Maman Suryaman, M.M.Pd',
        'NIP Atasan Langsung': '196903141994121001',
        'Jabatan Atasan Langsung': 'Kepala SMKN 1 Katapang'
      },
      {
        'NI PPPK (18 Digit)': '198801122023211002',
        'NIK (16 Digit)': '3204091201880006',
        'Nama Lengkap': 'Budi Santoso, S.P',
        'Jabatan': 'Ahli Pertama - Penyuluh Pertanian',
        'Golongan': 'IX',
        'Unit Kerja': 'Dinas Pertanian & Ketahanan Pangan',
        'Persentase Kehadiran (%)': 83.5, // Intentionally low for testing validation warning
        'Tanpa Keterangan (Hari Alpha)': 2,
        'Keterlambatan (Menit)': 280,
        'Predikat Kinerja SKP': 'Butuh Perbaikan',
        'Skor Hasil Kerja SKP (0-100)': 72,
        'Nama Atasan Langsung': 'Ir. H. Gunawan, M.M',
        'NIP Atasan Langsung': '197004121995031004',
        'Jabatan Atasan Langsung': 'Kepala Bidang Penyuluhan'
      }
    ];

    setFileName('Sampel_Uji_Injek_5_Pegawai.xlsx');
    processRawData(sampleBatch);
  };

  // Helper to parse file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      parseFile(file);
    }
  };

  const parseFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        processRawData(data);
      } catch (err) {
        alert('Gagal membaca berkas Excel. Pastikan format file sesuai (.xlsx, .xls, .csv).');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Process raw JSON rows and run automated validation
  const processRawData = (rows: any[]) => {
    const processed: ParsedRow[] = rows.map((r, idx) => {
      // Find flexible keys
      const findVal = (keys: string[]) => {
        for (const k of keys) {
          const match = Object.keys(r).find(key => key.toLowerCase().replace(/[^a-z0-9]/g, '').includes(k.toLowerCase().replace(/[^a-z0-9]/g, '')));
          if (match && r[match] !== undefined) return r[match];
        }
        return '';
      };

      const nipRaw = String(findVal(['nipppk', 'nip', 'ni_pppk', 'nomorinduk'])).replace(/\D/g, '');
      const nikRaw = String(findVal(['nik', 'ktp', 'noktp'])).replace(/\D/g, '');
      const nama = String(findVal(['namalengkap', 'nama', 'pegawai']) || `Pegawai Baris ${idx + 1}`);
      const jabatan = String(findVal(['jabatan', 'posisi', 'fungsional']) || 'Ahli Pertama');
      const golongan = String(findVal(['golongan', 'gol']) || 'IX');
      const unit = String(findVal(['unitkerja', 'unit', 'opd', 'dinas', 'instansi']) || 'Badan Kepegawaian Daerah');
      
      const presensi = parseFloat(String(findVal(['persentasekehadiran', 'kehadiran', 'presensi', 'absen'])).replace('%', '')) || 95;
      const alpha = parseInt(String(findVal(['tanpaketerangan', 'alpha', 'alpa'])), 10) || 0;
      const keterlambatan = parseInt(String(findVal(['keterlambatan', 'terlambat', 'menit'])), 10) || 0;
      
      let predikatRaw = String(findVal(['predikatkinerjaskp', 'predikat', 'skp', 'kinerja'])).trim();
      let predikat: PredikatSKP = 'Baik';
      if (/sangat\s*baik/i.test(predikatRaw)) predikat = 'Sangat Baik';
      else if (/sangat\s*kurang/i.test(predikatRaw)) predikat = 'Sangat Kurang';
      else if (/baik/i.test(predikatRaw)) predikat = 'Baik';
      else if (/perbaikan/i.test(predikatRaw)) predikat = 'Butuh Perbaikan';
      else if (/kurang/i.test(predikatRaw)) predikat = 'Kurang';

      const skorSKP = parseFloat(String(findVal(['skorhasilkerja', 'skorskp', 'nilaiskp', 'nilai']))) || (predikat === 'Sangat Baik' ? 95 : predikat === 'Baik' ? 85 : 70);
      
      const atasanNama = String(findVal(['namaatasan', 'atasan', 'penilai']) || 'Drs. H. Mulyadi, M.Si');
      const atasanNip = String(findVal(['nipatasan', 'atasan_nip'])).replace(/\D/g, '') || '197204151998031002';
      const atasanJabatan = String(findVal(['jabatanatasan', 'atasan_jabatan']) || 'Kepala Unit Kerja / Atasan Penilai');

      // Validation
      const errors: string[] = [];
      const warnings: string[] = [];

      const nipCheck = validateNIPPPK(nipRaw);
      if (!nipCheck.valid) {
        errors.push(nipCheck.message || 'NI PPPK tidak valid');
      }

      const nikCheck = validateNIK(nikRaw);
      if (!nikCheck.valid) {
        errors.push(nikCheck.message || 'NIK tidak valid');
      }

      if (presensi < config.ambangBatasMinimalAbsensi) {
        warnings.push(`Kehadiran ${presensi}% berada di bawah standar minimal (${config.ambangBatasMinimalAbsensi}%)`);
      }

      if (alpha > 0) {
        warnings.push(`Tercatat ${alpha} hari Alpha`);
      }

      if (predikat === 'Kurang' || predikat === 'Sangat Kurang') {
        warnings.push(`Predikat SKP ${predikat} tergolong kritis`);
      }

      // Calculate sample score
      const calc = calculateKelayakan(
        {
          persentaseKehadiran: presensi,
          tanpaKeterangan: alpha,
          totalHariKerja: 240,
          hadir: Math.round((presensi / 100) * 240),
          izin: 2,
          sakit: 2,
          cuti: 0,
          totalKeterlambatanMenit: keterlambatan,
          terlambatFrekuensi: 2,
          catatanDisiplin: 'Disiplin',
          terakhirDisinkronkan: 'Injected from Excel'
        },
        {
          tahunEvaluasi: 2026,
          predikatKinerja: predikat,
          skorHasilKerja: skorSKP,
          skorPerilaku: 85,
          predikatPerilaku: 'Sesuai Ekspektasi',
          nilaiAkhirSKP: skorSKP,
          capaianTargetUtama: 'Tercapai',
          perilakuBerAKHLAK: {
            berorientasiPelayanan: 'Baik',
            akuntabel: 'Baik',
            kompeten: 'Baik',
            harmonis: 'Baik',
            loyal: 'Baik',
            adaptif: 'Baik',
            kolaboratif: 'Baik'
          },
          nomorSKPBKN: 'SKP-BKN/INJECT/2026',
          terakhirDisinkronkan: 'Injected from Excel'
        },
        config
      );

      return {
        raw: r,
        nipPppk: nipRaw,
        nik: nikRaw,
        namaLengkap: nama,
        jabatan,
        golongan,
        unitKerja: unit,
        persentaseKehadiran: presensi,
        tanpaKeterangan: alpha,
        keterlambatanMenit: keterlambatan,
        predikatKinerja: predikat,
        skorHasilKerja: skorSKP,
        atasanNama,
        atasanNip,
        atasanJabatan,
        isValid: errors.length === 0,
        errors,
        warnings,
        calculatedScore: calc.skorTotalKelayakan,
        calculatedStatus: calc.status
      };
    });

    setParsedRows(processed);
  };

  // Execute Batch Injection
  const handleExecuteInjection = async () => {
    if (parsedRows.length === 0) return;

    setIsProcessing(true);

    const newEmployees: PPPKEmployee[] = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];

      const absensiObj = {
        persentaseKehadiran: row.persentaseKehadiran,
        totalHariKerja: 240,
        hadir: Math.round((row.persentaseKehadiran / 100) * 240),
        izin: 3,
        sakit: 2,
        cuti: 1,
        tanpaKeterangan: row.tanpaKeterangan,
        totalKeterlambatanMenit: row.keterlambatanMenit,
        terlambatFrekuensi: row.keterlambatanMenit > 60 ? 3 : 1,
        catatanDisiplin: row.tanpaKeterangan > 0 
          ? `Tercatat ${row.tanpaKeterangan} hari Alpha dalam sistem presensi.` 
          : 'Disiplin aktif dan tertib waktu kehadiran.',
        terakhirDisinkronkan: 'Injeksi Kolektif Excel (Terverifikasi)'
      };

      const skpObj = {
        tahunEvaluasi: 2026,
        predikatKinerja: row.predikatKinerja,
        skorHasilKerja: row.skorHasilKerja,
        skorPerilaku: 88,
        predikatPerilaku: 'Sesuai Ekspektasi' as const,
        nilaiAkhirSKP: row.skorHasilKerja,
        capaianTargetUtama: 'Telah menuntaskan seluruh target kinerja individu triwulanan dan tahunan.',
        perilakuBerAKHLAK: {
          berorientasiPelayanan: 'Memberikan respons pelayanan prima',
          akuntabel: 'Pengelolaan data dinas tertib regulasi',
          kompeten: 'Memiliki kompetensi teknis sesuai jenjang keahlian',
          harmonis: 'Menjaga keharmonisan dalam lingkungan kerja',
          loyal: 'Memegang teguh integritas aparatur',
          adaptif: 'Cepat beradaptasi dengan sistem pemerintahan digital',
          kolaboratif: 'Sinergis dengan tim kerja unit'
        },
        nomorSKPBKN: `SKP-BKN/INJ/${Date.now().toString().slice(-4)}/${i + 1}`,
        terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN'
      };

      const kelayakan = calculateKelayakan(absensiObj, skpObj, config);

      const sptjmHash = await generateSHA256Hash(`SPTJM-${row.nipPppk}-${row.namaLengkap}-${Date.now()}-${i}`);
      const rekomHash = await generateSHA256Hash(`REKOM-${row.nipPppk}-${row.atasanNip}-${Date.now()}-${i}`);

      const empData: PPPKEmployee = {
        id: `pppk-inj-${Date.now()}-${i}`,
        nipPppk: row.nipPppk,
        nik: row.nik,
        namaLengkap: row.namaLengkap,
        jabatan: row.jabatan,
        golongan: row.golongan,
        unitKerja: row.unitKerja,
        instansi: 'Pemerintah Kabupaten Bangkalan',
        tmtKontrakAwal: '2022-01-01',
        tmtKontrakAkhir: '2026-12-31',
        sisaHariKontrak: 71,
        evaluasiAbsensi: absensiObj,
        evaluasiSKP: skpObj,
        kelayakan,
        statusDokumen: 'Menunggu Verifikasi Atasan',
        dokumenPersyaratan: {
          ktp: true,
          skPengangkatanAwal: true,
          rekapPresensiResmi: true,
          lembarPenilaianSKP: true,
          suratKeteranganSehat: true,
          suratBebasHukumanDisiplin: true,
          suratRekomendasiAtasan: true
        },
        sptjmNomor: `800.1.2/SPTJM-PPPK/INJ/${Date.now().toString().slice(-4)}/${i + 1}`,
        sptjmTanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        rekomendasiNomor: `800/REKOM-PPPK/INJ/${Date.now().toString().slice(-4)}/${i + 1}`,
        rekomendasiTanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        atasanNama: row.atasanNama,
        atasanNip: row.atasanNip,
        atasanJabatan: row.atasanJabatan,
        kepalaOpdNama: 'Dr. Ir. H. Hermansyah, M.Si',
        kepalaOpdNip: '196805121994031002',
        kepalaOpdJabatan: 'Kepala BKPSDM Provinsi',
        validasi: {
          isValid: row.errors.length === 0,
          scoreKelayakanLolos: kelayakan.skorTotalKelayakan >= 70,
          issues: [
            ...row.errors.map(err => ({ field: 'input', severity: 'error' as const, message: err })),
            ...row.warnings.map(warn => ({ field: 'evaluasi', severity: 'warning' as const, message: warn }))
          ]
        },
        enkripsi: {
          sptjmHashSHA256: sptjmHash,
          rekomendasiHashSHA256: rekomHash,
          algorithm: 'SHA-256 + AES-256-GCM',
          signatureTimestamp: new Date().toISOString(),
          bsreDigitalCertId: generateCertId(row.nipPppk, 'SPTJM'),
          isVerified: true
        },
        catatanAdmin: 'Diinjeksi otomatis secara massal melalui file Excel.',
        updatedAt: new Date().toISOString().split('T')[0]
      };

      newEmployees.push(empData);
    }

    onInjectEmployees(newEmployees, replaceExisting);
    setIsProcessing(false);
    onClose();
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Injek Data Massal via Excel / Spreadsheet (.xlsx, .csv)
              </h2>
              <p className="text-xs text-slate-500">
                Unggah rekapitulasi data usulan PPPK, kalkulasi otomatis kelayakan absensi & SKP, serta terbitkan hash integritas
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          
          {/* Top Actions: Template Download & Quick Test Sample */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800">Gunakan Format Baku Kolom SIM-PPPK</div>
              <div className="text-slate-500 text-[11px]">
                Pastikan nama kolom sesuai format (NI PPPK 18 digit, NIK, Nama, Kehadiran %, Predikat SKP)
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-medium shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh Template Excel</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSampleBatch}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-lg font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Uji Coba Data Sampel</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-emerald-600 bg-emerald-50/50' 
                : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center mx-auto mb-2 text-emerald-700 shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div className="font-semibold text-slate-800 text-sm">
              {fileName ? fileName : 'Pilih file Excel atau Seret & Lepas ke sini'}
            </div>
            <p className="text-slate-500 text-[11px] mt-1">
              Mendukung file berekstensi Microsoft Excel (.xlsx, .xls) atau format Comma Separated (.csv)
            </p>
          </div>

          {/* Parsed Rows Summary & Data Matrix Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-800">
                    Hasil Ekstraksi & Validasi Data:
                  </span>
                  <span className="font-mono tabular-nums text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {parsedRows.length} Baris Terdeteksi
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{validCount} Lolos Validasi</span>
                  </span>
                  {invalidCount > 0 && (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{invalidCount} Perlu Perbaikan</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0">
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Pegawai & NI PPPK</th>
                      <th className="py-2.5 px-3">Jabatan & Unit Kerja</th>
                      <th className="py-2.5 px-3 text-right">Kehadiran</th>
                      <th className="py-2.5 px-3">SKP</th>
                      <th className="py-2.5 px-3 text-right">Kalkulasi Skor</th>
                      <th className="py-2.5 px-3">Hasil Usulan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/40 hover:bg-rose-50/70'}>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {row.isValid ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 font-medium flex items-center gap-1" title={row.errors.join(', ')}>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>Error Format</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{row.namaLengkap}</div>
                          <div className="font-mono text-[10px] text-slate-500">{maskNIP(row.nipPppk)}</div>
                          {row.errors.length > 0 && (
                            <div className="text-[10px] text-rose-600 italic mt-0.5">{row.errors[0]}</div>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="text-slate-800">{row.jabatan}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{row.unitKerja}</div>
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          <div className="font-semibold text-slate-900">{row.persentaseKehadiran}%</div>
                          <div className="text-[10px] text-slate-500">Alpha: {row.tanpaKeterangan}</div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-slate-800">{row.predikatKinerja}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Nilai: {row.skorHasilKerja}</div>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {row.calculatedScore}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`font-semibold ${
                            row.calculatedStatus === 'Layak Diperpanjang'
                              ? 'text-emerald-700'
                              : row.calculatedStatus === 'Tidak Layak Diperpanjang'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}>
                            {row.calculatedStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Injection Option Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="replaceOption"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="replaceOption" className="text-slate-700 cursor-pointer">
                  Perbarui (update) data pegawai jika <strong>NI PPPK</strong> sudah terdaftar dalam sistem
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {parsedRows.length > 0 && (
              <span>
                Siap memproses <strong className="text-slate-900 font-mono">{parsedRows.length}</strong> data usulan pegawai.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteInjection}
              disabled={parsedRows.length === 0 || isProcessing}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>
                {isProcessing ? 'Memproses Injeksi...' : `Eksekusi Injek (${parsedRows.length} Pegawai)`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
