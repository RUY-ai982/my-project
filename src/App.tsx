/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { EmployeeTable } from './components/EmployeeTable';
import { DocumentModal } from './components/DocumentModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { EvaluationScheduleView } from './components/EvaluationScheduleView';
import { ApiSyncView } from './components/ApiSyncView';
import { ReportingView } from './components/ReportingView';
import { SecurityVerifyModal } from './components/SecurityVerifyModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ConfigWeightModal } from './components/ConfigWeightModal';
import { ExcelInjectModal } from './components/ExcelInjectModal';
import { FileSpreadsheet } from 'lucide-react';

import { PPPKEmployee, BobotKonfigurasi } from './types/pppk';
import { EvaluationSchedule, ApiSyncLog } from './types/schedule';
import { INITIAL_EMPLOYEES, INITIAL_SCHEDULES } from './data/mockData';
import { INITIAL_API_LOGS, simulateExternalApiSync } from './utils/apiSync';
import { DEFAULT_BOBOT, calculateKelayakan } from './utils/calculation';
import { validateEmployeeData } from './utils/validation';
import { generateSHA256Hash } from './utils/crypto';

export default function App() {
  const [employees, setEmployees] = useState<PPPKEmployee[]>(INITIAL_EMPLOYEES);
  const [schedules, setSchedules] = useState<EvaluationSchedule[]>(INITIAL_SCHEDULES);
  const [apiLogs, setApiLogs] = useState<ApiSyncLog[]>(INITIAL_API_LOGS);
  const [config, setConfig] = useState<BobotKonfigurasi>(DEFAULT_BOBOT);

  // Active view navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pegawai' | 'jadwal' | 'api-sync' | 'laporan'>('dashboard');

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState<PPPKEmployee | null>(null);
  const [documentModalData, setDocumentModalData] = useState<{
    employee: PPPKEmployee;
    docType: 'SPTJM' | 'REKOMENDASI';
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // API sync status & toast feedback
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Recalculate all employees when formula weights change
  const handleSaveConfig = (newConfig: BobotKonfigurasi) => {
    setConfig(newConfig);
    const updated = employees.map(emp => {
      const kelayakan = calculateKelayakan(emp.evaluasiAbsensi, emp.evaluasiSKP, newConfig);
      const validasi = validateEmployeeData({ ...emp, kelayakan });
      return {
        ...emp,
        kelayakan,
        validasi
      };
    });
    setEmployees(updated);
    showToast(`Formula pembobotan diperbarui: Absensi ${newConfig.bobotAbsensi}% & SKP ${newConfig.bobotSKP}%. Seluruh kelayakan telah dihitung ulang.`);
  };

  // Add new employee
  const handleAddEmployee = (newEmp: PPPKEmployee) => {
    setEmployees([newEmp, ...employees]);
    showToast(`Usulan baru atas nama ${newEmp.namaLengkap} berhasil ditambahkan dan divalidasi.`);
  };

  // Handle Bulk Excel Injection
  const handleInjectEmployees = (newEmployees: PPPKEmployee[], replaceExisting: boolean) => {
    let updatedList = [...employees];
    let addedCount = 0;
    let updatedCount = 0;

    newEmployees.forEach(newEmp => {
      const existingIndex = updatedList.findIndex(e => e.nipPppk === newEmp.nipPppk);
      if (existingIndex >= 0) {
        if (replaceExisting) {
          updatedList[existingIndex] = { ...newEmp, id: updatedList[existingIndex].id };
          updatedCount++;
        }
      } else {
        updatedList.unshift(newEmp);
        addedCount++;
      }
    });

    setEmployees(updatedList);
    showToast(`Berhasil menginjeksi ${newEmployees.length} usulan pegawai dari Excel (${addedCount} usulan baru, ${updatedCount} data diperbarui).`);
  };

  // Update existing employee
  const handleUpdateEmployee = (updatedEmp: PPPKEmployee) => {
    setEmployees(employees.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    if (selectedEmployee && selectedEmployee.id === updatedEmp.id) {
      setSelectedEmployee(updatedEmp);
    }
  };

  // Delete employee proposal
  const handleDeleteEmployee = (employeeId: string) => {
    const target = employees.find(e => e.id === employeeId);
    setEmployees(employees.filter(e => e.id !== employeeId));
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee(null);
    }
    if (documentModalData?.employee.id === employeeId) {
      setDocumentModalData(null);
    }
    showToast(`Usulan atas nama ${target?.namaLengkap || 'Pegawai'} berhasil dihapus dari sistem.`);
  };

  // Batch delete employee proposals
  const handleBatchDeleteEmployees = (employeeIds: string[]) => {
    setEmployees(employees.filter(e => !employeeIds.includes(e.id)));
    if (selectedEmployee && employeeIds.includes(selectedEmployee.id)) {
      setSelectedEmployee(null);
    }
    showToast(`Sebanyak ${employeeIds.length} usulan pegawai berhasil dihapus.`);
  };

  // Handle direct upload of Surat Rekomendasi Atasan Langsung
  const handleUploadRekomendasi = async (empId: string, file: File) => {
    try {
      const hash = await generateSHA256Hash(`${file.name}-${file.size}-${file.lastModified}-${Date.now()}`);
      const updated = employees.map(emp => {
        if (emp.id !== empId) return emp;
        const uploadData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          uploadTimestamp: new Date().toISOString(),
          hashSHA256: hash
        };
        const tempEmp: PPPKEmployee = {
          ...emp,
          suratRekomendasiUpload: uploadData,
          dokumenPersyaratan: {
            ...emp.dokumenPersyaratan,
            suratRekomendasiAtasan: true
          },
          updatedAt: new Date().toISOString().split('T')[0]
        };
        const validasi = validateEmployeeData(tempEmp);
        return {
          ...tempEmp,
          validasi
        };
      });

      setEmployees(updated);
      if (selectedEmployee && selectedEmployee.id === empId) {
        const found = updated.find(e => e.id === empId);
        if (found) setSelectedEmployee(found);
      }
      showToast(`Surat Rekomendasi Atasan (${file.name}) berhasil diunggah dan terverifikasi digital.`);
    } catch {
      showToast('Gagal memproses unggahan Surat Rekomendasi Atasan.');
    }
  };

  // Trigger External API Sync
  const handleTriggerSync = async (service: 'BKN e-Kinerja SIASN' | 'Presensi Biometrik & Geotag' | 'SIMPEG Kepegawaian Pusat') => {
    setIsSyncing(true);
    try {
      const result = await simulateExternalApiSync(service, employees);
      setEmployees(result.updatedEmployees);
      setApiLogs([result.log, ...apiLogs]);
      showToast(`Sinkronisasi ${service} berhasil: ${result.log.jumlahRecord} catatan divalidasi (${result.log.durasiMs}ms).`);
    } catch {
      showToast('Gagal melakukan sinkronisasi data API.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Broadcast reminder for evaluation schedules
  const handleBroadcastReminder = (scheduleId: string) => {
    const updatedSchedules = schedules.map(s => {
      if (s.id === scheduleId) {
        return {
          ...s,
          pengingatTerakhirDikirim: 'Baru saja'
        };
      }
      return s;
    });
    setSchedules(updatedSchedules);
    showToast('Notifikasi pengingat evaluasi berkala berhasil disiarkan melalui WhatsApp Gateway ASN dan Email resmi.');
  };

  // Pending validation counter
  const pendingValidationCount = employees.filter(e => !e.validasi.isValid).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          pendingValidationCount={pendingValidationCount}
        />
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            employees={employees}
            config={config}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onQuickSync={() => handleTriggerSync('BKN e-Kinerja SIASN')}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'pegawai' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Data Usulan & Berkas Perpanjangan Kontrak PPPK
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Daftar seluruh calon perpanjangan kontrak dengan metrik kehadiran biometrik, predikat SKP, dan validasi dokumen
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsExcelModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-medium shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Injek Excel (.xlsx)</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
                >
                  + Tambah Usulan Baru
                </button>
              </div>
            </div>

            <EmployeeTable
              employees={employees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onOpenDocumentModal={(emp, docType) => setDocumentModalData({ employee: emp, docType })}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenExcelInject={() => setIsExcelModalOpen(true)}
              onDeleteEmployee={handleDeleteEmployee}
              onBatchDeleteEmployees={handleBatchDeleteEmployees}
              onUploadRekomendasi={handleUploadRekomendasi}
            />
          </div>
        )}

        {activeTab === 'jadwal' && (
          <EvaluationScheduleView
            schedules={schedules}
            onBroadcastReminder={handleBroadcastReminder}
          />
        )}

        {activeTab === 'api-sync' && (
          <ApiSyncView
            logs={apiLogs}
            onTriggerSync={handleTriggerSync}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'laporan' && (
          <ReportingView
            employees={employees}
          />
        )}
      </main>

      {/* Footer (no-print) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Badan Kepegawaian Daerah & Pengembangan SDM. Sistem Evaluasi Kontrak PPPK PW Terpadu.
          </div>
          <div className="flex items-center gap-4">
            <span>Sesuai PermenPAN-RB No. 14/2023 & PP No. 49/2018</span>
            <span aria-hidden="true">&middot;</span>
            <span className="font-mono text-emerald-700">Enkripsi SHA-256 BSrE Aktif</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Official Document Modal (SPTJM & Rekomendasi) */}
      {documentModalData && (
        <DocumentModal
          employee={documentModalData.employee}
          initialDocType={documentModalData.docType}
          onClose={() => setDocumentModalData(null)}
        />
      )}

      {/* 2. Employee In-depth Detail & Validation Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdateEmployee={handleUpdateEmployee}
          onOpenDocument={(emp, docType) => setDocumentModalData({ employee: emp, docType })}
          onDeleteEmployee={handleDeleteEmployee}
          onUploadRekomendasi={handleUploadRekomendasi}
        />
      )}

      {/* 3. Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        config={config}
      />

      {/* 4. Weight Calculation Configuration Modal */}
      <ConfigWeightModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* 5. Cryptographic Document Hash Verification Portal */}
      <SecurityVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        employees={employees}
      />

      {/* 6. Excel Bulk Spreadsheet Injection Modal */}
      <ExcelInjectModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onInjectEmployees={handleInjectEmployees}
        existingEmployees={employees}
        config={config}
      />

    </div>
  );
}
