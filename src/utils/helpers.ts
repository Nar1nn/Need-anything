import { LinktreeProfile } from '../types';

/**
 * Encodes the profile state into an URL-safe base64 string
 */
export function compressProfile(profile: LinktreeProfile): string {
  try {
    const jsonStr = JSON.stringify(profile);
    // Use btoa with encodeURIComponent to support full UTF-8 emojis and special characters safely
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const binaryStr = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryStr)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // remove padding
  } catch (err) {
    console.error('Error compressing profile:', err);
    return '';
  }
}

/**
 * Decodes a base64 encoded profile string from URL
 */
export function decompressProfile(hash: string): LinktreeProfile | null {
  try {
    // Put back standard base64 characters
    let base64 = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if required
    while (base64.length % 4) {
      base64 += '=';
    }

    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr) as LinktreeProfile;
    
    // Simple validation
    if (parsed && typeof parsed.name === 'string' && Array.isArray(parsed.items)) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.error('Error decompressing profile:', err);
    return null;
  }
}

/**
 * Generates Whatsapp link correctly
 */
export function formatWhatsappUrl(phone: string): string {
  // strip all symbols, keep only digits
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  return `https://wa.me/${cleaned}`;
}

/**
 * Generates Mailto link cleanly
 */
export function formatMailtoUrl(email: string): string {
  if (!email.includes('@')) return email;
  return `mailto:${email}`;
}
