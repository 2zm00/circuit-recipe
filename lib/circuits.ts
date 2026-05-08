import fs from "fs";
import path from "path";
import { CircuitSchema, CircuitSummary } from "@/types/circuit";

const DATA_DIR = path.join(process.cwd(), "data", "circuits");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function circuitPath(id: string) {
  return path.join(DATA_DIR, `${id}.json`);
}

export function getAllCircuits(): CircuitSummary[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
        const schema: CircuitSchema = JSON.parse(raw);
        return {
          id: schema.id,
          name: schema.name,
          description: schema.description,
          createdAt: schema.createdAt,
          updatedAt: schema.updatedAt,
          componentCount: schema.components.length,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime()) as CircuitSummary[];
}

export function getCircuit(id: string): CircuitSchema | null {
  ensureDir();
  const filePath = circuitPath(id);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export function saveCircuit(schema: CircuitSchema): void {
  ensureDir();
  fs.writeFileSync(circuitPath(schema.id), JSON.stringify(schema, null, 2), "utf-8");
}

export function deleteCircuit(id: string): boolean {
  ensureDir();
  const filePath = circuitPath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
