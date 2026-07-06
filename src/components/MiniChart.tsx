interface DataPoint {
  day: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

export default function MiniChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 80; 
  const barWidth = 24;
  const svgWidth = 300;
  const gap = (svgWidth - 7 * barWidth) / 6;

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 shadow-sm fade-in-transition">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Activité (7 derniers jours)</h3>
      <div className="w-full max-w-[300px] mx-auto">
        <svg viewBox="0 0 300 110" className="w-full h-auto overflow-visible">
          {data.map((d, i) => {
            const height = (d.count / maxCount) * chartHeight;
            const y = chartHeight - height;
            const x = i * (barWidth + gap);
            
            return (
              <g key={i}>
                <rect x={x} y={0} width={barWidth} height={chartHeight} rx={4} fill="#f1f5f9" />
                {height > 0 && (
                  <rect x={x} y={y} width={barWidth} height={height} rx={4} fill="#2563eb" className="transition-all duration-500" />
                )}
                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
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
