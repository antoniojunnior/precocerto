import React, { useState, useEffect } from 'react';
import { calculateProductMetrics } from '../lib/data';

export default function PriceSimulator({ products }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.id || '');
  const [simulatedPrice, setSimulatedPrice] = useState(0);

  const selectedProduct = products.find(p => p.id === selectedSku);

  useEffect(() => {
    if (selectedProduct) {
      setSimulatedPrice(selectedProduct.sellPrice);
    }
  }, [selectedSku, products]);

  if (!selectedProduct) return null;

  // Simulate metrics with new price
  const simulatedProduct = calculateProductMetrics({
    ...selectedProduct,
    sellPrice: Number(simulatedPrice)
  });

  const isLosingMoney = simulatedProduct.contributionMarginValue < 0;

  return (
    <div className="glass-panel">
      <div className="glass-header">
        <h2>Simulador de Preços</h2>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Ajuste o preço de venda para observar o impacto imediato na Margem de Contribuição.
      </p>

      <div className="input-group">
        <label>Selecione o Produto:</label>
        <select 
          className="simulator-input"
          value={selectedSku} 
          onChange={(e) => setSelectedSku(e.target.value)}
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Preço Simulado (R$):</label>
        <input 
          type="number" 
          className="simulator-input"
          value={simulatedPrice}
          onChange={(e) => setSimulatedPrice(e.target.value)}
        />
        <input 
          type="range" 
          min={selectedProduct.variableCosts} 
          max={selectedProduct.sellPrice * 1.5} 
          step="1"
          value={simulatedPrice}
          onChange={(e) => setSimulatedPrice(e.target.value)}
        />
      </div>

      <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
        <div className="metric">
          <span className="metric-label">Preço Original:</span>
          <span>R$ {selectedProduct.sellPrice.toFixed(2)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Custos Variáveis:</span>
          <span>R$ {selectedProduct.variableCosts.toFixed(2)}</span>
        </div>
        <div className="metric" style={{ borderBottom: 'none' }}>
          <span className="metric-label">Nova Margem (%):</span>
          <span className="metric-value" style={{ color: isLosingMoney ? 'var(--color-deviator)' : 'var(--color-profit)' }}>
            {simulatedProduct.contributionMarginPerc.toFixed(1)}%
          </span>
        </div>
        
        {isLosingMoney && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-deviator)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Limite de preço baixo atingido! Prejuízo real detectado.</span>
          </div>
        )}
      </div>
    </div>
  );
}
