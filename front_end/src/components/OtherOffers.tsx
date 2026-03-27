import images_1 from "../assets/images_1.webp";
import imagens_2 from "../assets/imagens_2.webp";
import imagens3 from "../assets/imagens3.webp";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OtherOffers = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
            Promoções especiais
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            Outras <span className="text-violet-400">Ofertas</span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-violet-400 transition"
        >
          Ver mais <ArrowRight size={14} />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* GRANDE */}
        <div className="relative group col-span-1 md:col-span-1 h-80 rounded-2xl overflow-hidden cursor-pointer">
          <img
            src={imagens3}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          <div className="absolute bottom-5 left-5">
            <p className="text-sm text-zinc-300">Nova coleção</p>
            <h3 className="text-xl font-bold">Estilo Infantil</h3>
          </div>
        </div>

        {/* DIREITA (2 + 3 juntos) */}
        <div className="flex flex-col gap-5 col-span-1 md:col-span-2">

          {/* template2 */}
          <div className="relative group h-40 rounded-2xl overflow-hidden cursor-pointer">
            <img
              src={images_1}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            <div className="absolute bottom-4 left-4">
              <p className="text-xs text-zinc-300">Descontos</p>
              <h3 className="text-lg font-semibold">Até 50% OFF</h3>
            </div>
          </div>

          {/* template3 (MENOR AO LADO DO 2 VISUALMENTE MAIS LEVE) */}
          <div className="relative group h-32 rounded-2xl overflow-hidden cursor-pointer">
            <img
              src={imagens_2}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            <div className="absolute bottom-3 left-4">
              <p className="text-xs text-zinc-300">Acessórios</p>
              <h3 className="text-sm font-semibold">
                Complemente seu look
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherOffers;
