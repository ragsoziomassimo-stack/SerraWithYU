// Password unica dello Spazio del Programmatore.
// Se esiste il segreto PROGRAMMER_PASSWORD ha la precedenza, altrimenti vale quella predefinita.
const DEFAULT_PASSWORD = "9921@#";

export function isProgrammerPassword(password: string | undefined): boolean {
  if (!password) return false;
  const secret = process.env.PROGRAMMER_PASSWORD;
  return password === (secret || DEFAULT_PASSWORD);
}
