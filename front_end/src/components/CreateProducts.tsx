import { useState } from "react";
import { api } from "../services/api";
import { UploadCloud, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const CreateProducts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(price));
      formData.append("description", description);
      formData.append("stock", String(stock));
      if (image) formData.append("image", image);
      await api.post("/products", formData);
      toast.success("Produto criado com sucesso 🚀");
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setImage(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#111118] border border-[#252530] focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 outline-none p-3 rounded-xl text-sm text-white placeholder-zinc-600 transition-all duration-200";

  const labelClass =
    "text-xs font-medium text-zinc-500 uppercase tracking-widest block mb-1.5";

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .field { animation: fadeSlideUp 0.35s ease both; }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NOME */}
        <div className="field" style={{ animationDelay: "0ms" }}>
          <label className={labelClass}>Nome do produto</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Camiseta Premium"
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
              required
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
          <label className={labelClass}>Imagem do produto</label>

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
            className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300
              ${
                dragOver
                  ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                  : "border-[#252530] bg-[#111118] hover:border-violet-500/50 hover:bg-violet-500/5"
              }`}
          >
            <UploadCloud
              size={24}
              className={`transition-colors duration-200 ${dragOver ? "text-violet-400" : "text-zinc-500"}`}
            />
            <span className="text-sm text-zinc-500">
              {dragOver ? "Solte aqui!" : "Clique ou arraste para enviar"}
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
                className="w-full h-44 object-cover rounded-xl border border-[#252530]"
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
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3.5 rounded-xl
                       transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/25
                       disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="flex items-center gap-2 relative z-10">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Criar Produto
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateProducts;
