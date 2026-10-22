import React, { useState, useRef } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Clock, 
  FileText, 
  UserCheck, 
  Lock, 
  ExternalLink,
  Save,
  Printer,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Paperclip
} from 'lucide-react';
import { PPPKEmployee, StatusDokumen, PredikatSKP, StatusKelayakan } from '../types/pppk';
import { maskNIP, maskNIK, generateSHA256Hash } from '../utils/crypto';
import { validatePPPKEmployee } from '../utils/validation';

interface EmployeeDetailModalProps {
  employee: PPPKEmployee | null;
  onClose: () => void;
  onUpdateEmployee: (updated: PPPKEmployee) => void;
  onOpenDocument: (emp: PPPKEmployee, docType: 'SPTJM' | 'REKOMENDASI') => void;
  onDeleteEmployee?: (empId: string) => void;
  onUploadRekomendasi?: (empId: string, file: File) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onUpdateEmployee,
  onOpenDocument,
  onDeleteEmployee,
  onUploadRekomendasi
}) => {
  if (!employee) return null;

  const [activeTab, setActiveTab] = useState<'validasi' | 'absensi' | 'skp' | 'dokumen' | 'keamanan'>('validasi');
  const [currentEmp, setCurrentEmp] = useState<PPPKEmployee>({ ...employee });
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatusDokumenChange = (newStatus: StatusDokumen) => {
    const updated: PPPKEmployee = {
      ...currentEmp,
      statusDokumen: newStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentEmp(updated);
    onUpdateEmployee(updated);
    showSavedFeedback();
  };

  const handleStatusKelayakanChange = (newStatus: StatusKelayakan) => {
    const updatedKelayakan = {
      ...currentEmp.kelayakan,
      status: newStatus,
      catatanRekomendasi: newStatus === 'Layak Diperpanjang'
        ? 'Diusulkan perpanjangan perjanjian kerja berdasarkan capaian kinerja dan evaluasi komprehensif.'
        : newStatus === 'Tidak Layak Diperpanjang'
        ? 'Kinerja atau tingkat kedisiplinan belum memenuhi standar regulasi perpanjangan kontrak.'
        : newStatus === 'Mengundurkan Diri'
        ? 'Pegawai telah mengajukan surat permohonan pengunduran diri secara resmi.'
        : newStatus === 'Meninggal Dunia'
        ? 'Tercatat meninggal dunia dalam masa penugasan kedinasan.'
        : 'Status kepegawaian tidak aktif bekerja (putus kontrak / mutasi).'
    };

    const tempEmp = {
      ...currentEmp,
      kelayakan: updatedKelayakan,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const reval = validatePPPKEmployee(tempEmp);
    const finalEmp: PPPKEmployee = {
      ...tempEmp,
      validasi: reval
    };

    setCurrentEmp(finalEmp);
    onUpdateEmployee(finalEmp);
    showSavedFeedback();
  };

  const handleDocumentCheckbox = (docKey: keyof typeof currentEmp.dokumenPersyaratan) => {
    const updatedDocs = {
      ...currentEmp.dokumenPersyaratan,
      [docKey]: !currentEmp.dokumenPersyaratan[docKey]
    };
    const tempEmp = {
      ...currentEmp,
      dokumenPersyaratan: updatedDocs
    };
    const reval = validatePPPKEmployee(tempEmp);
    const updated: PPPKEmployee = {
      ...tempEmp,
      validasi: reval,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentEmp(updated);
    onUpdateEmployee(updated);
  };

  const showSavedFeedback = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const processUploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const hash = await generateSHA256Hash(`${file.name}-${file.size}-${file.lastModified}-${Date.now()}`);
      const uploadData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadTimestamp: new Date().toISOString(),
        hashSHA256: hash
      };

      const updatedDocs = {
        ...currentEmp.dokumenPersyaratan,
        suratRekomendasiAtasan: true
      };

      const tempEmp = {
        ...currentEmp,
        suratRekomendasiUpload: uploadData,
        dokumenPersyaratan: updatedDocs,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const reval = validatePPPKEmployee(tempEmp);
      const finalEmp: PPPKEmployee = {
        ...tempEmp,
        validasi: reval
      };

      setCurrentEmp(finalEmp);
      onUpdateEmployee(finalEmp);
      if (onUploadRekomendasi) {
        onUploadRekomendasi(currentEmp.id, file);
      }
      showSavedFeedback();
    } catch (err) {
      console.error('Failed to process uploaded file', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadFile(file);
    }
  };

  const handleRemoveUploadedFile = () => {
    const updatedDocs = {
      ...currentEmp.dokumenPersyaratan,
      suratRekomendasiAtasan: false
    };

    const tempEmp: PPPKEmployee = {
      ...currentEmp,
      suratRekomendasiUpload: undefined,
      dokumenPersyaratan: updatedDocs,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const reval = validatePPPKEmployee(tempEmp);
    const finalEmp: PPPKEmployee = {
      ...tempEmp,
      validasi: reval
    };

    setCurrentEmp(finalEmp);
    onUpdateEmployee(finalEmp);
    showSavedFeedback();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentEmp.namaLengkap}
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {maskNIP(currentEmp.nipPppk)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentEmp.jabatan} · {currentEmp.unitKerja}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSavedNotice && (
              <span className="text-xs text-emerald-700 font-medium animate-fade-in flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-white border-b border-slate-200 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('validasi')}
            className={`pb-2.5 px-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'validasi'
                ? 'text-emerald-700 border-b-2 border-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Validasi Kelayakan & Syarat</span>
            {!currentEmp.validasi.isValid && (
              <span className="text-rose-600 font-mono">(!)</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('absensi')}
            className={`pb-2.5 px-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'absensi'
                ? 'text-emerald-700 border-b-2 border-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Rincian Absensi Biometrik</span>
          </button>

          <button
            onClick={() => setActiveTab('skp')}
            className={`pb-2.5 px-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'skp'
                ? 'text-emerald-700 border-b-2 border-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Kinerja SKP BerAKHLAK</span>
          </button>

          <button
            onClick={() => setActiveTab('dokumen')}
            className={`pb-2.5 px-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'dokumen'
                ? 'text-emerald-700 border-b-2 border-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Workflow & Rekomendasi Atasan</span>
            {currentEmp.suratRekomendasiUpload && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('keamanan')}
            className={`pb-2.5 px-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'keamanan'
                ? 'text-emerald-700 border-b-2 border-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enkripsi & Audit Log</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* TAB 1: VALIDASI & RINGKASAN */}
          {activeTab === 'validasi' && (
            <div className="space-y-6">
              {/* Hasil Kalkulasi Otomatis & Status Selector */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium">Status Kelayakan Pegawai:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={currentEmp.kelayakan.status}
                        onChange={(e) => handleStatusKelayakanChange(e.target.value as StatusKelayakan)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs cursor-pointer"
                      >
                        <option value="Layak Diperpanjang">Layak Diperpanjang</option>
                        <option value="Tidak Layak Diperpanjang">Tidak Layak Diperpanjang</option>
                        <option value="Mengundurkan Diri">Mengundurkan Diri</option>
                        <option value="Meninggal Dunia">Meninggal Dunia</option>
                        <option value="Tidak Aktif Bekerja">Tidak Aktif Bekerja</option>
                      </select>
                    </div>
                    <div className="text-slate-600 text-[11px] pt-1">
                      {currentEmp.kelayakan.catatanRekomendasi}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Skor Absensi (40%)</div>
                      <div className="font-mono text-sm font-bold text-slate-800">
                        {currentEmp.kelayakan.skorBobotAbsensi}
                      </div>
                    </div>
                    <div className="text-slate-300 font-bold">+</div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Skor SKP (60%)</div>
                      <div className="font-mono text-sm font-bold text-slate-800">
                        {currentEmp.kelayakan.skorBobotSKP}
                      </div>
                    </div>
                    <div className="text-slate-300 font-bold">=</div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Skor Akhir</div>
                      <div className="font-mono text-base font-bold text-emerald-700">
                        {currentEmp.kelayakan.skorTotalKelayakan}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Surat Rekomendasi Quick Banner */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-950">Surat Rekomendasi Atasan Langsung</div>
                    <div className="text-slate-600 text-[11px]">
                      {currentEmp.suratRekomendasiUpload 
                        ? `Dokumen terunggah: ${currentEmp.suratRekomendasiUpload.fileName} (${typeof currentEmp.suratRekomendasiUpload.fileSize === 'number' ? (currentEmp.suratRekomendasiUpload.fileSize / 1024).toFixed(0) + ' KB' : currentEmp.suratRekomendasiUpload.fileSize})`
                        : 'Belum ada dokumen digital rekomendasi atasan yang diunggah untuk usulan ini.'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('dokumen')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors text-xs whitespace-nowrap self-start sm:self-auto"
                >
                  {currentEmp.suratRekomendasiUpload ? 'Kelola Dokumen' : 'Unggah Surat Rekomendasi'}
                </button>
              </div>

              {/* Automated Data Validation Checks */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Hasil Uji Validasi Berkas & Konsistensi Data Otomatis
                </h3>
                <p className="text-slate-500 mb-3">
                  Sistem memeriksa integritas NIP, NIK, batas minimal kehadiran, predikat SKP, dan kelengkapan lampiran
                </p>

                {currentEmp.validasi.issues.length === 0 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Lolos seluruh validasi otomatis. Berkas memenuhi syarat regulasi untuk diproses ke BKN.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentEmp.validasi.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex items-start gap-2 ${
                          issue.severity === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold capitalize">[{issue.severity.toUpperCase()}] </span>
                          <span>{issue.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checklist Kelengkapan Dokumen Syarat */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Checklist Dokumen Prasyarat Fisik & Digital
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'ktp', label: 'Kartu Tanda Penduduk (KTP Elektronik)' },
                    { key: 'skPengangkatanAwal', label: 'SK Pengangkatan Pertama PPPK' },
                    { key: 'rekapPresensiResmi', label: 'Rekap Presensi Fingerprint / Mobile' },
                    { key: 'lembarPenilaianSKP', label: 'Lembar Penilaian SKP e-Kinerja BKN' },
                    { key: 'suratKeteranganSehat', label: 'Surat Keterangan Sehat Dokter Pemerintah' },
                    { key: 'suratBebasHukumanDisiplin', label: 'Surat Bebas Hukuman Disiplin (Inspektorat)' },
                    { key: 'suratRekomendasiAtasan', label: 'Surat Rekomendasi Atasan Langsung' }
                  ].map((item) => {
                    const isChecked = currentEmp.dokumenPersyaratan[item.key as keyof typeof currentEmp.dokumenPersyaratan];
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleDocumentCheckbox(item.key as keyof typeof currentEmp.dokumenPersyaratan)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className={isChecked ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Alur Kerja */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Ubah Status Alur Berkas:</span>
                  <select
                    value={currentEmp.statusDokumen}
                    onChange={(e) => handleStatusDokumenChange(e.target.value as StatusDokumen)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-emerald-600"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Menunggu Verifikasi Atasan">Menunggu Verifikasi Atasan</option>
                    <option value="Validasi BKPSDM">Validasi BKPSDM</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Dokumen Terbit">Dokumen Terbit (TTE)</option>
                    <option value="Perlu Revisi">Perlu Revisi</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDocument(currentEmp, 'SPTJM')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-medium transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Lihat SPTJM</span>
                  </button>
                  <button
                    onClick={() => onOpenDocument(currentEmp, 'REKOMENDASI')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-medium transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Rekomendasi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RINCIAN ABSENSI */}
          {activeTab === 'absensi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Rekapitulasi Kehadiran & Kedisiplinan Kerja
                  </h3>
                  <p className="text-slate-500">
                    Sinkronisasi API Presensi Biometrik: {currentEmp.evaluasiAbsensi.terakhirDisinkronkan}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Persentase Akumulatif:</div>
                  <div className="font-mono text-xl font-bold text-emerald-700">
                    {currentEmp.evaluasiAbsensi.persentaseKehadiran}%
                  </div>
                </div>
              </div>

              {/* Attendance metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Total Hari Kerja</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-1">
                    {currentEmp.evaluasiAbsensi.totalHariKerja} hari
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-emerald-800">Kehadiran Efektif</div>
                  <div className="text-base font-bold font-mono text-emerald-900 mt-1">
                    {currentEmp.evaluasiAbsensi.hadir} hari
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Izin / Cuti / Sakit</div>
                  <div className="text-base font-bold font-mono text-slate-800 mt-1">
                    {currentEmp.evaluasiAbsensi.izin + currentEmp.evaluasiAbsensi.sakit + currentEmp.evaluasiAbsensi.cuti} hari
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${
                  currentEmp.evaluasiAbsensi.tanpaKeterangan > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <div>Tanpa Keterangan (Alpha)</div>
                  <div className="text-base font-bold font-mono mt-1">
                    {currentEmp.evaluasiAbsensi.tanpaKeterangan} hari
                  </div>
                </div>
              </div>

              {/* Keterlambatan info */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-800 mb-1">Catatan Keterlambatan & Kedisiplinan:</div>
                <div className="text-slate-600 mb-2">
                  Total akumulasi keterlambatan: <strong className="font-mono text-slate-900">{currentEmp.evaluasiAbsensi.totalKeterlambatanMenit} menit</strong> ({currentEmp.evaluasiAbsensi.terlambatFrekuensi} kali kejadian).
                </div>
                <div className="p-2.5 bg-white rounded border border-slate-200 text-slate-700 italic">
                  "{currentEmp.evaluasiAbsensi.catatanDisiplin}"
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RINCIAN SKP BKN */}
          {activeTab === 'skp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Penilaian Sasaran Kinerja Pegawai (SKP e-Kinerja BKN)
                  </h3>
                  <p className="text-slate-500">
                    Nomor Registrasi BKN: <span className="font-mono">{currentEmp.evaluasiSKP.nomorSKPBKN}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Predikat Kinerja:</div>
                  <div className="text-sm font-bold text-emerald-800">
                    {currentEmp.evaluasiSKP.predikatKinerja}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-semibold text-slate-800">Capaian Target Kinerja Utama Pegawai:</div>
                <div className="text-slate-700">
                  {currentEmp.evaluasiSKP.capaianTargetUtama}
                </div>
              </div>

              {/* Core Values BerAKHLAK */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Evaluasi Perilaku Kerja Inti ASN (BerAKHLAK)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(currentEmp.evaluasiSKP.perilakuBerAKHLAK).map(([key, desc]) => (
                    <div key={key} className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="font-semibold text-slate-800 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">
                        {desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOW DOKUMEN & UPLOAD REKOMENDASI ATASAN */}
          {activeTab === 'dokumen' && (
            <div className="space-y-6">
              {/* Dedicated Upload Section for Surat Rekomendasi Atasan Langsung */}
              <div className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Unggah Surat Rekomendasi Atasan Langsung (Digital)
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        Lampirkan dokumen fisik berstempel/TTE yang telah disetujui atasan penilai dalam format PDF atau Gambar
                      </p>
                    </div>
                  </div>

                  {currentEmp.suratRekomendasiUpload && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {currentEmp.suratRekomendasiUpload ? (
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <span>{currentEmp.suratRekomendasiUpload.fileName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Ukuran: <strong className="font-mono text-slate-700">{typeof currentEmp.suratRekomendasiUpload.fileSize === 'number' ? (currentEmp.suratRekomendasiUpload.fileSize / 1024).toFixed(1) + ' KB' : currentEmp.suratRekomendasiUpload.fileSize}</strong></span>
                          <span>Format: <strong className="uppercase text-slate-700">{(currentEmp.suratRekomendasiUpload.fileType || 'PDF').split('/')[1] || currentEmp.suratRekomendasiUpload.fileType || 'PDF'}</strong></span>
                          <span>Waktu Unggah: <strong className="font-mono text-slate-700">{new Date(currentEmp.suratRekomendasiUpload.uploadTimestamp || currentEmp.suratRekomendasiUpload.uploadedAt).toLocaleString('id-ID')}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                          Ganti File
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveUploadedFile}
                          className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg font-medium transition-colors"
                        >
                          Hapus File
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/80">
                      <div className="text-[10px] text-slate-500 font-medium">Sidik Jari Kriptografis (SHA-256 Integritas):</div>
                      <div className="font-mono text-[10px] text-emerald-900 bg-white p-2 border border-emerald-200 rounded mt-1 break-all">
                        {currentEmp.suratRekomendasiUpload.hashSHA256}
                      </div>
                    </div>
                  </div>
                ) : (
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
                    <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center mx-auto mb-2 text-emerald-700 shadow-xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-slate-800 text-xs">
                      Klik untuk Memilih Berkas Surat Rekomendasi atau Drag & Drop ke sini
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Mendukung format file dokumen resmi (.pdf, .docx) atau hasil pindai (.jpg, .jpeg, .png)
                    </p>
                  </div>
                )}
              </div>

              {/* Data Pejabat Penilai */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Atasan Langsung & Pejabat Pembina Kepegawaian
                </h3>
                <p className="text-slate-500 mb-4">
                  Data pejabat berwenang penandatangan rekomendasi kinerja dan SPTJM
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Superior */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span>Atasan Langsung (Penilai)</span>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Nama Lengkap:</div>
                      <div className="font-medium text-slate-900">{currentEmp.atasanNama}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">NIP:</div>
                      <div className="font-mono text-slate-800">{currentEmp.atasanNip}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Jabatan:</div>
                      <div className="text-slate-800">{currentEmp.atasanJabatan}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-slate-500 text-[11px]">Nomor Surat Rekomendasi:</div>
                      <div className="font-mono text-emerald-800 font-medium">{currentEmp.rekomendasiNomor}</div>
                    </div>
                  </div>

                  {/* PPK / Kepala OPD */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Kepala OPD / Pejabat Pembina</span>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Nama Lengkap:</div>
                      <div className="font-medium text-slate-900">{currentEmp.kepalaOpdNama}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">NIP:</div>
                      <div className="font-mono text-slate-800">{currentEmp.kepalaOpdNip}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Jabatan:</div>
                      <div className="text-slate-800">{currentEmp.kepalaOpdJabatan}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-slate-500 text-[11px]">Nomor SPTJM Resmi:</div>
                      <div className="font-mono text-emerald-800 font-medium">{currentEmp.sptjmNomor}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-emerald-900">Dokumen Siap Dicetak & Diunduh</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    Format resmi naskah dinas A4 standar BKN & Kemkominfo BSrE
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDocument(currentEmp, 'SPTJM')}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg font-medium shadow-xs hover:bg-emerald-50 transition-colors"
                  >
                    Buka SPTJM
                  </button>
                  <button
                    onClick={() => onOpenDocument(currentEmp, 'REKOMENDASI')}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-medium shadow-xs hover:bg-emerald-800 transition-colors"
                  >
                    Buka Rekomendasi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEAMANAN & ENKRIPSI */}
          {activeTab === 'keamanan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Keamanan End-to-End & Integritas Dokumen Digital
                  </h3>
                  <p className="text-slate-500">
                    Algoritma proteksi: <span className="font-mono font-semibold">{currentEmp.enkripsi.algorithm}</span>
                  </p>
                </div>

                <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[11px] font-mono">
                  BSrE Verified
                </div>
              </div>

              {/* Hash Boxes */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 text-[11px] font-medium mb-1">
                    SHA-256 Hash Naskah SPTJM:
                  </div>
                  <div className="font-mono text-[11px] text-slate-800 break-all bg-white p-2 border border-slate-200 rounded">
                    {currentEmp.enkripsi.sptjmHashSHA256}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 text-[11px] font-medium mb-1">
                    SHA-256 Hash Surat Rekomendasi Atasan (Sistem):
                  </div>
                  <div className="font-mono text-[11px] text-slate-800 break-all bg-white p-2 border border-slate-200 rounded">
                    {currentEmp.enkripsi.rekomendasiHashSHA256}
                  </div>
                </div>

                {currentEmp.suratRekomendasiUpload && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <div className="text-emerald-900 text-[11px] font-medium mb-1">
                      SHA-256 Hash Berkas Rekomendasi yang Diunggah ({currentEmp.suratRekomendasiUpload.fileName}):
                    </div>
                    <div className="font-mono text-[11px] text-emerald-900 break-all bg-white p-2 border border-emerald-200 rounded">
                      {currentEmp.suratRekomendasiUpload.hashSHA256}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500 text-[11px] font-medium mb-1">
                    ID Sertifikat Digital BSrE:
                  </div>
                  <div className="font-mono text-emerald-800 font-semibold">
                    {currentEmp.enkripsi.bsreDigitalCertId}
                  </div>
                </div>
              </div>

              {/* Encryption simulation */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg space-y-2 font-mono text-[11px]">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enkripsi AES-256 GCM Payload Vault (Simulasi Keamanan):</span>
                </div>
                <div className="text-emerald-400 break-all">
                  ENC:AES-256-GCM:IV-k92x0a:9fa298104821cde91048a12847291...[ENCRYPTED_RESTRICTED_DATA]
                </div>
                <div className="text-slate-400 text-[10px]">
                  Informasi NIK kependudukan dan rekam medis terlindungi dengan standar enkripsi end-to-end
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Terakhir diubah: <span className="font-mono">{currentEmp.updatedAt}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteEmployee && (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Usulan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Inside Detail Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Usulan Perpanjangan Kontrak?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data usulan atas nama{' '}
                  <strong className="text-slate-900">{currentEmp.namaLengkap}</strong>{' '}
                  (NI PPPK: <span className="font-mono">{currentEmp.nipPppk}</span>)?
                  Seluruh berkas evaluasi, riwayat draft SPTJM, dan rekomendasi terkait akan dihapus secara permanen.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3.5 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEmployee) {
                    onDeleteEmployee(currentEmp.id);
                  }
                  setIsConfirmingDelete(false);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Usulan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
