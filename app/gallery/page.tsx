"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CircuitCard from "@/components/CircuitCard";
import { CircuitSummary } from "@/types/circuit";

export default function GalleryPage() {
  const [circuits, setCircuits] = useState<CircuitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCircuits = () => {
    fetch("/api/circuits")
      .then((r) => r.json())
      .then((data) => { setCircuits(data); setLoading(false); });
  };

  useEffect(() => { loadCircuits(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("이 설계도를 삭제하시겠습니까?")) return;
    await fetch(`/api/circuits/${id}`, { method: "DELETE" });
    loadCircuits();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              ← 홈
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900">회로 설계도 목록</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/import"
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              JSON 가져오기
            </Link>
            <Link
              href="/create"
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              새 설계도 만들기
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-24 text-gray-400">불러오는 중...</div>
        ) : circuits.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">저장된 설계도가 없습니다</h2>
            <p className="text-gray-400 mb-6">새 회로를 설계하거나 JSON 파일을 가져오세요.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/create"
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                설계도 만들기
              </Link>
              <Link
                href="/import"
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                JSON 가져오기
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{circuits.length}개의 설계도</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {circuits.map((circuit) => (
                <CircuitCard key={circuit.id} circuit={circuit} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
