import React from 'react';
import { Edit2, Copy, Trash2, Plus } from 'lucide-react';

export default function ProductManager({ products, deleteProduct, duplicateProduct, onEdit, onAdd }) {
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const [filterMode, setFilterMode] = React.useState('Todos');

  const filteredProducts = filterMode === 'Todos' ? products : products.filter(p => p.categoriaEstrategica === filterMode);

  return (
    <div className="glass-panel" style={{ padding: '0' }}>
      <div className="glass-header" style={{ padding: '24px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Gestão de Portfólio</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--panel-border)' }}
            value={filterMode} onChange={e => setFilterMode(e.target.value)}
          >
            <option value="Todos">Todas as Categorias</option>
            <option value="Produto Estrela">Estrelas</option>
            <option value="Maximizador de Lucro">Maximizadores</option>
            <option value="Gerador de Tráfego">Geradores de Tráfego</option>
            <option value="Complementador de Transação">Complementadores</option>
            <option value="Desviador de Foco">Desviadores</option>
          </select>
          <button className="primary" onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <Plus size={18} />
            Adicionar Produto
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Produto</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Categoria Estratégica</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Margem</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Giro</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Valor Travado em Estoque</th>
              <th style={{ padding: '16px 24px', fontWeight: 500, textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}>
                    {p.categoriaEstrategica || '-'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ color: p.contributionMarginValue < 0 ? 'var(--color-deviator)' : 'var(--color-profit)' }}>
                    {p.contributionMarginPerc?.toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>{p.inventoryTurnover?.toFixed(2)}x</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(p.valorTravadoEstoque)}</td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => onEdit(p.id)} style={{ padding: '6px' }} title="Simular / Editar">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => duplicateProduct(p.id)} style={{ padding: '6px' }} title="Duplicar Produto">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => { if(window.confirm('Deseja realmente excluir este produto permanentemente?')) deleteProduct(p.id); }} style={{ padding: '6px', color: 'var(--color-deviator)' }} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
