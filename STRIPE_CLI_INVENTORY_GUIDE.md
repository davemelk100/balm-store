# Stripe CLI - Inventory Management Guide

## 🚀 Quick Start

The Stripe CLI lets you manage products and inventory metadata without using the dashboard - perfect for bulk updates, scripting, and automation!

## 📥 Installation

### macOS (Homebrew)
```bash
brew install stripe/stripe-cli/stripe
```

### macOS (Direct Download)
```bash
# Download and install
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_darwin_arm64.tar.gz | tar -xz
sudo mv stripe /usr/local/bin/
```

### Linux
```bash
# Download
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_linux_x86_64.tar.gz

# Extract and install
tar -xzf stripe_latest_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Verify Installation
```bash
stripe --version
```

## 🔐 Login to Stripe

```bash
# Login (will open browser for authentication)
stripe login

# Or login with API key directly
stripe login --api-key sk_test_xxxxx
```

## 📦 Managing Products

### List All Products
```bash
# List all active products
stripe products list

# List with expanded default price
stripe products list --expand data.default_price

# Limit results
stripe products list --limit 10
```

### Get a Single Product
```bash
# Replace prod_xxxxx with your product ID
stripe products retrieve prod_xxxxx

# Get with expanded price
stripe products retrieve prod_xxxxx --expand default_price
```

### Create a New Product
```bash
# Basic product
stripe products create \
  --name "BALM Classic T-Shirt" \
  --description "Premium cotton t-shirt with BALM logo" \
  --default-price-data[currency]=usd \
  --default-price-data[unit_amount]=2500

# Product with metadata (including inventory)
stripe products create \
  --name "BALM Classic T-Shirt" \
  --description "Premium cotton t-shirt" \
  --default-price-data[currency]=usd \
  --default-price-data[unit_amount]=2500 \
  --metadata[category]=art \
  --metadata[sizes]="S,M,L,XL,2XL,3XL" \
  --metadata[stock_S]=10 \
  --metadata[stock_M]=15 \
  --metadata[stock_L]=20 \
  --metadata[stock_XL]=12 \
  --metadata[stock_2XL]=8 \
  --metadata[stock_3XL]=5 \
  --metadata[colors]="Black,White,Navy" \
  --metadata[details]="100% cotton, pre-shrunk, machine washable"
```

### Update Product Metadata
```bash
# Update inventory for one size
stripe products update prod_xxxxx \
  --metadata[stock_M]=13

# Update multiple sizes at once
stripe products update prod_xxxxx \
  --metadata[stock_S]=8 \
  --metadata[stock_M]=13 \
  --metadata[stock_L]=18

# Add new sizes
stripe products update prod_xxxxx \
  --metadata[sizes]="S,M,L,XL,2XL,3XL,4XL" \
  --metadata[stock_4XL]=10
```

### Update Product Details
```bash
# Update name and description
stripe products update prod_xxxxx \
  --name "BALM Premium T-Shirt (Updated)" \
  --description "New and improved design"

# Update category
stripe products update prod_xxxxx \
  --metadata[category]=music

# Update colors
stripe products update prod_xxxxx \
  --metadata[colors]="Black,White,Navy,Gray,Red"
```

## 🔢 Managing Inventory via CLI

### Quick Inventory Update
```bash
# After selling 2 Medium shirts
stripe products update prod_xxxxx --metadata[stock_M]=13

# After selling 1 Small and 3 Large
stripe products update prod_xxxxx \
  --metadata[stock_S]=9 \
  --metadata[stock_L]=17
```

### Restock All Sizes
```bash
stripe products update prod_xxxxx \
  --metadata[stock_S]=20 \
  --metadata[stock_M]=25 \
  --metadata[stock_L]=30 \
  --metadata[stock_XL]=20 \
  --metadata[stock_2XL]=15 \
  --metadata[stock_3XL]=10
```

### Check Current Inventory
```bash
# Get product and filter to show only metadata
stripe products retrieve prod_xxxxx | grep -A 20 "metadata"
```

## 📊 Viewing Product Data

### Pretty Print JSON
```bash
# macOS/Linux with jq
stripe products retrieve prod_xxxxx | jq

# View just the metadata
stripe products retrieve prod_xxxxx | jq .metadata

# View inventory specifically
stripe products retrieve prod_xxxxx | jq '.metadata | to_entries | map(select(.key | startswith("stock_")))'
```

### Get All Products with Inventory
```bash
# List all products and show metadata
stripe products list --limit 100 | jq '.data[] | {id, name, metadata}'
```

## 🤖 Automation Scripts

### Bash Script: Update Inventory After Sale

Create `update-inventory.sh`:

```bash
#!/bin/bash

# Usage: ./update-inventory.sh prod_xxxxx M 2
# This decrements Medium stock by 2

PRODUCT_ID=$1
SIZE=$2
QUANTITY=$3

# Get current stock
CURRENT_STOCK=$(stripe products retrieve $PRODUCT_ID | jq -r ".metadata.stock_$SIZE")

if [ "$CURRENT_STOCK" == "null" ]; then
  echo "Error: Size $SIZE not found in product metadata"
  exit 1
fi

# Calculate new stock
NEW_STOCK=$((CURRENT_STOCK - QUANTITY))

if [ $NEW_STOCK -lt 0 ]; then
  echo "Warning: Stock would go negative! Current: $CURRENT_STOCK, Requested: $QUANTITY"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
  NEW_STOCK=0
fi

# Update stock
echo "Updating $SIZE stock: $CURRENT_STOCK → $NEW_STOCK"
stripe products update $PRODUCT_ID --metadata[stock_$SIZE]=$NEW_STOCK

echo "✅ Stock updated successfully"
```

Make it executable:
```bash
chmod +x update-inventory.sh

# Use it
./update-inventory.sh prod_abc123 M 2
```

### Node.js Script: Bulk Update

Create `bulk-update-inventory.js`:

```javascript
#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Define your inventory updates
const inventoryUpdates = [
  { productId: 'prod_abc123', size: 'M', newStock: 13 },
  { productId: 'prod_abc123', size: 'L', newStock: 18 },
  { productId: 'prod_def456', size: 'S', newStock: 8 },
  { productId: 'prod_def456', size: 'XL', newStock: 15 },
];

async function updateInventory(productId, size, newStock) {
  try {
    const command = `stripe products update ${productId} --metadata[stock_${size}]=${newStock}`;
    const { stdout } = await execPromise(command);
    console.log(`✅ Updated ${productId} - ${size}: ${newStock}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${productId} - ${size}:`, error.message);
    return false;
  }
}

async function main() {
  console.log(`Updating ${inventoryUpdates.length} inventory records...\n`);
  
  for (const update of inventoryUpdates) {
    await updateInventory(update.productId, update.size, update.newStock);
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Bulk update complete!');
}

main().catch(console.error);
```

Run it:
```bash
node bulk-update-inventory.js
```

### Python Script: Inventory Report

Create `inventory-report.py`:

```python
#!/usr/bin/env python3

import json
import subprocess

def get_all_products():
    """Fetch all products from Stripe"""
    result = subprocess.run(
        ['stripe', 'products', 'list', '--limit', '100'],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)

def print_inventory_report(products_data):
    """Print inventory report for all products"""
    print("\n" + "="*80)
    print("INVENTORY REPORT")
    print("="*80 + "\n")
    
    for product in products_data.get('data', []):
        name = product.get('name', 'Unknown')
        product_id = product.get('id', '')
        metadata = product.get('metadata', {})
        
        # Extract sizes and stock
        sizes_str = metadata.get('sizes', '')
        sizes = [s.strip() for s in sizes_str.split(',') if s.strip()]
        
        if not sizes:
            continue
            
        print(f"Product: {name}")
        print(f"ID: {product_id}")
        print(f"Stock Levels:")
        
        total_stock = 0
        for size in sizes:
            stock_key = f"stock_{size}"
            stock = metadata.get(stock_key, 'N/A')
            if stock != 'N/A':
                stock = int(stock)
                total_stock += stock
                status = "⚠️  LOW" if stock <= 5 else "✅ OK"
                if stock == 0:
                    status = "❌ OUT"
            else:
                status = "❓ UNKNOWN"
            
            print(f"  {size:6s}: {str(stock):>4s} {status}")
        
        print(f"Total Stock: {total_stock}")
        print("-" * 80 + "\n")

if __name__ == "__main__":
    print("Fetching products from Stripe...")
    products = get_all_products()
    print_inventory_report(products)
```

Make it executable and run:
```bash
chmod +x inventory-report.py
./inventory-report.py
```

## 🎯 Common CLI Workflows

### Workflow 1: Daily Inventory Check
```bash
# Quick check of all products
stripe products list | jq '.data[] | {name, id, metadata}'

# Or use the Python report script
./inventory-report.py
```

### Workflow 2: Process Sales Orders
```bash
# After receiving order notification
# 1. Note product ID and size sold
# 2. Run update script
./update-inventory.sh prod_abc123 M 1
```

### Workflow 3: Weekly Restock
```bash
# Create a restock file: restock-list.txt
# Format: PRODUCT_ID SIZE QUANTITY

# Example restock-list.txt:
# prod_abc123 S 20
# prod_abc123 M 25
# prod_abc123 L 30

# Process the file
while read product_id size quantity; do
  stripe products update $product_id --metadata[stock_$size]=$quantity
  echo "Restocked $product_id - $size: $quantity"
done < restock-list.txt
```

## 🔍 Advanced Queries

### Find Low Stock Products
```bash
# Get all products and filter for low stock (requires jq)
stripe products list --limit 100 | jq '
  .data[] | 
  select(.metadata | to_entries | any(.key | startswith("stock_") and (.value | tonumber) <= 5)) |
  {name, id, low_stock: [.metadata | to_entries | .[] | select(.key | startswith("stock_") and (.value | tonumber) <= 5)]}
'
```

### Find Out of Stock Products
```bash
stripe products list --limit 100 | jq '
  .data[] | 
  select(.metadata | to_entries | any(.key | startswith("stock_") and (.value | tonumber) == 0)) |
  {name, id}
'
```

### Export All Products to CSV
```bash
stripe products list --limit 100 | jq -r '
  ["ID","Name","Category","Sizes","Stock_S","Stock_M","Stock_L","Stock_XL"],
  (.data[] | [.id, .name, .metadata.category, .metadata.sizes, .metadata.stock_S, .metadata.stock_M, .metadata.stock_L, .metadata.stock_XL]) |
  @csv
' > products-inventory.csv
```

## 🪝 Webhook Integration with CLI

### Listen to Webhooks Locally
```bash
# Start webhook listener
stripe listen --forward-to localhost:4242/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
```

### Test Your Webhook Handler
```bash
# If you have a webhook handler running locally
stripe listen --forward-to http://localhost:8888/.netlify/functions/webhook

# Trigger a test checkout
stripe trigger checkout.session.completed
```

## 💡 Pro Tips

### 1. Use Aliases
Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Stripe CLI shortcuts
alias spl='stripe products list'
alias spr='stripe products retrieve'
alias spu='stripe products update'

# Quick inventory check
alias stock='stripe products retrieve $1 | jq .metadata'
```

### 2. Store Product IDs in Environment
```bash
# In your .env or shell config
export BALM_TSHIRT_BLACK="prod_abc123"
export BALM_HOODIE_WHITE="prod_def456"

# Use them
stripe products update $BALM_TSHIRT_BLACK --metadata[stock_M]=15
```

### 3. Create a Makefile
```makefile
.PHONY: inventory-report restock check-stock

inventory-report:
	./inventory-report.py

restock:
	@echo "Processing restock list..."
	@while read product_id size quantity; do \
		stripe products update $$product_id --metadata[stock_$$size]=$$quantity; \
		echo "✅ Restocked $$product_id - $$size: $$quantity"; \
	done < restock-list.txt

check-stock:
	@stripe products list | jq '.data[] | {name, id, metadata}'
```

Usage:
```bash
make inventory-report
make restock
make check-stock
```

## 📚 Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe CLI GitHub](https://github.com/stripe/stripe-cli)
- [Stripe Products API](https://stripe.com/docs/api/products)
- [jq Tutorial](https://stedolan.github.io/jq/tutorial/)

## 🆘 Troubleshooting

### CLI Not Found
```bash
# Check installation
which stripe

# Reinstall if needed (macOS)
brew reinstall stripe/stripe-cli/stripe
```

### Authentication Issues
```bash
# Re-login
stripe login

# Or use API key
export STRIPE_API_KEY=sk_test_xxxxx
stripe products list
```

### Rate Limits
```bash
# Add delays between bulk operations
sleep 0.5  # Wait 500ms between calls
```

### JSON Parsing Errors
```bash
# Install jq if not available
brew install jq  # macOS
sudo apt install jq  # Linux
```

---

**Last Updated:** December 29, 2025  
**Status:** Ready to use - much faster than dashboard!

