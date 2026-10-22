import React from 'react';
import { ShieldCheck, Calendar, RefreshCw, FileText, PlusCircle, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'pegawai' | 'jadwal' | 'api-sync' | 'laporan';
  setActiveTab: (tab: 'dashboard' | 'pegawai' | 'jadwal' | 'api-sync' | 'laporan') => void;
  onOpenAddModal: () => void;
  onOpenVerifyModal: () => void;
  pendingValidationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenVerifyModal,
  pendingValidationCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <span className="text-sm tracking-wider">PW</span>
            </div>
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors"
            >
              SIM-PPPK PW Terpadu
            </a>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'dashboard'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              Dashboard Admin
            </button>
            <button
              onClick={() => setActiveTab('pegawai')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'pegawai'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Data Usulan & Berkas</span>
              {pendingValidationCount > 0 && (
                <span className="text-xs text-amber-700 font-mono tabular-nums">
                  ({pendingValidationCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'jadwal'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Jadwal Evaluasi</span>
            </button>
            <button
              onClick={() => setActiveTab('api-sync')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'api-sync'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Integrasi API BKN & Presensi</span>
            </button>
            <button
              onClick={() => setActiveTab('laporan')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'laporan'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Laporan Rekapitulasi</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenVerifyModal}
              title="Cek Keaslian Berkas Digital (SHA-256)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verifikasi Hash</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Usul Perpanjangan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
