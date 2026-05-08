"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  type ReactFlowInstance,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { ComponentType, COMPONENT_META, CircuitSchema } from "@/types/circuit";
import { saveCircuit, getCircuit } from "@/lib/circuitsStorage";
import CircuitNode, { CircuitNodeData } from "./nodes/CircuitNode";
import AnimatedFlowEdge from "./AnimatedFlowEdge";
import ComponentInventory from "./ComponentInventory";
import PowerPanel from "./PowerPanel";

const nodeTypes = { circuitNode: CircuitNode };
const edgeTypes = { animatedFlow: AnimatedFlowEdge };

interface Props {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  circuitId?: string;
  circuitName?: string;
  circuitDescription?: string;
  readOnly?: boolean;
}

export default function CircuitDesigner({
  initialNodes = [],
  initialEdges = [],
  circuitId,
  circuitName: initName = "",
  circuitDescription: initDesc = "",
  readOnly = false,
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [name, setName] = useState(initName || "새 설계도");
  const [description, setDescription] = useState(initDesc || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editLabel, setEditLabel] = useState<{ id: string; label: string; value: string } | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, id: uuidv4() }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!rfInstance || !reactFlowWrapper.current) return;
      const type = e.dataTransfer.getData("application/circuit-component") as ComponentType;
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const meta = COMPONENT_META[type];
      const counter = nodes.filter((n) => (n.data as CircuitNodeData).type === type).length + 1;
      const prefixMap: Record<ComponentType, string> = {
        resistor: "R", capacitor: "C", led: "LED", battery: "V",
        switch: "S", ground: "GND", transistor_npn: "Q", transistor_pnp: "Q",
        inductor: "L", diode: "D",
      };
      const label = `${prefixMap[type]}${counter}`;

      const newNode: Node = {
        id: uuidv4(),
        type: "circuitNode",
        position,
        data: { type, label, value: "" } satisfies CircuitNodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [rfInstance, nodes, setNodes]
  );

  const handleAddComponent = useCallback(
    (type: ComponentType) => {
      if (!rfInstance || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      // 화면 중앙 기준, 겹치지 않도록 약간의 랜덤 오프셋 추가
      const jitter = () => (Math.random() - 0.5) * 120;
      const position = rfInstance.screenToFlowPosition({
        x: bounds.width / 2 + jitter(),
        y: bounds.height / 2 + jitter(),
      });
      const prefixMap: Record<ComponentType, string> = {
        resistor: "R", capacitor: "C", led: "LED", battery: "V",
        switch: "S", ground: "GND", transistor_npn: "Q", transistor_pnp: "Q",
        inductor: "L", diode: "D",
      };
      const counter = nodes.filter((n) => (n.data as CircuitNodeData).type === type).length + 1;
      const label = `${prefixMap[type]}${counter}`;
      const newNode: Node = {
        id: uuidv4(),
        type: "circuitNode",
        position,
        data: { type, label, value: "" } satisfies CircuitNodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [rfInstance, reactFlowWrapper, nodes, setNodes]
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      const d = node.data as CircuitNodeData;
      setEditLabel({ id: node.id, label: d.label, value: d.value ?? "" });
    },
    [readOnly]
  );

  const applyLabelEdit = () => {
    if (!editLabel) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === editLabel.id
          ? { ...n, data: { ...n.data, label: editLabel.label, value: editLabel.value } }
          : n
      )
    );
    setEditLabel(null);
  };

  const handleSave = () => {
    if (!rfInstance) return;
    setSaving(true);
    const flow = rfInstance.toObject();
    const components = flow.nodes.map((n) => {
      const d = n.data as CircuitNodeData;
      return { id: n.id, type: d.type, label: d.label, value: d.value, position: n.position };
    });
    const wires = flow.edges.map((e) => ({
      id: e.id,
      source: e.source,
      sourceHandle: e.sourceHandle ?? null,
      target: e.target,
      targetHandle: e.targetHandle ?? null,
    }));
    const now = new Date().toISOString();
    const id = circuitId ?? uuidv4();
    const existing = circuitId ? getCircuit(circuitId) : null;
    const schema: CircuitSchema = {
      id, name, description, components, wires,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    saveCircuit(schema);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    if (!rfInstance) return;
    const flow = rfInstance.toObject();
    const components = flow.nodes.map((n) => {
      const d = n.data as CircuitNodeData;
      return { id: n.id, type: d.type, label: d.label, value: d.value, position: n.position };
    });
    const wires = flow.edges.map((e) => ({
      id: e.id, source: e.source, sourceHandle: e.sourceHandle ?? null,
      target: e.target, targetHandle: e.targetHandle ?? null,
    }));
    const json = JSON.stringify({ name, description, components, wires }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full">
      {!readOnly && (
        <ComponentInventory
          isOpen={inventoryOpen}
          onToggle={() => setInventoryOpen((o) => !o)}
          onAdd={handleAddComponent}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white">
            <input
              className="flex-1 min-w-[120px] text-sm font-semibold border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="설계도 이름"
            />
            <input
              className="flex-1 min-w-[120px] text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 hidden sm:block"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명 (선택)"
            />
            <button
              onClick={handleExport}
              className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">JSON 내보내기</span>
              <span className="sm:hidden">내보내기</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-60`}
            >
              {saving ? "저장 중..." : saved ? "저장됨 ✓" : "저장"}
            </button>
          </div>
        )}

        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={readOnly ? undefined : onNodesChange}
            onEdgesChange={readOnly ? undefined : onEdgesChange}
            onConnect={readOnly ? undefined : onConnect}
            onInit={setRfInstance}
            onDrop={readOnly ? undefined : onDrop}
            onDragOver={readOnly ? undefined : onDragOver}
            onNodeDoubleClick={readOnly ? undefined : onNodeDoubleClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
            panOnScroll
            panOnScrollSpeed={0.8}
            zoomOnPinch
            zoomOnScroll={false}
            defaultEdgeOptions={{ type: "animatedFlow" }}
            fitView
            className="bg-gray-50"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
            <Controls />
            <MiniMap nodeColor={(n) => COMPONENT_META[(n.data as CircuitNodeData)?.type]?.color ?? "#ccc"} />
            {readOnly && (
              <Panel position="top-right">
                <div className="bg-white rounded px-3 py-1.5 text-sm text-gray-500 border border-gray-200 shadow-sm">
                  읽기 전용
                </div>
              </Panel>
            )}
            <PowerPanel />
          </ReactFlow>
        </div>
      </div>

      {editLabel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setEditLabel(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">부품 편집</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">레이블</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={editLabel.label}
                  onChange={(e) => setEditLabel({ ...editLabel, label: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">값 (예: 10kΩ, 100μF)</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={editLabel.value}
                  onChange={(e) => setEditLabel({ ...editLabel, value: e.target.value })}
                  placeholder="선택 입력"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditLabel(null)} className="flex-1 py-2 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                취소
              </button>
              <button onClick={applyLabelEdit} className="flex-1 py-2 rounded bg-blue-600 text-sm text-white hover:bg-blue-700">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
