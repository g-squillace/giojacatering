export function readEnv(name: string): string | null {
  const value = process.env[name];
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return null;
}

export function missingList(names: string[]): string {
  const missing = names.filter((name) => readEnv(name) === null);
  return missing.length > 0 ? missing.join(", ") : "credenziali non valide";
}
