import birdImg from "/avatar.jpg";

export default function Logo({ size = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={birdImg}
        alt="AlgaidHub"
        style={{
          width: size,
          height: size,
          borderRadius: "8px",
          objectFit: "cover",
          border: "2px solid #e50914",
        }}
      />
      <span style={{
        fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
        fontSize: size * 0.6,
        fontWeight: "900",
        letterSpacing: "-0.5px",
        lineHeight: 1,
        color: "#fff",
      }}>
        Algaid<span style={{ color: "#e50914", fontStyle: "italic" }}>Hub</span>
      </span>
    </div>
  );
}
