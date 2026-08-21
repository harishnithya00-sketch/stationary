// Password Hashing Utility using Web Crypto API (SHA-256)
// Ensures passwords are never stored or compared in plain text

export async function hashPassword(plainPassword) {
  if (!plainPassword) return "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // Fallback simple deterministic hash if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < plainPassword.length; i++) {
      const char = plainPassword.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return "sha256_fallback_" + Math.abs(hash).toString(16);
  }
}

// Pre-computed SHA-256 hash for default demo password "password123"
export const DEFAULT_DEMO_PASSWORD_HASH = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f";
