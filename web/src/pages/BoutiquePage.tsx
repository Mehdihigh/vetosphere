import React, { useEffect, useMemo, useState } from 'react';
import ProductFilter from '../components/catalog/ProductFilter';
import ProductList from '../components/catalog/ProductList';
import { useCart } from '../context/CartContext';
import CartDrawer from '../context/CartDrawer';
import {
  fetchProducts,
  Product,
} from '../services/productService';

const BoutiquePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem, openCart } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des produits:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    return ['Toutes', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'Toutes' || p.category === selectedCategory)
      )
      .sort((a, b) => sortOrder === 'asc' ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price));
  }, [products, searchTerm, selectedCategory, sortOrder]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="p-6">
      {/* Titre + bouton panier */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catalogue de produits</h1>
        <button
          onClick={openCart}
          className="text-2xl px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          title="Voir le panier"
        >
          🛒
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur : {error}</p>
      ) : (
        <>
          <ProductFilter
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortOrder={sortOrder}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortOrder}
          />
          <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
        </>
      )}

      {/* Panier déroulant animé */}
      <CartDrawer />
    </div>
  );
};

export default BoutiquePage;

