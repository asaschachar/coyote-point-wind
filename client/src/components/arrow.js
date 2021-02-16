import React from "react";

export default function Arrow({ cx, cy, direction, wind, width, height }) {

  let w = width || '100%';
  let h = height || '100%';
  let color;
  if (wind < 10) { color = '#3895D3' } else
  if (wind < 20) { color = '#1261A0' } else
  if (wind < 30) { color = '#072F5F' } else
  { color = '#000' }

  return (
    <svg width={w} height={h}>
      <polygon fill={color} points={`${cx},${cy-7} ${cx-5},${cy+5} ${cx+5},${cy+5}`} transform={`rotate(${direction} ${cx} ${cy})`} />
    </svg>
  );
}
