import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Send, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Mail, 
  Smartphone, 
  CheckCheck
} from 'lucide-react';
import { EvaluationSchedule } from '../types/schedule';

interface EvaluationScheduleViewProps {
  schedules: EvaluationSchedule[];
  onBroadcastReminder: (scheduleId: string) => void;
}

export const EvaluationScheduleView: React.FC<EvaluationScheduleViewProps> = ({
  schedules,
  onBroadcastReminder
}) => {
  const [sentAlertId, setSentAlertId] = useState<string | null>(null);

  const handleSendReminder = (id: string) => {
    onBroadcastReminder(id);
    setSentAlertId(id);
    setTimeout(() => {
      setSentAlertId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Jadwal & Notifikasi Evaluasi Kinerja Berkala PPPK
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengingat terjadwal triwulanan dan notifikasi peringatan H-60 / H-30 sebelum masa kontrak kerja berakhir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Kanal Siar Otomatis:
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Email</span>
            <span aria-hidden="true">·</span>
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Gateway</span>
          </div>
        </div>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((item) => {
          const progressPercent = item.totalPegawaiSasaran > 0 
            ? Math.round((item.sudahSelesaiEvaluasi / item.totalPegawaiSasaran) * 100) 
            : 0;

          const isCritical = item.jenisEvaluasi === 'H-30 Habis Kontrak' || item.status === 'Mendekati Batas Akhir';
          const isSent = sentAlertId === item.id;

          return (
            <div 
              key={item.id}
              className={`p-5 bg-white border rounded-xl shadow-xs transition-all ${
                isCritical 
                  ? 'border-amber-300 ring-1 ring-amber-200' 
                  : 'border-slate-200'
              }`}
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold ${
                      isCritical ? 'text-amber-800' : 'text-emerald-800'
                    }`}>
                      {item.jenisEvaluasi} · Periode {item.periodeTahun}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {item.sisaHari > 0 ? `${item.sisaHari} hari tersisa` : 'Jatuh tempo'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {item.namaKegiatan}
                  </h3>
                </div>

                <div className={`p-2 rounded-lg shrink-0 ${
                  isCritical ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {/* Target & Time */}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rentang Waktu: <strong className="font-mono text-slate-800">{item.tanggalMulai}</strong> s/d <strong className="font-mono text-slate-800">{item.tanggalSelesai}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sasaran: {item.targetUnitKerja}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progres Evaluasi OPD</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {item.sudahSelesaiEvaluasi} / {item.totalPegawaiSasaran} Pegawai ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progressPercent >= 80 ? 'bg-emerald-600' : progressPercent >= 40 ? 'bg-teal-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Bottom Action: Broadcast Reminder */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  {item.pengingatTerakhirDikirim ? (
                    <span>Terkirim: {item.pengingatTerakhirDikirim}</span>
                  ) : (
                    <span>Belum ada siaran pengingat</span>
                  )}
                </div>

                <button
                  onClick={() => handleSendReminder(item.id)}
                  disabled={isSent}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSent 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                  }`}
                >
                  {isSent ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Notifikasi Terkirim!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pengingat Berkala</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-emerald-700" />
          <span>Mekanisme Peringatan Otomatis Sistem SIM-PPPK PW:</span>
        </div>
        <p className="leading-relaxed">
          Sistem secara otomatis menghitung sisa masa berlaku perjanjian kerja setiap pegawai. Peringatan <strong>H-60</strong> akan dikirimkan kepada atasan langsung penilai untuk menyiapkan berkas evaluasi SKP dan rekap presensi. Pada <strong>H-30</strong>, peringatan eskalasi diteruskan ke Kepala OPD dan BKPSDM untuk penetapan SPTJM dan penerbitan SK Perpanjangan.
        </p>
      </div>
    </div>
  );
};
