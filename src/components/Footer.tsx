import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" text-md flex h-10 gap-5 text-dark-gray">
      <a href="https://instagram.com/nezneznezneznez">
        <FaInstagram />
      </a>
      <a href="https://www.facebook.com/people/Neznayer/100068832200828/">
        <FaFacebook />
      </a>
    </footer>
  );
}
