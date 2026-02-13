export default function Conversorsvg({ color = "currentColor", className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      fill={color}
      stroke={color}
      className={className}
    >
      <g
        fill={color}
        stroke={color}
        fontFamily="sans-serif"
        fontWeight="bold"
        textAnchor="middle"
      >
        <text x="55" y="30" stroke={color} fontSize="30">
          PNG
        </text>
        <text x="55" y="65" stroke={color} fontSize="17">
          TO
        </text>

        <text x="55" y="110" stroke={color} fontSize="30">
          WEBP
        </text>
      </g>
    </svg>
  );
}
