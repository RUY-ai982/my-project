import React from 'react';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Clock, 
  FileCheck, 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Download
} from 'lucide-react';
import { PPPKEmployee, BobotKonfigurasi } from '../types/pppk';

interface DashboardOverviewProps {
  employees: PPPKEmployee[];
  config: BobotKonfigurasi;
  onOpenConfig: () => void;
  onOpenAddModal: () => void;
  onSelectEmployee: (emp: PPPKEmployee) => void;
  onNavigateToTab: (tab: 'dashboard' | 'pegawai' | 'jadwal' | 'api-sync' | 'laporan') => void;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  employees,
  config,
  onOpenConfig,
  onOpenAddModal,
  onSelectEmployee,
  onNavigateToTab,
  onQuickSync,
  isSyncing
}) => {
  // Aggregate Metrics
  const totalEmployees = employees.length;
  
  const eligibleCount = employees.filter(
    e => e.kelayakan.status === 'Layak Diperpanjang'
  ).length;

  const ineligiblesCount = employees.filter(
    e => e.kelayakan.status !== 'Layak Diperpanjang'
  ).length;

  const criticalContractCount = employees.filter(e => e.sisaHariKontrak <= 60).length;

  const avgAttendance = totalEmployees > 0
    ? (employees.reduce((acc, curr) => acc + curr.evaluasiAbsensi.persentaseKehadiran, 0) / totalEmployees).toFixed(1)
    : '0';

  const avgSKP = totalEmployees > 0
    ? (employees.reduce((acc, curr) => acc + curr.evaluasiSKP.nilaiAkhirSKP, 0) / totalEmployees).toFixed(1)
    : '0';

  const publishedDocsCount = employees.filter(e => e.statusDokumen === 'Dokumen Terbit' || e.statusDokumen === 'Disetujui').length;
  const pendingReviewCount = employees.filter(e => e.statusDokumen === 'Menunggu Verifikasi Atasan' || e.statusDokumen === 'Validasi BKPSDM').length;
  const uploadedRekomCount = employees.filter(e => e.suratRekomendasiUpload || e.dokumenPersyaratan.suratRekomendasiAtasan).length;

  // Breakdown by 5 new statuses
  const countLayak = employees.filter(e => e.kelayakan.status === 'Layak Diperpanjang').length;
  const countTidakLayak = employees.filter(e => e.kelayakan.status === 'Tidak Layak Diperpanjang').length;
  const countResign = employees.filter(e => e.kelayakan.status === 'Mengundurkan Diri').length;
  const countMeninggal = employees.filter(e => e.kelayakan.status === 'Meninggal Dunia').length;
  const countTidakAktif = employees.filter(e => e.kelayakan.status === 'Tidak Aktif Bekerja').length;

  // Urgent list (Sisa hari <= 60 or Needs revision or non-eligible)
  const urgentList = employees.filter(e => e.sisaHariKontrak <= 60 || !e.validasi.isValid);

  return (
    <div className="space-y-8">
      {/* Header Banner & Live Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pemantauan Real-Time Perpanjangan Kontrak PPPK PW
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Evaluasi otomatis berbasis rekapitulasi presensi biometrik & capaian SKP e-Kinerja BKN
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Bobot: Absensi {config.bobotAbsensi}% / SKP {config.bobotSKP}%</span>
          </button>

          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan API...' : 'Sinkronisasi API BKN'}</span>
          </button>
        </div>
      </div>

      {/* 6 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total PPPK Terdata</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalEmployees}
            </span>
            <span className="text-xs text-slate-500">pegawai</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Formasi 2022 - 2024
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Siap Diperpanjang</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {eligibleCount}
            </span>
            <span className="text-xs text-slate-500">
              ({totalEmployees > 0 ? Math.round((eligibleCount / totalEmployees) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Memenuhi syarat teknis
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Masa Kontrak Kritis</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
              {criticalContractCount}
            </span>
            <span className="text-xs text-slate-500">s/d 60 hari</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Perlu percepatan SK
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rerata Nilai SKP</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {avgSKP}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Predikat Baik</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Min. regulasi: 75.0
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rerata Kehadiran</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {avgAttendance}%
            </span>
            <span className="text-xs text-slate-500">presensi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Min. regulasi: {config.ambangBatasMinimalAbsensi}%
          </div>
        </div>

        {/* KPI 6 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Dokumen Terbit</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {publishedDocsCount}
            </span>
            <span className="text-xs text-amber-600 font-mono tabular-nums">
              +{pendingReviewCount} proses
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            SPTJM & Rekomendasi
          </div>
        </div>
      </div>

      {/* Distribution & Analytical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Status Kelayakan Distribution */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Distribusi Rekomendasi Kelayakan Masa Kontrak
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kalkulasi otomatis bobot Absensi ({config.bobotAbsensi}%) + Capaian SKP ({config.bobotSKP}%)
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('pegawai')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Row 1: Layak Diperpanjang */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-800">Layak Diperpanjang</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {countLayak} pegawai ({totalEmployees > 0 ? Math.round((countLayak/totalEmployees)*100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEmployees > 0 ? (countLayak/totalEmployees)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Row 2: Tidak Layak Diperpanjang */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-rose-800">Tidak Layak Diperpanjang</span>
                <span className="font-mono tabular-nums text-rose-700 font-semibold">
                  {countTidakLayak} pegawai ({totalEmployees > 0 ? Math.round((countTidakLayak/totalEmployees)*100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-rose-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEmployees > 0 ? (countTidakLayak/totalEmployees)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Row 3: Mengundurkan Diri */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-800">Mengundurkan Diri</span>
                <span className="font-mono tabular-nums text-amber-800 font-semibold">
                  {countResign} pegawai ({totalEmployees > 0 ? Math.round((countResign/totalEmployees)*100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEmployees > 0 ? (countResign/totalEmployees)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Row 4: Meninggal Dunia */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Meninggal Dunia</span>
                <span className="font-mono tabular-nums text-slate-800 font-semibold">
                  {countMeninggal} pegawai ({totalEmployees > 0 ? Math.round((countMeninggal/totalEmployees)*100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-slate-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEmployees > 0 ? (countMeninggal/totalEmployees)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Row 5: Tidak Aktif Bekerja */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-purple-800">Tidak Aktif Bekerja</span>
                <span className="font-mono tabular-nums text-purple-800 font-semibold">
                  {countTidakAktif} pegawai ({totalEmployees > 0 ? Math.round((countTidakAktif/totalEmployees)*100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${totalEmployees > 0 ? (countTidakAktif/totalEmployees)*100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rujukan Regulasi: PP No. 49 Tahun 2018 & PermenPAN-RB No. 14 Tahun 2023</span>
            <span className="font-mono">Enkripsi SHA-256 BSrE Aktif</span>
          </div>
        </div>

        {/* Right: Urgent Action Center */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Peringatan Berkas Kritis
              </h2>
              <span className="text-xs text-rose-700 font-medium font-mono tabular-nums">
                {urgentList.length} berkas
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Pegawai dengan sisa masa kontrak &le; 60 hari atau memiliki catatan evaluasi/dokumen belum lengkap
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {urgentList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Tidak ada berkas berstatus kritis saat ini.
                </div>
              ) : (
                urgentList.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {emp.namaLengkap}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {emp.jabatan}
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums font-semibold text-amber-700 shrink-0">
                        {emp.sisaHariKontrak} hari lagi
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span>Presensi {emp.evaluasiAbsensi.persentaseKehadiran}%</span>
                      <span aria-hidden="true">·</span>
                      <span>SKP: {emp.evaluasiSKP.predikatKinerja}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateToTab('jadwal')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              Lihat Kalender Evaluasi &rarr;
            </button>
            <button
              onClick={() => onNavigateToTab('laporan')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
