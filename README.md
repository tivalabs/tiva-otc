# TIVA OTC | Institutional Liquidity Layer

![License](https://img.shields.io/badge/license-Private-blue.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)
![Network](https://img.shields.io/badge/network-Canton-gold.svg)

**Tiva OTC** is a premium, institutional-grade Over-The-Counter (OTC) trading terminal built on the **Canton Network**. It leverages **Daml** smart contracts to enable atomic, risk-free settlement of digital assets with absolute privacy and regulatory compliance.

## ✨ Key Features

- **Atomic Settlement**: Trades settle instantly in a single transaction. Zero counterparty risk, no partial fills.
- **Privacy Preserved**: Transaction details are visible only to the involved parties. Market-wide data is aggregated anonymously.
- **Institutional Compliance**: Built-in identity management and regulatory controls powered by Daml.
- **Atmospheric UI**: A "Black Gold" futurism aesthetic offering a premium, high-frequency trading terminal experience.

## 🛠️ Technology Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Ledger Integration**: @daml/ledger, @daml/types
- **Smart Contracts**: Daml (Digital Asset Modeling Language)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to a running Canton Ledger instance (for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tivalabs/tiva-otc.git
   cd tiva-otc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file (optional for local dev overrides):
   ```env
   NEXT_PUBLIC_LEDGER_BASE_URL=http://localhost:7575
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── market/          # Live Market Feed
│   ├── create/          # Offer Creation
│   └── my-offers/       # User Portfolio
├── components/
│   ├── layout/          # Header, Hero, Sidebar
│   ├── market/          # Market-specific components (OfferList, Card)
│   └── ui/              # Reusable UI primitives (Button, Input, Modal)
├── lib/                 # Utilities and Types
└── styles/              # Global CSS and Tailwind directives
```

## 🎨 Design System

The platform features a custom **"Black Gold"** theme:
- **Primary**: Gold Gradient (Linear gradients simulating metallic sheen)
- **Background**: Deep Black/Charcoal with atmospheric radial glows.
- **Effects**: Glassmorphism, Scanlines, and Staggered Animations.

## 🤝 Contributing

This is a private repository for Tiva Labs. Access is restricted to authorized personnel.

---

© 2026 Tiva Labs. Powered by Canton Network.
