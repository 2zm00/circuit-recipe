import Link from "next/link";
import RandomCircuitButton from "@/components/RandomCircuitButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm">
          회로 설계 도구
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Circuit Recipe
        </h1>
        <p className="text-lg text-slate-400 mb-12">
          드래그 앤 드롭으로 회로를 설계하고, JSON으로 저장하고, 공유하세요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/create"
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
              ✏️
            </div>
            <div>
              <div className="text-white font-semibold">설계도 만들기</div>
              <div className="text-slate-400 text-sm mt-1">새 회로를 설계합니다</div>
            </div>
          </Link>

          <Link
            href="/import"
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
              📂
            </div>
            <div>
              <div className="text-white font-semibold">설계도 넣기</div>
              <div className="text-slate-400 text-sm mt-1">JSON 파일을 불러옵니다</div>
            </div>
          </Link>

          <Link
            href="/gallery"
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <div className="text-white font-semibold">설계도 보기</div>
              <div className="text-slate-400 text-sm mt-1">저장된 설계도 목록</div>
            </div>
          </Link>
        </div>

        <div className="mt-6">
          <RandomCircuitButton />
        </div>
      </div>
    </main>
  );
}
