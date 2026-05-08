"use client";

import { EdgeProps, getSmoothStepPath, useNodes } from "@xyflow/react";
import { calcCurrent } from "@/lib/circuitCalc";

const DOT_COUNT = 3;

export default function AnimatedFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  selected,
}: EdgeProps) {
  const nodes = useNodes();
  const current = calcCurrent(nodes);

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const hasFlow = current !== null && Math.abs(current) > 1e-12;
  const reversed = hasFlow && current! < 0;

  // 전류 크기에 따라 속도 조절: I_mA 기준, 5mA → 1.5s, 1mA → 3s, 0.1mA → 8s
  const iMa = hasFlow ? Math.abs(current! * 1000) : 0;
  const dur = hasFlow ? Math.max(0.4, Math.min(8, 8 / iMa)) : 2;

  const strokeColor = selected ? "#3b82f6" : "#94a3b8";
  const strokeWidth = selected ? 2.5 : 1.5;

  return (
    <>
      <path
        id={`ep-${id}`}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="react-flow__edge-path"
        style={style}
        markerEnd={markerEnd}
      />

      {hasFlow &&
        Array.from({ length: DOT_COUNT }).map((_, i) => {
          const offset = i / DOT_COUNT;
          const begin = reversed
            ? `${-dur * (1 - offset)}s`
            : `${-dur * offset}s`;
          return (
            <circle key={i} r="4" fill="#3b82f6" opacity="0.85">
              <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={begin}
                keyPoints={reversed ? "1;0" : "0;1"}
                keyTimes="0;1"
                calcMode="linear"
                path={edgePath}
              />
            </circle>
          );
        })}
    </>
  );
}
