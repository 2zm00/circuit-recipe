"use client";

import { ComponentType, COMPONENT_META } from "@/types/circuit";
import {
  ResistorSymbol,
  CapacitorSymbol,
  LEDSymbol,
  BatterySymbol,
  SwitchSymbol,
  GroundSymbol,
  NpnTransistorSymbol,
  PnpTransistorSymbol,
  InductorSymbol,
  DiodeSymbol,
} from "./nodes/symbols";

const SYMBOL_PREVIEW: Record<ComponentType, React.FC> = {
  resistor: ResistorSymbol,
  capacitor: CapacitorSymbol,
  led: LEDSymbol,
  battery: BatterySymbol,
  switch: SwitchSymbol,
  ground: GroundSymbol,
  transistor_npn: NpnTransistorSymbol,
  transistor_pnp: PnpTransistorSymbol,
  inductor: InductorSymbol,
  diode: DiodeSymbol,
};

const COMPONENT_ORDER: ComponentType[] = [
  "resistor", "capacitor", "inductor", "diode", "led",
  "battery", "switch", "ground", "transistor_npn", "transistor_pnp",
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onAdd?: (type: ComponentType) => void;
}

export default function ComponentInventory({ isOpen, onToggle, onAdd }: Props) {
  const onDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData("application/circuit-component", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside
      className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-[width] duration-200 overflow-hidden ${
        isOpen ? "w-52" : "w-10"
      }`}
    >
      {/* 헤더 / 토글 버튼 */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 flex-shrink-0 h-12">
        {isOpen && (
          <div className="px-3 min-w-0">
            <h2 className="text-sm font-semibold text-gray-700 truncate">부품 목록</h2>
            <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">드래그 또는 탭으로 추가</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`flex items-center justify-center w-10 h-10 flex-shrink-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors ${
            !isOpen ? "mx-auto" : ""
          }`}
          title={isOpen ? "부품 목록 닫기" : "부품 목록 열기"}
        >
          {isOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* 부품 리스트 */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {COMPONENT_ORDER.map((type) => {
            const meta = COMPONENT_META[type];
            const Symbol = SYMBOL_PREVIEW[type];
            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                onClick={() => onAdd?.(type)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 active:bg-blue-50 active:border-blue-200 cursor-pointer transition-colors select-none touch-manipulation"
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center w-12 h-9 overflow-hidden"
                  style={{ color: meta.color }}
                >
                  <div className="scale-[0.65] origin-center">
                    <Symbol />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-800 truncate leading-tight">{meta.label}</div>
                  <div className="text-[10px] text-gray-400 truncate leading-tight">{meta.description}</div>
                </div>
                {/* 모바일 탭 힌트 */}
                <span className="flex-shrink-0 text-gray-300 text-base sm:hidden">+</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 닫힌 상태: 아이콘만 세로로 */}
      {!isOpen && (
        <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1">
          {COMPONENT_ORDER.map((type) => {
            const meta = COMPONENT_META[type];
            return (
              <div
                key={type}
                title={meta.label}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 cursor-default transition-colors"
                style={{ color: meta.color }}
              >
                <span className="text-[10px] font-bold">
                  {meta.label.replace(/[^A-Z가-힣]/g, "").slice(0, 2) || type.slice(0, 1).toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
