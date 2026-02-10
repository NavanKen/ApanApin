import TransaksiController from "@/controllers/transaksi.controller";

export async function GET(req, { params }) {
    const { id } = await params;
    return TransaksiController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
    const { id } = await params;
    return await TransaksiController.updateKeluar({ id: Number(id) });
}
