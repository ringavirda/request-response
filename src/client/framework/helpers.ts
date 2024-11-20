export async function fetchCurrentIp(): Promise<string> {
  const res = await fetch("https://ipinfo.io/json");
  const data = await res.json();
  return data.ip as string;
}

export async function toSha256String(input: string): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
