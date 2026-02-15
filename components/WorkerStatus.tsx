export default function WorkerStatus() {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-semibold mb-4">Worker Status</h2>
  
        <div className="space-y-3 text-sm">
          <Status label="Worker 1" status="Running" />
          <Status label="Worker 2" status="Idle" />
          <Status label="Worker 3" status="Running" />
        </div>
      </div>
    );
  }
  
  function Status({ label, status }: { label: string; status: string }) {
    const color = status === "Running" ? "text-green-600" : "text-gray-500";
  
    return (
      <div className="flex justify-between">
        <span>{label}</span>
        <span className={color}>{status}</span>
      </div>
    );
  }