import React from "react";

export default function BigArrow({ direction, wind, width, height }) {

  let w = width || '100%';
  let h = height || '100%';
  let color = '#000';
  let cx = 0 + 20;
  let cy = 0 + 25;

  return (
    <svg width={w} height={h}>
      <polygon fill={color} points={`${cx},${cy-21} ${cx-15},${cy+15} ${cx+15},${cy+15}`} transform={`rotate(${direction} ${cx} ${cy})`} />
    </svg>
  );
}
