export default function Card({ title, value, icon, tone = "cyan", hint }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__head">
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
        <p className="stat-card__title">{title}</p>
      </div>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </article>
  );
}
