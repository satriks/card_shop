import React from "react";
import FooterLogo from "./elements/FooterLogo";
import "./Footer.scss";
import FooterInfo from "./elements/FooterInfo";

type Props = {};

export default function Footer({}: Props) {
  return (
    <div className="footer">
      <FooterLogo />
      <FooterInfo />
    </div>
  );
}
