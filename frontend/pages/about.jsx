import React, { useState, useEffect } from 'react';

export default function UltraHeavyComponent() {
  const [count, setCount] = useState(0);
  const [grid, setGrid] = useState([]);

  // Generate a big nested grid
  useEffect(() => {
    const rows = 100;
    const cols = 50;
    const newGrid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          id: `${r}-${c}`,
          value: Math.random().toString(36).slice(2, 7),
          color: `hsl(${Math.random() * 360}, 70%, 85%)`
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Ultra Heavy Component</h1>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4081',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Clicked {count} times
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {grid.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '5px' }}>
            {row.map(cell => (
              <div
                key={cell.id}
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: cell.color,
                  borderRadius: '2px',
                  fontSize: '8px',
                  textAlign: 'center',
                  lineHeight: '12px'
                }}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
