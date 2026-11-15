'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft, 
  FileText, 
  Phone, 
  XCircle,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

interface RegistrationStatus {
  registration_number: string;
  full_name: string;
  nisn?: string;
  previous_school?: string;
  major_choice?: string;
  status: 'pending' | 'verified' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<
  string, 
  { 
    label: string; 
    badgeClass: string; 
    bannerClass: string; 
    icon: typeof CheckCircle2;
    iconColor: string;
    headline: string;
    desc: string;
  }
> = {
  accepted: {
    label: 'Dinyatakan Diterima',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20',
    bannerClass: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
    headline: 'Selamat! Anda Dinyatakan Lulus & Diterima',
    desc: 'Selamat bergabung dengan civitas akademika SMA PGRI 1 Lumajang Tahun Ajaran 2026/2027. Silakan cetak lembar bukti dan ikuti prosedur daftar ulang fisik.',
  },
  verified: {
    label: 'Data Terverifikasi',
    badgeClass: 'bg-blue-500/15 text-blue-700 border-blue-300 ring-1 ring-blue-500/20',
    bannerClass: 'bg-blue-50/90 border-blue-200 text-blue-950',
    icon: ShieldCheck,
    iconColor: 'text-blue-600',
    headline: 'Berkas Pendaftaran Telah Terverifikasi',
    desc: 'Panitia PPDB telah memvalidasi seluruh berkas administrasi dan data kependudukan Anda. Pengumuman seleksi tahap akhir akan diumumkan sesuai jadwal.',
  },
  pending: {
    label: 'Menunggu Verifikasi',
    badgeClass: 'bg-amber-500/15 text-amber-700 border-amber-300 ring-1 ring-amber-500/20',
    bannerClass: 'bg-amber-50/90 border-amber-200 text-amber-950',
    icon: Clock,
    iconColor: 'text-amber-600',
    headline: 'Dokumen Sedang Dalam Antrean Verifikasi',
    desc: 'Formulir dan berkas Anda sudah masuk ke sistem kami. Petugas PPDB sedang memverifikasi kelengkapan dokumen.',
  },
  rejected: {
    label: 'Belum Memenuhi Syarat',
    badgeClass: 'bg-rose-500/15 text-rose-700 border-rose-300 ring-1 ring-rose-500/20',
    bannerClass: 'bg-rose-50/90 border-rose-200 text-rose-950',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
    headline: 'Seleksi Berkas Belum Memenuhi Kriteria',
    desc: 'Mohon maaf, berkas Anda belum dapat diterima pada seleksi kali ini. Hubungi sekretariat PPDB jika memerlukan penjelasan lebih lanjut.',
  },
};

export default function PpdbStatusPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const checkStatus = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/ppdb/check-status?q=${encodeURIComponent(query.trim())}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) {
        throw new Error('Data calon siswa tidak ditemukan. Periksa kembali Nomor Pendaftaran (misal PPDB-2026-XXXX) atau 10 digit NISN Anda.');
      }
      const data = await res.json();
      setResult(data.data ?? data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kendala jaringan saat menghubungkan ke server PPDB.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStatus = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.pending) : null;
  const StatusIcon = currentStatus?.icon || Clock;
  const formattedToday = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 print:bg-white print:py-0">
      
      {/* Decorative Top Accent Line */}
      <div className="h-1.5 w-full bg-linear-to-r from-blue-700 via-indigo-600 to-sky-500 print:hidden" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 print:max-w-full print:p-0">

        {/* SCREEN SECTION: Header & Search Form */}
        <section className="print:hidden space-y-8">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link 
              href="/ppdb" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors group cursor-pointer"
            >
              <span className="p-1 rounded-md bg-white border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors shadow-2xs">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              <span>Kembali ke Beranda PPDB</span>
            </Link>

            <span className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full">
              T.A. 2026/2027
            </span>
          </div>

          {/* Section Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-[#1E2B58] to-blue-900 text-white p-7 sm:p-10 shadow-xl shadow-slate-900/10">
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold backdrop-blur-md mb-4">
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span>Portal Resmi Seleksi Siswa Baru</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Cek Status Kelulusan & Verifikasi Berkas
              </h1>
              <p className="text-blue-100/80 text-sm sm:text-base mt-2.5 leading-relaxed font-normal">
                Masukkan identitas pendaftaran untuk meninjau hasil seleksi administrasi, jadwal daftar ulang, dan mengunduh surat tanda kelulusan resmi.
              </p>
            </div>
          </div>

          {/* Search Card Component */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                checkStatus();
              }}
              className="space-y-4"
            >
              <div>
                <label 
                  htmlFor="query-input" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Nomor Pendaftaran Atau NISN Siswa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    id="query-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 32))}
                    placeholder="Contoh: PPDB-2026-00123 atau 0078129381"
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-base font-mono focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-auto">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Format: 10 digit NISN atau Kode Registrasi Lengkap</span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mencari Data...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Cek Status Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message Alert */}
            {error && (
              <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold">Data Tidak Ditemukan</p>
                  <p className="mt-0.5 text-rose-700 leading-relaxed">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Help Steps (When no result is displayed) */}
          {!result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center mb-3">
                  01
                </div>
                <h4 className="font-bold text-sm text-slate-900">Periksa Kode Bukti</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Cek nomor registrasi yang tertera pada bukti PDF saat selesai mengisi formulir.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center mb-3">
                  02
                </div>
                <h4 className="font-bold text-sm text-slate-900">Validasi Panitia</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Status verifikasi berkas membutuhkan waktu 1-2 hari kerja setelah pendaftaran masuk.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center mb-3">
                  03
                </div>
                <h4 className="font-bold text-sm text-slate-900">Cetak & Daftar Ulang</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jika status sudah DITERIMA, cetak dokumen resmi untuk diserahkan ke loket sekolah.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* RESULT SECTION: Dynamic Status Banner & Official Letter */}
        {result && currentStatus && (
          <section className="mt-8 space-y-6">
            
            {/* Status Feedback Banner */}
            <div className={`print:hidden p-5 sm:p-6 rounded-2xl border shadow-sm ${currentStatus.bannerClass}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl bg-white/80 border border-slate-200/50 shadow-2xs ${currentStatus.iconColor} shrink-0`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900">
                        {currentStatus.headline}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${currentStatus.badgeClass}`}>
                        {currentStatus.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
                      {currentStatus.desc}
                    </p>
                  </div>
                </div>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Resmi</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* OFFICIAL LETTER DOCUMENT (SURAT BUKTI PENERIMAAN)                          */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 text-black font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
              
              {/* KOP SURAT RESMI */}
              <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-950">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <Image 
                    src="/logo-sekolah.png" 
                    alt="Logo SMA PGRI 1 Lumajang" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-center flex-1 pr-4 sm:pr-8">
                  <h4 className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider text-slate-800">
                    YPLP DASMEN PGRI KABUPATEN LUMAJANG
                  </h4>
                  <h2 className="text-lg sm:text-2xl font-serif font-black uppercase text-black tracking-wide my-0.5">
                    SMA PGRI 1 LUMAJANG
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-sans font-semibold text-slate-700">
                    TERAKREDITASI &quot;A&quot; (UNGGUL) • NPSN: 20521456
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-sans text-slate-600 mt-0.5">
                    Jl. Alamat Sekolah No. 123 Lumajang 67316 • Telp: (0334) 881234 • Email: info@smapgri1lmj.sch.id
                  </p>
                </div>
              </div>

              {/* JUDUL SURAT */}
              <div className="text-center my-6">
                <h3 className="font-serif font-black text-sm sm:text-base uppercase tracking-wider underline">
                  SURAT TANDA BUKTI HASIL SELEKSI PPDB
                </h3>
                <p className="font-mono text-[10px] sm:text-xs text-slate-700 mt-1">
                  Nomor: 421.3 / {result.registration_number} / PPDB.SMAGRISA / 2026
                </p>
              </div>

              {/* PENGANTAR */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-800 mb-5">
                Panitia Penerimaan Peserta Didik Baru (PPDB) SMA PGRI 1 Lumajang Tahun Ajaran 2026/2027 menerangkan dengan sebenarnya bahwa calon peserta didik berikut:
              </p>

              {/* TABEL IDENTITAS SISWA */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-xs sm:text-[13px] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-600 w-44 sm:w-52">Nomor Registrasi</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">: {result.registration_number}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(result.registration_number)}
                            className="p-1 hover:bg-slate-200/70 rounded text-slate-500 hover:text-slate-900 transition-colors print:hidden cursor-pointer"
                            title="Salin nomor pendaftaran"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">Nama Lengkap Siswa</td>
                      <td className="py-2.5 px-4 font-bold uppercase text-slate-950">: {result.full_name}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">NISN</td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-900">: {result.nisn || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">Asal Sekolah</td>
                      <td className="py-2.5 px-4 text-slate-900">: {result.previous_school || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">Peminatan / Program</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">: {result.major_choice || 'Fase E (Kurikulum Merdeka)'}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-slate-600">Waktu Pengajuan</td>
                      <td className="py-2.5 px-4 text-slate-900">: {new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-600">Status Seleksi Akhir</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 mr-2">:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${currentStatus.badgeClass}`}>
                          {currentStatus.label}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CATATAN RESMI */}
              {result.notes && (
                <div className="mb-5 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    Catatan Panitia Seleksi:
                  </span>
                  <p className="text-amber-900 pl-5 leading-relaxed">
                    {result.notes}
                  </p>
                </div>
              )}

              {/* PETUNJUK DAFTAR ULANG */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-700 mb-6">
                <p className="font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                  Persyaratan Daftar Ulang Fisik:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-800">
                  <li>Menyerahkan lembar cetak Surat Tanda Bukti Penerimaan ini ke loket verifikasi PPDB.</li>
                  <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) legalisir, Kartu Keluarga, dan Akta Kelahiran (2 lembar).</li>
                  <li>Pas foto terbaru ukuran 3x4 berwarna latar merah (4 lembar).</li>
                </ol>
              </div>

              {/* TANDA TANGAN RESMI */}
              <div className="flex justify-between items-end text-xs pt-4">
                {/* QR Code Validation */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2.5 border border-slate-300 p-2.5 rounded-xl bg-slate-50">
                    <QrCode className="w-9 h-9 text-slate-800 shrink-0" />
                    <div className="text-[9px] font-mono leading-tight">
                      <div className="font-bold text-slate-900">VERIFIKASI SISTEM</div>
                      <div className="text-[8px] text-slate-500 truncate max-w-[130px]">{result.registration_number}</div>
                      <div className="text-[7px] text-emerald-600 font-semibold mt-0.5">VALID RECORD</div>
                    </div>
                  </div>
                </div>

                {/* Stempel & Nama Pejabat */}
                <div className="text-center w-56 space-y-1">
                  <p className="text-slate-600 text-[11px]">Lumajang, {formattedToday}</p>
                  <p className="font-bold text-slate-900 text-xs">Ketua Panitia PPDB,</p>
                  
                  <div className="h-14 flex items-center justify-center">
                    <div className="border border-blue-900/40 rounded-full px-3 py-1 rotate-[-4deg] bg-blue-50/40">
                      <span className="text-[9px] font-serif font-bold text-blue-950 uppercase tracking-widest">
                        SMA PGRI 1 LUMAJANG
                      </span>
                    </div>
                  </div>

                  <p className="font-bold underline text-slate-900 text-xs uppercase">PANITIA PPDB RESMI</p>
                  <p className="text-[10px] text-slate-500">NIP / NUPTK Panitia PPDB</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  Butuh bantuan seputar daftar ulang atau kendala data?
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Layanan informasi PPDB aktif pada jam kerja (08.00 - 14.00 WIB)
                </p>
              </div>
              
              <a
                href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20SMA%20PGRI%201%20Lumajang,%20saya%20ingin%20konfirmasi%20daftar%20ulang%20penerimaan%20siswa%20baru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Panitia</span>
              </a>
            </div>

          </section>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 text-center text-xs sm:text-sm text-slate-500 print:hidden space-y-2">
          <p>
            Belum mendaftarkan diri sebagai calon siswa?{' '}
            <Link 
              href="/ppdb/daftar" 
              className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 hover:underline transition-colors ml-1"
            >
              <span>Isi Formulir Pendaftaran Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </p>
          <p className="text-slate-400 text-[11px]">
            © 2026 SMA PGRI 1 Lumajang • The Character of Success
          </p>
        </div>

      </div>
    </div>
  );
}