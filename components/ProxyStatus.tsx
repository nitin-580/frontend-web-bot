export default function ProxyStatus() {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-semibold mb-4">Proxy Status</h2>
  
        <div className="space-y-3 text-sm">
          <Status ip="45.12.32.11" country="US" latency="120ms" />
          <Status ip="88.21.55.90" country="UK" latency="150ms" />
          <Status ip="103.44.22.18" country="IN" latency="90ms" />
        </div>
      </div>
    );
  }
  
  function Status({
    ip,
    country,
    latency,
  }: {
    ip: string;
    country: string;
    latency: string;
  }) {
    return (
      <div className="flex justify-between">
        <span>{ip} ({country})</span>
        <span className="text-gray-500">{latency}</span>
      </div>
    );
  }