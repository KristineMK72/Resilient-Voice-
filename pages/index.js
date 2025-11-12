import { useState, useEffect } from 'react';
import Head from 'next/head'; // Import Head for <title> and meta
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Fetching products...');
        const res = await fetch('/api/products');
        console.log('Fetch response status:', res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log('Fetched data:', data);
        if (data.error) throw new Error(data.error);
        if (isMounted) setProducts(data.result || []);
      } catch (err) {
        if (isMounted) setError(err.message);
        console.log('Fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; }; // Cleanup
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading products... <span>(Check console)</span></div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} <span>(Check console)</span></div>;
  if (!products.length) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      No products found. Check Printful dashboard or console.
    </div>
  );

  return (
    <>
      <Head>
        <title>The Resilient Voice Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <html lang="en" /> {/* Note: This won't work here; see Step 2 */}
      </Head>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>✨ The Resilient Voice Store</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2em' }}>Faith • Grit • Purpose — Wear Your Message</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {product.thumbnail_url && (
                <img src={product.thumbnail_url} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} />
              )}
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
              <p style={{ color: '#666', margin: '0 0 15px 0' }}>
                Variants: {product.variants} | Price: TBD (Check product page)
              </p>
              <button style={{ background: '#0070f3', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>Every purchase supports Central MN nonprofits through The Resilient Voice mission.</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/products">
            <a style={{ display: 'inline-block', padding: '12px 24px', background: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>Shop All Products</a>
          </Link>
        </div>
      </div>
    </>
  );
}
