import React, { useState, useEffect } from 'react';
import { calculateProductMetrics } from '../lib/data';
import { Save, PlusCircle } from 'lucide-react';

export default function EnhancedPriceSimulator({ products, addProduct, updateProduct }) {
  const [selectedSku, setSelectedSku] = useState('new');
  const [draft, setDraft] = useState({
    name: 'Novo Produto Simulador', category: '', sellPrice: 0, purchaseCost: 0,
    taxesPerc: 0, commissionPerc: 0, freightPaid: 0, packagingCost: 0,
    unitsSold: 0, avgInventory: 0, periodDays: 180, supplierDays: 0, clientDays: 0
  });

  useEffect(() => {
    if (selectedSku && selectedSku !== 'new') {
      const p = products.find(x => x.id === selectedSku);
      if (p) setDraft(p);
    } else {
      setDraft({
        name: 'Novo Produto Simulador', category: 'Simulação', sellPrice: 100, purchaseCost: 50,
        taxesPerc: 10, commissionPerc: 5, freightPaid: 0, packagingCost: 0,
        dailySalesVolume: 5, estoqueTotal: 50, supplierDays: 30, clientDays: 30
      });
    }
  }, [selectedSku, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: isNaN(Number(value)) || name === 'name' || name === 'category' ? value : Number(value) }));
  };

  const metrics = calculateProductMetrics(draft);
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSaveDraft = () => {
    if (selectedSku === 'new') {
      const added = addProduct(draft);
      setSelectedSku(added.id);
      alert('Produto criado com sucesso!');
    } else {
      updateProduct(selectedSku, draft);
      alert('Produto atualizado!');
    }
  };

  const handleSaveAsNew = () => {
    const { id, ...rest } = draft;
    const added = addProduct({ ...rest, name: `${rest.name} (Simulação)` });
    setSelectedSku(added.id);
    alert('Nova simulação salva como produto base!');
  };

  return (
    <div className="glass-panel">
      <div className="glass-header" style={{ justifyContent: 'space-between' }}>
        <h2>Simulação de Preço e Margem</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select className="simulator-input" style={{ width: '250px' }} value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}>
            <option value="new">+ Criar Nova Simulação</option>
            {products.map(p => <option key={p.id} value={p.id}>Editar: {p.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '2rem' }}>
        {/* Formulário */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Nome do Produto</label>
            <input name="name" className="simulator-input" value={draft.name} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Cost Fornecedor (R$)</label>
            <input type="number" name="purchaseCost" className="simulator-input" value={draft.purchaseCost === 0 ? '' : draft.purchaseCost} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Preço de Venda (R$)</label>
            <input type="number" name="sellPrice" className="simulator-input" value={draft.sellPrice === 0 ? '' : draft.sellPrice} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Impostos (%)</label>
            <input type="number" name="taxesPerc" className="simulator-input" value={draft.taxesPerc === 0 ? '' : draft.taxesPerc} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Comissões/Taxas (%)</label>
            <input type="number" name="commissionPerc" className="simulator-input" value={draft.commissionPerc === 0 ? '' : draft.commissionPerc} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>FBA (R$)</label>
            <input type="number" name="freightPaid" className="simulator-input" value={draft.freightPaid === 0 ? '' : draft.freightPaid} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Outros (R$)</label>
            <input type="number" name="packagingCost" className="simulator-input" value={draft.packagingCost === 0 ? '' : draft.packagingCost} onChange={handleChange} />
          </div>
        </div>

        {/* Console de Resultados */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Resultados Instatâneos</h3>
          
          <div className="metric">
            <span className="metric-label">Custos Variáveis Tolais:</span>
            <span className="metric-value">{formatCurrency(metrics.variableCosts)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Preço de Equilíbrio (Margem Zero):</span>
            <span className="metric-value" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(metrics.breakEvenPrice)}</span>
          </div>
          <div className="metric" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <span className="metric-label" style={{ fontWeight: 600 }}>Margem de Contribuição:</span>
            <span className="metric-value" style={{ fontSize: '1.4rem', color: metrics.contributionMarginValue < 0 ? 'var(--color-deviator)' : 'var(--color-profit)' }}>
              {formatCurrency(metrics.contributionMarginValue)} ({metrics.contributionMarginPerc.toFixed(1)}%)
            </span>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="primary" onClick={handleSaveDraft} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> {selectedSku === 'new' ? 'Cadastrar Produto' : 'Salvar Alterações'}
            </button>
            {selectedSku !== 'new' && (
              <button onClick={handleSaveAsNew} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)' }}>
                <PlusCircle size={18} /> Salvar como Nova Simulação
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
