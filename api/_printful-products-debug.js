export default async function handler(req, res) {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  const STORE_ID = "17196995";

  try {
    const response = await fetch(`https://api.printful.com/store/products`, {
      headers: {
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
