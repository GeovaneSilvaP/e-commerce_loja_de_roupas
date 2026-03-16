import { useState } from "react";
import { api } from "../services/api";

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
      alert("Nome e preço são obrigatórios");
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

      alert("Produto criado com sucesso!!");

      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold">Criar Produto</h2>

      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        required
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Preço"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        placeholder="Estoque"
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          className="w-full h-40 object-cover rounded"
        />
      )}

      <button
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        {loading ? "Criando..." : "Criar Produto"}
      </button>
    </form>
  );
};

export default CreateProducts;