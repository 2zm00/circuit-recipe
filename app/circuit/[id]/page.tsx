"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    data: { type: c.type, label: c.label, value: c.value ?? "", readOnly: true } satisfies CircuitNodeData,
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function CircuitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [circuit, setCircuit] = useState<CircuitSchema | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const schema = getCircuit(id);
    if (schema) {
      setCircuit(schema);
      setNodes(toFlowNodes(schema.components));
      setEdges(toFlowEdges(schema.wires));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">불러오는 중...</div>;
  }

  if (!circuit) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <p className="text-lg mb-4">설계도를 찾을 수 없습니다.</p>
        <Link href="/gallery" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <Link href="/gallery" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
          ← 목록
        </Link>
        <span className="text-gray-300">|</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{circuit.name}</h1>
          {circuit.description && (
            <p className="text-xs text-gray-500 truncate hidden sm:block">{circuit.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <span className="text-xs text-gray-400 hidden md:block">
            {formatDate(circuit.updatedAt)} 업데이트
          </span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 whitespace-nowrap">
            {circuit.components.length}개 부품
          </span>
          <Link
            href={`/create?id=${circuit.id}`}
            className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            편집하기
          </Link>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <CircuitDesigner
          initialNodes={nodes}
          initialEdges={edges}
          readOnly
        />
      </div>
    </div>
  );
}
