import axios from "axios";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36";

const client = axios.create({
  timeout: 10000,
  maxRedirects: 5,
  validateStatus: () => true,
  headers: {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  },
});

export async function fetchHtml(url) {
  const { data } = await client.get(url);
  return data;
}

export async function checkLinkStatus(url) {
  try {
    const response = await client.head(url);

    if (response.status >= 400 || response.status === 405) {
      const getResponse = await client.get(url);
      return getResponse.status;
    }

    return response.status;
  } catch {
    return null; 
  }
}
