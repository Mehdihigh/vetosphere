import { FaShoppingCart } from 'react-icons/fa';
import { Product } from '../../services/productService';

export default function ProductCard({ product, onAddToCart }: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div className="border p-4 rounded shadow">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded mb-2" />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="font-bold mt-2 text-[#5B359B]">{Number(product.price).toFixed(2)} €</p>
      {!product.inStock ? (
        <p className="text-red-600 mt-1">Indisponible</p>
      ) : (
        <button
          onClick={() => onAddToCart(product)}
          className="mt-3 bg-[#5B359B] hover:bg-purple-700 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <FaShoppingCart /> Ajouter
        </button>
      )}
    </div>
  );
}
