export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  image: string;
  id_specie: number;
  id_category: number;
  category: string; // ← Ajouté ici
};


const API_URL = 'http://127.0.0.1:3500'; // à remplacer par ta vraie URL

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/product`);
    console.log('API response status:', res.status);

    if (!res.ok) throw new Error('Erreur API : ' + res.status);

    const data = await res.json();
    console.log('Données reçues :', data);

    // On enrichit les produits avec un booléen "inStock" basé sur la propriété "stock"
    return data.map((p: any) => ({
      ...p,
      inStock: typeof p.stock === 'number' ? p.stock > 0 : true,
    }));
  } catch (error) {
    console.error('Erreur lors de l’appel à fetchProducts:', error);
    throw error;
  }
}


export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${id}`);
  if (!res.ok) throw new Error('Produit non trouvé');
  return res.json();
}

export async function fetchByCategory(id_category: number): Promise<Product[]> {
  const res = await fetch(`${API_URL}/product/by-category/${id_category}`);
  if (!res.ok) throw new Error('Erreur de filtre par catégorie');
  return res.json();
}

export async function createProduct(data: Omit<Product, 'id'>) {
  const res = await fetch(`${API_URL}/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id: number, data: Partial<Product>) {
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/product/${id}`, { method: 'DELETE' });
  return res.ok;
}
