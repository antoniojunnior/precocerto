// Pre-configured mock data representing a retail product portfolio
export const initialProducts = [
  {
    id: 'sku-001',
    name: 'Smartphone Pro X',
    category: 'Eletrônicos',
    sellPrice: 4500,
    purchaseCost: 2800,
    taxesPerc: 12,
    commissionPerc: 3,
    freightPaid: 25,
    packagingCost: 15,
    dailySalesVolume: 4,
    estoqueTotal: 20,
    supplierDays: 45,
    clientDays: 30
  },
  {
    id: 'sku-002',
    name: 'Fone Bluetooth Noise',
    category: 'Acessórios',
    sellPrice: 350,
    purchaseCost: 90,
    taxesPerc: 8,
    commissionPerc: 5,
    freightPaid: 10,
    packagingCost: 2,
    dailySalesVolume: 20,
    estoqueTotal: 50,
    supplierDays: 30,
    clientDays: 15
  },
  {
    id: 'sku-003',
    name: 'Smart TV 55" OLED',
    category: 'Eletrônicos',
    sellPrice: 5200,
    purchaseCost: 3900,
    taxesPerc: 12,
    commissionPerc: 2,
    freightPaid: 80,
    packagingCost: 35,
    dailySalesVolume: 1,
    estoqueTotal: 25,
    supplierDays: 60,
    clientDays: 45
  },
  {
    id: 'sku-004',
    name: 'Cabo USB-C Nylon 2m',
    category: 'Acessórios',
    sellPrice: 45,
    purchaseCost: 8,
    taxesPerc: 5,
    commissionPerc: 10,
    freightPaid: 2,
    packagingCost: 1,
    dailySalesVolume: 50,
    estoqueTotal: 400,
    supplierDays: 20,
    clientDays: 30
  },
  {
    id: 'sku-005',
    name: 'Câmera Mirrorless V1',
    category: 'Fotografia',
    sellPrice: 7800,
    purchaseCost: 6100,
    taxesPerc: 15,
    commissionPerc: 4,
    freightPaid: 50,
    packagingCost: 20,
    dailySalesVolume: 0.5,
    estoqueTotal: 12,
    supplierDays: 30,
    clientDays: 60
  },
  {
    id: 'sku-006',
    name: 'Capa Silicone P',
    category: 'Acessórios',
    sellPrice: 60,
    purchaseCost: 15,
    taxesPerc: 4,
    commissionPerc: 10,
    freightPaid: 3,
    packagingCost: 1,
    dailySalesVolume: 28,
    estoqueTotal: 150,
    supplierDays: 15,
    clientDays: 30
  },
  {
    id: 'sku-007',
    name: 'Notebook Developer Y',
    category: 'Informática',
    sellPrice: 9500,
    purchaseCost: 8200,
    taxesPerc: 18,
    commissionPerc: 2,
    freightPaid: 45,
    packagingCost: 30,
    dailySalesVolume: 0.3,
    estoqueTotal: 10,
    supplierDays: 45,
    clientDays: 30
  }
];

// Calculate metrics for a single product dynamically
export const calculateProductMetrics = (product) => {
  // Conversão de suporte a cadastros legados com unitsSold/avgInventory
  const dailySalesVolume = Number(product.dailySalesVolume) || (Number(product.unitsSold) / (Number(product.periodDays) || 30)) || 0;
  const estoqueTotal = Number(product.estoqueTotal) || Number(product.avgInventory) || 0;

  const p = {
    ...product,
    sellPrice: Number(product.sellPrice) || 0,
    purchaseCost: Number(product.purchaseCost) || 0,
    taxesPerc: Number(product.taxesPerc) || 0,
    commissionPerc: Number(product.commissionPerc) || 0,
    freightPaid: Number(product.freightPaid) || 0,
    packagingCost: Number(product.packagingCost) || 0,
    dailySalesVolume,
    estoqueTotal,
    supplierDays: Number(product.supplierDays) || 0,
    clientDays: Number(product.clientDays) || 0,
  };

  // 1. Variable Costs
  const taxesCost = p.sellPrice * (p.taxesPerc / 100);
  const commissionCost = p.sellPrice * (p.commissionPerc / 100);
  
  const variableCosts = p.purchaseCost + taxesCost + commissionCost + p.freightPaid + p.packagingCost;

  // 2. Contribution Margin
  const contributionMarginValue = p.sellPrice - variableCosts;
  const contributionMarginPerc = p.sellPrice > 0 ? (contributionMarginValue / p.sellPrice) * 100 : 0;

  // 3. Inventory Turnover & Days (Normalized to 30 days)
  const vendas30d = p.dailySalesVolume * 30;
  const inventoryTurnover = p.estoqueTotal > 0 ? (vendas30d / p.estoqueTotal) : 0;
  const daysInInventory = inventoryTurnover > 0 ? (30 / inventoryTurnover) : 0;
  
  // 4. Working Capital Needs
  // A formula for "Valor Travado em Estoque" uses total inventory
  const valorTravadoEstoque = p.estoqueTotal * p.purchaseCost;
  
  // A formula for "NCG Operacional" avoids mixing stock logic, just gap * cost
  // Valores positivos = necessidade de capital; Valores negativos = folga/superávit de capital
  const gapCaixaDias = p.clientDays - p.supplierDays;
  const custoMedioDiario = p.dailySalesVolume * p.purchaseCost;
  const ncgOperacional = gapCaixaDias * custoMedioDiario;

  // 5. Break-even Price (Price where Margin = 0)
  const variablePerc = (p.taxesPerc + p.commissionPerc) / 100;
  const fixedUnitCosts = p.purchaseCost + p.freightPaid + p.packagingCost;
  const breakEvenPrice = variablePerc < 1 ? fixedUnitCosts / (1 - variablePerc) : 0;

  return {
    ...p,
    variableCosts,
    contributionMarginValue,
    contributionMarginPerc,
    inventoryTurnover,
    daysInInventory,
    gapCaixaDias,
    valorTravadoEstoque,
    ncgOperacional,
    breakEvenPrice
  };
};

/**
 * Classifies a list of product metrics based on dynamic thresholds (averages)
 */
export const classifyProducts = (productsWithMetrics) => {
  if (productsWithMetrics.length === 0) return { products: [], averages: {} };

  const totalMargin = productsWithMetrics.reduce((acc, p) => acc + p.contributionMarginPerc, 0);
  const totalTurnover = productsWithMetrics.reduce((acc, p) => acc + p.inventoryTurnover, 0);
  
  const avgMargin = totalMargin / productsWithMetrics.length;
  const avgTurnover = totalTurnover / productsWithMetrics.length;

  const classified = productsWithMetrics.map(p => {
    let categoriaEstrategica = '';
    
    const isHighMargin = p.contributionMarginPerc >= avgMargin;
    const isHighTurnover = p.inventoryTurnover >= avgTurnover;

    if (isHighMargin && isHighTurnover) {
      categoriaEstrategica = 'Produto Estrela';
    } else if (isHighMargin && !isHighTurnover) {
      categoriaEstrategica = 'Maximizador de Lucro';
    } else if (!isHighMargin && !isHighTurnover) {
      categoriaEstrategica = 'Desviador de Foco';
    } else {
      // Differentiating Gerador vs Complementador based on margin distance to average
      if (p.contributionMarginPerc >= avgMargin * 0.6) {
        categoriaEstrategica = 'Complementador de Transação';
      } else {
        categoriaEstrategica = 'Gerador de Tráfego';
      }
    }

    return { ...p, categoriaEstrategica, classification: categoriaEstrategica };
  });

  return {
    products: classified,
    averages: {
      margin: avgMargin,
      turnover: avgTurnover
    }
  };
};

export const processPortfolio = (products) => {
  const withMetrics = products.map(calculateProductMetrics);
  return classifyProducts(withMetrics);
};
