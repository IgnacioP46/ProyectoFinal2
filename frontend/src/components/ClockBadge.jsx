import useClock from "../hooks/useClock";

export default function ClockBadge(){
  const { time, date } = useClock(60_000);
  return (
    <div style={{
      display:"flex", gap:8, alignItems:"center",
      background:"#0b1526", padding:"6px 10px", borderRadius:8, fontVariantNumeric:"tabular-nums"
    }}>
      <span aria-label="Hora">{time}</span>
      <span style={{opacity:.7}} aria-label="Fecha">{date}</span>
    </div>
  );
}
