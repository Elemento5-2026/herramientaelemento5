import "./StatCard.css";

export default function StatCard({
  title,
  value,
  subtitle,
  color = "primary",
}) {
  return (
    <div className={`stat-card ${color}`}>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
}
