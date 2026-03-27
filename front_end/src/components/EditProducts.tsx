import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
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

  const getProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data[0];

      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setStock(product.stock);
    } catch {
      toast.error("Erro ao carregar produto");
    }
  };

  useEffect(() => {
    if (id) getProduct();
  }, [id]);

  const updateProduct = async () => {
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

      await api.put(`/products/${id}`, formData);

      toast.success("Produto atualizado com sucesso 🚀");
      navigate("/admin");
    } catch {
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white px-4 py-10">
      <div className="max-w-md mx-auto bg-[#18181f] border border-[#252530] p-6 rounded-2xl shadow-lg space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">
            Editar Produto
          </h1>

          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* INPUTS */}
        <div>
          <label className="text-xs text-zinc-400">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 p-3 rounded-xl text-sm outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Preço</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full mt-1 bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 p-3 rounded-xl text-sm outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 p-3 rounded-xl text-sm outline-none transition resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Estoque</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full mt-1 bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 p-3 rounded-xl text-sm outline-none transition"
          />
        </div>

        {/* UPLOAD */}
        <div>
          <label className="text-xs text-zinc-400 block mb-2">
            Nova imagem (opcional)
          </label>

          <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-[#252530] hover:border-violet-500 bg-[#111118] p-6 rounded-xl transition">
            <UploadCloud size={22} className="text-zinc-400" />
            <span className="text-sm text-zinc-400">
              Clique para trocar imagem
            </span>

            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
            />
          </label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-40 object-cover rounded-xl mt-3 border border-[#252530]"
            />
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={updateProduct}
          disabled={loading}
          className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20 disabled:opacity-50"
        >
          {loading ? "Atualizando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
};

export default EditProducts;
