async function enhanceResume(data) {
  const res = await fetch("/api/ai.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "summary",
      text: data,
      tone: "professional",
      length: "medium"
    })
  });

  const json = await res.json();
  return json.result;
}