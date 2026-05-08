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
  "resistor",
  "capacitor",
  "inductor",
  "diode",
  "led",
  "battery",
  "switch",
  "ground",
  "transistor_npn",
  "transistor_pnp",
];

export default function ComponentInventory() {
  const onDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData("application/circuit-component", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">부품 목록</h2>
        <p className="text-xs text-gray-400 mt-0.5">캔버스로 드래그하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {COMPONENT_ORDER.map((type) => {
          const meta = COMPONENT_META[type];
          const Symbol = SYMBOL_PREVIEW[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors group"
            >
              <div
                className="flex-shrink-0 flex items-center justify-center w-14 h-10 overflow-hidden"
                style={{ color: meta.color }}
              >
                <div className="scale-75 origin-center">
                  <Symbol />
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-800 truncate">{meta.label}</div>
                <div className="text-xs text-gray-400 truncate">{meta.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
