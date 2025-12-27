# Backend Public Directory

This directory contains static files served by the FastAPI backend.

## Directory Structure

```
public/
├── images/
│   ├── products/   # Product images uploaded via admin
│   └── uploads/    # User-uploaded content
└── README.md       # This file
```

## Usage

### Serving Static Files

The backend serves these files at: `http://localhost:8000/static/`

Example:

- File: `public/images/products/shirt.png`
- URL: `http://localhost:8000/static/images/products/shirt.png`

### Uploading Images

Images can be uploaded through:

1. Admin panel
2. API endpoints (when implemented)
3. Direct file placement (for development)

### Image Guidelines

- **Max file size**: 10MB recommended
- **Formats**: PNG, JPG, JPEG, WEBP, SVG
- **Products**: High-resolution images (1200x1600px recommended)
- **Thumbnails**: Generate automatically if needed

## Security

- Only allow trusted image uploads
- Validate file types and sizes
- Sanitize filenames
- Use secure storage for production
