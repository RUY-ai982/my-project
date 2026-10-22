import { ApiSyncLog } from '../types/schedule';
import { PPPKEmployee } from '../types/pppk';
import { calculateKelayakan } from './calculation';
import { validateEmployeeData } from './validation';

export const INITIAL_API_LOGS: ApiSyncLog[] = [
  {
    id: 'sync-log-01',
    namaLayanan: 'BKN e-Kinerja SIASN',
    endpoint: 'https://api.siasn.bkn.go.id/v2/layanan-kinerja/skp/pppk/evaluasi',
    metode: 'GET',
    waktuSync: 'Hari ini, 08:30 WIB',
    statusKode: 200,
    durasiMs: 312,
    jumlahRecord: 24,
    status: 'Sukses',
    detailPayload: '{"status":"success","synced_records":24,"period":"2025/2026","service":"e-Kinerja BKN v2"}'
  },
  {
    id: 'sync-log-02',
    namaLayanan: 'Presensi Biometrik & Geotag',
    endpoint: 'https://presensi-asn.kota.go.id/api/v1/fingerprint/rekap-bulanan',
    metode: 'POST',
    waktuSync: 'Hari ini, 08:31 WIB',
    statusKode: 200,
    durasiMs: 184,
    jumlahRecord: 24,
    status: 'Sukses',
    detailPayload: '{"status":"ok","engine":"ZK-Fingerprint-Cloud","verified_nodes":14,"records_parsed":24}'
  },
  {
    id: 'sync-log-03',
    namaLayanan: 'SIMPEG Kepegawaian Pusat',
    endpoint: 'https://simpeg.kepegawaian.go.id/rest/v3/data-pppk/kontrak-berjalan',
    metode: 'GET',
    waktuSync: 'Kemarin, 16:45 WIB',
    statusKode: 200,
    durasiMs: 250,
    jumlahRecord: 24,
    status: 'Sukses',
    detailPayload: '{"auth":"Bearer token valid","opd_scope":"ALL","updated_entries":24}'
  }
];

export async function simulateExternalApiSync(
  service: 'BKN e-Kinerja SIASN' | 'Presensi Biometrik & Geotag' | 'SIMPEG Kepegawaian Pusat',
  employees: PPPKEmployee[]
): Promise<{ updatedEmployees: PPPKEmployee[]; log: ApiSyncLog }> {
  // Simulate network latency (250-450ms)
  await new Promise(resolve => setTimeout(resolve, 350));

  const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  let updatedList = [...employees];
  let logDetail = '';

  if (service === 'Presensi Biometrik & Geotag') {
    // Refresh attendance sync timestamp and verify slight real-time presensi recalculation
    updatedList = updatedList.map(emp => {
      const updatedAbsensi = {
        ...emp.evaluasiAbsensi,
        terakhirDisinkronkan: `Terverifikasi Live Biometrik (${timestamp})`
      };
      const kelayakan = calculateKelayakan(updatedAbsensi, emp.evaluasiSKP);
      const validasi = validateEmployeeData({ ...emp, evaluasiAbsensi: updatedAbsensi, kelayakan });
      return {
        ...emp,
        evaluasiAbsensi: updatedAbsensi,
        kelayakan,
        validasi
      };
    });
    logDetail = `{"status":"synced","provider":"E-Presensi Mobile & Biometric Fingerprint","records_updated":${updatedList.length}}`;
  } else if (service === 'BKN e-Kinerja SIASN') {
    updatedList = updatedList.map(emp => {
      const updatedSKP = {
        ...emp.evaluasiSKP,
        terakhirDisinkronkan: `Tersinkronisasi SIASN BKN (${timestamp})`
      };
      const kelayakan = calculateKelayakan(emp.evaluasiAbsensi, updatedSKP);
      const validasi = validateEmployeeData({ ...emp, evaluasiSKP: updatedSKP, kelayakan });
      return {
        ...emp,
        evaluasiSKP: updatedSKP,
        kelayakan,
        validasi
      };
    });
    logDetail = `{"status":"synced","provider":"SIASN BKN e-Kinerja Gateway API","records_validated":${updatedList.length}}`;
  } else {
    logDetail = `{"status":"synced","provider":"SIMPEG Master Database Kepegawaian","total":${updatedList.length}}`;
  }

  const newLog: ApiSyncLog = {
    id: `sync-log-${Date.now()}`,
    namaLayanan: service,
    endpoint: service === 'BKN e-Kinerja SIASN' 
      ? 'https://api.siasn.bkn.go.id/v2/layanan-kinerja/skp/pppk/evaluasi'
      : service === 'Presensi Biometrik & Geotag'
      ? 'https://presensi-asn.kota.go.id/api/v1/fingerprint/rekap-bulanan'
      : 'https://simpeg.kepegawaian.go.id/rest/v3/data-pppk/kontrak-berjalan',
    metode: service === 'Presensi Biometrik & Geotag' ? 'POST' : 'GET',
    waktuSync: `Hari ini, ${timestamp}`,
    statusKode: 200,
    durasiMs: Math.floor(180 + Math.random() * 150),
    jumlahRecord: updatedList.length,
    status: 'Sukses',
    detailPayload: logDetail
  };

  return { updatedEmployees: updatedList, log: newLog };
}
