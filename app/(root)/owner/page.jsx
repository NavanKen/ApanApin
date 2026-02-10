export default function DashboardOwner() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e6091]">Dashboard Owner</h1>
        <p className="text-gray-500 mt-1">
          Selamat datang di Dashboard Owner Sistem Parkir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Navigasi Cepat
          </h3>
          <p className="text-gray-700 mt-2">
            Gunakan menu <strong>Rekap Transaksi</strong> di sidebar untuk
            melihat seluruh data transaksi parkir beserta filter tanggal.
          </p>
        </div>
      </div>
    </div>
  );
}
