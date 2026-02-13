export default function Jwtsvg({ color = "currentColor", className }) {
  return (
    <svg
      id="jwt-logo"
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="90"
        fill={color}
        id="jwt-text"
      >
        JWT
      </text>
    </svg>
  );
}
