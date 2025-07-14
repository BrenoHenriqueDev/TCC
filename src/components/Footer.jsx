import {
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-bg text-white">
      {/* Seção principal do footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna 1 - Sobre */}
          <div className="footer-col space-y-4">
            <h3 className="text-xl font-bold text-blue-400">VenceMED</h3>
            <p className="text-gray-300 text-sm">
              Transformando a saúde através da tecnologia e inovação. Nossa
              missão é tornar o acesso à saúde mais eficiente e acessível.
            </p>
            <div className="footer-social flex gap-4">
              <a href="#" className="footer-social-link">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Contato */}
          <div className="footer-col space-y-4 md:justify-self-end">
            <h4 className="text-lg font-semibold text-blue-400">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <FaPhone className="text-blue-400" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaEnvelope className="text-blue-400" />
                <span>contato@vencemed.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <p className="text-gray-400 text-sm">
              © 2024 VenceMED. Todos os direitos reservados.
            </p>
            <div className="footer-bottom-links flex gap-6">
              <a href="/privacidade" className="footer-bottom-link">
                Política de Privacidade
              </a>
              <a href="/termos" className="footer-bottom-link">
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
