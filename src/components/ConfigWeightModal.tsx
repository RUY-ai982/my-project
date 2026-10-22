import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import { BobotKonfigurasi } from '../types/pppk';
import { DEFAULT_BOBOT } from '../utils/calculation';

interface ConfigWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BobotKonfigurasi;
  onSaveConfig: (newConfig: BobotKonfigurasi) => void;
}

export const ConfigWeightModal: React.FC<ConfigWeightModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  if (!isOpen) return null;

  const [bobotAbsensi, setBobotAbsensi] = useState(config.bobotAbsensi);
  const [minAbsensi, setMinAbsensi] = useState(config.ambangBatasMinimalAbsensi);
  const [minSKP, setMinSKP] = useState(config.ambangBatasMinimalSKP);
  const [minLayak, setMinLayak] = useState(config.ambangMinimalLayak);

  const bobotSKP = 100 - bobotAbsensi;

  const handleReset = () => {
    setBobotAbsensi(DEFAULT_BOBOT.bobotAbsensi);
    setMinAbsensi(DEFAULT_BOBOT.ambangBatasMinimalAbsensi);
    setMinSKP(DEFAULT_BOBOT.ambangBatasMinimalSKP);
    setMinLayak(DEFAULT_BOBOT.ambangMinimalLayak);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      bobotAbsensi,
      bobotSKP,
      ambangBatasMinimalAbsensi: minAbsensi,
      ambangBatasMinimalSKP: minSKP,
      ambangMinimalLayak: minLayak
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Pengaturan Bobot Formula Evaluasi
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Sesuaikan proporsi pembobotan antara aspek kehadiran fisik/biometrik dan evaluasi capaian SKP e-Kinerja untuk menentukan rekomendasi <strong>Layak Diperpanjang</strong> vs <strong>Tidak Layak Diperpanjang</strong>.
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Slider Bobot */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Bobot Absensi: {bobotAbsensi}%</span>
              <span className="text-emerald-700">Bobot SKP: {bobotSKP}%</span>
            </div>

            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={bobotAbsensi}
              onChange={(e) => setBobotAbsensi(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% Absensi / 90% SKP</span>
              <span>40% / 60% (Standar)</span>
              <span>70% Absensi / 30% SKP</span>
            </div>
          </div>

          {/* Thresholds */}
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Batas Minimal Kehadiran (%)
              </label>
              <input
                type="number"
                min="70"
                max="95"
                value={minAbsensi}
                onChange={(e) => setMinAbsensi(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Pegawai di bawah batas ini terdeteksi catatan disiplin kehadiran</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Batas Minimal Nilai SKP (Skor 0-100)
              </label>
              <input
                type="number"
                min="60"
                max="90"
                value={minSKP}
                onChange={(e) => setMinSKP(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Ambang nilai predikat SKP minimal 'Baik' (standar BKN = 75)</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Ambang Batas Nilai Gabungan 'Layak Diperpanjang'
              </label>
              <input
                type="number"
                min="60"
                max="90"
                value={minLayak}
                onChange={(e) => setMinLayak(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 font-bold text-emerald-800"
              />
              <span className="text-[10px] text-slate-400">Skor komposit di bawah nilai ini otomatis dikategorikan 'Tidak Layak Diperpanjang'</span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Standar BKN</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
              >
                Terapkan & Hitung Ulang
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
