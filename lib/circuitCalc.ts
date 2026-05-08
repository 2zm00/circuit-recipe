import type { Node } from "@xyflow/react";
import type { CircuitNodeData } from "@/components/nodes/CircuitNode";

export function parseVoltage(val: string): number | null {
  const m = val.trim().match(/^(-?[\d.]+)\s*[Vv]?$/);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return isNaN(v) ? null : v;
}

export function parseResistance(val: string): number | null {
  const s = val.trim();
  const meg = s.match(/^([\d.]+)\s*M[Ωω]?$/i);
  if (meg) return parseFloat(meg[1]) * 1_000_000;
  const k = s.match(/^([\d.]+)\s*k[Ωω]?$/i);
  if (k) return parseFloat(k[1]) * 1_000;
  const o = s.match(/^([\d.]+)\s*[Ωω]?$/);
  if (o) return parseFloat(o[1]);
  return null;
}

export function calcCurrent(nodes: Node[]): number | null {
  const totalVoltage = nodes
    .filter((n) => (n.data as CircuitNodeData).type === "battery")
    .reduce((s, n) => {
      const v = parseVoltage((n.data as CircuitNodeData).value ?? "");
      return v !== null ? s + v : s;
    }, 0);

  const resistors = nodes.filter((n) => (n.data as CircuitNodeData).type === "resistor");
  const totalResistance = resistors.reduce((s, n) => {
    const r = parseResistance((n.data as CircuitNodeData).value ?? "");
    return r !== null ? s + r : s;
  }, 0);

  const hasBattery = nodes.some(
    (n) => (n.data as CircuitNodeData).type === "battery" &&
      parseVoltage((n.data as CircuitNodeData).value ?? "") !== null
  );
  const hasResistor = resistors.some(
    (n) => parseResistance((n.data as CircuitNodeData).value ?? "") !== null
  );

  if (!hasBattery || !hasResistor || totalResistance === 0) return null;
  return totalVoltage / totalResistance;
}

export function formatPower(w: number): string {
  if (Math.abs(w) >= 1) return `${w.toPrecision(3)} W`;
  if (Math.abs(w) >= 0.001) return `${(w * 1000).toPrecision(3)} mW`;
  return `${(w * 1_000_000).toPrecision(3)} μW`;
}

export function formatCurrent(a: number): string {
  if (Math.abs(a) >= 1) return `${a.toPrecision(3)} A`;
  if (Math.abs(a) >= 0.001) return `${(a * 1000).toPrecision(3)} mA`;
  return `${(a * 1_000_000).toPrecision(3)} μA`;
}

export function formatResistance(r: number): string {
  if (r >= 1_000_000) return `${r / 1_000_000}MΩ`;
  if (r >= 1000) return `${r / 1000}kΩ`;
  return `${r}Ω`;
}
