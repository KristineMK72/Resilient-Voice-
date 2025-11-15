// pages/api/products.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    console.error('PRINTFUL_API_KEY is not set');
    return res.status(500).json({ error: 'API key missing' });
  }

  try {
    console.log('Fetching from Printful with key length:', apiKey.length);

    const response = await fetch('https://api.printful.com/store/products', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': '17196995',
      },
    });

    console.log('Printful response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful error body:', errorText);
      throw new Error(`Printful API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Products fetched:', data.result?.length || 0);

    // Return simplified objects 🟢
    const simplifiedProducts = data.result.map(item => ({
      id: item.id,
      name: item.name,
      thumbnail: item.thumbnail_url,
      price: item.retail_price,
      externalLink: item.external_url,
    }));

    return res.status(200).json(simplifiedProducts);

  } catch (error) {
    console.error('Full error in handler:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
