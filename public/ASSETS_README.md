# Avatar Assets

This directory contains all avatar parts and the manifest file for the Futur-O-Mat avatar generator.

## Structure

```
public/
├── assets/
│   ├── avatars/              # Avatar component images (241 files)
│   │   ├── accessoires/      # Accessories (bags, scarves, jewelry, etc.)
│   │   ├── bodytype/         # Body types with different skin tones
│   │   ├── brust/            # Breast options
│   │   ├── clothes/          # Clothing items
│   │   ├── face/             # Facial features (lips, nose, beard, eyebrows, eyes)
│   │   ├── hair/             # Hairstyles in different colors
│   │   ├── handicap/         # Assistive devices (wheelchair, cane, glasses)
│   │   ├── head/             # Head shapes with different skin tones
│   │   ├── shoes/            # Footwear
│   │   ├── strengths/        # Visual representations of strengths
│   │   └── values/           # Visual representations of values
│   └── background/           # Background images
└── avatar_parts_manifest.json # Metadata for all avatar parts (241 entries)
```

## Manifest Structure

The `avatar_parts_manifest.json` file contains an array of avatar part objects:

```json
{
  "id": "unique_identifier",
  "src": "assets/avatars/category/filename.png",
  "category": "category_name"
}
```

## Categories

- **accessoires**: Bags, scarves, jewelry, watches, tattoos
- **bodytype**: Body types (Normal, Betont, Breit, Eng) with skin tones (Hell, Braun, Dunkel)
- **brust**: Breast options
- **clothes**: Various clothing items (shirts, dresses, pants, etc.)
- **face**: Facial features (lips, nose, beard, eyebrows, eyes)
- **hair**: Hairstyles in colors (black, blonde, brunette, red, white)
- **handicap**: Assistive devices (wheelchair, cane, glasses)
- **head**: Head shapes (Eckig, Oval, Rund, Wangenknochen) with skin tones
- **shoes**: Footwear options
- **strengths**: Visual symbols for personal strengths
- **values**: Visual symbols for personal values

## Usage

Assets are served by Vite from the public directory and accessible at:

- Manifest: `/avatar_parts_manifest.json`
- Images: `/assets/avatars/[category]/[filename].png`

## Statistics

- Total avatar parts: 241
- Total categories: 11
- Image format: PNG with transparency
