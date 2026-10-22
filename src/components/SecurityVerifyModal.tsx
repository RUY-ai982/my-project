import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Search, FileText, Lock, QrCode } from 'lucide-react';
import { PPPKEmployee } from '../types/pppk';
import { maskNIP } from '../utils/crypto';

interface SecurityVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: PPPKEmployee[];
}

export const SecurityVerifyModal: React.FC<SecurityVerifyModalProps> = ({
  isOpen,
  onClose,
  employees
}) => {
  if (!isOpen) return null;

  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    employee?: PPPKEmployee;
    docType?: 'SPTJM' | 'REKOMENDASI';
    hash?: string;
    certId?: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputHash.trim().toLowerCase();
    if (!query) return;

    // Search by SHA-256 hash or BSrE cert ID
    let matchEmployee: PPPKEmployee | undefined;
    let matchType: 'SPTJM' | 'REKOMENDASI' | undefined;

    for (const emp of employees) {
      if (emp.enkripsi.sptjmHashSHA256.toLowerCase().includes(query)) {
        matchEmployee = emp;
        matchType = 'SPTJM';
        break;
      }
      if (emp.enkripsi.rekomendasiHashSHA256.toLowerCase().includes(query)) {
        matchEmployee = emp;
        matchType = 'REKOMENDASI';
        break;
      }
      if (emp.enkripsi.bsreDigitalCertId.toLowerCase().includes(query)) {
        matchEmployee = emp;
        matchType = 'SPTJM';
        break;
      }
    }

    if (matchEmployee && matchType) {
      setVerificationResult({
        found: true,
        employee: matchEmployee,
        docType: matchType,
        hash: matchType === 'SPTJM' ? matchEmployee.enkripsi.sptjmHashSHA256 : matchEmployee.enkripsi.rekomendasiHashSHA256,
        certId: matchEmployee.enkripsi.bsreDigitalCertId
      });
    } else {
      setVerificationResult({
        found: false
      });
    }
  };

  const handleSampleHash = (sample: string) => {
    setInputHash(sample);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Portal Otentikasi & Verifikasi Hash Dokumen
              </h2>
              <p className="text-xs text-slate-500">
                Uji keaslian naskah digital SPTJM dan Rekomendasi Atasan (Anti-Tamper BSrE)
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

        {/* Form Search */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Masukkan Hash SHA-256 Dokumen atau ID Sertifikat BSrE:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: 7f83b1657ff1fc53... atau BSrE-2026-SPTJM-1005"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                className="w-full pl-3 pr-24 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors"
              >
                Verifikasi
              </button>
            </div>
          </div>

          {/* Quick sample chips */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span>Uji Cepat Hash:</span>
            {employees.slice(0, 2).map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleSampleHash(emp.enkripsi.sptjmHashSHA256)}
                className="text-emerald-700 hover:text-emerald-900 underline font-mono text-[10px]"
              >
                [{emp.namaLengkap.split(' ')[0]} - SPTJM]
              </button>
            ))}
          </div>
        </form>

        {/* Verification Result Display */}
        {verificationResult && (
          <div className="pt-2">
            {verificationResult.found && verificationResult.employee ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs text-slate-800">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>DOKUMEN ASLI TEROTENTIKASI (100% VALID)</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-emerald-200/60 font-sans">
                  <div>
                    <span className="text-slate-500">Jenis Dokumen:</span>{' '}
                    <strong className="text-slate-900">
                      {verificationResult.docType === 'SPTJM' ? 'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)' : 'Surat Rekomendasi Atasan Langsung'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Pegawai Pemilik:</span>{' '}
                    <strong className="text-slate-900">{verificationResult.employee.namaLengkap}</strong> (NI PPPK: {maskNIP(verificationResult.employee.nipPppk)})
                  </div>
                  <div>
                    <span className="text-slate-500">Unit Kerja:</span>{' '}
                    <span>{verificationResult.employee.unitKerja}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Status Validasi Sistem:</span>{' '}
                    <span className="text-emerald-700 font-semibold">{verificationResult.employee.kelayakan.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ID Sertifikat Digital:</span>{' '}
                    <span className="font-mono text-emerald-900 font-semibold">{verificationResult.certId}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-emerald-200 rounded text-[10px] font-mono break-all text-slate-600">
                  SHA-256: {verificationResult.hash}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-800">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>DOKUMEN TIDAK DITEMUKAN / INTEGRITAS BERBEDA</span>
                </div>
                <p className="text-slate-600">
                  Nilai hash yang Anda masukkan tidak cocok dengan catatan naskah dinas resmi yang terdaftar pada basis data SIM-PPPK PW. Kemungkinan naskah telah diubah atau bukan dokumen resmi yang diterbitkan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Security Info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-[11px] text-slate-500">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            Setiap dokumen resmi yang diterbitkan secara otomatis dikalkulasikan fungsi hash kriptografi SHA-256 untuk menjamin integritas naskah terhadap risiko pemalsuan berkas perpanjangan kontrak.
          </p>
        </div>
      </div>
    </div>
  );
};
