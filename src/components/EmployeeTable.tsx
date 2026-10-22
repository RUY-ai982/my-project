import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Download, 
  ShieldCheck, 
  Eye, 
  Printer,
  ChevronRight,
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
  X,
  Upload,
  Paperclip,
  Check
} from 'lucide-react';
import { PPPKEmployee, StatusDokumen, StatusKelayakan } from '../types/pppk';
import { maskNIP } from '../utils/crypto';

interface EmployeeTableProps {
  employees: PPPKEmployee[];
  onSelectEmployee: (emp: PPPKEmployee) => void;
  onOpenDocumentModal: (emp: PPPKEmployee, docType: 'SPTJM' | 'REKOMENDASI') => void;
  onOpenAddModal: () => void;
  onOpenExcelInject?: () => void;
  onDeleteEmployee: (empId: string) => void;
  onBatchDeleteEmployees?: (empIds: string[]) => void;
  onUploadRekomendasi?: (empId: string, file: File) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onSelectEmployee,
  onOpenDocumentModal,
  onOpenAddModal,
  onOpenExcelInject,
  onDeleteEmployee,
  onBatchDeleteEmployees,
  onUploadRekomendasi
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedKelayakan, setSelectedKelayakan] = useState<string>('ALL');
  const [selectedDocStatus, setSelectedDocStatus] = useState<string>('ALL');

  // Deletion & bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'single';
    employee: PPPKEmployee;
  } | {
    type: 'batch';
    count: number;
    ids: string[];
  } | null>(null);

  // Dynamic file input ref map for inline uploads
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Extract distinct units
  const units = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => {
      const mainUnit = e.unitKerja.split('/')[0].trim();
      set.add(mainUnit);
    });
    return Array.from(set);
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = emp.namaLengkap.toLowerCase().includes(query);
        const matchesNIP = emp.nipPppk.includes(query);
        const matchesJabatan = emp.jabatan.toLowerCase().includes(query);
        const matchesUnit = emp.unitKerja.toLowerCase().includes(query);
        if (!matchesName && !matchesNIP && !matchesJabatan && !matchesUnit) {
          return false;
        }
      }

      // Unit filter
      if (selectedUnit !== 'ALL' && !emp.unitKerja.includes(selectedUnit)) {
        return false;
      }

      // Kelayakan filter (5 strict statuses)
      if (selectedKelayakan !== 'ALL' && emp.kelayakan.status !== selectedKelayakan) {
        return false;
      }

      // Document status filter
      if (selectedDocStatus !== 'ALL' && emp.statusDokumen !== selectedDocStatus) {
        return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedUnit, selectedKelayakan, selectedDocStatus]);

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'single') {
      onDeleteEmployee(deleteTarget.employee.id);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.employee.id);
        return next;
      });
    } else if (deleteTarget.type === 'batch') {
      if (onBatchDeleteEmployees) {
        onBatchDeleteEmployees(deleteTarget.ids);
      } else {
        deleteTarget.ids.forEach(id => onDeleteEmployee(id));
      }
      setSelectedIds(new Set());
    }

    setDeleteTarget(null);
  };

  const handleInlineFileSelect = (empId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadRekomendasi) {
      onUploadRekomendasi(empId, file);
    }
    // Reset value so re-selecting same file triggers change
    e.target.value = '';
  };

  const renderStatusBadge = (status: StatusKelayakan) => {
    switch (status) {
      case 'Layak Diperpanjang':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Layak Diperpanjang</span>
          </span>
        );
      case 'Tidak Layak Diperpanjang':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Tidak Layak Diperpanjang</span>
          </span>
        );
      case 'Mengundurkan Diri':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Mengundurkan Diri</span>
          </span>
        );
      case 'Meninggal Dunia':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <span>Meninggal Dunia</span>
          </span>
        );
      case 'Tidak Aktif Bekerja':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-800 border border-slate-300">
            <span>Tidak Aktif Bekerja</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama, NI PPPK, Jabatan, Unit Kerja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900 transition-colors"
            />
          </div>

          {/* Quick Stats & Injek Excel Action */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>
              Menampilkan <strong className="text-slate-900 font-mono tabular-nums">{filteredEmployees.length}</strong> dari {employees.length} usulan
            </span>
            {(selectedUnit !== 'ALL' || selectedKelayakan !== 'ALL' || selectedDocStatus !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedUnit('ALL');
                  setSelectedKelayakan('ALL');
                  setSelectedDocStatus('ALL');
                  setSearchQuery('');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Reset Filter
              </button>
            )}

            {onOpenExcelInject && (
              <button
                type="button"
                onClick={onOpenExcelInject}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-medium transition-colors ml-auto md:ml-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Injek Excel (.xlsx)</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns & Segmented Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter Unit:</span>
          </div>
          
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="ALL">Semua Unit Kerja / OPD</option>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {/* Exactly 5 Statuses */}
          <select
            value={selectedKelayakan}
            onChange={(e) => setSelectedKelayakan(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <option value="ALL">Semua Status Kelayakan</option>
            <option value="Layak Diperpanjang">Layak Diperpanjang</option>
            <option value="Tidak Layak Diperpanjang">Tidak Layak Diperpanjang</option>
            <option value="Mengundurkan Diri">Mengundurkan Diri</option>
            <option value="Meninggal Dunia">Meninggal Dunia</option>
            <option value="Tidak Aktif Bekerja">Tidak Aktif Bekerja</option>
          </select>

          <select
            value={selectedDocStatus}
            onChange={(e) => setSelectedDocStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="ALL">Semua Status Dokumen</option>
            <option value="Draft">Draft</option>
            <option value="Menunggu Verifikasi Atasan">Menunggu Verifikasi Atasan</option>
            <option value="Validasi BKPSDM">Validasi BKPSDM</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Dokumen Terbit">Dokumen Terbit (Digital)</option>
            <option value="Perlu Revisi">Perlu Revisi / Catatan</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar when items selected */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl shadow-md text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400 font-mono tabular-nums">
              {selectedIds.size} berkas usulan dipilih
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
            >
              Batal Pilihan
            </button>
            <button
              onClick={() => setDeleteTarget({ type: 'batch', count: selectedIds.size, ids: Array.from(selectedIds) })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus ({selectedIds.size}) Usulan Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* High-Density Data Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 whitespace-nowrap">Pegawai & NI PPPK</th>
                <th className="py-3 px-4 whitespace-nowrap">Unit Kerja / Jabatan</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Presensi</th>
                <th className="py-3 px-4 whitespace-nowrap">Predikat SKP</th>
                <th className="py-3 px-4 whitespace-nowrap">Status Kelayakan</th>
                <th className="py-3 px-4 whitespace-nowrap">Surat Rekomendasi Atasan</th>
                <th className="py-3 px-4 whitespace-nowrap">Status Alur Berkas</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pegawai sesuai kriteria pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const hasValidationIssue = !emp.validasi.isValid;
                  const isSelected = selectedIds.has(emp.id);

                  return (
                    <tr 
                      key={emp.id} 
                      className={`hover:bg-slate-50/70 transition-colors group cursor-pointer ${isSelected ? 'bg-emerald-50/40' : ''}`}
                      onClick={() => onSelectEmployee(emp)}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => handleToggleSelectRow(emp.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Name & NIP */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {emp.namaLengkap}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] tabular-nums mt-0.5">
                          {maskNIP(emp.nipPppk)}
                        </div>
                      </td>

                      {/* Jabatan & Unit */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[200px]" title={emp.jabatan}>
                          {emp.jabatan}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[200px]" title={emp.unitKerja}>
                          {emp.unitKerja}
                        </div>
                      </td>

                      {/* Absensi */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono tabular-nums font-semibold text-slate-900">
                          {emp.evaluasiAbsensi.persentaseKehadiran}%
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {emp.evaluasiAbsensi.tanpaKeterangan > 0 ? (
                            <span className="text-rose-600 font-medium">Alpha: {emp.evaluasiAbsensi.tanpaKeterangan} hari</span>
                          ) : (
                            <span>Nir-alpha</span>
                          )}
                        </div>
                      </td>

                      {/* SKP */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {emp.evaluasiSKP.predikatKinerja}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          Nilai: {emp.evaluasiSKP.nilaiAkhirSKP}
                        </div>
                      </td>

                      {/* Status Kelayakan (5 States) */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {renderStatusBadge(emp.kelayakan.status)}
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>Skor:</span>
                            <span className="font-mono font-bold text-slate-800 tabular-nums">
                              {emp.kelayakan.skorTotalKelayakan}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Upload Surat Rekomendasi Atasan Langsung */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.docx"
                          ref={(el) => { fileInputRefs.current[emp.id] = el; }}
                          onChange={(e) => handleInlineFileSelect(emp.id, e)}
                          className="hidden"
                        />
                        {emp.suratRekomendasiUpload ? (
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-[11px] font-medium"
                              title={`File: ${emp.suratRekomendasiUpload.fileName} (${typeof emp.suratRekomendasiUpload.fileSize === 'number' ? (emp.suratRekomendasiUpload.fileSize / 1024).toFixed(0) + ' KB' : emp.suratRekomendasiUpload.fileSize})`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[110px]">{emp.suratRekomendasiUpload.fileName}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[emp.id]?.click()}
                              title="Ganti Dokumen Surat Rekomendasi"
                              className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[emp.id]?.click()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-medium transition-colors"
                          >
                            <Upload className="w-3 h-3 text-slate-500" />
                            <span>Unggah Surat</span>
                          </button>
                        )}
                      </td>

                      {/* Status Dokumen */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {hasValidationIssue ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Validasi perlu perbaikan" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Valid" />
                          )}
                          <span className="font-medium text-slate-800">
                            {emp.statusDokumen}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          {emp.enkripsi.isVerified ? (
                            <span className="text-emerald-700 font-mono text-[10px]">BSrE Verified</span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Unsigned</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            title="Detail Evaluasi & Validasi"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenDocumentModal(emp, 'SPTJM')}
                            title="Cetak/Unduh SPTJM Digital"
                            className="p-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenDocumentModal(emp, 'REKOMENDASI')}
                            title="Cetak/Unduh Rekomendasi Atasan"
                            className="p-1.5 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget({ type: 'single', employee: emp })}
                            title="Hapus Usulan Pegawai Ini"
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {deleteTarget.type === 'single'
                    ? 'Hapus Usulan Perpanjangan Kontrak?'
                    : `Hapus ${deleteTarget.count} Usulan Terpilih?`}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {deleteTarget.type === 'single' ? (
                    <>
                      Apakah Anda yakin ingin menghapus data usulan atas nama{' '}
                      <strong className="text-slate-900">{deleteTarget.employee.namaLengkap}</strong>{' '}
                      (NI PPPK: <span className="font-mono">{deleteTarget.employee.nipPppk}</span>)?
                      Tindakan ini akan membatalkan berkas evaluasi, riwayat draft SPTJM, dan rekomendasi terkait dari basis data.
                    </>
                  ) : (
                    <>
                      Apakah Anda yakin ingin menghapus sebanyak{' '}
                      <strong className="text-slate-900 font-mono">{deleteTarget.count} berkas usulan</strong> yang dipilih secara permanen?
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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
