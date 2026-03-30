import React, { useState, useEffect } from 'react';
import { Save, Copy, AlertCircle } from 'lucide-react';
import { calculateProductMetrics } from '../lib/data';
import Tooltip from './Tooltip';

export default function UnifiedSimulator({ products, addProduct, updateProduct, selectedSku, onClearSelection }) {
  const [draft, setDraft] = useState({
    name: 'Novo Produto Simulação', category: 'Simulação',
    sellPrice: 100, purchaseCost: 50,
    taxesPerc: 10, commissionPerc: 5, freightPaid: 0, packagingCost: 0,
    dailySalesVolume: 5, estoqueTotal: 50, supplierDays: 30, clientDays: 30
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedSku) {
      const p = products.find(prod => prod.id === selectedSku);
      if (p) setDraft({ ...p });
    } else {
      setDraft({
        name: 'Novo Produto Simulação', category: 'Simulação',
        sellPrice: 100, purchaseCost: 50,
        taxesPerc: 10, commissionPerc: 5, freightPaid: 0, packagingCost: 0,
        dailySalesVolume: 5, estoqueTotal: 50, supplierDays: 30, clientDays: 30
      });
    }
  }, [selectedSku, products]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = type === 'number' ? parseFloat(value) || 0 : value;
    
    // Real-time Validations
    let newErrors = { ...errors };
    if (type === 'number') {
      if (val < 0) newErrors[name] = 'Não pode ser negativo';
      else delete newErrors[name];
      
      if ((name === 'taxesPerc' || name === 'commissionPerc') && val > 100) {
        newErrors[name] = 'Máximo 100%';
      }
    }
    setErrors(newErrors);

    if (type === 'number' && e.target.value === '') {
      setDraft({ ...draft, [name]: 0 });
    } else {
      setDraft({ ...draft, [name]: val });
    }
  };

  const hasErrors = Object.keys(errors).length > 0;
  const metrics = calculateProductMetrics(draft);

  const handleSaveDraft = () => {
    if (hasErrors) return;
    if (selectedSku) {
      updateProduct(draft.id, draft);
      // Mantém o produto selecionado na tela após atualização
    } else {
      addProduct({ ...draft, category: 'Simulação' });
    }
  };

  const handleSaveAsNew = () => {
    if (hasErrors) return;
    addProduct({ ...draft, name: `${draft.name} (Cópia)`, id: undefined, category: 'Simulação' });
  };

  return (
    <div className="simulator-wrapper" style={{ display: 'grid', gap: '2rem' }}>
      <style>{`
        .simulator-wrapper { grid-template-columns: 1fr 340px; align-items: start; }
        @media (max-width: 1024px) { .simulator-wrapper { grid-template-columns: 1fr; } }
        .sim-section { margin-bottom: 2rem; }
        .sim-section h3 { font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
        .sim-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .sim-grid { grid-template-columns: 1fr; } }
        .sticky-sidebar { position: sticky; top: 2rem; }
      `}</style>
      
      {/* Coluna Esquerda: Padrão Z/F */}
      <div className="glass-panel">
        <div className="glass-header">
          <h2>Simulador Completo</h2>
        </div>
        
        {/* Progresso Wizard Visual */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
          {['Custos e Preço', 'Impostos e Taxas', 'Estoque e Giro', 'Prazos e Capital'].map((step, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: '4px', background: 'var(--color-cash)', borderRadius: '2px', opacity: 0.8 }} />
              <div style={{ fontSize: '0.7rem', marginTop: '4px', color: 'var(--text-secondary)' }}>{i + 1}. {step}</div>
            </div>
          ))}
        </div>

        <div className="sim-section">
          <h3>1. Identificação e Preço</h3>
          <div className="sim-grid">
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Nome do Produto</label>
              <input type="text" name="name" className="simulator-input" value={draft.name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Preço de Venda (R$)
                <Tooltip text="O preço base que atinge o cliente final, utilizado para margem e comissionamento." />
              </label>
              <input type="number" name="sellPrice" className={`simulator-input ${errors.sellPrice ? 'input-error' : ''}`} value={draft.sellPrice === 0 ? '' : draft.sellPrice} onChange={handleChange} />
              {errors.sellPrice && <span className="error-text">{errors.sellPrice}</span>}
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Custo de Compra (R$)
                <Tooltip text="O valor pago para adquirir o estoque do fornecedor." />
              </label>
              <input type="number" name="purchaseCost" className={`simulator-input ${errors.purchaseCost ? 'input-error' : ''}`} value={draft.purchaseCost === 0 ? '' : draft.purchaseCost} onChange={handleChange} />
              {errors.purchaseCost && <span className="error-text">{errors.purchaseCost}</span>}
            </div>
            <div className="input-group">
              <label>FBA (R$)</label>
              <input type="number" name="freightPaid" className={`simulator-input ${errors.freightPaid ? 'input-error' : ''}`} value={draft.freightPaid === 0 ? '' : draft.freightPaid} onChange={handleChange} />
              {errors.freightPaid && <span className="error-text">{errors.freightPaid}</span>}
            </div>
            <div className="input-group">
              <label>Outros (R$)</label>
              <input type="number" name="packagingCost" className={`simulator-input ${errors.packagingCost ? 'input-error' : ''}`} value={draft.packagingCost === 0 ? '' : draft.packagingCost} onChange={handleChange} />
              {errors.packagingCost && <span className="error-text">{errors.packagingCost}</span>}
            </div>
          </div>
        </div>

        <div className="sim-section">
          <h3>2. Impostos e Taxas</h3>
          <div className="sim-grid">
            <div className="input-group">
              <label>Impostos (Simples, ICMS) (%)</label>
              <input type="number" name="taxesPerc" className={`simulator-input ${errors.taxesPerc ? 'input-error' : ''}`} value={draft.taxesPerc === 0 ? '' : draft.taxesPerc} onChange={handleChange} />
              {errors.taxesPerc && <span className="error-text">{errors.taxesPerc}</span>}
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Comissão do Marketplace (%)
                <Tooltip text="A taxa percentual que a Amazon ou outro canal cobra por venda." />
              </label>
              <input type="number" name="commissionPerc" className={`simulator-input ${errors.commissionPerc ? 'input-error' : ''}`} value={draft.commissionPerc === 0 ? '' : draft.commissionPerc} onChange={handleChange} />
              {errors.commissionPerc && <span className="error-text">{errors.commissionPerc}</span>}
            </div>
          </div>
        </div>

        <div className="sim-section">
          <h3>3. Estoque e Giro</h3>
          <div className="sim-grid">
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Volume Diário de Vendas (Unidades)
                <Tooltip text="Taxa média diária de saída do estoque para este SKU." />
              </label>
              <input type="number" name="dailySalesVolume" className={`simulator-input ${errors.dailySalesVolume ? 'input-error' : ''}`} value={draft.dailySalesVolume === 0 ? '' : draft.dailySalesVolume} onChange={handleChange} />
              {errors.dailySalesVolume && <span className="error-text">{errors.dailySalesVolume}</span>}
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Estoque Total (Unidades)
                <Tooltip text="Volume real de itens que você tem em estoque agora. Usado para travar o valor do Capital." />
              </label>
              <input type="number" name="estoqueTotal" className={`simulator-input ${errors.estoqueTotal ? 'input-error' : ''}`} value={draft.estoqueTotal === 0 ? '' : draft.estoqueTotal} onChange={handleChange} />
              {errors.estoqueTotal && <span className="error-text">{errors.estoqueTotal}</span>}
            </div>
          </div>
        </div>

        <div className="sim-section">
          <h3>4. Prazos Financeiros e Capital de Giro</h3>
          <div className="sim-grid">
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Prazo Recebimento Amazon (Dias)
                <Tooltip text="Em quantos dias o dinheiro cai efetivamente na sua conta." />
              </label>
              <input type="number" name="clientDays" className={`simulator-input ${errors.clientDays ? 'input-error' : ''}`} value={draft.clientDays === 0 ? '' : draft.clientDays} onChange={handleChange} />
              {errors.clientDays && <span className="error-text">{errors.clientDays}</span>}
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                Prazo Pagamento Fornecedor (Dias)
                <Tooltip text="Quantos dias de prazo você tem para pagar pelo seu estoque total." />
              </label>
              <input type="number" name="supplierDays" className={`simulator-input ${errors.supplierDays ? 'input-error' : ''}`} value={draft.supplierDays === 0 ? '' : draft.supplierDays} onChange={handleChange} />
              {errors.supplierDays && <span className="error-text">{errors.supplierDays}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Resultados */}
      <div className="glass-panel sticky-sidebar" style={{ borderTopWidth: '4px', borderTopColor: metrics.contributionMarginValue < 0 ? 'var(--color-deviator)' : 'var(--color-profit)' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Resultados da Simulação</h3>
        
        <div className="metric">
           <span className="metric-label" style={{ display: 'flex', alignItems: 'center' }}>
            Preço de Equilíbrio:
            <Tooltip text="O preço exato onde o lucro zera e empata os custos. Vender abaixo disso dá prejuízo absoluto." />
          </span>
          <span className="metric-value">R$ {metrics.breakEvenPrice.toFixed(2)}</span>
        </div>
        <div className="metric" style={{ marginTop: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="metric-label" style={{ fontWeight: 600 }}>Margem de Contribuição:</span>
          <div style={{ textAlign: 'right' }}>
            <span className="metric-value" style={{ fontSize: '1.5rem', color: metrics.contributionMarginValue < 0 ? 'var(--color-deviator)' : 'var(--color-profit)' }}>
              {metrics.contributionMarginPerc.toFixed(1)}%
            </span>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              R$ {metrics.contributionMarginValue.toFixed(2)} / un
            </span>
          </div>
        </div>

        <div className="metric" style={{ marginTop: '1rem' }}>
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center' }}>
            Giro Normalizado (30d):
            <Tooltip text="Quantas vezes todo o seu estoque vira dinheiro em um mês." />
          </span>
          <span className="metric-value">{metrics.inventoryTurnover.toFixed(2)}x</span>
        </div>
        <div className="metric">
          <span className="metric-label">Dias em Estoque (Cobertura):</span>
          <span className="metric-value">{metrics.daysInInventory.toFixed(0)} dias</span>
        </div>
        <div className="metric">
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center' }}>
            Gap de Caixa:
            <Tooltip text="Ciclo de espera financeira. Dias adicionais até receber comparando com prazo de pagamento. Negativo significa que você recebe antes de pagar (Folga/Superávit)." />
          </span>
          <span className="metric-value" style={{ color: metrics.gapCaixaDias > 0 ? 'var(--color-deviator)' : (metrics.gapCaixaDias < 0 ? 'var(--color-profit)' : 'var(--text-primary)') }}>
            {metrics.gapCaixaDias > 0 ? `+${metrics.gapCaixaDias} dias` : (metrics.gapCaixaDias < 0 ? `${metrics.gapCaixaDias} dias` : '0 dias')}
          </span>
        </div>

        <div className="metric" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <span className="metric-label" style={{ display: 'flex', alignItems: 'center' }}>
            Valor Travado no Estoque:
            <Tooltip text="Capital mobilizado no galpão, valor total de custo imobilizado nas prateleiras neste momento." />
          </span>
          <span className="metric-value">R$ {metrics.valorTravadoEstoque.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        </div>
        
        <div className="metric" style={{ paddingTop: '0.2rem', alignItems: 'flex-start' }}>
          <span className="metric-label" style={{ fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center' }}>
            NCG Operacional (Capital de Giro):
            <Tooltip text="Sua necessidade financeira projetada pelo seu descasamento de caixa." />
          </span>
          <div style={{ textAlign: 'right' }}>
            <span className="metric-value" style={{ fontSize: '1.2rem', color: metrics.ncgOperacional > 0 ? 'var(--color-deviator)' : (metrics.ncgOperacional < 0 ? 'var(--color-profit)' : 'var(--text-primary)') }}>
              R$ {metrics.ncgOperacional.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {metrics.ncgOperacional > 0 ? '(Falta Dinheiro/Financiar)' : (metrics.ncgOperacional < 0 ? '(Gera Folga Extra)' : '(Empatado)')}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="primary" onClick={handleSaveDraft} disabled={hasErrors} style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: hasErrors ? 0.5 : 1 }}>
            <Save size={18} />
            {selectedSku ? 'Atualizar Produto' : 'Adicionar ao Portfólio'}
          </button>
          
          {selectedSku && (
            <button onClick={handleSaveAsNew} disabled={hasErrors} style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: hasErrors ? 0.5 : 1 }}>
              <Copy size={18} />
              Replicar Simulação como Novo Produto
            </button>
          )}

          {hasErrors && (
            <div style={{ color: 'var(--color-deviator)', fontSize: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> Corrija os erros listados para liberar salvamento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
