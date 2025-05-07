import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart } = useCart();

  // ✅ Calcul du total
  const total = items.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 p-4 z-50 flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🛒 Panier</h2>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-800 text-lg"
              title="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Liste des produits */}
          <ul className="space-y-2 overflow-y-auto flex-1">
            {items.map((item, i) => (
              <li key={i} className="border-b pb-2">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">{Number(item.price).toFixed(2)} €</p>
              </li>
            ))}
          </ul>

          {/* ✅ Total panier */}
          <div className="mt-4 mb-2 border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total :</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Bouton valider */}
          <button
            className="w-full bg-[#5B359B] text-white py-2 rounded hover:bg-purple-700"
            onClick={() => alert('Panier validé !')}
          >
            Valider mon panier
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
