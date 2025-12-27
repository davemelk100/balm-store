# Image Directory Structure

This directory contains all static images for the BALM Store frontend.

## Directory Structure

```
img/
├── logos/          # Brand logos and header images
├── products/       # Product images (main and gallery)
└── README.md       # This file
```

## Image Guidelines

### Product Images

- **Location**: `img/products/`
- **Format**: PNG, JPG, or SVG
- **Recommended size**: 800x1000px minimum
- **Naming convention**: Use descriptive names like `balm-cursive-shirt.png`

### Logos

- **Location**: `img/logos/`
- **Format**: SVG preferred (for scalability)
- **Naming convention**: Use brand-related names like `balm-varsity.svg`

## Adding New Images

1. Place images in the appropriate subdirectory
2. Update product data in `/src/store/data/storeProducts.ts`
3. Use relative paths from `/public`: `/img/products/your-image.png`

## Current Images

- `logos/balm-varsity.svg` - Header logo
- `products/placeholder-product.svg` - Placeholder for missing product images
