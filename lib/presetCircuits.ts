import { CircuitComponent, CircuitWire } from "@/types/circuit";

export type PresetCircuit = {
  name: string;
  description: string;
  components: CircuitComponent[];
  wires: CircuitWire[];
};

// ─── 1. 전압 분배기 + 부하 저항 (테브난 분석) ───────────────────────────
// V_th = Vs * R2/(R1+R2),  R_th = R1 ‖ R2
// 회로: Vs ─R1─(A)─R2─GND,  (A)─RL─GND
const voltageDivider: PresetCircuit = {
  name: "전압 분배기 + 부하 저항 (테브난)",
  description:
    "V1·R1·R2 분배기의 노드 A에서 테브난 등가 회로를 구하세요. Vth = V1·R2/(R1+R2), Rth = R1‖R2",
  components: [
    { id: "vs", type: "battery",  label: "V1",  value: "10V",  position: { x: 60,  y: 160 } },
    { id: "r1", type: "resistor", label: "R1",  value: "2kΩ",  position: { x: 230, y: 70  } },
    { id: "r2", type: "resistor", label: "R2",  value: "3kΩ",  position: { x: 440, y: 70  } },
    { id: "rl", type: "resistor", label: "RL",  value: "6kΩ",  position: { x: 650, y: 160 } },
    { id: "g1", type: "ground",   label: "GND1",               position: { x: 60,  y: 390 } },
    { id: "g2", type: "ground",   label: "GND2",               position: { x: 440, y: 390 } },
    { id: "g3", type: "ground",   label: "GND3",               position: { x: 650, y: 390 } },
  ],
  wires: [
    // Vs 하단(−) → R1 왼쪽 → R2 왼쪽 (노드 A 분기)
    { id: "w1", source: "vs", sourceHandle: "bottom", target: "r1", targetHandle: null },
    { id: "w2", source: "r1", sourceHandle: null,     target: "r2", targetHandle: null },
    // 노드 A에서 RL로도 분기 (R1 right → RL left)
    { id: "w3", source: "r1", sourceHandle: null,     target: "rl", targetHandle: null },
    // R2 오른쪽 → GND2 (R2 하단 경로)
    { id: "w4", source: "r2", sourceHandle: null,     target: "g2", targetHandle: "top" },
    // RL 오른쪽 → GND3
    { id: "w5", source: "rl", sourceHandle: null,     target: "g3", targetHandle: "top" },
    // Vs 상단(+) ← GND1 경로 (하단 공통 노드)
    { id: "w6", source: "g1", sourceHandle: "bottom", target: "vs", targetHandle: "top" },
  ],
};

// ─── 2. 두 루프 메시 해석 (테브난 / 중첩 정리) ──────────────────────────
// 루프1: V1─R1─R3, 루프2: V2─R2─R3 (R3 공유)
const twoMesh: PresetCircuit = {
  name: "두 메시 회로 (중첩 정리)",
  description:
    "V1·V2 두 전압원과 공유 저항 R3. 중첩 정리로 각 전원의 기여를 분리 분석하세요.",
  components: [
    { id: "v1", type: "battery",  label: "V1", value: "9V",   position: { x: 50,  y: 170 } },
    { id: "v2", type: "battery",  label: "V2", value: "6V",   position: { x: 600, y: 170 } },
    { id: "r1", type: "resistor", label: "R1", value: "3kΩ",  position: { x: 200, y: 80  } },
    { id: "r2", type: "resistor", label: "R2", value: "2kΩ",  position: { x: 430, y: 80  } },
    { id: "r3", type: "resistor", label: "R3", value: "6kΩ",  position: { x: 310, y: 300 } },
    { id: "g1", type: "ground",   label: "GND",               position: { x: 310, y: 440 } },
  ],
  wires: [
    // V1 bottom → R1 left → (node B, top rail)
    { id: "w1", source: "v1", sourceHandle: "bottom", target: "r1", targetHandle: null },
    // R1 right → R2 left (top rail 공유)
    { id: "w2", source: "r1", sourceHandle: null, target: "r2", targetHandle: null },
    // R2 right → V2 bottom
    { id: "w3", source: "r2", sourceHandle: null, target: "v2", targetHandle: "bottom" },
    // (node B = R1/R2 중간) → R3 left : R1 right도 R3로 연결
    { id: "w4", source: "r1", sourceHandle: null, target: "r3", targetHandle: null },
    // R3 right → GND
    { id: "w5", source: "r3", sourceHandle: null, target: "g1", targetHandle: "top" },
    // V1 top ← GND bottom (하단 공통 rail)
    { id: "w6", source: "g1", sourceHandle: "bottom", target: "v1", targetHandle: "top" },
    // V2 top ← GND bottom
    { id: "w7", source: "g1", sourceHandle: "bottom", target: "v2", targetHandle: "top" },
  ],
};

// ─── 3. 노드 전압법 (세 노드 회로) ──────────────────────────────────────
// 노드 A, B, GND.  V1─R1─A─R3─B─R5─GND, A─R2─GND, B─R4─GND
const nodeVoltage: PresetCircuit = {
  name: "세 노드 회로 (노드 전압법)",
  description:
    "V1을 제외한 노드 A·B에 KCL 적용. 테브난/노튼 등가 단자로 R5 양단을 활용하세요.",
  components: [
    { id: "v1", type: "battery",  label: "V1", value: "12V",  position: { x: 50,  y: 170 } },
    { id: "r1", type: "resistor", label: "R1", value: "1kΩ",  position: { x: 200, y: 80  } },
    { id: "r2", type: "resistor", label: "R2", value: "4kΩ",  position: { x: 340, y: 170 } },
    { id: "r3", type: "resistor", label: "R3", value: "2kΩ",  position: { x: 480, y: 80  } },
    { id: "r4", type: "resistor", label: "R4", value: "3kΩ",  position: { x: 630, y: 170 } },
    { id: "r5", type: "resistor", label: "R5", value: "5kΩ",  position: { x: 760, y: 80  } },
    { id: "g1", type: "ground",   label: "GND",               position: { x: 200, y: 390 } },
    { id: "g2", type: "ground",   label: "GND",               position: { x: 630, y: 390 } },
  ],
  wires: [
    // V1 bottom → R1 left → (node A)
    { id: "w1", source: "v1", sourceHandle: "bottom", target: "r1", targetHandle: null },
    // node A: R1 right → R2 left
    { id: "w2", source: "r1", sourceHandle: null, target: "r2", targetHandle: null },
    // R2 right → GND1
    { id: "w3", source: "r2", sourceHandle: null, target: "g1", targetHandle: "top" },
    // node A: R1 right → R3 left
    { id: "w4", source: "r1", sourceHandle: null, target: "r3", targetHandle: null },
    // R3 right → (node B): R4 left
    { id: "w5", source: "r3", sourceHandle: null, target: "r4", targetHandle: null },
    // R4 right → GND2
    { id: "w6", source: "r4", sourceHandle: null, target: "g2", targetHandle: "top" },
    // node B: R3 right → R5 left
    { id: "w7", source: "r3", sourceHandle: null, target: "r5", targetHandle: null },
    // V1 top ← GND1 bottom
    { id: "w8", source: "g1", sourceHandle: "bottom", target: "v1", targetHandle: "top" },
  ],
};

// ─── 4. 휘트스톤 브리지 ────────────────────────────────────────────────
// 상단: R1·R2, 하단: R3·R4, 브리지 암: R5 (검류계 대체)
const wheatstone: PresetCircuit = {
  name: "휘트스톤 브리지",
  description:
    "R1/R3 = R2/R4 이면 R5에 전류 없음(균형). R5 단자를 테브난 등가로 분석하세요.",
  components: [
    { id: "vs", type: "battery",  label: "Vs",  value: "5V",  position: { x: 60,  y: 200 } },
    { id: "r1", type: "resistor", label: "R1",  value: "1kΩ", position: { x: 230, y: 80  } },
    { id: "r2", type: "resistor", label: "R2",  value: "2kΩ", position: { x: 450, y: 80  } },
    { id: "r3", type: "resistor", label: "R3",  value: "3kΩ", position: { x: 230, y: 340 } },
    { id: "r4", type: "resistor", label: "R4",  value: "6kΩ", position: { x: 450, y: 340 } },
    { id: "r5", type: "resistor", label: "R5",  value: "1kΩ", position: { x: 340, y: 210 } },
    { id: "g1", type: "ground",   label: "GND",               position: { x: 660, y: 380 } },
  ],
  wires: [
    // Vs bottom → R1 left (상단 좌)
    { id: "w1", source: "vs", sourceHandle: "bottom", target: "r1", targetHandle: null },
    // Vs bottom → R3 left (하단 좌)
    { id: "w2", source: "vs", sourceHandle: "bottom", target: "r3", targetHandle: null },
    // R1 right → R2 left
    { id: "w3", source: "r1", sourceHandle: null, target: "r2", targetHandle: null },
    // R3 right → R4 left
    { id: "w4", source: "r3", sourceHandle: null, target: "r4", targetHandle: null },
    // 브리지 암: R1 right → R5 left (mid-top → R5)
    { id: "w5", source: "r1", sourceHandle: null, target: "r5", targetHandle: null },
    // R5 right → R4 left (R5 → mid-bottom)
    { id: "w6", source: "r5", sourceHandle: null, target: "r4", targetHandle: null },
    // R2 right → GND
    { id: "w7", source: "r2", sourceHandle: null, target: "g1", targetHandle: "top" },
    // R4 right → GND
    { id: "w8", source: "r4", sourceHandle: null, target: "g1", targetHandle: "top" },
    // Vs top ← GND bottom
    { id: "w9", source: "g1", sourceHandle: "bottom", target: "vs", targetHandle: "top" },
  ],
};

// ─── 5. 래더 저항망 (테브난 단계적 축소) ────────────────────────────────
// Vs─R1─┬─R3─┬─R5─GND
//       R2    R4
//       │     │
//      GND   GND
const ladder: PresetCircuit = {
  name: "래더(사다리) 저항망 (단계적 테브난 축소)",
  description:
    "오른쪽부터 순서대로 테브난 등가로 축소해 나가는 래더 네트워크.",
  components: [
    { id: "vs", type: "battery",  label: "Vs",  value: "18V",  position: { x: 50,  y: 190 } },
    { id: "r1", type: "resistor", label: "R1",  value: "1kΩ",  position: { x: 200, y: 80  } },
    { id: "r2", type: "resistor", label: "R2",  value: "6kΩ",  position: { x: 340, y: 190 } },
    { id: "r3", type: "resistor", label: "R3",  value: "2kΩ",  position: { x: 490, y: 80  } },
    { id: "r4", type: "resistor", label: "R4",  value: "3kΩ",  position: { x: 640, y: 190 } },
    { id: "r5", type: "resistor", label: "R5",  value: "4kΩ",  position: { x: 790, y: 80  } },
    { id: "g1", type: "ground",   label: "GND",                position: { x: 50,  y: 420 } },
    { id: "g2", type: "ground",   label: "GND",                position: { x: 340, y: 420 } },
    { id: "g3", type: "ground",   label: "GND",                position: { x: 640, y: 420 } },
  ],
  wires: [
    // Vs bottom → R1 left
    { id: "w1", source: "vs", sourceHandle: "bottom", target: "r1", targetHandle: null },
    // R1 right → R2 left (분기 노드 A)
    { id: "w2", source: "r1", sourceHandle: null, target: "r2", targetHandle: null },
    // R2 right → GND2
    { id: "w3", source: "r2", sourceHandle: null, target: "g2", targetHandle: "top" },
    // 노드 A: R1 right → R3 left
    { id: "w4", source: "r1", sourceHandle: null, target: "r3", targetHandle: null },
    // R3 right → R4 left (분기 노드 B)
    { id: "w5", source: "r3", sourceHandle: null, target: "r4", targetHandle: null },
    // R4 right → GND3
    { id: "w6", source: "r4", sourceHandle: null, target: "g3", targetHandle: "top" },
    // 노드 B: R3 right → R5 left
    { id: "w7", source: "r3", sourceHandle: null, target: "r5", targetHandle: null },
    // R5 right → GND3
    { id: "w8", source: "r5", sourceHandle: null, target: "g3", targetHandle: "top" },
    // Vs top ← GND1 bottom
    { id: "w9", source: "g1", sourceHandle: "bottom", target: "vs", targetHandle: "top" },
    // GND1 ← GND2 bottom (공통 접지 rail)
    { id: "wa", source: "g2", sourceHandle: "bottom", target: "g1", targetHandle: "top" },
  ],
};

// ─── 6. π형(파이형) 저항망 (노튼 등가 분석) ────────────────────────────
// V1─R1─(A)─R3─(B)─GND
//          R2(A~GND)     R4(B~GND)
const piNetwork: PresetCircuit = {
  name: "π형 저항망 (노튼 등가 분석)",
  description:
    "노드 A·B 간 테브난/노튼 등가를 구하기 좋은 π형 네트워크. R3이 직렬, R2·R4가 각 노드의 션트 저항입니다.",
  components: [
    { id: "vs", type: "battery",  label: "Vs",  value: "15V",  position: { x: 50,  y: 190 } },
    { id: "r1", type: "resistor", label: "R1",  value: "2kΩ",  position: { x: 200, y: 80  } },
    { id: "r2", type: "resistor", label: "R2",  value: "6kΩ",  position: { x: 360, y: 190 } },
    { id: "r3", type: "resistor", label: "R3",  value: "1kΩ",  position: { x: 510, y: 80  } },
    { id: "r4", type: "resistor", label: "R4",  value: "4kΩ",  position: { x: 680, y: 190 } },
    { id: "g1", type: "ground",   label: "GND",                position: { x: 50,  y: 420 } },
    { id: "g2", type: "ground",   label: "GND",                position: { x: 360, y: 420 } },
    { id: "g3", type: "ground",   label: "GND",                position: { x: 680, y: 420 } },
  ],
  wires: [
    // Vs bottom → R1 left
    { id: "w1", source: "vs", sourceHandle: "bottom", target: "r1", targetHandle: null },
    // R1 right → R2 left (노드 A 분기)
    { id: "w2", source: "r1", sourceHandle: null, target: "r2", targetHandle: null },
    // R2 right → GND2 (션트)
    { id: "w3", source: "r2", sourceHandle: null, target: "g2", targetHandle: "top" },
    // 노드 A: R1 right → R3 left (직렬)
    { id: "w4", source: "r1", sourceHandle: null, target: "r3", targetHandle: null },
    // R3 right → R4 left (노드 B 분기)
    { id: "w5", source: "r3", sourceHandle: null, target: "r4", targetHandle: null },
    // R4 right → GND3 (션트)
    { id: "w6", source: "r4", sourceHandle: null, target: "g3", targetHandle: "top" },
    // Vs top ← GND1
    { id: "w7", source: "g1", sourceHandle: "bottom", target: "vs", targetHandle: "top" },
    // 공통 접지 연결
    { id: "w8", source: "g2", sourceHandle: "bottom", target: "g1", targetHandle: "top" },
    { id: "w9", source: "g3", sourceHandle: "bottom", target: "g1", targetHandle: "top" },
  ],
};

export const PRESET_CIRCUITS: PresetCircuit[] = [
  voltageDivider,
  twoMesh,
  nodeVoltage,
  wheatstone,
  ladder,
  piNetwork,
];

export function getRandomPreset(): PresetCircuit {
  return PRESET_CIRCUITS[Math.floor(Math.random() * PRESET_CIRCUITS.length)];
}
