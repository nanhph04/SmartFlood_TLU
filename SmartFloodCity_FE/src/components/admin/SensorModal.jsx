function SensorModal({
    show,
    onClose,
    onSubmit,
    form,
    setForm,
}) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
                className="bg-white p-6 rounded-xl shadow-lg min-w-[320px]"
                onSubmit={onSubmit}
            >
                <h3 className="text-lg font-semibold mb-4">Thêm cảm biến</h3>
                <div className="mb-3">
                    <label className="block text-xs mb-1">Tên cảm biến</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-xs mb-1">Tên khu vực (areaName)</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.areaName || ""}
                        onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-xs mb-1">Kinh độ (Longitude)</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        type="number"
                        value={form.longitude || ""}
                        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-xs mb-1">Vĩ độ (Latitude)</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        type="number"
                        value={form.latitude || ""}
                        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-xs mb-1">Mực nước (cm)</label>
                    <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={form.waterLevel}
                        onChange={(e) => setForm({ ...form, waterLevel: Number(e.target.value) })}
                        min={0}
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SensorModal;
