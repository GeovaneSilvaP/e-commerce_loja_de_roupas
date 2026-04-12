import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api, getImageUrl } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package, Layers, Star, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

type ReviewData = {
  total: number;
  average: number;
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
};

// ✅ Componente de estrelas
const StarRating = ({
  rating,
  onRate,
  size = 20,
  readonly = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  size?: number;
  readonly?: boolean;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition-all duration-150 ${
            readonly ? "" : "cursor-pointer"
          } ${
            star <= (hovered || rating)
              ? "text-amber-400 fill-amber-400"
              : "text-zinc-600"
          }`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onRate?.(star)}
        />
      ))}
    </div>
  );
};

const categoryLabel: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  acessorios: "Acessórios",
  outros: "Outros",
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState<Products | null>(null);
  const [otherProducts, setOtherProducts] = useState<Products[]>([]);
  const [reviews, setReviews] = useState<ReviewData | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
    api.get("/products").then((res) => setOtherProducts(res.data));
    api.get(`/products/${id}/reviews`).then((res) => setReviews(res.data));
  }, [id]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f13]">
        <div className="flex flex-col items-center gap-3 text-zinc-600">
          <Package size={40} />
          <p className="text-sm">Carregando produto...</p>
        </div>
      </div>
    );

  const handleRate = async (rating: number) => {
    if (!token) {
      toast.error("Faça login para avaliar");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setUserRating(rating);
      await api.post(`/products/${id}/reviews`, { rating });
      toast.success("Avaliação enviada! ⭐");

      // ✅ Atualiza as avaliações
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data);
    } catch {
      toast.error("Erro ao enviar avaliação");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-500 hover:text-violet-400 text-sm transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={15} />
            Voltar à loja
          </button>
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
            Detalhes do produto
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Informações do <span className="text-violet-400">Produto</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden mb-8">
          {/* IMAGE */}
          <div className="relative flex items-center justify-center bg-[#111118] p-10 min-h-[360px]">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <img
              src={getImageUrl(product.image_url!)}
              className="max-h-[340px] w-full object-contain relative z-10 transition-transform duration-300 hover:scale-105"
              alt={product.name}
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center p-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-2">
              {product.name}
            </h2>

            {/* ✅ CATEGORIA */}
            <div className="flex items-center gap-1.5 mb-4">
              <Tag size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-widest">
                {categoryLabel[(product as any).category] ?? "Outros"}
              </span>
            </div>

            {/* ✅ MÉDIA DE ESTRELAS */}
            {reviews && reviews.total > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating
                  rating={Math.round(reviews.average)}
                  readonly
                  size={16}
                />
                <span className="text-sm text-zinc-400">
                  {Number(reviews.average).toFixed(1)}
                  <span className="text-zinc-600 ml-1">
                    ({reviews.total} {reviews.total === 1 ? "avaliação" : "avaliações"})
                  </span>
                </span>
              </div>
            )}

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border w-fit mb-8 ${
                product.stock > 5
                  ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                  : "bg-amber-400/10 text-amber-400 border-amber-400/20"
              }`}
            >
              <Layers size={11} />
              {product.stock > 5
                ? `${product.stock} unidades disponíveis`
                : `Apenas ${product.stock} restantes`}
            </span>

            <button
              onClick={() => {
                addToCart(product);
                toast.success("Produto adicionado ao carrinho 🛒");
              }}
              className="flex items-center justify-center gap-2 bg-white text-black text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-100 active:scale-95 transition-all duration-200"
            >
              <ShoppingCart size={16} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* ✅ SEÇÃO DE AVALIAÇÃO */}
        <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-6 mb-16">
          <h3 className="text-lg font-semibold mb-6">Avaliações</h3>

          <div className="flex flex-col md:flex-row gap-8">
            {/* MÉDIA GERAL */}
            <div className="flex flex-col items-center justify-center bg-[#111118] rounded-2xl p-6 min-w-[140px]">
              <span className="text-5xl font-extrabold text-white mb-1">
                {reviews && reviews.total > 0
                  ? Number(reviews.average).toFixed(1)
                  : "—"}
              </span>
              <StarRating
                rating={reviews ? Math.round(reviews.average) : 0}
                readonly
                size={16}
              />
              <span className="text-xs text-zinc-500 mt-2">
                {reviews?.total ?? 0} avaliações
              </span>
            </div>

            {/* BARRAS POR ESTRELA */}
            <div className="flex-1 flex flex-col gap-2 justify-center">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews
                  ? reviews[["one", "two", "three", "four", "five"][star - 1] as keyof ReviewData] as number
                  : 0;
                const total = reviews?.total ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-4 text-right">{star}</span>
                    <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-[#252530] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-600 w-4">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* ✅ AVALIAR */}
            <div className="flex flex-col items-center justify-center gap-3 min-w-[160px]">
              <p className="text-sm text-zinc-400">
                {token ? "Avalie este produto" : "Faça login para avaliar"}
              </p>
              <StarRating
                rating={userRating}
                onRate={token ? handleRate : undefined}
                readonly={!token || submitting}
                size={28}
              />
              {submitting && (
                <span className="text-xs text-zinc-500">Enviando...</span>
              )}
            </div>
          </div>
        </div>

        {/* OTHER PRODUCTS */}
        <section>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
              Explore mais
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Outros <span className="text-violet-400">Produtos</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {otherProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item.id}
                  className="group bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3d3d55]"
                >
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="relative h-44 bg-[#111118] flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={getImageUrl(item.image_url!)}
                      alt={item.name}
                      className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-violet-400/0 group-hover:bg-violet-400/5 transition-all duration-300" />
                  </div>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-[#f0f0f5] font-semibold text-sm leading-snug truncate">
                        {item.name}
                      </h3>
                      <p className="text-violet-400 font-bold text-base mt-1">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(item);
                        toast.success(`${item.name} adicionado 🛒`);
                      }}
                      className="mt-auto w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <ShoppingCart size={13} />
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
