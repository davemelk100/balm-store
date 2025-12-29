#!/usr/bin/env node

/**
 * Inventory Verification Script
 * 
 * Uses Stripe API to export and verify current inventory levels.
 * Use this for:
 * - Daily/weekly inventory reports
 * - Verifying webhook sync is working correctly
 * - Backup snapshots
 * - Detecting discrepancies
 * 
 * Usage:
 *   node scripts/verify-inventory.js
 *   node scripts/verify-inventory.js --csv
 *   node scripts/verify-inventory.js --json
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');

async function exportInventorySnapshot(format = 'console') {
  console.log('📊 Fetching inventory from Stripe...\n');
  
  try {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
      expand: ['data.default_price']
    });

    const inventory = [];
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const product of products.data) {
      const metadata = product.metadata;
      const sizesStr = metadata.sizes || '';
      const sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s);
      
      if (sizes.length === 0) {
        console.log(`⚠️  Product "${product.name}" has no sizes defined, skipping...`);
        continue;
      }

      const productInventory = {
        id: product.id,
        name: product.name,
        price: product.default_price?.unit_amount ? (product.default_price.unit_amount / 100) : 0,
        sizes: {}
      };

      let productTotal = 0;

      sizes.forEach(size => {
        const stockKey = `stock_${size}`;
        const stock = parseInt(metadata[stockKey] || '0', 10);
        productInventory.sizes[size] = stock;
        productTotal += stock;
        totalStock += stock;

        if (stock === 0) outOfStockCount++;
        else if (stock <= 5) lowStockCount++;
      });

      productInventory.totalStock = productTotal;
      inventory.push(productInventory);
    }

    // Output based on format
    if (format === 'json') {
      outputJSON(inventory, totalStock, lowStockCount, outOfStockCount);
    } else if (format === 'csv') {
      outputCSV(inventory);
    } else {
      outputConsole(inventory, totalStock, lowStockCount, outOfStockCount);
    }

  } catch (error) {
    console.error('❌ Error fetching inventory:', error.message);
    process.exit(1);
  }
}

function outputConsole(inventory, totalStock, lowStockCount, outOfStockCount) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                   INVENTORY SNAPSHOT                      ');
  console.log('═══════════════════════════════════════════════════════════\n');

  inventory.forEach((item, index) => {
    console.log(`${index + 1}. 📦 ${item.name}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   Price: $${item.price.toFixed(2)}`);
    console.log(`   Total Stock: ${item.totalStock}`);
    
    const sortedSizes = Object.entries(item.sizes).sort((a, b) => {
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
      return sizeOrder.indexOf(a[0]) - sizeOrder.indexOf(b[0]);
    });

    sortedSizes.forEach(([size, stock]) => {
      let status = '✅ OK  ';
      if (stock === 0) status = '❌ OUT ';
      else if (stock <= 5) status = '⚠️  LOW ';
      
      console.log(`      ${size.padEnd(6)}: ${stock.toString().padStart(4)} ${status}`);
    });
    console.log('');
  });

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 SUMMARY`);
  console.log(`   Total Products: ${inventory.length}`);
  console.log(`   Total Stock Units: ${totalStock}`);
  console.log(`   Low Stock Items (≤5): ${lowStockCount}`);
  console.log(`   Out of Stock Items: ${outOfStockCount}`);
  
  const totalValue = inventory.reduce((sum, item) => 
    sum + (item.price * item.totalStock), 0
  );
  console.log(`   Inventory Value: $${totalValue.toFixed(2)}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Alerts
  if (outOfStockCount > 0) {
    console.log(`⚠️  WARNING: ${outOfStockCount} size(s) are OUT OF STOCK!`);
  }
  if (lowStockCount > 0) {
    console.log(`⚠️  NOTICE: ${lowStockCount} size(s) have LOW STOCK (≤5 units)`);
  }
  console.log('');
}

function outputJSON(inventory, totalStock, lowStockCount, outOfStockCount) {
  const output = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProducts: inventory.length,
      totalStockUnits: totalStock,
      lowStockItems: lowStockCount,
      outOfStockItems: outOfStockCount
    },
    products: inventory
  };

  const filename = `inventory-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(output, null, 2));
  console.log(`✅ Exported to ${filename}`);
}

function outputCSV(inventory) {
  const headers = 'Product ID,Product Name,Price,Size,Stock,Status\n';
  const rows = inventory.flatMap(item =>
    Object.entries(item.sizes).map(([size, stock]) => {
      let status = 'IN STOCK';
      if (stock === 0) status = 'OUT OF STOCK';
      else if (stock <= 5) status = 'LOW STOCK';
      
      return `${item.id},"${item.name}",${item.price},${size},${stock},${status}`;
    })
  );

  const csv = headers + rows.join('\n');
  const filename = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
  fs.writeFileSync(filename, csv);
  console.log(`✅ Exported to ${filename}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const format = args.includes('--json') ? 'json' : 
               args.includes('--csv') ? 'csv' : 
               'console';

// Check for Stripe key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set');
  console.error('   Set it in your .env file or export it:');
  console.error('   export STRIPE_SECRET_KEY=sk_test_xxxxx');
  process.exit(1);
}

// Run the export
exportInventorySnapshot(format).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

