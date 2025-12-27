# Image Storage Guide

This document explains how images are stored and served in the BALM Store application.

## Directory Structure

### Frontend (`/frontend/public/img/`)
```
frontend/public/img/
├── logos/                  # Brand logos and header images
│   └── balm-varsity.svg
├── products/              # Product images
│   └── placeholder-product.svg
└── README.md             # Documentation
```

**Access URL**: `http://localhost:5173/img/*`

### Backend (`/backend/public/`)
```
backend/public/
├── images/
│   ├── products/         # Product images (uploaded via admin)
│   │   └── .gitkeep
│   ├── uploads/          # User-uploaded content
│   │   └── .gitkeep
│   └── .gitignore        # Prevents committing uploads
└── README.md            # Documentation
```

**Access URL**: `http://localhost:8000/static/*`

## Usage

### Frontend Images (Static Assets)

1. **Add images**: Place files in `/frontend/public/img/`
   ```bash
   # Example
   cp my-logo.svg frontend/public/img/logos/
   cp product-photo.jpg frontend/public/img/products/
   ```

2. **Reference in code**: Use absolute paths from `/public`
   ```typescript
   // In components
   <img src="/img/logos/balm-varsity.svg" />
   <img src="/img/products/my-product.jpg" />
   
   // In product data (storeProducts.ts)
   image: "/img/products/my-product.jpg"
   ```

### Backend Images (Dynamic/Uploaded)

1. **Upload images**: Place in `/backend/public/images/`
   ```bash
   # Example
   cp uploaded-image.jpg backend/public/images/products/
   ```

2. **Access via URL**:
   ```
   http://localhost:8000/static/images/products/uploaded-image.jpg
   ```

3. **Reference in API**:
   ```python
   # In product data
   image_url = f"{base_url}/static/images/products/product.jpg"
   ```

## Image Guidelines

### Product Images
- **Format**: JPG, PNG, or WEBP
- **Size**: 800x1000px minimum (portrait orientation)
- **File size**: < 2MB per image
- **Naming**: Use descriptive kebab-case names
  - ✅ `balm-cursive-shirt-front.jpg`
  - ❌ `IMG_1234.jpg`

### Logos
- **Format**: SVG preferred (scalable)
- **Fallback**: PNG with transparent background
- **Size**: Original resolution (SVG scales automatically)

## Adding Product Images

### Option 1: Frontend Static Images (Recommended for initial products)

1. Add image to `/frontend/public/img/products/`:
   ```bash
   cp balm-shirt.jpg frontend/public/img/products/
   ```

2. Update product data in `/frontend/src/store/data/storeProducts.ts`:
   ```typescript
   {
     id: "balm-shirt-1",
     title: "BALM Shirt",
     image: "/img/products/balm-shirt.jpg",
     images: [
       "/img/products/balm-shirt.jpg",
       "/img/products/balm-shirt-back.jpg",
       "/img/products/balm-shirt-detail.jpg",
     ],
     // ... other fields
   }
   ```

### Option 2: Backend Dynamic Images (For uploaded/admin content)

1. Upload to backend:
   ```bash
   cp new-product.jpg backend/public/images/products/
   ```

2. Image URL:
   ```
   http://localhost:8000/static/images/products/new-product.jpg
   ```

3. Store URL in database (when using API)

## Git Configuration

### Frontend
- All images in `/frontend/public/img/` are committed to git
- Version control tracks design assets

### Backend
- Images in `/backend/public/images/` are **gitignored**
- Only `.gitkeep` files and README are committed
- Production images should be uploaded dynamically or stored separately

## Production Deployment

### Recommended Approach
1. **Static assets**: Use CDN (Cloudflare, AWS CloudFront)
2. **Uploads**: Use object storage (AWS S3, Google Cloud Storage)
3. **URLs**: Update `API_BASE_URL` in environment variables

### Example Production URLs
```env
# Frontend (.env)
VITE_API_URL=https://api.balmstore.com

# Backend (.env)  
STATIC_URL=https://cdn.balmstore.com
```

## Troubleshooting

### Images not loading?
1. Check file exists: `ls frontend/public/img/products/`
2. Check path in code matches file location
3. Refresh browser (Cmd/Ctrl + Shift + R)
4. Check browser console for 404 errors

### Backend static files not serving?
1. Verify directory exists: `ls backend/public/`
2. Check FastAPI mounted StaticFiles in `main.py`
3. Restart backend server
4. Test URL: `http://localhost:8000/static/README.md`

## Current Images

### Frontend
- ✅ `logos/balm-varsity.svg` - Header logo
- ✅ `products/placeholder-product.svg` - Product placeholder

### Backend
- 🔧 Ready for uploads (empty directories with .gitkeep)

## Next Steps

1. **Add real product images**: Replace placeholder with actual photos
2. **Implement upload API**: Add endpoints for image uploads
3. **Add image optimization**: Resize/compress on upload
4. **Set up CDN**: For production image delivery

