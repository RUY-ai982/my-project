import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Filter, 
  CheckCircle, 
  Building, 
  TrendingUp, 
  FileText,
  UserCheck,
  Edit3,
  X,
  ShieldCheck,
  Calendar,
  Check
} from 'lucide-react';
import { PPPKEmployee, StatusKelayakan } from '../types/pppk';
import { maskNIP } from '../utils/crypto';

interface ReportingViewProps {
  employees: PPPKEmployee[];
}

export interface SignatoryConfig {
  tempat: string;
  tanggal: string;
  jabatan: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  isTTE: boolean;
  keteranganTTE: string;
}

export const ReportingView: React.FC<ReportingViewProps> = ({ employees }) => {
  const [selectedOPD, setSelectedOPD] = useState<string>('ALL');
  const [isEditSignatoryOpen, setIsEditSignatoryOpen] = useState(false);

  // Signatory State - Defaults to Pemerintah Kabupaten Bangkalan / BKPSDA
  const [signatory, setSignatory] = useState<SignatoryConfig>({
    tempat: 'Bangkalan',
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    jabatan: 'Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur',
    nama: 'Drs. H. Mulyadi, M.Si',
    nip: '197204151998031002',
    pangkatGolongan: 'Pembina Utama Muda (IV/c)',
    isTTE: true,
    keteranganTTE: '[Telah Ditandatangani Secara Elektronik]'
  });

  // Draft state for modal editing
  const [draftSignatory, setDraftSignatory] = useState<SignatoryConfig>({ ...signatory });

  // Unique OPD list for filter dropdown
  const opdList = useMemo(() => {
    const units = new Set<string>();
    employees.forEach(e => {
      if (e.unitKerja) {
        units.add(e.unitKerja.split('/')[0].trim());
      }
    });
    return Array.from(units);
  }, [employees]);

  const filtered = selectedOPD === 'ALL'
    ? employees
    : employees.filter(e => e.unitKerja.includes(selectedOPD));

  const total = filtered.length;
  const countLayak = filtered.filter(e => e.kelayakan.status === 'Layak Diperpanjang').length;
  const countTidakLayak = filtered.filter(e => e.kelayakan.status === 'Tidak Layak Diperpanjang').length;
  const countResign = filtered.filter(e => e.kelayakan.status === 'Mengundurkan Diri').length;
  const countWafat = filtered.filter(e => e.kelayakan.status === 'Meninggal Dunia').length;
  const countNonaktif = filtered.filter(e => e.kelayakan.status === 'Tidak Aktif Bekerja').length;

  const handleOpenEditSignatory = () => {
    setDraftSignatory({ ...signatory });
    setIsEditSignatoryOpen(true);
  };

  const handleSaveSignatory = (e: React.FormEvent) => {
    e.preventDefault();
    setSignatory({ ...draftSignatory });
    setIsEditSignatoryOpen(false);
  };

  const applyPreset = (preset: Partial<SignatoryConfig>) => {
    setDraftSignatory(prev => ({
      ...prev,
      ...preset
    }));
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'NI PPPK',
      'Nama Lengkap',
      'Jabatan',
      'Unit Kerja',
      'TMT Kontrak Awal',
      'TMT Kontrak Akhir',
      'Persentase Absensi',
      'Predikat SKP',
      'Nilai Akhir SKP',
      'Skor Kelayakan',
      'Status Kelayakan Usulan',
      'Status Dokumen',
      'Surat Rekomendasi Upload',
      'No SPTJM',
      'Hash SHA256 SPTJM'
    ];

    const rows = filtered.map((e, idx) => [
      idx + 1,
      `'${e.nipPppk}`,
      `"${e.namaLengkap}"`,
      `"${e.jabatan}"`,
      `"${e.unitKerja}"`,
      e.tmtKontrakAwal,
      e.tmtKontrakAkhir,
      `${e.evaluasiAbsensi.persentaseKehadiran}%`,
      `"${e.evaluasiSKP.predikatKinerja}"`,
      e.evaluasiSKP.nilaiAkhirSKP,
      e.kelayakan.skorTotalKelayakan,
      `"${e.kelayakan.status}"`,
      `"${e.statusDokumen}"`,
      e.suratRekomendasiUpload ? `"${e.suratRekomendasiUpload.fileName}"` : '"Belum Diunggah"',
      `"${e.sptjmNomor}"`,
      e.enkripsi.sptjmHashSHA256
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekapitulasi_Perpanjangan_PPPK_PW_Bangkalan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (no-print) */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Sistem Pelaporan Otomatis & Rekapitulasi Usulan Perpanjangan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Format baku rekapitulasi kolektif terverifikasi untuk Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur (BKPSDA) Kabupaten Bangkalan & BKN
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* OPD Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedOPD}
              onChange={(e) => setSelectedOPD(e.target.value)}
              className="bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Perangkat Daerah ({employees.length})</option>
              {opdList.map(opd => (
                <option key={opd} value={opd}>{opd}</option>
              ))}
            </select>
          </div>

          {/* Edit Penandatangan Button */}
          <button
            onClick={handleOpenEditSignatory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors"
            title="Ubah Nama, NIP, Jabatan, Tempat & Tanggal Penandatangan Rekapitulasi"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Edit Penandatangan</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor (.CSV)</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip (no-print) - 5 Exact Statuses */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500">Total Berkas</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{total}</div>
        </div>
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
          <div className="text-[11px] text-emerald-800 font-medium">Layak Diperpanjang</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{countLayak}</div>
        </div>
        <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
          <div className="text-[11px] text-rose-800 font-medium">Tidak Layak Diperpanjang</div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1">{countTidakLayak}</div>
        </div>
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
          <div className="text-[11px] text-amber-800 font-medium">Mengundurkan Diri</div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">{countResign}</div>
        </div>
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
          <div className="text-[11px] text-purple-800 font-medium">Meninggal Dunia</div>
          <div className="text-xl font-bold font-mono text-purple-700 mt-1">{countWafat}</div>
        </div>
        <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl">
          <div className="text-[11px] text-slate-700 font-medium">Tidak Aktif Bekerja</div>
          <div className="text-xl font-bold font-mono text-slate-800 mt-1">{countNonaktif}</div>
        </div>
      </div>

      {/* Printable Official Government Report Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs">
        {/* Report Header for printing */}
        <div className="text-center pb-4 mb-4 border-b-2 border-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            PEMERINTAH KABUPATEN BANGKALAN / BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA APARATUR
          </div>
          <div className="text-sm sm:text-base font-bold font-serif uppercase tracking-tight text-slate-900 mt-1">
            DAFTAR REKAPITULASI HASIL EVALUASI KINERJA DAN USULAN PERPANJANGAN PERJANJIAN KERJA PPPK PW
          </div>
          <div className="text-xs text-slate-600 mt-1 font-mono">
            Berdasarkan Evaluasi Presensi Biometrik, e-Kinerja SKP BKN, dan Surat Rekomendasi Atasan Langsung
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-100 border border-slate-300 text-slate-700 font-bold">
                <th className="py-2 px-2 border border-slate-300 text-center w-8">No</th>
                <th className="py-2 px-3 border border-slate-300">Nama & NI PPPK</th>
                <th className="py-2 px-3 border border-slate-300">Jabatan & Unit Kerja</th>
                <th className="py-2 px-2 border border-slate-300 text-center">Presensi (%)</th>
                <th className="py-2 px-2 border border-slate-300 text-center">SKP BKN</th>
                <th className="py-2 px-2 border border-slate-300 text-center">Skor Akhir</th>
                <th className="py-2 px-3 border border-slate-300">Status Kelayakan</th>
                <th className="py-2 px-3 border border-slate-300 text-center">Surat Rekomendasi</th>
                <th className="py-2 px-3 border border-slate-300 text-center">Status Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 border border-slate-300 text-center font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border border-slate-300">
                    <div className="font-bold text-slate-900">{emp.namaLengkap}</div>
                    <div className="font-mono text-[10px] text-slate-600">{emp.nipPppk}</div>
                  </td>
                  <td className="py-2 px-3 border border-slate-300">
                    <div className="font-medium text-slate-800">{emp.jabatan}</div>
                    <div className="text-[10px] text-slate-600">{emp.unitKerja}</div>
                  </td>
                  <td className="py-2 px-2 border border-slate-300 text-center font-mono font-semibold">
                    {emp.evaluasiAbsensi.persentaseKehadiran}%
                  </td>
                  <td className="py-2 px-2 border border-slate-300 text-center">
                    <div className="font-semibold text-slate-800">{emp.evaluasiSKP.predikatKinerja}</div>
                    <div className="font-mono text-[10px] text-slate-500">Nilai: {emp.evaluasiSKP.nilaiAkhirSKP}</div>
                  </td>
                  <td className="py-2 px-2 border border-slate-300 text-center font-mono font-bold text-emerald-800">
                    {emp.kelayakan.skorTotalKelayakan}
                  </td>
                  <td className="py-2 px-3 border border-slate-300">
                    <div className="font-bold text-slate-900">{emp.kelayakan.status}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">{emp.kelayakan.catatanRekomendasi}</div>
                  </td>
                  <td className="py-2 px-3 border border-slate-300 text-center">
                    {emp.suratRekomendasiUpload ? (
                      <span className="text-emerald-700 font-medium">Telah Diunggah</span>
                    ) : emp.dokumenPersyaratan.suratRekomendasiAtasan ? (
                      <span className="text-blue-700 font-medium">Ada (Fisik)</span>
                    ) : (
                      <span className="text-rose-600 font-medium">Belum Diunggah</span>
                    )}
                  </td>
                  <td className="py-2 px-3 border border-slate-300 text-center font-medium">
                    {emp.statusDokumen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature & Endorsement Block (Fully Configurable via "Edit Penandatangan") */}
        <div className="mt-8 pt-4 flex justify-between items-start text-xs font-serif">
          <div className="text-left font-sans text-[11px] text-slate-500 max-w-sm">
            <div>Dokumen ini diproduksi secara otomatis oleh Sistem SIM-PPPK PW Terpadu Kabupaten Bangkalan.</div>
            <div>Integritas data dilindungi tanda tangan digital tersertifikasi BSrE.</div>
            <div className="font-mono text-[10px] mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div className="text-center font-serif w-72">
            <div>Ditetapkan di {signatory.tempat}</div>
            <div>Pada tanggal {signatory.tanggal}</div>
            <div className="font-medium mt-1 leading-snug">{signatory.jabatan}</div>
            
            <div className="h-16 flex items-center justify-center my-1.5">
              {signatory.isTTE ? (
                <div className="font-sans text-[10px] text-emerald-800 font-mono border border-emerald-300 bg-emerald-50 px-2.5 py-1 rounded shadow-2xs text-center">
                  <div className="font-semibold">{signatory.keteranganTTE}</div>
                  <div className="text-[9px] text-emerald-600 font-sans">BSrE - BSSN Republik Indonesia</div>
                </div>
              ) : (
                <div className="font-sans text-[10px] text-slate-400 italic">
                  (Tanda Tangan dan Cap Basah Instansi)
                </div>
              )}
            </div>

            <div className="font-bold underline text-slate-900 text-[13px]">{signatory.nama}</div>
            {signatory.pangkatGolongan && (
              <div className="text-[11px] text-slate-700 font-serif leading-tight">{signatory.pangkatGolongan}</div>
            )}
            <div className="font-mono text-xs text-slate-700 mt-0.5">NIP. {signatory.nip}</div>
          </div>
        </div>
      </div>

      {/* Edit Penandatangan Modal */}
      {isEditSignatoryOpen && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pengaturan Pejabat Penandatangan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ubah data pejabat penandatangan rekapitulasi PPPK PW Kabupaten Bangkalan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditSignatoryOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSignatory} className="p-6 space-y-4">
              
              {/* Quick Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Pilih Cepat Pejabat (Preset BKPSDA Bangkalan):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      jabatan: 'Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur,',
                      nama: 'Drs. H. Mulyadi, M.Si',
                      nip: '197204151998031002',
                      pangkatGolongan: 'Pembina Utama Muda (IV/c)',
                      tempat: 'Bangkalan'
                    })}
                    className="p-2 text-left border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-800">Kepala BKPSDA</div>
                    <div className="text-[10px] text-slate-500 truncate">Drs. H. Mulyadi, M.Si</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset({
                      jabatan: 'Plt. Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur,',
                      nama: 'Dr. Ir. H. Hermansyah, M.Si',
                      nip: '196805121994031002',
                      pangkatGolongan: 'Pembina Utama Madya (IV/d)',
                      tempat: 'Bangkalan'
                    })}
                    className="p-2 text-left border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-800">Plt. Kepala BKPSDA</div>
                    <div className="text-[10px] text-slate-500 truncate">Dr. Ir. H. Hermansyah</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset({
                      jabatan: 'Sekretaris Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur,',
                      nama: 'Hj. Siti Rahmawati, S.Sos., M.Si',
                      nip: '197809122002122001',
                      pangkatGolongan: 'Pembina (IV/a)',
                      tempat: 'Bangkalan'
                    })}
                    className="p-2 text-left border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-800">Sekretaris BKPSDA</div>
                    <div className="text-[10px] text-slate-500 truncate">Hj. Siti Rahmawati</div>
                  </button>
                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat / Kota Penetapan
                  </label>
                  <input
                    type="text"
                    required
                    value={draftSignatory.tempat}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, tempat: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Bangkalan"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Tanggal Penetapan
                    </label>
                    <button
                      type="button"
                      onClick={() => setDraftSignatory({
                        ...draftSignatory,
                        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      })}
                      className="text-[10px] text-emerald-700 hover:underline"
                    >
                      Hari Ini
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={draftSignatory.tanggal}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, tanggal: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: 21 Oktober 2026"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Penandatangan
                  </label>
                  <input
                    type="text"
                    required
                    value={draftSignatory.jabatan}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Aparatur,"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar Pejabat
                  </label>
                  <input
                    type="text"
                    required
                    value={draftSignatory.nama}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Drs. H. Mulyadi, M.Si"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pejabat (18 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    value={draftSignatory.nip}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, nip: e.target.value.replace(/\D/g, '') })}
                    maxLength={18}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="197204151998031002"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan Ruang
                  </label>
                  <input
                    type="text"
                    value={draftSignatory.pangkatGolongan}
                    onChange={(e) => setDraftSignatory({ ...draftSignatory, pangkatGolongan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Pembina Utama Muda (IV/c)"
                  />
                </div>
              </div>

              {/* TTE vs Wet Signature Option */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Model Pengesahan Dokumen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftSignatory({ ...draftSignatory, isTTE: true })}
                    className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                      draftSignatory.isTTE
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Tanda Tangan Digital (TTE)</span>
                      {draftSignatory.isTTE && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sertifikasi Elektronik BSrE BSSN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftSignatory({ ...draftSignatory, isTTE: false })}
                    className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                      !draftSignatory.isTTE
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Tanda Tangan Basah</span>
                      {!draftSignatory.isTTE && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Tanda tangan manual & stempel cap basah</div>
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-800 mb-1">
                  Pratinjau Hasil Format Tanda Tangan:
                </div>
                <div className="p-3 bg-white rounded border border-amber-200 text-center font-serif text-xs">
                  <div>Ditetapkan di {draftSignatory.tempat || '...'}</div>
                  <div>Pada tanggal {draftSignatory.tanggal || '...'}</div>
                  <div className="font-medium mt-0.5">{draftSignatory.jabatan || '...'}</div>
                  <div className="h-10 flex items-center justify-center my-1 text-[9px] font-sans">
                    {draftSignatory.isTTE ? (
                      <span className="text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-mono">
                        {draftSignatory.keteranganTTE}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">(Tanda Tangan & Cap Basah)</span>
                    )}
                  </div>
                  <div className="font-bold underline text-slate-900">{draftSignatory.nama || '...'}</div>
                  {draftSignatory.pangkatGolongan && (
                    <div className="text-[10px] text-slate-600">{draftSignatory.pangkatGolongan}</div>
                  )}
                  <div className="font-mono text-[10px] text-slate-600">NIP. {draftSignatory.nip || '...'}</div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditSignatoryOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan & Terapkan Perubahan</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
