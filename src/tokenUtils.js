// tokenUtils.js

/**
 * Decode a Base64URL string
 * @param {string} str - The Base64URL string to decode
 * @returns {string} - The decoded string
 */
const base64UrlDecode = (str) => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Invalid base64 string');
    }
    return decodeURIComponent(escape(atob(output)));
  };
  
  /**
   * Decode a JWT token
   * @param {string} token - The JWT token to decode
   * @returns {object|null} - The decoded token payload or null if invalid
   */
  const decodeToken = (token) => {
    try {
      const [, payload] = token.split('.');
      if (!payload) {
        throw new Error('Invalid token');
      }
      const decodedPayload = base64UrlDecode(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };
  
  export default decodeToken;
  