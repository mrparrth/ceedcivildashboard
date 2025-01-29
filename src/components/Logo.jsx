import useSettings from "hooks/useSettings";
export default function Logo({ className }) {
  return (
    <img
      src="https://ceedcivil.com/wp-content/uploads/thegem-logos/logo_4d56f686668bce5695ed72f5ec338800_1x.png"
      alt="CEED Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }}
      className={className}
    />
  );
}
