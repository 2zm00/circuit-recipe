"use client";

import Link from "next/link";
import { CircuitSummary, COMPONENT_META } from "@/types/circuit";

interface Props {
  circuit: CircuitSummary;
  onDelete?: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function CircuitCard({ circuit, onDelete }: Props) {
  const colors = Object.values(COMPONENT_META)
    .map((m) => m.color)
    .slice(0, 5);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/circuit/${circuit.id}`} className="block">
        <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="flex gap-1 flex-wrap justify-center px-4">
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-4 rounded opacity-70"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-0.5 text-xs text-gray-500">
            {circuit.componentCount}개 부품
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/circuit/${circuit.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {circuit.name}
          </h3>
        </Link>
        {circuit.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{circuit.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{formatDate(circuit.updatedAt)}</span>
          <div className="flex gap-2">
            <Link
              href={`/create?id=${circuit.id}`}
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              편집
            </Link>
            {onDelete && (
              <button
                onClick={(e) => { e.preventDefault(); onDelete(circuit.id); }}
                className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
