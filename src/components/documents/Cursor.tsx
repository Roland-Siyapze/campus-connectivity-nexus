
import React from "react";

interface CursorProps {
  x: number;
  y: number;
  label: string;
  color: string;
}

const Cursor: React.FC<CursorProps> = ({ x, y, label, color }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{ color: color }}
      >
        <svg
          width="24"
          height="36"
          viewBox="0 0 24 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={color}
          />
        </svg>
        <span
          className="px-2 py-1 rounded text-xs text-white -mt-1"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default Cursor;
