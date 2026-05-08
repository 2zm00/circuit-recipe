"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomPreset } from "@/lib/presetCircuits";
import { saveCircuit } from "@/lib/circuitsStorage";
import { v4 as uuidv4 } from "uuid";

const CIRCUIT_NAMES = [
  "전압 분배기 (테브난)",
  "두 메시 회로 (중첩 정리)",
  "세 노드 회로 (노드 전압법)",
  "휘트스톤 브리지",
  "래더 저항망",
  "π형 저항망 (노튼)",
];

export default function RandomCircuitButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    setLoading(true);
    const preset = getRandomPreset();
    setPreview(preset.name);

    const now = new Date().toISOString();
    const saved = saveCircuit({
      id: uuidv4(),
      name: preset.name,
      description: preset.description,
      components: preset.components,
      wires: preset.wires,
      createdAt: now,
      updatedAt: now,
    });
    router.push(`/create?id=${saved.id}`);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="group flex flex-col items-center gap-3 w-full px-6 py-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
          {loading ? (
            <span className="animate-spin inline-block">⚙️</span>
          ) : (
            "🎲"
          )}
        </div>
        <div>
          <div className="text-white font-semibold">여러 가지 회로</div>
          <div className="text-slate-400 text-sm mt-1">
            {loading && preview ? `생성 중: ${preview}` : "테브난·노튼 분석 예제를 무작위로 생성"}
          </div>
        </div>
      </button>

      <div className="flex flex-wrap justify-center gap-1.5 px-2">
        {CIRCUIT_NAMES.map((name) => (
          <span
            key={name}
            className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
