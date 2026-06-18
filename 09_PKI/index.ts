/**
 * Encrypts or decrypts text using the Caesar Cipher.
 * @param text The input string to process.
 * @param shift The number of positions to shift the alphabet (can be negative for decryption).
 */
export function caesarCipher(text: string, shift: number): string {
  // Handle negative shifts and shifts greater than 26
  const normalizedShift: number = ((shift % 26) + 26) % 26;

  return text
    .split("")
    .map((char) => {
      const code: number = char.charCodeAt(0);

      // Uppercase letters (A-Z: 65-90)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
      }

      // Lowercase letters (a-z: 97-122)
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
      }

      // Non-alphabetic characters remain unchanged
      return char;
    })
    .join("");
}

// Example usage:
const secretMessage = "Hello, World!";
const shiftAmount = 5;

// 1. Encrypt
const encrypted: string = caesarCipher(secretMessage, shiftAmount);
console.log(`Encrypted: ${encrypted}`);
// Output: "Mjqqt, Btwqi!"

// 2. Decrypt (Shift in the opposite direction)
const decrypted: string = caesarCipher(encrypted, -shiftAmount);
console.log(`Decrypted: ${decrypted}`);
// Output: "Hello, World!"
