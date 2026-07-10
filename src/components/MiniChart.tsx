interface DataPoint {
  day: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

export default function MiniChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 100;
  const barWidth = 28;
  const svgWidth = 300;
  const gap = (svgWidth - 7 * barWidth) / 6;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">7 derniers jours</div>
      <div className="w-full max-w-[300px] mx-auto">
        <svg viewBox={`0 0 ${svgWidth} ${chartHeight + 24}`} className="w-full h-auto overflow-visible">
          {data.map((d, i) => {
            const height = (d.count / maxCount) * chartHeight;
            const y = chartHeight - height;
            const x = i * (barWidth + gap);
            const hasData = d.count > 0;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  rx={6}
                  fill="#f1f5f9"
                />
                {hasData && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    rx={6}
                    fill="#3B82F6"
                    className="transition-all duration-500 ease-out"
                  />
                )}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Space Grotesk, sans-serif"
                >
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
