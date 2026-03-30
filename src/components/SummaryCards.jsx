import React from 'react';
import { Package, TrendingUp, HandCoins, Vault } from 'lucide-react';
import Tooltip from './Tooltip';

export default function SummaryCards({ portfolio }) {
  const { products, averages } = portfolio;

  const totalProducts = products.length;
  const totalValorTravado = products.reduce((acc, p) => acc + (p.valorTravadoEstoque || 0), 0);
  const totalNcg = products.reduce((acc, p) => acc + (p.ncgOperacional || 0), 0);

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
          <Package size={24} color="var(--text-primary)" />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            Total de SKUs <Tooltip text="Quantidade total de produtos diferentes cadastrados no sistema." />
          </p>
          <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{totalProducts}</h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '12px', borderRadius: '12px' }}>
          <TrendingUp size={24} color="var(--color-profit)" />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            Margem Média <Tooltip text="Média geral de rentabilidade. Valores altos indicam geração forte de lucro bruto." />
          </p>
          <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{averages.margin?.toFixed(1) || 0}%</h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(234, 179, 8, 0.15)', padding: '12px', borderRadius: '12px' }}>
          <HandCoins size={24} color="var(--color-star)" />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            Giro Médio (x) <Tooltip text="Aceleração de vendas. Quantas vezes o estoque zera e é reposto a cada 30 dias na média." />
          </p>
          <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{averages.turnover?.toFixed(2) || 0}</h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '12px' }}>
          <Vault size={24} color="var(--color-cash)" />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            Valor Estoque <Tooltip text="Custo total de todo o inventário parado nos galpões e prateleiras somados." />
          </p>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{formatCurrency(totalValorTravado)}</h3>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderColor: totalNcg > 0 ? 'rgba(239, 68, 68, 0.3)' : (totalNcg < 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)') }}>
        <div style={{ background: totalNcg > 0 ? 'rgba(239, 68, 68, 0.15)' : (totalNcg < 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.1)'), padding: '12px', borderRadius: '12px' }}>
          <Vault size={24} color={totalNcg > 0 ? 'var(--color-deviator)' : (totalNcg < 0 ? 'var(--color-profit)' : 'var(--text-primary)')} />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
            {totalNcg > 0 ? 'NCG (Necessidade)' : (totalNcg < 0 ? 'NCG (Superávit)' : 'NCG Equilibrada')}
            <Tooltip text="A Necessidade de Capital de Giro reflete o impacto dos prazos de recebimento e pagamento na sua liquidez final." />
          </p>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: totalNcg > 0 ? 'var(--color-deviator)' : (totalNcg < 0 ? 'var(--color-profit)' : 'var(--text-primary)') }}>
            {formatCurrency(totalNcg)}
          </h3>
        </div>
      </div>

    </div>
  );
}
