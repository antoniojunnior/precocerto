import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}
    >
      <HelpCircle size={14} color="var(--text-secondary)" style={{ cursor: 'help' }} />
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--panel-border)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          width: 'max-content',
          maxWidth: '220px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          textAlign: 'center',
          lineHeight: '1.4',
          pointerEvents: 'none'
        }}>
          {text}
        </div>
      )}
    </div>
  );
}
