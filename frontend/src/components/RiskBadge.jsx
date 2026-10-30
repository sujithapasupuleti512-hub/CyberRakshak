const RISK_CLASS = {
  "High Risk": "badge badge--high",
  Caution: "badge badge--caution",
  "Low Risk": "badge badge--low",
  "Invalid Input": "badge badge--invalid",
  "Invalid URL": "badge badge--invalid",
};

export default function RiskBadge({ risk }) {
  const className = RISK_CLASS[risk] || "badge badge--neutral";
  return <span className={className}>{risk}</span>;
}
