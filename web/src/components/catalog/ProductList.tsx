import { Product } from '../../services/productService';
import ProductCard from './ProductCard';

export default function ProductList({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
