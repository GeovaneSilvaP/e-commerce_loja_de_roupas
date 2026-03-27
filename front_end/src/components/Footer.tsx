import {
  Instagram,
  Facebook,
  Twitter,
  Github,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f13] border-t border-white/5 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO / ABOUT */}
        <div>
          <h1 className="text-xl font-extrabold tracking-tight mb-4">
            My<span className="text-violet-400">Store</span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Sua loja moderna de roupas e acessórios. Qualidade, estilo e tecnologia em um só lugar.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-4">
            {[Instagram, Facebook, Twitter, Github].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 cursor-pointer transition"
              >
                <Icon size={16} className="text-zinc-300" />
              </div>
            ))}
          </div>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-white">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-white cursor-pointer transition">
              Home
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Produtos
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Categorias
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Meus Pedidos
            </li>
          </ul>
        </div>

        {/* SUPORTE */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-white">
            Suporte
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-white cursor-pointer transition">
              Central de Ajuda
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Termos de Uso
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Política de Privacidade
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Contato
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-white">
            Fique por dentro
          </h3>

          <p className="text-sm text-zinc-400 mb-3">
            Receba novidades e promoções.
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 bg-[#18181f] border border-[#252530] rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
            />

            <button className="bg-violet-500 hover:bg-violet-600 px-4 rounded-xl flex items-center justify-center transition active:scale-95">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/5 text-center py-4 text-xs text-zinc-500">
        © {new Date().getFullYear()} MyStore — Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;