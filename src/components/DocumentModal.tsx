import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, ShieldCheck, QrCode, FileText } from 'lucide-react';
import { PPPKEmployee } from '../types/pppk';
import { maskNIP, maskNIK } from '../utils/crypto';

interface DocumentModalProps {
  employee: PPPKEmployee | null;
  initialDocType: 'SPTJM' | 'REKOMENDASI';
  onClose: () => void;
  onApproveDocument?: (empId: string, docType: 'SPTJM' | 'REKOMENDASI') => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  employee,
  initialDocType,
  onClose,
  onApproveDocument
}) => {
  const [docType, setDocType] = useState<'SPTJM' | 'REKOMENDASI'>(initialDocType);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!employee) return null;

  const currentHash = docType === 'SPTJM' 
    ? employee.enkripsi.sptjmHashSHA256 
    : employee.enkripsi.rekomendasiHashSHA256;

  const currentNomor = docType === 'SPTJM'
    ? employee.sptjmNomor
    : employee.rekomendasiNomor;

  const currentTanggal = docType === 'SPTJM'
    ? employee.sptjmTanggal
    : employee.rekomendasiTanggal;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = () => {
    const docElement = document.getElementById('printable-official-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${docType}_${employee.nipPppk}_${employee.namaLengkap.replace(/\s+/g, '_')}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; color: #000; padding: 2cm; line-height: 1.5; font-size: 12pt; }
            .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
            .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 4px; font-size: 14pt; }
            .nomor { text-align: center; font-size: 11pt; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 12px 0; }
            td { vertical-align: top; padding: 4px; }
            .materai { border: 1px dashed #666; width: 100px; height: 60px; text-align: center; font-size: 8pt; display: inline-block; padding-top: 15px; }
            .qr-box { font-family: monospace; font-size: 8pt; border: 1px solid #ccc; padding: 8px; }
          </style>
        </head>
        <body>
          ${docElement.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_PPPK_${employee.nipPppk}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar (Screen only, hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Penerbitan Dokumen Resmi Digital
              </div>
              <div className="text-xs text-slate-500">
                {employee.namaLengkap} · NI PPPK: {maskNIP(employee.nipPppk)}
              </div>
            </div>
          </div>

          {/* Document Switcher Tab */}
          <div className="flex items-center gap-1 p-1 bg-slate-200 rounded-lg text-xs font-medium">
            <button
              onClick={() => setDocType('SPTJM')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                docType === 'SPTJM'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SPTJM Pejabat Pembina
            </button>
            <button
              onClick={() => setDocType('REKOMENDASI')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                docType === 'REKOMENDASI'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surat Rekomendasi Atasan
            </button>
          </div>

          {/* Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Cetak via dialog cetak browser (A4 portrait)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>

            <button
              onClick={handleDownloadFile}
              title="Unduh berkas dokumen digital (.html siap cetak)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Digital</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Hash Footprint Banner */}
        <div className="no-print px-6 py-2 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 truncate max-w-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-emerald-900 shrink-0">SHA-256 Hash Dokumen:</span>
            <span className="font-mono text-[11px] text-slate-600 truncate">{currentHash}</span>
          </div>
          <button
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-medium shrink-0 ml-2"
          >
            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHash ? 'Tersalin' : 'Salin Hash'}</span>
          </button>
        </div>

        {/* Document Body (Printable Paper Style) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 flex justify-center">
          <div 
            id="printable-official-document" 
            className="print-document-container bg-white w-full max-w-3xl p-8 sm:p-12 shadow-sm rounded-lg border border-slate-200 text-slate-900 text-[13px] leading-relaxed font-serif"
          >
            
            {/* KOP SURAT RESMI */}
            <div className="text-center pb-4 mb-6 border-b-4 border-double border-slate-900">
              <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600 mb-0.5">
                {employee.instansi.toUpperCase()}
              </div>
              <div className="text-base sm:text-lg font-bold font-serif uppercase tracking-tight text-slate-900">
                {employee.unitKerja.toUpperCase()}
              </div>
              <div className="text-[11px] font-sans text-slate-600 mt-1">
                Jl. Soekarno-Hatta No. 35, Kabupaten Bangkalan, Jawa Timur · Kode Pos: 69115
              </div>
              <div className="text-[10px] font-sans text-slate-500">
                Laman Resmi: www.bangkalankab.go.id · Pos-el: bkpsda@bangkalankab.go.id
              </div>
            </div>

            {/* DOKUMEN TYPE 1: SPTJM */}
            {docType === 'SPTJM' && (
              <div className="space-y-4 font-serif">
                <div className="text-center mb-6">
                  <div className="text-sm font-bold uppercase tracking-wide underline font-serif">
                    SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)
                  </div>
                  <div className="text-xs font-serif font-bold mt-0.5">
                    USULAN PERPANJANGAN PERJANJIAN KERJA PPPK PW
                  </div>
                  <div className="text-xs font-sans text-slate-700 mt-1 font-mono">
                    Nomor: {employee.sptjmNomor}
                  </div>
                </div>

                <p className="text-justify indent-8">
                  Saya yang bertanda tangan di bawah ini:
                </p>

                <table className="w-full text-xs font-serif my-2 ml-4">
                  <tbody>
                    <tr>
                      <td className="w-36 py-1 font-medium">Nama</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold">{employee.kepalaOpdNama}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">NIP</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-mono">{employee.kepalaOpdNip}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Jabatan</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.kepalaOpdJabatan}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Unit Kerja</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.unitKerja}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-justify indent-8">
                  Dengan ini menyatakan dengan sadar dan penuh rasa tanggung jawab bahwa Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) di bawah ini:
                </p>

                <table className="w-full text-xs font-serif my-2 ml-4 bg-slate-50 p-2 border border-slate-200">
                  <tbody>
                    <tr>
                      <td className="w-36 py-1 font-medium">Nama Lengkap</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold">{employee.namaLengkap}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Nomor Induk PPPK</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-mono">{employee.nipPppk}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">NIK</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-mono">{employee.nik}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Jabatan / Golongan</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.jabatan} (Golongan {employee.golongan})</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Masa Perjanjian Kerja Awal</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.tmtKontrakAwal} s/d {employee.tmtKontrakAkhir}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Predikat SKP Tahunan</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-semibold text-emerald-900">{employee.evaluasiSKP.predikatKinerja} (Nilai: {employee.evaluasiSKP.nilaiAkhirSKP})</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Akumulasi Presensi</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-semibold text-emerald-900">{employee.evaluasiAbsensi.persentaseKehadiran}% (Tanpa Keterangan: {employee.evaluasiAbsensi.tanpaKeterangan} hari)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Status Kelayakan Usulan</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold text-slate-900">{employee.kelayakan.status}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-justify indent-8">
                  Telah memenuhi seluruh kriteria dan persyaratan administratif, teknis kualifikasi, tingkat kedisiplinan kehadiran, serta capaian kinerja berlandaskan <strong>Peraturan Pemerintah Nomor 49 Tahun 2018</strong> tentang Manajemen PPPK dan <strong>Peraturan Menteri PAN-RB Nomor 14 Tahun 2023</strong>. Seluruh data rekap presensi dan SKP yang disampaikan adalah benar dan sah.
                </p>

                <p className="text-justify indent-8">
                  Apabila di kemudian hari terbukti terdapat pemalsuan data, manipulasi presensi, atau pelanggaran disiplin berat yang disembunyikan, saya bersedia bertanggung jawab secara administratif maupun hukum sesuai dengan ketentuan perundang-undangan yang berlaku.
                </p>

                <p className="text-justify indent-8">
                  Demikian Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) ini saya buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya dalam proses perpanjangan perjanjian kerja PPPK.
                </p>

                {/* TANDA TANGAN & MATERAI & QR VERIFIKASI */}
                <div className="mt-8 pt-4 flex justify-between items-end text-xs font-serif">
                  {/* Left: QR Code Verifikasi Integritas BSrE */}
                  <div className="text-left font-sans">
                    <div className="p-2 border border-slate-300 rounded bg-slate-50 w-32 flex flex-col items-center">
                      <div className="w-20 h-20 bg-white border border-slate-300 flex items-center justify-center p-1">
                        <QrCode className="w-16 h-16 text-slate-800" />
                      </div>
                      <span className="text-[9px] font-mono font-medium text-slate-600 mt-1 text-center">
                        BSrE BSSN RI<br />TEROTENTIKASI
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 max-w-[150px]">
                      Pindai QR untuk verifikasi keaslian naskah digital
                    </div>
                  </div>

                  {/* Right: Pejabat Penandatangan */}
                  <div className="text-center font-serif w-64">
                    <div>Bangkalan, {employee.sptjmTanggal}</div>
                    <div className="font-medium mt-0.5">{employee.kepalaOpdJabatan},</div>
                    
                    {/* Visual Stamp Materai Rp 10.000 */}
                    <div className="my-3 flex items-center justify-center">
                      <div className="border border-dashed border-red-500/80 bg-red-50/60 p-2 rounded text-[10px] text-red-800 font-sans tracking-wide">
                        <div className="font-bold">METERAI ELEKTRONIK</div>
                        <div className="text-[9px] font-mono">Rp 10.000,-</div>
                        <div className="text-[8px] text-slate-500 font-mono">BSrE-{employee.nipPppk.slice(-4)}-2026</div>
                      </div>
                    </div>

                    <div className="font-bold underline text-sm">{employee.kepalaOpdNama}</div>
                    <div className="font-mono text-xs">NIP. {employee.kepalaOpdNip}</div>
                  </div>
                </div>

                {/* Footer Hash Certificate */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Sertifikat Digital: {employee.enkripsi.bsreDigitalCertId}</span>
                  <span>SHA256: {employee.enkripsi.sptjmHashSHA256.slice(0, 24)}...</span>
                </div>
              </div>
            )}

            {/* DOKUMEN TYPE 2: REKOMENDASI ATASAN LANGSUNG */}
            {docType === 'REKOMENDASI' && (
              <div className="space-y-4 font-serif">
                <div className="text-center mb-6">
                  <div className="text-sm font-bold uppercase tracking-wide underline font-serif">
                    SURAT REKOMENDASI ATASAN LANGSUNG
                  </div>
                  <div className="text-xs font-serif font-bold mt-0.5">
                    USULAN PERPANJANGAN PERJANJIAN KERJA WAKTU TERTENTU (PPPK PW)
                  </div>
                  <div className="text-xs font-sans text-slate-700 mt-1 font-mono">
                    Nomor: {employee.rekomendasiNomor}
                  </div>
                </div>

                <p className="text-justify indent-8">
                  Yang bertanda tangan di bawah ini selaku Atasan Langsung:
                </p>

                <table className="w-full text-xs font-serif my-2 ml-4">
                  <tbody>
                    <tr>
                      <td className="w-36 py-1 font-medium">Nama</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold">{employee.atasanNama}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">NIP</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-mono">{employee.atasanNip}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Jabatan</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.atasanJabatan}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Satuan Kerja</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.unitKerja}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-justify indent-8">
                  Memberikan rekomendasi objektif atas kinerja, loyalitas, dan kedisiplinan kerja terhadap:
                </p>

                <table className="w-full text-xs font-serif my-2 ml-4 bg-slate-50 p-2 border border-slate-200">
                  <tbody>
                    <tr>
                      <td className="w-36 py-1 font-medium">Nama PPPK</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold">{employee.namaLengkap}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Nomor Induk PPPK</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-mono">{employee.nipPppk}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Jabatan Saat Ini</td>
                      <td className="w-4">:</td>
                      <td className="py-1">{employee.jabatan}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Predikat Kinerja SKP</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold text-slate-900">{employee.evaluasiSKP.predikatKinerja} (Skor: {employee.evaluasiSKP.nilaiAkhirSKP})</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Tingkat Kehadiran</td>
                      <td className="w-4">:</td>
                      <td className="py-1 font-bold text-slate-900">{employee.evaluasiAbsensi.persentaseKehadiran}%</td>
                    </tr>
                  </tbody>
                </table>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5 font-sans">
                  <div className="font-semibold text-slate-800">Pertimbangan & Rekam Jejak Kinerja Obyektif:</div>
                  <div className="text-slate-700 italic">
                    "{employee.kelayakan.catatanRekomendasi}"
                  </div>
                  <div className="text-slate-600 text-[11px] pt-1">
                    Capaian Utama: {employee.evaluasiSKP.capaianTargetUtama}
                  </div>
                </div>

                <p className="text-justify indent-8">
                  Berdasarkan pemantauan langsung secara berkala dan evaluasi kinerja komprehensif, yang bersangkutan dinyatakan <strong>{employee.kelayakan.status.toUpperCase()}</strong> {employee.kelayakan.status === 'Layak Diperpanjang' ? 'untuk diusulkan perpanjangan perjanjian kerja berikutnya terhitung sejak berakhirnya masa perjanjian kerja saat ini.' : 'sesuai rekam jejak kedisiplinan dan administrasi kepegawaian.'}
                </p>

                <p className="text-justify indent-8">
                  Demikian rekomendasi ini dibuat dengan penuh tanggung jawab dan objektivitas untuk menjadi bahan pertimbangan bagi Tim Penilai Kinerja ASN dan Pejabat Pembina Kepegawaian (PPK).
                </p>

                {/* SIGNATURE AREA */}
                <div className="mt-8 pt-4 flex justify-between items-end text-xs font-serif">
                  <div className="text-left font-sans">
                    <div className="p-2 border border-slate-300 rounded bg-slate-50 w-32 flex flex-col items-center">
                      <div className="w-20 h-20 bg-white border border-slate-300 flex items-center justify-center p-1">
                        <QrCode className="w-16 h-16 text-slate-800" />
                      </div>
                      <span className="text-[9px] font-mono font-medium text-slate-600 mt-1 text-center">
                        TTE ELEKTRONIK<br />TERVERIFIKASI
                      </span>
                    </div>
                  </div>

                  <div className="text-center font-serif w-64">
                    <div>Bangkalan, {employee.rekomendasiTanggal}</div>
                    <div className="font-medium mt-0.5">Atasan Langsung Penilai,</div>
                    <div className="my-6">
                      <div className="text-[10px] text-emerald-800 font-sans font-mono border border-emerald-300 bg-emerald-50 py-1 px-2 rounded inline-block">
                        [Ditandatangani secara elektronik]
                      </div>
                    </div>
                    <div className="font-bold underline text-sm">{employee.atasanNama}</div>
                    <div className="font-mono text-xs">NIP. {employee.atasanNip}</div>
                  </div>
                </div>

                {/* Footer Hash Certificate */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Sertifikat Digital: {employee.enkripsi.bsreDigitalCertId}</span>
                  <span>SHA256: {employee.enkripsi.rekomendasiHashSHA256.slice(0, 24)}...</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
