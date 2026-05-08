import { CircuitSchema, CircuitSummary } from "@/types/circuit";

const STORAGE_KEY = "circuit_recipes";

function loadAll(): CircuitSchema[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAll(circuits: CircuitSchema[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
}

export function getAllCircuits(): CircuitSummary[] {
  return loadAll()
    .map(({ id, name, description, createdAt, updatedAt, components }) => ({
      id, name, description, createdAt, updatedAt,
      componentCount: components.length,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getCircuit(id: string): CircuitSchema | null {
  return loadAll().find((c) => c.id === id) ?? null;
}

export function saveCircuit(schema: CircuitSchema): CircuitSchema {
  const circuits = loadAll();
  const idx = circuits.findIndex((c) => c.id === schema.id);
  if (idx >= 0) circuits[idx] = schema;
  else circuits.push(schema);
  saveAll(circuits);
  return schema;
}

export function deleteCircuit(id: string): boolean {
  const circuits = loadAll();
  const idx = circuits.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  circuits.splice(idx, 1);
  saveAll(circuits);
  return true;
}
