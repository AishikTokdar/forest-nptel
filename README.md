# Forest NPTEL Learning Platform

A modern web application for NPTEL Forest course learning and assessment, built with Next.js and TypeScript.

## Features

### Core Features
- 📚 Week-wise content organization
- ✍️ Interactive quiz system with immediate feedback
- ⏱️ Timer-based quiz sessions
- 📊 Real-time score tracking
- 🎯 Progress monitoring
- 📱 Responsive design for all devices
- 🌓 Dark/Light theme support
- 🔄 Dynamic content loading

### Technical Features
- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🎭 Framer Motion for animations
- 📱 Mobile-first responsive design
- 🔍 SEO optimized
- 🚀 Performance optimized
- 🎯 Dynamic imports for code splitting
- 🔄 Optimized font loading
- 🎨 CSS variables for theming

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Virtualization**: TanStack Virtual

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/forest-nptel.git
cd forest-nptel
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm deps:check` - Check for dependency updates
- `pnpm deps:update` - Update dependencies
- `pnpm deps:clean` - Clean and reinstall dependencies

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Select the repository
6. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
7. Click "Deploy"

### Manual Deployment

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

3. The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── about/       # About page
│   ├── quiz/        # Quiz pages
│   ├── study/       # Study material pages
│   └── layout.tsx   # Root layout
├── components/      # React components
├── data/           # Static data
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NPTEL for course content
- Next.js team for the amazing framework
- All contributors who have helped with this project