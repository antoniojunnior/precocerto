import React, { useState } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import OverviewPanel from './components/OverviewPanel';
import AlertsModule from './components/AlertsModule';
import SummaryCards from './components/SummaryCards';
import UnifiedSimulator from './components/UnifiedSimulator';
import ProductManager from './components/ProductManager';
import { LayoutDashboard, PackageSearch, Settings, Calculator, Wallet } from 'lucide-react';

export default function App() {
  const { portfolio, products, addProduct, updateProduct, deleteProduct, duplicateProduct } = usePortfolio();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSimSku, setSelectedSimSku] = useState(null);

  const navigateToSimulate = (productId) => {
    setSelectedSimSku(productId);
    setCurrentView('unified_simulator');
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <>
            <SummaryCards portfolio={portfolio} />
            <div className="dashboard-grid">
              <OverviewPanel data={portfolio.products} averages={portfolio.averages} />
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AlertsModule data={portfolio.products} />
              </aside>
            </div>
          </>
        );
      case 'products':
        return <ProductManager 
          products={portfolio.products} 
          deleteProduct={deleteProduct} 
          duplicateProduct={duplicateProduct} 
          onEdit={navigateToSimulate} 
          onAdd={() => navigateToSimulate(null)}
        />;
      case 'unified_simulator':
        return <UnifiedSimulator 
          products={portfolio.products} 
          addProduct={addProduct} 
          updateProduct={updateProduct} 
          selectedSku={selectedSimSku} 
          onClearSelection={() => setSelectedSimSku(null)} 
        />;
      default:
        return null;
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => {
    const isActive = currentView === id;
    return (
      <div 
        onClick={() => setCurrentView(id)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', 
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', 
          borderRadius: '8px', 
          color: isActive ? '#fff' : 'var(--text-secondary)', 
          fontWeight: isActive ? 500 : 400, 
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Icon size={20} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>PreçoCerto.</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>V2 | Gestão Integrada</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Visão Geral" />
          <NavItem id="products" icon={PackageSearch} label="Meus Produtos" />
          
          <div 
            onClick={() => { setSelectedSimSku(null); setCurrentView('unified_simulator'); }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', 
              background: currentView === 'unified_simulator' ? 'rgba(255,255,255,0.1)' : 'transparent', 
              borderRadius: '8px', color: currentView === 'unified_simulator' ? '#fff' : 'var(--text-secondary)', 
              fontWeight: currentView === 'unified_simulator' ? 500 : 400, cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <Calculator size={20} />
            <span>Simulador Unificado</span>
          </div>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>Lembrete do CEO:</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
            "Faturamento é ego,<br/>Lucro é ponto de vista,<br/>Caixa é realidade."
          </p>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>
              {currentView === 'dashboard' && 'Monitoramento de Portfólio'}
              {currentView === 'products' && 'Gestão de Produtos'}
              {currentView === 'unified_simulator' && 'Simulador Estratégico Integrado'}
            </h2>
          </div>
        </header>

        {products.length > 0 ? renderView() : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Nenhum produto cadastrado</h3>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Cadastre um produto no simulador para começar.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
