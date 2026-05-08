"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircuitSchema } from "@/types/circuit";
import { saveCircuit } from "@/lib/circuitsStorage";
import { v4 as uuidv4 } from "uuid";

export default function ImportPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<CircuitSchema | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("JSON 파일만 지원합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!json.components || !Array.isArray(json.components)) {
          setError("올바른 회로 설계도 JSON이 아닙니다.");
          return;
        }
        setError("");
        setPreview(json);
      } catch {
        setError("JSON 파싱에 실패했습니다.");
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = () => {
    if (!preview) return;
    setImporting(true);
    const now = new Date().toISOString();
    const schema: CircuitSchema = {
      ...preview,
      id: preview.id ?? uuidv4(),
      createdAt: preview.createdAt ?? now,
      updatedAt: now,
    };
    saveCircuit(schema);
    router.push(`/circuit/${schema.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 홈
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">설계도 가져오기</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
              dragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={onFileChange} />
            <div className="text-4xl mb-3">📂</div>
            <p className="text-gray-700 font-medium">JSON 파일을 여기에 드롭하세요</p>
            <p className="text-gray-400 text-sm mt-1">또는 클릭해서 파일 선택</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">설계도 미리보기</h2>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">이름</span>
                <p className="text-gray-900 mt-0.5">{preview.name || "(이름 없음)"}</p>
              </div>
              {preview.description && (
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">설명</span>
                  <p className="text-gray-900 mt-0.5">{preview.description}</p>
                </div>
              )}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">부품 수</span>
                <p className="text-gray-900 mt-0.5">{preview.components.length}개</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">연결선</span>
                <p className="text-gray-900 mt-0.5">{(preview.wires ?? []).length}개</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">부품 목록</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {preview.components.map((c) => (
                    <span key={c.id} className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700">
                      {c.label} ({c.type})
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                다시 선택
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-5 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {importing ? "가져오는 중..." : "가져오기"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
