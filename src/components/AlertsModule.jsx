import React from 'react';
import { AlertCircle, TrendingDown, AlertTriangle, Zap, ShoppingCart, DollarSign } from 'lucide-react';

export default function AlertsModule({ data }) {
  const geradores = data.filter(p => p.categoriaEstrategica === 'Gerador de Tráfego');
  const complementadores = data.filter(p => p.categoriaEstrategica === 'Complementador de Transação');
  const maximizadores = data.filter(p => p.categoriaEstrategica === 'Maximizador de Lucro');
  const estrelas = data.filter(p => p.categoriaEstrategica === 'Produto Estrela');
  const desviadores = data.filter(p => p.categoriaEstrategica === 'Desviador de Foco');

  const criticos = data.filter(p => p.contributionMarginPerc < 0 && p.inventoryTurnover < 1);

  const totalFrozenValue = desviadores.reduce((acc, p) => acc + (p.valorTravadoEstoque || 0), 0);

  return (
    <div className="glass-panel">
      <div className="glass-header">
        <AlertCircle className="icon" size={24} color="var(--color-deviator)" />
        <h2>Alertas Estratégicos e Recomendações</h2>
      </div>

      <div className="alerts-grid">
        {/* Críticos Máximos */}
        {criticos.length > 0 && (
          <div className="alert-card" style={{ borderLeftColor: 'var(--color-deviator)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--color-deviator)" />
                <h4 style={{ margin: 0, color: 'var(--color-deviator)' }}>Críticos Máximos</h4>
              </div>
              <span className="badge" style={{ background: 'var(--color-deviator)', color: '#fff' }}>{criticos.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <strong>Produto com prejuízo (margem negativa) e giro abaixo de 1x:</strong> Revisar imediatamente preço, reduzir custos ou retirar do portfólio. Este produto drena caixa e lucro simultaneamente.
            </p>
          </div>
        )}

        {/* Estrelas */}
        {estrelas.length > 0 && (
          <div className="alert-card alert-stockout">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="var(--color-star)" />
                <h4 style={{ margin: 0 }}>Produtos Estrela</h4>
              </div>
              <span className="badge badge-star">{estrelas.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Esses produtos impulsionam crescimento saudável com alta margem e giro alto. A falta de estoque deles destrói o negócio.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Ação Sugerida:</strong> Monitore o risco de ruptura. Busque pelo menos 3 a 4 fornecedores diferentes para garantir o abastecimento contínuo.
            </div>
          </div>
        )}

        {/* Geradores de Tráfego */}
        {geradores.length > 0 && (
          <div className="alert-card" style={{ borderLeftColor: 'var(--color-generator)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={18} color="var(--color-generator)" />
                <h4 style={{ margin: 0 }}>Geradores de Tráfego</h4>
              </div>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--color-generator)' }}>{geradores.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Essenciais para atrair clientes e gerar caixa rápido, mesmo com menor margem.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Atenção:</strong> Cuidado para que o preço não esteja muito abaixo do mercado (margem zero ou negativa). Evite comprometer a geração de caixa operacional.
            </div>
          </div>
        )}

        {/* Complementadores */}
        {complementadores.length > 0 && (
          <div className="alert-card" style={{ borderLeftColor: 'var(--color-complement)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={18} color="var(--color-complement)" />
                <h4 style={{ margin: 0 }}>Complementadores de Transação</h4>
              </div>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: 'var(--color-complement)' }}>{complementadores.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Elevam a rentabilidade do pedido gerando compras adjacentes.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Ação Sugerida:</strong> Crie combos e promova vendas casadas desses itens com seus Geradores de Tráfego e Produtos Estrela para aumentar o ticket médio.
            </div>
          </div>
        )}

        {/* Maximizadores de Lucro */}
        {maximizadores.length > 0 && (
          <div className="alert-card" style={{ borderLeftColor: 'var(--color-profit)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--color-profit)" />
                <h4 style={{ margin: 0 }}>Maximizadores de Lucro</h4>
              </div>
              <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--color-profit)' }}>{maximizadores.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Alta margem que garante lucros consistentes, embora o giro seja mais baixo.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Ação Sugerida:</strong> Promova ações de marketing ou impulsione anúncios para aumentar a rotatividade sem sacrificar a margem absurda.
            </div>
          </div>
        )}

        {/* Desviadores de Foco */}
        {desviadores.length > 0 && (
          <div className="alert-card alert-liquidation">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="var(--color-deviator)" />
                <h4 style={{ margin: 0 }}>Desviadores de Foco</h4>
              </div>
              <span className="badge badge-deviator">{desviadores.length} Itens</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Esses itens drenam capital de giro e oferecem baixa margem. Recomendada a limpeza de portfólio para proteger a operação.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Ação Sugerida:</strong> Rasgue o preço e queime estoque para liquidar. 
              <br/>
              <em>Valor travado neste grupo:</em> <span style={{ color: 'var(--color-deviator)' }}>{totalFrozenValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        )}

        {criticos.length === 0 && geradores.length === 0 && complementadores.length === 0 && maximizadores.length === 0 && estrelas.length === 0 && desviadores.length === 0 && (
           <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
             Nenhum alerta estratégico no momento. Adicione produtos para serem classificados.
           </div>
        )}
      </div>
    </div>
  );
}
