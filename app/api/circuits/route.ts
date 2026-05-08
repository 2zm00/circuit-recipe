import { NextRequest, NextResponse } from "next/server";
import { getAllCircuits, saveCircuit } from "@/lib/circuits";
import { CircuitSchema } from "@/types/circuit";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const circuits = getAllCircuits();
  return NextResponse.json(circuits);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const schema: CircuitSchema = {
    id: body.id ?? uuidv4(),
    name: body.name ?? "새 설계도",
    description: body.description ?? "",
    createdAt: body.createdAt ?? now,
    updatedAt: now,
    components: body.components ?? [],
    wires: body.wires ?? [],
  };
  saveCircuit(schema);
  return NextResponse.json(schema, { status: 201 });
}
