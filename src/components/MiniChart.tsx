interface DataPoint {
  day: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

export default function MiniChart({ data }: { data: { day: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 80;
  const barWidth = 28;
  const svgWidth = 300;
  const gap = (svgWidth - 7 * barWidth) / 6;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 mb-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">7 derniers jours</h3>
      <div className="w-full">
        <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
          {data.map((d, i) => {
            const height = (d.count / maxCount) * chartHeight;
            const y = chartHeight - height;
            const x = i * (barWidth + gap);
            
            return (
              <g key={i}>
                <rect x={x} y={0} width={barWidth} height={chartHeight} rx={6} fill="#f1f5f9" />
                {height > 0 && (
                  <rect x={x} y={y} width={barWidth} height={height} rx={6} fill="#3b82f6" />
                )}
                <text x={x + barWidth / 2} y={115} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
