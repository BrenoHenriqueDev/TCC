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
    <footer className="bg-gray-900 text-white">
      {/* Seção principal do footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1 - Sobre */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">VenceMED</h3>
            <p className="text-gray-300 text-sm">
              Transformando a saúde através da tecnologia e inovação. Nossa
              missão é tornar o acesso à saúde mais eficiente e acessível.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/sobre"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="/servicos"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-300">
                <FaPhone className="text-blue-400" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="text-blue-400" />
                <span>contato@vencemed.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300">
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
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 VenceMED. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacidade"
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                Política de Privacidade
              </a>
              <a
                href="/termos"
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
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
