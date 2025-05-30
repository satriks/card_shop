import FooterLogo from "./elements/FooterLogo";
import "./Footer.scss";
import FooterInfo from "./elements/FooterInfo";

export default function Footer() {
  return (
    <div className="footer">
      <FooterLogo />
      <FooterInfo />
    </div>
  );
}
