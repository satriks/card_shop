import footerLogo from "../../../assets/footer/footerLogo.png";

export default function FooterLogo() {
  return (
    <div className="footer_logo">
      <p className="footer_logo_title">Kailin Card</p>
      <img className="footer_logo_img" src={footerLogo} alt="Logo" />
      <p className="footer_logo_text">www.kailin-cards.ru</p>
    </div>
  );
}
