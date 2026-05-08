import { NextRequest, NextResponse } from "next/server";
import { getCircuit, saveCircuit, deleteCircuit } from "@/lib/circuits";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circuit = getCircuit(id);
  if (!circuit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(circuit);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = getCircuit(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
  saveCircuit(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteCircuit(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
