import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, Save } from "lucide-react";
import toast from "react-hot-toast";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data[0];
        setName(p.name);
        setPrice(p.price);
        setDescription(p.description);
        setStock(p.stock);
      })
      .catch(() => toast.error("Erro ao carregar produto"))
      .finally(() => setFetching(false));
  }, [id]);

  const updateProduct = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(price));
      formData.append("description", description);
      formData.append("stock", String(stock));
      if (image) formData.append("image", image);
      await api.put(`/products/${id}`, formData);
      toast.success("Produto atualizado com sucesso 🚀");
      navigate("/admin");
    } catch {
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#0f0f13] border border-[#252530] focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 outline-none p-3 rounded-xl text-sm text-white placeholder-zinc-600 transition-all duration-200";

  const labelClass =
    "text-xs font-medium text-zinc-500 uppercase tracking-widest block mb-1.5";

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white px-4 py-12 flex items-start justify-center">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .page-enter { animation: fadeIn 0.4s ease both; }
        .field { animation: fadeSlideUp 0.35s ease both; }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #18181f 25%, #252530 50%, #18181f 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
      `}</style>

      <div className="w-full max-w-md page-enter">
        {/* HEADER */}
        <div className="mb-8 field" style={{ animationDelay: "0ms" }}>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-zinc-500 hover:text-violet-400 text-sm transition-colors duration-200 mb-5"
          >
            <ArrowLeft size={15} />
            Voltar ao painel
          </button>

          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
            Edição de produto
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Editar <span className="text-violet-400">Produto</span>
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-6 shadow-2xl">
          {/* SKELETON enquanto carrega */}
          {fetching ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-3 w-20 mb-2" />
                  <div className="skeleton h-11 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* NOME */}
              <div className="field" style={{ animationDelay: "0ms" }}>
                <label className={labelClass}>Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do produto"
                  className={inputClass}
                />
              </div>

              {/* PREÇO + ESTOQUE */}
              <div
                className="grid grid-cols-2 gap-4 field"
                style={{ animationDelay: "60ms" }}
              >
                <div>
                  <label className={labelClass}>Preço</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="R$ 0,00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estoque</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="Qtd."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* DESCRIÇÃO */}
              <div className="field" style={{ animationDelay: "120ms" }}>
                <label className={labelClass}>Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes do produto..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* UPLOAD */}
              <div className="field" style={{ animationDelay: "180ms" }}>
                <label className={labelClass}>Nova imagem (opcional)</label>

                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) setImage(file);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-xl p-7 transition-all duration-300
                    ${
                      dragOver
                        ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                        : "border-[#252530] bg-[#0f0f13] hover:border-violet-500/50 hover:bg-violet-500/5"
                    }`}
                >
                  <UploadCloud
                    size={22}
                    className={`transition-colors duration-200 ${dragOver ? "text-violet-400" : "text-zinc-600"}`}
                  />
                  <span className="text-sm text-zinc-600">
                    {dragOver ? "Solte aqui!" : "Clique ou arraste para trocar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                </label>

                {image && (
                  <div className="relative mt-3 group">
                    <img
                      src={URL.createObjectURL(image)}
                      className="w-full h-40 object-cover rounded-xl border border-[#252530]"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all duration-200"
                    >
                      <X size={13} className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* BOTÃO */}
              <div className="field pt-1" style={{ animationDelay: "240ms" }}>
                <button
                  onClick={updateProduct}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3.5 rounded-xl
                             transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20
                             disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="flex items-center gap-2 relative z-10">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Salvar alterações
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
