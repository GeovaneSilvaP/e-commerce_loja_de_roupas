import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);

  const getProduct = async () => {
    const response = await api.get(`/products/${id}`);
    const product = response.data[0];

    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStock(product.stock);
  };

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/admin");
  };

  const updateProduct = async (): Promise<void> => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("stock", String(stock));

    if (image) {
      formData.append("image", image);
    }

    await api.put(`/products/${id}`, formData);

    alert("Produto atualizado com sucesso 🚀");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">Editar Produto</h1>

      <input
        type="text"
        placeholder="Nome do produto"
        className="w-full border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Preço"
        className="w-full border p-2 rounded"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="Descrição"
        className="w-full border p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantidade em estoque"
        className="w-full border p-2 rounded"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      <input
        type="file"
        className="w-full"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
      />

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
        onClick={updateProduct}
      >
        Atualizar Produto
      </button>

      <button
        className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition"
        onClick={handleBack}
      >
        ← Voltar
      </button>
    </div>
  );
};

export default EditProducts;
