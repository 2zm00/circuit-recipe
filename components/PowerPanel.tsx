"use client";

import { useNodes } from "@xyflow/react";
import { CircuitNodeData } from "./nodes/CircuitNode";
import {
  parseVoltage,
  parseResistance,
  calcCurrent,
  formatPower,
  formatCurrent,
  formatResistance,
} from "@/lib/circuitCalc";

export default function PowerPanel() {
  const nodes = useNodes();

  const batteries = nodes
    .filter((n) => (n.data as CircuitNodeData).type === "battery")
    .map((n) => {
      const d = n.data as CircuitNodeData;
      return { label: d.label, voltage: parseVoltage(d.value ?? "") };
    })
    .filter((b) => b.voltage !== null) as { label: string; voltage: number }[];

  const resistors = nodes
    .filter((n) => (n.data as CircuitNodeData).type === "resistor")
    .map((n) => {
      const d = n.data as CircuitNodeData;
      return { label: d.label, resistance: parseResistance(d.value ?? "") };
    })
    .filter((r) => r.resistance !== null) as { label: string; resistance: number }[];

  if (batteries.length === 0 && resistors.length === 0) return null;

  const hasEnough = batteries.length > 0 && resistors.length > 0;

  const current = calcCurrent(nodes);
  const totalResistance = resistors.reduce((s, r) => s + r.resistance, 0);
  const totalConsumedPower = current !== null ? current * current * totalResistance : null;

  return (
    <div className="absolute bottom-4 left-4 z-10 w-72 bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">전력 분석</span>
        {current !== null && (
          <span className="ml-auto text-xs text-gray-500">
            I = {formatCurrent(current)}
          </span>
        )}
      </div>

      <div className="px-4 py-3 space-y-2">
        {batteries.map((b) => {
          // PSC: P_i = V_i × I
          // P > 0 → 전력 공급, P < 0 → 전력 흡수(소비, 역방향 전압원)
          const p = current !== null ? b.voltage * current : null;
          const isSupplying = p !== null && p > 0;
          const isConsuming = p !== null && p < 0;

          return (
            <div key={b.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${isSupplying ? "bg-emerald-400" : isConsuming ? "bg-red-400" : "bg-gray-300"}`} />
                <span className="text-xs font-medium text-gray-800">{b.label}</span>
                <span className="text-xs text-gray-400">{b.voltage}V</span>
              </div>
              <div className="flex items-center gap-1.5">
                {p !== null ? (
                  <>
                    <span className={`text-xs font-semibold ${isSupplying ? "text-emerald-600" : "text-red-600"}`}>
                      {formatPower(Math.abs(p))}
                    </span>
                    {isSupplying ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">공급</span>
                    ) : (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-medium">소비</span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-400">저항값 필요</span>
                )}
              </div>
            </div>
          );
        })}

        {resistors.map((r) => {
          // 저항은 항상 소비: P = I² × R (항상 양수)
          const p = current !== null ? current * current * r.resistance : null;
          return (
            <div key={r.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-gray-800">{r.label}</span>
                <span className="text-xs text-gray-400">{formatResistance(r.resistance)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {p !== null ? (
                  <>
                    <span className="text-xs font-semibold text-red-600">{formatPower(p)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-medium">소비</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">전압값 필요</span>
                )}
              </div>
            </div>
          );
        })}

        {batteries.length > 0 && resistors.length === 0 && (
          <p className="text-xs text-gray-400">저항 값을 입력하면 전력을 계산합니다.</p>
        )}
        {resistors.length > 0 && batteries.length === 0 && (
          <p className="text-xs text-gray-400">전압원 값을 입력하면 전력을 계산합니다.</p>
        )}
      </div>

      {totalConsumedPower !== null && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <span className="text-xs text-blue-700 font-medium">총 소비 전력</span>
          <span className="text-xs font-bold text-blue-800">{formatPower(totalConsumedPower)}</span>
        </div>
      )}
    </div>
  );
}
