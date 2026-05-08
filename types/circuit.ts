export type ComponentType =
  | "resistor"
  | "capacitor"
  | "led"
  | "battery"
  | "switch"
  | "ground"
  | "transistor_npn"
  | "transistor_pnp"
  | "inductor"
  | "diode";

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  label: string;
  value?: string;
  position: { x: number; y: number };
}

export interface CircuitWire {
  id: string;
  source: string;
  sourceHandle: string | null;
  target: string;
  targetHandle: string | null;
}

export interface CircuitSchema {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  components: CircuitComponent[];
  wires: CircuitWire[];
}

export interface CircuitSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  componentCount: number;
}

export const COMPONENT_META: Record<
  ComponentType,
  { label: string; description: string; color: string }
> = {
  resistor: { label: "저항 (R)", description: "전류 제한", color: "#ef4444" },
  capacitor: { label: "커패시터 (C)", description: "전하 저장", color: "#3b82f6" },
  led: { label: "LED", description: "발광 다이오드", color: "#f59e0b" },
  battery: { label: "배터리 (V)", description: "전압 공급", color: "#10b981" },
  switch: { label: "스위치 (S)", description: "회로 개폐", color: "#8b5cf6" },
  ground: { label: "접지 (GND)", description: "기준 전위", color: "#6b7280" },
  transistor_npn: { label: "NPN 트랜지스터", description: "전류 증폭 (NPN)", color: "#ec4899" },
  transistor_pnp: { label: "PNP 트랜지스터", description: "전류 증폭 (PNP)", color: "#06b6d4" },
  inductor: { label: "인덕터 (L)", description: "자기 에너지 저장", color: "#84cc16" },
  diode: { label: "다이오드 (D)", description: "단방향 전류", color: "#f97316" },
};
