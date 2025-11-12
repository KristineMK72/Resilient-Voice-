import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.result || []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProducts();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>Loading products...</p>;

  return (
    <div>
      <h1>The Resilient Voice Products</h1>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <img src={product.thumbnail_url} alt={product.name} style={{ maxWidth: '100%' }} />
            <h3>{product.name}</h3>
            <p>Variants: {product.variants}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
