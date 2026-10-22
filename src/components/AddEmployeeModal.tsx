import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, PlusCircle, UserCheck } from 'lucide-react';
import { PPPKEmployee, PredikatSKP, BobotKonfigurasi } from '../types/pppk';
import { validateEmployeeData, validateNIPPPK, validateNIK } from '../utils/validation';
import { calculateKelayakan, DEFAULT_BOBOT } from '../utils/calculation';
import { generateSHA256Hash, generateCertId } from '../utils/crypto';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: PPPKEmployee) => void;
  config: BobotKonfigurasi;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  config
}) => {
  if (!isOpen) return null;

  const [nipPppk, setNipPppk] = useState('199605142023211009');
  const [nik, setNik] = useState('3204121405960002');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jabatan, setJabatan] = useState('Ahli Pertama - Analis SDM Aparatur');
  const [golongan, setGolongan] = useState('IX');
  const [unitKerja, setUnitKerja] = useState('Badan Kepegawaian dan Pengembangan SDM');
  const [persentaseKehadiran, setPersentaseKehadiran] = useState<number>(95);
  const [tanpaKeterangan, setTanpaKeterangan] = useState<number>(0);
  const [keterlambatanMenit, setKeterlambatanMenit] = useState<number>(45);
  const [predikatKinerja, setPredikatKinerja] = useState<PredikatSKP>('Baik');
  const [skorHasilKerja, setSkorHasilKerja] = useState<number>(88);
  const [atasanNama, setAtasanNama] = useState('Drs. H. Mulyadi, M.Si');
  const [atasanNip, setAtasanNip] = useState('197204151998031002');
  const [atasanJabatan, setAtasanJabatan] = useState('Kepala Bidang Pengadaan & Pembinaan ASN');

  // Real-time live validation result
  const [liveValidation, setLiveValidation] = useState(validateEmployeeData({
    nipPppk,
    nik,
    namaLengkap,
    unitKerja,
    evaluasiAbsensi: {
      persentaseKehadiran,
      tanpaKeterangan,
      totalHariKerja: 240,
      hadir: 228,
      izin: 6,
      sakit: 6,
      cuti: 0,
      totalKeterlambatanMenit: keterlambatanMenit,
      terlambatFrekuensi: 2,
      catatanDisiplin: 'Tertib',
      terakhirDisinkronkan: 'Manual Form Input'
    },
    evaluasiSKP: {
      tahunEvaluasi: 2026,
      predikatKinerja,
      skorHasilKerja,
      skorPerilaku: 85,
      predikatPerilaku: 'Sesuai Ekspektasi',
      nilaiAkhirSKP: skorHasilKerja,
      capaianTargetUtama: 'Tercapai optimal',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Baik',
        akuntabel: 'Baik',
        kompeten: 'Baik',
        harmonis: 'Baik',
        loyal: 'Baik',
        adaptif: 'Baik',
        kolaboratif: 'Baik'
      },
      nomorSKPBKN: 'SKP-BKN/MANUAL/2026',
      terakhirDisinkronkan: 'Manual'
    },
    dokumenPersyaratan: {
      ktp: true,
      skPengangkatanAwal: true,
      rekapPresensiResmi: true,
      lembarPenilaianSKP: true,
      suratKeteranganSehat: true,
      suratBebasHukumanDisiplin: true,
      suratRekomendasiAtasan: true
    },
    atasanNama,
    atasanNip
  }));

  useEffect(() => {
    const tempEmp = {
      nipPppk,
      nik,
      namaLengkap,
      unitKerja,
      evaluasiAbsensi: {
        persentaseKehadiran,
        tanpaKeterangan,
        totalHariKerja: 240,
        hadir: Math.round((persentaseKehadiran / 100) * 240),
        izin: 3,
        sakit: 3,
        cuti: 0,
        totalKeterlambatanMenit: keterlambatanMenit,
        terlambatFrekuensi: 2,
        catatanDisiplin: 'Disiplin aktif',
        terakhirDisinkronkan: 'Manual Entry'
      },
      evaluasiSKP: {
        tahunEvaluasi: 2026,
        predikatKinerja,
        skorHasilKerja,
        skorPerilaku: 85,
        predikatPerilaku: 'Sesuai Ekspektasi' as const,
        nilaiAkhirSKP: skorHasilKerja,
        capaianTargetUtama: 'Memenuhi seluruh target indikator kinerja individu',
        perilakuBerAKHLAK: {
          berorientasiPelayanan: 'Berorientasi pelayanan tinggi',
          akuntabel: 'Bertanggung jawab dalam pelaporan dinas',
          kompeten: 'Menguasai bidang tugas regulasi kepegawaian',
          harmonis: 'Hubungan kerja baik',
          loyal: 'Menjaga integritas ASN',
          adaptif: 'Cepat menyesuaikan sistem digital',
          kolaboratif: 'Sinergi lintas bidang'
        },
        nomorSKPBKN: `SKP-BKN/${Date.now().toString().slice(-4)}`,
        terakhirDisinkronkan: 'Manual'
      },
      dokumenPersyaratan: {
        ktp: true,
        skPengangkatanAwal: true,
        rekapPresensiResmi: true,
        lembarPenilaianSKP: true,
        suratKeteranganSehat: true,
        suratBebasHukumanDisiplin: true,
        suratRekomendasiAtasan: true
      },
      atasanNama,
      atasanNip
    };

    setLiveValidation(validateEmployeeData(tempEmp));
  }, [nipPppk, nik, namaLengkap, unitKerja, persentaseKehadiran, tanpaKeterangan, keterlambatanMenit, predikatKinerja, skorHasilKerja, atasanNama, atasanNip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) return;

    const absensiObj = {
      persentaseKehadiran,
      totalHariKerja: 240,
      hadir: Math.round((persentaseKehadiran / 100) * 240),
      izin: 4,
      sakit: 2,
      cuti: 0,
      tanpaKeterangan,
      totalKeterlambatanMenit: keterlambatanMenit,
      terlambatFrekuensi: 3,
      catatanDisiplin: 'Disiplin terjaga, tidak ada riwayat indisipliner.',
      terakhirDisinkronkan: 'Manual Validated Input'
    };

    const skpObj = {
      tahunEvaluasi: 2026,
      predikatKinerja,
      skorHasilKerja,
      skorPerilaku: 86,
      predikatPerilaku: 'Sesuai Ekspektasi' as const,
      nilaiAkhirSKP: skorHasilKerja,
      capaianTargetUtama: 'Menyelesaikan seluruh target IKI dan rencana aksi tahunan.',
      perilakuBerAKHLAK: {
        berorientasiPelayanan: 'Pelayanan prima dan ramah',
        akuntabel: 'Tertib administrasi dan dokumentasi tugas',
        kompeten: 'Menunjukkan keahlian teknis sesuai jenjang jabatan',
        harmonis: 'Membangun lingkungan kerja yang kondusif',
        loyal: 'Menjaga nama baik korps pegawai pemerintah',
        adaptif: 'Cepat mengadopsi teknologi informasi baru',
        kolaboratif: 'Kerja sama tim solid dan proaktif'
      },
      nomorSKPBKN: `SKP-BKN/USUL/${Date.now().toString().slice(-4)}`,
      terakhirDisinkronkan: 'Tersinkronisasi SIASN BKN'
    };

    const kelayakan = calculateKelayakan(absensiObj, skpObj, config);
    const sptjmHash = await generateSHA256Hash(`SPTJM-${nipPppk}-${namaLengkap}-${Date.now()}`);
    const rekomHash = await generateSHA256Hash(`REKOM-${nipPppk}-${atasanNip}-${Date.now()}`);

    const newEmp: PPPKEmployee = {
      id: `pppk-${Date.now()}`,
      nipPppk,
      nik,
      namaLengkap,
      jabatan,
      golongan,
      unitKerja,
      instansi: 'Pemerintah Kabupaten Bangkalan',
      tmtKontrakAwal: '2023-01-01',
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
      sptjmNomor: `800.1.2/SPTJM-PPPK/${Date.now().toString().slice(-4)}`,
      sptjmTanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      rekomendasiNomor: `800/REKOM-PPPK/${Date.now().toString().slice(-4)}`,
      rekomendasiTanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      atasanNama,
      atasanNip,
      atasanJabatan,
      kepalaOpdNama: 'Dr. Ir. H. Hermansyah, M.Si',
      kepalaOpdNip: '196805121994031002',
      kepalaOpdJabatan: 'Kepala BKPSDM Provinsi',
      validasi: liveValidation,
      enkripsi: {
        sptjmHashSHA256: sptjmHash,
        rekomendasiHashSHA256: rekomHash,
        algorithm: 'SHA-256 + AES-256-GCM',
        signatureTimestamp: new Date().toISOString(),
        bsreDigitalCertId: generateCertId(nipPppk, 'SPTJM'),
        isVerified: true
      },
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Formulir Pendaftaran Usulan Perpanjangan Kontrak PPPK
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Validation Alert Banner */}
        <div className="mt-3">
          {liveValidation.issues.length === 0 ? (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Input data memenuhi seluruh validasi format NIP, NIK, dan standar kehadiran</span>
            </div>
          ) : (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold">Peringatan Validasi Input Otomatis:</div>
                {liveValidation.issues.map((iss, i) => (
                  <div key={i} className="text-[11px]">&bull; {iss.message}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-4 space-y-4 text-xs">
          
          {/* Pegawai Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Fauzan, S.Pd"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NI PPPK (18 Digit Angka) *
              </label>
              <input
                type="text"
                required
                maxLength={18}
                value={nipPppk}
                onChange={(e) => setNipPppk(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                {nipPppk.length}/18 digit
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIK Kependudukan (16 Digit) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jabatan Fungsional *
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Unit Kerja / Perangkat Daerah (OPD) *
              </label>
              <input
                type="text"
                required
                value={unitKerja}
                onChange={(e) => setUnitKerja(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Absensi & SKP Section */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2">
              Parameter Evaluasi Presensi & SKP
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Persentase Kehadiran (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={persentaseKehadiran}
                  onChange={(e) => setPersentaseKehadiran(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tanpa Keterangan (Alpha)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tanpaKeterangan}
                  onChange={(e) => setTanpaKeterangan(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Predikat Kinerja SKP
                </label>
                <select
                  value={predikatKinerja}
                  onChange={(e) => setPredikatKinerja(e.target.value as PredikatSKP)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium focus:ring-1 focus:ring-emerald-600 text-slate-900"
                >
                  <option value="Sangat Baik">Sangat Baik (95 - 100)</option>
                  <option value="Baik">Baik (75 - 94)</option>
                  <option value="Butuh Perbaikan">Butuh Perbaikan (60 - 74)</option>
                  <option value="Kurang">Kurang (50 - 59)</option>
                  <option value="Sangat Kurang">Sangat Kurang (&lt; 50)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Atasan Langsung */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2">
              Atasan Langsung (Penilai Rekomendasi)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Atasan Langsung</label>
                <input
                  type="text"
                  value={atasanNama}
                  onChange={(e) => setAtasanNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP Atasan Langsung</label>
                <input
                  type="text"
                  value={atasanNip}
                  onChange={(e) => setAtasanNip(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!namaLengkap.trim() || nipPppk.length !== 18}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Simpan & Usulkan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
