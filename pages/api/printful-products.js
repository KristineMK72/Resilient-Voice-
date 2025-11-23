// pages/api/printful-products.js
export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Printful API error:", response.status, text);
      return res.status(response.status).json({ error: "Printful API request failed" });
    }

    const data = await response.json();

    // ✅ Guard against unexpected response
    if (!data.result || !Array.isArray(data.result)) {
      console.error("Unexpected Printful response:", data);
      return res.status(500).json({ error: "Invalid Printful response format" });
    }

    const enrichedProducts = data.result.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      thumbnail: p.thumbnail_url,
      price: p.variants?.[0]?.retail_price || null,
      variants: p.variants,
    }));

    res.status(200).json(enrichedProducts);
  } catch (err) {
    console.error("Printful products fetch error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
