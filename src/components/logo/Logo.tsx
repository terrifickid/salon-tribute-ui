interface LogoProps {
  size?: "small" | "medium" | "large" | "";
}

export default function Logo(props: LogoProps) {
  return (
    <div style={{ fontSize: "1.5rem" }}>
      <a href="https://salondao.xyz">&laquo; Return</a>
    </div>
  );
}
