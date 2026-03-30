import React from 'react';
import Chart from 'react-apexcharts';

export default function OverviewPanel({ data, averages }) {
  // We need to group data by `categoriaEstrategica`
  const categories = ['Produto Estrela', 'Maximizador de Lucro', 'Gerador de Tráfego', 'Complementador de Transação', 'Desviador de Foco'];
  const colors = {
    'Produto Estrela': '#eab308', // var(--color-star)
    'Maximizador de Lucro': '#22c55e', // var(--color-profit)
    'Gerador de Tráfego': '#3b82f6', // var(--color-generator)
    'Complementador de Transação': '#a855f7', // var(--color-complement)
    'Desviador de Foco': '#ef4444' // var(--color-deviator)
  };

  const series = categories.map(cat => ({
    name: cat,
    data: data.filter(d => d.categoriaEstrategica === cat).map(d => ({
      x: Number(d.contributionMarginPerc.toFixed(2)),
      y: Number(d.inventoryTurnover.toFixed(2)),
      product: d
    }))
  })).filter(s => s.data.length > 0);

  // Calcula limites fixos e paddings para evitar sobreposição nas extremidades numéricas
  const margins = data.map(d => d.contributionMarginPerc);
  const turnovers = data.map(d => d.inventoryTurnover);
  
  const minMargin = Math.min(...margins, 0) - 10;
  const maxMargin = Math.max(...margins, 50) + 10;
  const maxTurnover = Math.max(...turnovers, 2) + 2;
  const minTurnover = Math.max(0, Math.min(...turnovers, 0) - 0.5);

  const options = {
    chart: {
      type: 'scatter',
      height: 400,
      zoom: { enabled: true, type: 'xy' },
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#94a3b8', // var(--text-secondary)
      animations: { enabled: true }
    },
    colors: series.map(s => colors[s.name]),
    xaxis: {
      title: { text: 'Margem de Contribuição (%)', style: { color: '#94a3b8', fontWeight: 500 } },
      min: minMargin,
      max: maxMargin,
      tickAmount: 8,
      labels: {
        formatter: function(val) {
          return parseFloat(val).toFixed(0) + "%";
        }
      },
      axisBorder: { show: true, color: 'rgba(255,255,255,0.2)' },
      axisTicks: { show: true, color: 'rgba(255,255,255,0.2)' }
    },
    yaxis: {
      title: { text: 'Giro de Estoque (x)', style: { color: '#94a3b8', fontWeight: 500 } },
      min: minTurnover,
      max: maxTurnover,
      axisBorder: { show: true, color: 'rgba(255,255,255,0.2)' },
      axisTicks: { show: true, color: 'rgba(255,255,255,0.2)' }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.08)',
      strokeDashArray: 4,
    },
    annotations: {
      xaxis: [{
        x: averages.margin,
        borderColor: 'rgba(255,255,255,0.3)',
        strokeDashArray: 5,
        label: {
          text: 'Média de Margem',
          style: { color: '#fff', background: 'rgba(0,0,0,0.4)', padding: { left: 4, right: 4, top: 2, bottom: 2 } }
        }
      }],
      yaxis: [{
        y: averages.turnover,
        borderColor: 'rgba(255,255,255,0.3)',
        strokeDashArray: 5,
        label: {
          text: 'Média de Giro',
          style: { color: '#fff', background: 'rgba(0,0,0,0.4)', padding: { left: 4, right: 4, top: 2, bottom: 2 } }
        }
      }]
    },
    tooltip: {
      theme: 'dark',
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const prod = w.config.series[seriesIndex].data[dataPointIndex].product;
        return `
          <div style="padding: 12px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #fff;">${prod.name}</h4>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;">Margem: <b>${prod.contributionMarginPerc.toFixed(1)}%</b></div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;">Giro: <b>${prod.inventoryTurnover.toFixed(2)}x</b></div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;">NCG: <b style="color: ${prod.ncgOperacional > 0 ? '#ef4444' : '#22c55e'}">R$ ${prod.ncgOperacional.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div>
            <div style="font-size: 0.85rem; color: ${colors[prod.categoriaEstrategica]}; margin-top: 8px; font-weight: 600;">${prod.categoriaEstrategica}</div>
          </div>
        `;
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#f8fafc' },
      markers: { width: 10, height: 10, radius: 10 }
    },
    markers: {
      size: 7,
      strokeWidth: 0,
      hover: { size: 10 }
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="glass-header">
        <h2>Visão Geral do Portfólio</h2>
      </div>
      <p className="subtitle" style={{ marginBottom: '1rem' }}>
        Matriz Estratégica: Margem de Contribuição (Eixo X) vs. Giro de Estoque (Eixo Y).
      </p>
      
      <div style={{ width: '100%', minHeight: '400px', marginTop: '1rem' }}>
        {data.length > 0 ? (
          <Chart options={options} series={series} type="scatter" height={400} />
        ) : (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Nenhum produto cadastrado para gerar estatísticas.
          </div>
        )}
      </div>
    </div>
  );
}
