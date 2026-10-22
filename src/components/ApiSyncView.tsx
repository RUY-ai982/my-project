import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  Globe, 
  Server, 
  Code, 
  Database, 
  Fingerprint, 
  Cpu, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApiSyncLog } from '../types/schedule';

interface ApiSyncViewProps {
  logs: ApiSyncLog[];
  onTriggerSync: (service: 'BKN e-Kinerja SIASN' | 'Presensi Biometrik & Geotag' | 'SIMPEG Kepegawaian Pusat') => void;
  isSyncing: boolean;
}

export const ApiSyncView: React.FC<ApiSyncViewProps> = ({
  logs,
  onTriggerSync,
  isSyncing
}) => {
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);
  const [activeSyncingService, setActiveSyncingService] = useState<string | null>(null);

  const handleSync = async (service: 'BKN e-Kinerja SIASN' | 'Presensi Biometrik & Geotag' | 'SIMPEG Kepegawaian Pusat') => {
    setActiveSyncingService(service);
    await onTriggerSync(service);
    setActiveSyncingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Integrasi API Pihak Ketiga & Sinkronisasi Data Terpadu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Koneksi pertukaran data otomatis dengan SIASN BKN, E-Presensi Biometrik, dan Basis Data SIMPEG
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status Koneksi Gateway:</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Terhubung & Aktif (HTTP 200)
          </span>
        </div>
      </div>

      {/* 3 Active API Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connector 1: BKN e-Kinerja */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                REST v2.4 JSON
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              BKN e-Kinerja SIASN
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sinkronisasi predikat SKP, capaian angka kredit jabatan fungsional, dan matriks perilaku BerAKHLAK nasional.
            </p>

            <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 truncate">
              GET https://api.siasn.bkn.go.id/v2/layanan-kinerja
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">Auth: Bearer Token</span>
            <button
              onClick={() => handleSync('BKN e-Kinerja SIASN')}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activeSyncingService === 'BKN e-Kinerja SIASN' ? 'animate-spin' : ''}`} />
              <span>Tarik Data SKP</span>
            </button>
          </div>
        </div>

        {/* Connector 2: E-Presensi Biometrik */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Fingerprint className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Webhook + REST
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Presensi Biometrik & Geotag
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sinkronisasi log kehadiran mesin finger, absensi GPS mobile ASN, rekap jam kerja harian, dan cuti resmi.
            </p>

            <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 truncate">
              POST https://presensi-asn.kota.go.id/api/v1/fingerprint
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">14 Mesin Terhubung</span>
            <button
              onClick={() => handleSync('Presensi Biometrik & Geotag')}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activeSyncingService === 'Presensi Biometrik & Geotag' ? 'animate-spin' : ''}`} />
              <span>Sinkron Presensi</span>
            </button>
          </div>
        </div>

        {/* Connector 3: SIMPEG Master */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                PostgreSQL Link
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              SIMPEG Kepegawaian Pusat
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sinkronisasi data master pegawai, penetapan formasi PPPK, TMT perjanjian kerja, dan mutasi unit kerja.
            </p>

            <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 truncate">
              GET https://simpeg.kepegawaian.go.id/rest/v3/data-pppk
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">Master DB OPD</span>
            <button
              onClick={() => handleSync('SIMPEG Kepegawaian Pusat')}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activeSyncingService === 'SIMPEG Kepegawaian Pusat' ? 'animate-spin' : ''}`} />
              <span>Tarik SIMPEG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Transaction History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Riwayat Transaksi Sinkronisasi API Terakhir
            </h2>
            <p className="text-xs text-slate-500">
              Log aktivitas pertukaran berkas dan validasi respon payload server
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-4">Layanan API</th>
                <th className="py-2.5 px-4">Endpoint</th>
                <th className="py-2.5 px-4">Waktu</th>
                <th className="py-2.5 px-4">Status & Respon</th>
                <th className="py-2.5 px-4 text-right">Durasi</th>
                <th className="py-2.5 px-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {log.namaLayanan}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                    {log.endpoint}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {log.waktuSync}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                      {log.statusKode} OK · {log.jumlahRecord} records
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                    {log.durasiMs} ms
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPayload(log.detailPayload)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium text-[11px] underline"
                    >
                      Lihat JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 font-mono">Payload JSON Response:</span>
              <button 
                onClick={() => setSelectedPayload(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium"
              >
                Tutup
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-64">
              {JSON.stringify(JSON.parse(selectedPayload), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
