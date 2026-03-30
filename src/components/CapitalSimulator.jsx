import React, { useState, useEffect } from 'react';
import { calculateProductMetrics } from '../lib/data';
import { Save, Copy } from 'lucide-react';

export default function CapitalSimulator({ products, updateProduct }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.id || '');
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (selectedSku) {
      const p = products.find(x => x.id === selectedSku);
      if (p) setDraft(p);
    }
  }, [selectedSku, products]);

  if (!draft) return <div className="glass-panel">Nenhum produto selecionado.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: Number(value) }));
  };

  const metrics = calculateProductMetrics(draft);
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSaveDraft = () => {
    updateProduct(selectedSku, draft);
    alert('Alterações de Estoque e Prazos salvas!');
  };

  return (
    <div className="glass-panel">
      <div className="glass-header" style={{ justifyContent: 'space-between' }}>
        <h2>Simulador de Capital de Giro e Estoque</h2>
        <select className="simulator-input" style={{ width: '250px' }} value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignContent: 'start' }}>
          
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Volume Diário de Vendas (Unidades)</label>
            <input type="number" name="dailySalesVolume" className="simulator-input" value={draft.dailySalesVolume === 0 ? '' : draft.dailySalesVolume} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Estoque Total (Unidades)</label>
            <input type="number" name="estoqueTotal" className="simulator-input" value={draft.estoqueTotal === 0 ? '' : draft.estoqueTotal} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Prazo Recebimento Amazon (Dias)</label>
            <input type="number" name="clientDays" className="simulator-input" value={draft.clientDays === 0 ? '' : draft.clientDays} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Prazo Pagamento Fornecedor (Dias)</label>
            <input type="number" name="supplierDays" className="simulator-input" value={draft.supplierDays === 0 ? '' : draft.supplierDays} onChange={handleChange} />
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-cash)' }}>Indicadores de Capital</h3>
          
          <div className="metric">
            <span className="metric-label">Giro de Estoque:</span>
            <span className="metric-value">{metrics.inventoryTurnover.toFixed(2)}x</span>
          </div>
          <div className="metric">
            <span className="metric-label">Dias em Estoque:</span>
            <span className="metric-value">{metrics.daysInInventory.toFixed(0)} dias</span>
          </div>
          <div className="metric">
            <span className="metric-label">Gap de Caixa:</span>
            <span className="metric-value" style={{ 
              color: metrics.gapCaixaDias > 0 ? 'var(--color-deviator)' : (metrics.gapCaixaDias < 0 ? 'var(--color-profit)' : 'var(--text-primary)') 
            }}>
              {metrics.gapCaixaDias > 0 ? `+${metrics.gapCaixaDias} dias (Financiar)` : (metrics.gapCaixaDias < 0 ? `${metrics.gapCaixaDias} dias (Folga)` : '0 dias (Equilíbrio)')}
            </span>
          </div>
          
          <div className="metric" style={{ marginTop: '1rem', borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: '1rem' }}>
            <span className="metric-label" style={{ fontWeight: 600 }}>Valor Travado em Estoque:</span>
            <span className="metric-value" style={{ fontSize: '1.2rem', color: '#fff' }}>
              {formatCurrency(metrics.valorTravadoEstoque)}
            </span>
          </div>
          <div className="metric" style={{ paddingTop: '0.2rem', alignItems: 'flex-start' }}>
            <span className="metric-label" style={{ fontWeight: 600, marginTop: '4px' }}>NCG Operacional:</span>
            <div style={{ textAlign: 'right' }}>
              <span className="metric-value" style={{ fontSize: '1.2rem', color: metrics.ncgOperacional > 0 ? 'var(--color-deviator)' : (metrics.ncgOperacional < 0 ? 'var(--color-profit)' : 'var(--text-primary)') }}>
                {formatCurrency(metrics.ncgOperacional)}
              </span>
              <span style={{ fontSize: '0.75rem', display: 'block', fontWeight: 400, color: 'var(--text-secondary)' }}>
                {metrics.ncgOperacional > 0 ? '(Necessidade de Capital)' : (metrics.ncgOperacional < 0 ? '(Folga / Superávit)' : '(Ciclo Equilibrado)')}
              </span>
            </div>
          </div>

          <button className="primary" onClick={handleSaveDraft} style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Salvar Estoque e Prazos
          </button>
        </div>
      </div>
    </div>
  );
}
