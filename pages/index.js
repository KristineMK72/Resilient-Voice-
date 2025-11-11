import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products'); // ✅ FIXED: Relative path - no CORS
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setProducts(data.result || []);
      } catch (err) {
        setError(err.message);
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  if (!products.length) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      No products found. Check Printful dashboard—your products are there, but ensure they're published to the store.
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>✨ The Resilient Voice Store</h1>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2em' }}>Faith • Grit • Purpose — Wear Your Message</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {product.thumbnail && (
              <img src={product.thumbnail} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} />
            )}
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
            <p style={{ color: '#666', margin: '0 0 15px 0' }}>
              {product.variants?.[0]?.price ? `$${product.variants[0].price}` : 'Price coming soon'}
            </p>
            <button style={{ background: '#0070f3', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>Every purchase supports Central MN nonprofits through The Resilient Voice mission.</p>
    </div>
  );
}
