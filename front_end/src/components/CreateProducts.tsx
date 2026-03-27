import { useState } from "react";
import { api } from "../services/api";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

const CreateProducts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

      if (image) {
        formData.append("image", image);
      }

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* NOME */}
      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Nome do produto
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Camiseta Premium"
          className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition"
        />
      </div>

      {/* PREÇO */}
      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Preço
        </label>
        <input
          type="number"
          required
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="R$ 0,00"
          className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition"
        />
      </div>

      {/* DESCRIÇÃO */}
      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes do produto..."
          className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition resize-none"
        />
      </div>

      {/* ESTOQUE */}
      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Estoque
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Quantidade disponível"
          className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition"
        />
      </div>

      {/* UPLOAD */}
      <div>
        <label className="text-xs text-zinc-400 block mb-2">
          Imagem do produto
        </label>

        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-[#252530] hover:border-violet-500 bg-[#111118] p-6 rounded-xl transition">
          <UploadCloud size={22} className="text-zinc-400" />
          <span className="text-sm text-zinc-400">
            Clique para enviar imagem
          </span>

          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
          />
        </label>

        {/* PREVIEW */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-40 object-cover rounded-xl mt-3 border border-[#252530]"
          />
        )}
      </div>

      {/* BOTÃO */}
      <button
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20 disabled:opacity-50"
      >
        {loading ? "Criando..." : "Criar Produto"}
      </button>
    </form>
  );
};

export default CreateProducts;