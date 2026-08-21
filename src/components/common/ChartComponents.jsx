import React, { useState } from "react";

// Responsive SVG Line / Area Chart
export const LineChart = ({
  data = [],
  dataKey = "value",
  labelKey = "label",
  height = 240,
  strokeColor = "var(--primary)",
  fillColor = "rgba(5, 150, 105, 0.12)",
  formatValue = (v) => v
}) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>No data points available</div>;
  }

  const values = data.map((d) => d[dataKey] || 0);
  const maxVal = Math.max(...values, 10) * 1.15;
  const minVal = Math.min(...values, 0);

  const padding = { top: 20, right: 24, bottom: 32, left: 36 };
  const width = 500; // SVG coordinate system
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
    const val = d[dataKey] || 0;
    const y = padding.top + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;
    return { x, y, data: d, val, label: d[labelKey] };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`line-grad-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + innerHeight * (1 - ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-light)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="var(--text-light)"
                fontSize="10"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {Math.round(minVal + (maxVal - minVal) * ratio)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#line-grad-${strokeColor})`} />

        {/* Line stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & Interaction */}
        {points.map((pt, i) => (
          <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? 6 : 4}
              fill="white"
              stroke={strokeColor}
              strokeWidth={hoverIndex === i ? 3 : 2}
              style={{ cursor: "pointer", transition: "r 0.2s" }}
            />
            {/* X labels */}
            <text
              x={pt.x}
              y={height - 8}
              fill="var(--text-muted)"
              fontSize="11"
              textAnchor="middle"
              fontWeight="500"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Interactive Tooltip */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          style={{
            position: "absolute",
            top: `${(points[hoverIndex].y / height) * 100}%`,
            left: `${(points[hoverIndex].x / width) * 100}%`,
            transform: "translate(-50%, -120%)",
            background: "var(--text-main)",
            color: "white",
            padding: "6px 10px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            fontWeight: "600",
            pointerEvents: "none",
            boxShadow: "var(--shadow-lg)",
            whiteSpace: "nowrap",
            zIndex: 10
          }}
        >
          <div>{points[hoverIndex].label}</div>
          <div style={{ color: "var(--primary-light)", fontWeight: "700" }}>
            {formatValue(points[hoverIndex].val)}
          </div>
        </div>
      )}
    </div>
  );
};

// Responsive Interactive Bar Chart
export const BarChart = ({
  data = [],
  dataKey = "value",
  labelKey = "label",
  height = 240,
  barColor = "var(--primary)",
  formatValue = (v) => v
}) => {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d[dataKey] || 0), 10) * 1.15;

  return (
    <div style={{ width: "100%", height, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "12px", padding: "10px 0" }}>
        {data.map((item, i) => {
          const val = item[dataKey] || 0;
          const heightPercent = Math.max(4, (val / maxVal) * 100);
          const isHov = hovered === i;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                cursor: "pointer",
                position: "relative"
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHov && (
                <div
                  style={{
                    position: "absolute",
                    bottom: `${heightPercent + 10}%`,
                    background: "var(--text-main)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "var(--shadow-md)"
                  }}
                >
                  {formatValue(val)}
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  maxWidth: "42px",
                  height: `${heightPercent}%`,
                  background: isHov ? "var(--primary-dark)" : item.color || barColor,
                  borderRadius: "6px 6px 2px 2px",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: hovered !== null && !isHov ? 0.6 : 1
                }}
              />
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.72rem",
                  color: isHov ? "var(--text-main)" : "var(--text-muted)",
                  fontWeight: isHov ? "700" : "500",
                  textAlign: "center",
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {item[labelKey]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// AI Comparison Bar Chart: Previous vs Predicted Next Semester
export const ComparisonBarChart = ({
  data = [],
  height = 260
}) => {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      {data.map((item, idx) => {
        const max = Math.max(item.previousSemesterQty, item.predictedNextSemesterQty, 1) * 1.25;
        const prevWidth = (item.previousSemesterQty / max) * 100;
        const nextWidth = (item.predictedNextSemesterQty / max) * 100;

        return (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{item.item}</span>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  color: item.percentageIncrease >= 0 ? "var(--primary)" : "var(--accent-amber)"
                }}
              >
                {item.percentageIncrease >= 0 ? `+${item.percentageIncrease}% Expected` : `${item.percentageIncrease}% Expected`}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {/* Previous semester bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "65px", fontSize: "0.72rem", color: "var(--text-muted)" }}>Previous:</span>
                <div style={{ flex: 1, background: "var(--bg-card-subtle)", height: "14px", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${prevWidth}%`,
                      height: "100%",
                      background: "#94a3b8",
                      borderRadius: "var(--radius-sm)",
                      transition: "width 0.6s ease"
                    }}
                  />
                </div>
                <span style={{ width: "65px", fontSize: "0.78rem", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>
                  {item.previousSemesterQty} {item.unit}
                </span>
              </div>

              {/* Next predicted semester bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "65px", fontSize: "0.72rem", color: "var(--primary-dark)", fontWeight: "600" }}>AI Forecast:</span>
                <div style={{ flex: 1, background: "var(--primary-subtle)", height: "18px", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${nextWidth}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, var(--primary), var(--primary-hover))",
                      borderRadius: "var(--radius-sm)",
                      transition: "width 0.8s ease"
                    }}
                  />
                </div>
                <span style={{ width: "65px", fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-dark)", textAlign: "right" }}>
                  {item.predictedNextSemesterQty} {item.unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Donut Pie Chart Component
export const DonutChart = ({
  data = [],
  size = 180,
  centerTitle = "Total",
  centerValue = "100%"
}) => {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0) || 1;
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map((slice) => {
    const startPercent = cumulativePercent;
    const slicePercent = slice.value / total;
    cumulativePercent += slicePercent;
    const endPercent = cumulativePercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`
    ].join(" ");

    return {
      ...slice,
      pathData,
      percent: Math.round(slicePercent * 100)
    };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          viewBox="-1 -1 2 2"
          style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}
        >
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color || `hsl(${i * 65}, 70%, 50%)`}
            />
          ))}
          {/* Donut hole */}
          <circle cx="0" cy="0" r="0.65" fill="white" />
        </svg>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>{centerTitle}</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>{centerValue}</div>
        </div>
      </div>

      {/* Legends */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "140px" }}>
        {slices.map((slice, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: slice.color || `hsl(${i * 65}, 70%, 50%)`,
                flexShrink: 0
              }}
            />
            <span style={{ color: "var(--text-muted)", flex: 1 }}>{slice.label}</span>
            <span style={{ fontWeight: "700", color: "var(--text-main)" }}>{slice.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
