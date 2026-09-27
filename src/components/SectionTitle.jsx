function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default SectionTitle;