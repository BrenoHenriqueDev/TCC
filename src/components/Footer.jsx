import {
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Seção principal do footer */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Coluna 1 - Sobre */}
          <div className="footer-about">
            <h3 className="footer-title">VenceMED</h3>
            <p className="footer-description">
              Transformando a saúde através da tecnologia e inovação. Nossa
              missão é tornar o acesso à saúde mais eficiente e acessível.
            </p>
            <div className="footer-social">
              <a
                href="#"
                className="footer-social-link"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="footer-social-link"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="footer-social-link"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="footer-social-link"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="footer-links">
            <h4 className="footer-links-title">
              Links Rápidos
            </h4>
            <ul className="footer-links-list">
              <li>
                <a
                  href="/sobre"
                  className="footer-link"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="/servicos"
                  className="footer-link"
                >
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="footer-link"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="footer-link"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="footer-contact">
            <h4 className="footer-contact-title">Contato</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <FaPhone className="footer-contact-icon" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="footer-contact-item">
                <FaEnvelope className="footer-contact-icon" />
                <span>contato@vencemed.com</span>
              </li>
              <li className="footer-contact-item">
                <FaMapMarkerAlt className="footer-contact-icon" />
                <span>
                  Av. Paulista, 1000 - Bela Vista
                  <br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <div className="footer-bottom-flex">
            <p className="footer-copyright">
              © 2024 VenceMED. Todos os direitos reservados.
            </p>
            <div className="footer-bottom-links">
              <a
                href="/privacidade"
                className="footer-bottom-link"
              >
                Política de Privacidade
              </a>
              <a
                href="/termos"
                className="footer-bottom-link"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;