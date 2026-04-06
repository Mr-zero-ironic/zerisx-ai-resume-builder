export default async function handler(req, res) {
  const response = await fetch("https://api...", {
    headers: {
      Authorization: `Bearer ${process.env.AIzaSyBPjhRkOvBk1kEWJYqgd20KUGeOsP4-LoY}`
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}