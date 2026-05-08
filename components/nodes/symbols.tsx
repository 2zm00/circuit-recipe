"use client";

export function ResistorSymbol() {
  return (
    <svg viewBox="0 0 80 30" width="80" height="30">
      <line x1="0" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
      <rect x="15" y="7" width="50" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="15" x2="80" y2="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CapacitorSymbol() {
  return (
    <svg viewBox="0 0 60 40" width="60" height="40">
      <line x1="0" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="5" x2="25" y2="35" stroke="currentColor" strokeWidth="3" />
      <line x1="35" y1="5" x2="35" y2="35" stroke="currentColor" strokeWidth="3" />
      <line x1="35" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function LEDSymbol() {
  return (
    <svg viewBox="0 0 70 40" width="70" height="40">
      <line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" />
      <polygon points="15,8 15,32 38,20" fill="currentColor" />
      <line x1="38" y1="8" x2="38" y2="32" stroke="currentColor" strokeWidth="2" />
      <line x1="38" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="42" y1="8" x2="52" y2="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="52" y1="2" x2="48" y2="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="52" y1="2" x2="52" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="47" y1="12" x2="57" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="57" y1="6" x2="53" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="57" y1="6" x2="57" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BatterySymbol() {
  return (
    <svg viewBox="0 0 40 80" width="40" height="80">
      {/* 상단 (+) 단자 */}
      <line x1="20" y1="0" x2="20" y2="22" stroke="currentColor" strokeWidth="2" />
      {/* 긴 선 = 양극 (+) */}
      <line x1="5" y1="22" x2="35" y2="22" stroke="currentColor" strokeWidth="2.5" />
      {/* 짧은 선 = 음극 (-) */}
      <line x1="12" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="2.5" />
      {/* 긴 선 = 양극 (+) */}
      <line x1="5" y1="45" x2="35" y2="45" stroke="currentColor" strokeWidth="2.5" />
      {/* 짧은 선 = 음극 (-) */}
      <line x1="12" y1="55" x2="28" y2="55" stroke="currentColor" strokeWidth="2.5" />
      {/* 하단 (-) 단자 */}
      <line x1="20" y1="55" x2="20" y2="80" stroke="currentColor" strokeWidth="2" />
      {/* + 레이블 */}
      <text x="29" y="21" fontSize="9" fontWeight="bold" fill="currentColor">+</text>
      {/* - 레이블 */}
      <text x="30" y="57" fontSize="10" fontWeight="bold" fill="currentColor">−</text>
    </svg>
  );
}

export function SwitchSymbol() {
  return (
    <svg viewBox="0 0 70 40" width="70" height="40">
      <line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="20" r="3" fill="currentColor" />
      <line x1="18" y1="20" x2="52" y2="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="55" cy="20" r="3" fill="currentColor" />
      <line x1="55" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function GroundSymbol() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <line x1="20" y1="0" x2="20" y2="15" stroke="currentColor" strokeWidth="2" />
      <line x1="5" y1="15" x2="35" y2="15" stroke="currentColor" strokeWidth="2.5" />
      <line x1="10" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="29" x2="25" y2="29" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function NpnTransistorSymbol() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <line x1="0" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="15" x2="25" y2="45" stroke="currentColor" strokeWidth="3" />
      <line x1="25" y1="22" x2="50" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="38" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
      <polygon points="40,44 50,50 44,40" fill="currentColor" />
      <line x1="50" y1="10" x2="50" y2="0" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function PnpTransistorSymbol() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <line x1="0" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="15" x2="25" y2="45" stroke="currentColor" strokeWidth="3" />
      <line x1="25" y1="22" x2="50" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="38" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
      <polygon points="25,22 31,28 35,20" fill="currentColor" />
      <line x1="50" y1="10" x2="50" y2="0" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function InductorSymbol() {
  return (
    <svg viewBox="0 0 80 30" width="80" height="30">
      <line x1="0" y1="15" x2="10" y2="15" stroke="currentColor" strokeWidth="2" />
      <path d="M10,15 Q15,5 20,15 Q25,5 30,15 Q35,5 40,15 Q45,5 50,15 Q55,5 60,15 Q65,5 70,15" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="70" y1="15" x2="80" y2="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function DiodeSymbol() {
  return (
    <svg viewBox="0 0 70 40" width="70" height="40">
      <line x1="0" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" />
      <polygon points="15,8 15,32 40,20" fill="currentColor" />
      <line x1="40" y1="8" x2="40" y2="32" stroke="currentColor" strokeWidth="2.5" />
      <line x1="40" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
