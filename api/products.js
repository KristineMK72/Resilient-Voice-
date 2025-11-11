export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.PRINTFUL_API_KEY) {
    console.error('PRINTFUL_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error: API key missing' });
  }

  try {
    console.log('Fetching Printful sync products...');
    const response = await fetch('https://api.printful.com/sync/products', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Printful API Status:', response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Printful Error:', errorBody);
      throw new Error(`Printful API failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('Sync Products Count:', data.result ? data.result.length : 0);
    res.status(200).json(data);
  } catch (err) {
    console.error('API Route Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
