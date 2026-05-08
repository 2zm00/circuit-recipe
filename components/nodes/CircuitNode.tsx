"use client";

import { useCallback } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
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
} from "./symbols";

const SYMBOL_MAP: Record<ComponentType, React.FC> = {
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

export type CircuitNodeData = {
  type: ComponentType;
  label: string;
  value?: string;
  readOnly?: boolean;
};

const VERTICAL_COMPONENTS: ComponentType[] = ["battery", "ground", "transistor_npn", "transistor_pnp"];
const INLINE_VALUE_COMPONENTS: ComponentType[] = ["resistor", "battery", "capacitor", "inductor"];

export default function CircuitNode({ id, data, selected }: NodeProps) {
  const nodeData = data as CircuitNodeData;
  const Symbol = SYMBOL_MAP[nodeData.type];
  const meta = COMPONENT_META[nodeData.type];
  const isVertical = VERTICAL_COMPONENTS.includes(nodeData.type);
  const hasInlineValue = INLINE_VALUE_COMPONENTS.includes(nodeData.type);
  const { updateNodeData } = useReactFlow();

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { value: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className={`relative flex flex-col items-center px-3 py-2 rounded-lg border-2 bg-white shadow-sm select-none min-w-[90px] ${
        selected ? "border-blue-500 shadow-blue-200 shadow-md" : "border-gray-300"
      }`}
    >
      {!nodeData.readOnly && (
        <>
          {isVertical ? (
            <>
              <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
            </>
          ) : (
            <>
              <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
              <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
              <Handle
                type="target"
                position={Position.Top}
                id="top"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
              />
            </>
          )}
        </>
      )}

      <div style={{ color: meta.color }}>
        <Symbol />
      </div>

      <div className="mt-1 text-center w-full">
        <div className="text-xs font-semibold text-gray-800 leading-tight">{nodeData.label}</div>
        {hasInlineValue && !nodeData.readOnly ? (
          <input
            value={nodeData.value ?? ""}
            onChange={onValueChange}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            placeholder={nodeData.type === "battery" ? "예: 5V" : "예: 10kΩ"}
            className="mt-0.5 w-full text-xs text-center text-gray-600 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400 focus:bg-white"
          />
        ) : (
          nodeData.value && (
            <div className="text-xs text-gray-500 leading-tight">{nodeData.value}</div>
          )
        )}
      </div>
    </div>
  );
}
