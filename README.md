# Futur-O-Mat Avatar Generator

A modern React TypeScript application for creating personalized avatars with customizable physical appearance, values, and strengths.

## 🚀 Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite
- **UI Components**: shadcn/ui (New York style)
- **Font**: Poppins (Google Fonts)

## 🎨 Design System

### Brand Colors

- **Primary (Violet)**: `#61398d`
- **Accent (Yellow)**: `#F59E0B`
- **Background**: `#FAFAFF` (Light violet tint)

### Typography

- Font Family: Poppins (400, 500, 600, 700, 800)

## 📦 Project Structure

```
avatar-generator/
├── .kiro/specs/          # Feature specifications and design docs
├── old/                  # Original vanilla JS/PHP implementation
├── public/               # Static assets served by Vite
│   ├── assets/          # Avatar parts images
│   │   ├── avatars/     # Avatar component images
│   │   └── background/  # Background images
│   └── avatar_parts_manifest.json  # Avatar parts metadata
├── src/
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── data/            # Data loaders and constants
│   ├── types/           # TypeScript type definitions
│   ├── lib/             # Utilities
│   ├── App.tsx
│   └── index.css        # Global styles with theme
├── assets/              # Original avatar parts (reference)
└── ...
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## 📋 Implementation Status

This project is being developed following a spec-driven approach. See `.kiro/specs/avatar-generator-migration/` for:

- `requirements.md` - Feature requirements in EARS format
- `design.md` - Technical design and architecture
- `tasks.md` - Implementation task list
- `SETUP_COMPLETE.md` - Setup completion summary

### Completed Tasks

- ✅ Task 1: Project setup and migration preparation
- ✅ Task 2: Core type definitions and data structures
- ✅ Task 3: Asset migration and management

### Next Steps

- Task 4: Custom hooks implementation
- Task 5: Core avatar rendering system
- Task 6: UI component implementation
- And more...

## 📁 Asset Management

Avatar assets are managed through Vite's public directory:

- **Location**: `public/assets/avatars/`
- **Manifest**: `public/avatar_parts_manifest.json`
- **Access**: Assets are served at `/assets/avatars/...` in the browser
- **Categories**: accessoires, bodytype, brust, clothes, face, hair, handicap, head, shoes, strengths, values

The manifest file contains metadata for all avatar parts including:

- `id`: Unique identifier for the part
- `src`: Path to the image file (relative to public directory)
- `category`: Category the part belongs to

## 🎯 Features (Planned)

- Customizable avatar appearance (head, face, hair, body, clothes, accessories)
- Values and strengths selection
- Random avatar generation
- Download avatar as PNG
- Share avatar via URL
- Responsive design for mobile and desktop
- Progress tracking

## 📝 License

See `old/LICENCE` for license information.

## 🔗 Original Implementation

The original vanilla JavaScript/PHP implementation is preserved in the `old/` directory for reference.
