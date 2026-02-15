export default function JobTable() {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-semibold mb-4">Recent Jobs</h2>
  
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-3 text-left">Job ID</th>
              <th>Status</th>
              <th>Runtime</th>
              <th>Runs</th>
              <th>Last Run</th>
            </tr>
          </thead>
  
          <tbody>
            <Row id="#A1023" status="Completed" runtime="2m 41s" runs="8" last="2 mins ago" />
            <Row id="#A1022" status="Running" runtime="1m 12s" runs="4" last="Now" />
            <Row id="#A1021" status="Failed" runtime="0m 32s" runs="1" last="10 mins ago" />
          </tbody>
        </table>
      </div>
    );
  }
  
  function Row({
    id,
    status,
    runtime,
    runs,
    last,
  }: {
    id: string;
    status: string;
    runtime: string;
    runs: string;
    last: string;
  }) {
    const color =
      status === "Completed"
        ? "text-green-600"
        : status === "Running"
        ? "text-yellow-600"
        : "text-red-600";
  
    return (
      <tr className="border-b">
        <td className="py-3">{id}</td>
        <td className={color}>{status}</td>
        <td>{runtime}</td>
        <td>{runs}</td>
        <td>{last}</td>
      </tr>
    );
  }