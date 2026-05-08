"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Node, Edge } from "@xyflow/react";
import { CircuitSchema, CircuitComponent, CircuitWire } from "@/types/circuit";
import { getCircuit } from "@/lib/circuitsStorage";
import type { CircuitNodeData } from "@/components/nodes/CircuitNode";

const CircuitDesigner = dynamic(() => import("@/components/CircuitDesigner"), { ssr: false });

function toFlowNodes(components: CircuitComponent[]): Node[] {
  return components.map((c) => ({
    id: c.id,
    type: "circuitNode",
    position: c.position,
    data: { type: c.type, label: c.label, value: c.value ?? "" } satisfies CircuitNodeData,
  }));
}

function toFlowEdges(wires: CircuitWire[]): Edge[] {
  return wires.map((w) => ({
    id: w.id,
    type: "animatedFlow",
    source: w.source,
    sourceHandle: w.sourceHandle,
    target: w.target,
    targetHandle: w.targetHandle,
  }));
}

function CreatePageInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
  const [meta, setMeta] = useState<{ id?: string; name?: string; description?: string }>({});
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    const schema = getCircuit(id);
    if (schema) {
      setInitialNodes(toFlowNodes(schema.components));
      setInitialEdges(toFlowEdges(schema.wires));
      setMeta({ id: schema.id, name: schema.name, description: schema.description });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
          ← 홈
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/gallery" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
          목록
        </Link>
        <div className="flex-1" />
        <span className="text-xs text-gray-400 hidden sm:block">더블클릭으로 레이블/값 편집</span>
      </header>
      <div className="flex-1 min-h-0">
        <CircuitDesigner
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          circuitId={meta.id}
          circuitName={meta.name}
          circuitDescription={meta.description}
        />
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-500">로딩 중...</div>}>
      <CreatePageInner />
    </Suspense>
  );
}
