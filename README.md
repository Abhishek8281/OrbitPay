# Stellar Soroban dApp Monorepo

A full-stack monorepo structure for building decentralized applications on the Stellar blockchain using Soroban smart contracts.

## Project Structure

```
stellar-dapp/
├── contracts/           # Soroban smart contracts (Rust)
│   └── hello_world/   # Example contract
├── frontend/          # React + Vite + Tailwind
│   └── src/           # Frontend source code
├── scripts/           # Deployment scripts
├── package.json       # Root workspace config
└── Cargo.toml        # Rust workspace config
```

## Prerequisites

- **Rust** 1.70+ with `wasm32-unknown-unknown` target
- **Node.js** 18+
- **pnpm** (optional, npm workspaces also supported)
- **Freighter Wallet** browser extension (for frontend)

## Quick Start

### 1. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Rust (if cargo not available)
cargo install --locked soroban-cli
```

### 2. Build contracts

```bash
cargo build --manifest-path ./contracts/hello_world/Cargo.toml \
  --target wasm32-unknown-unknown --release
```

### 3. Deploy contract

```bash
./scripts/deploy.sh <SOURCE_SECRET_KEY>
```

### 4. Run frontend

```bash
cd frontend
npm run dev
```

## Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_NETWORK_PASSPHRASE=Test SDF Future Network ; 2023-10-23.1
VITE_CONTRACT_ID=<your-deployed-contract-id>
```

See `.env.example` for available options.

## Smart Contract Development

### Build

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Test

```bash
cargo test --manifest-path ./contracts/hello_world/Cargo.toml
```

### Deploy

```bash
./scripts/deploy.sh <SECRET_KEY>
```

## Frontend Development

### Available scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

### Tech Stack

- **React** 18 with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **stellar-sdk** for Stellar blockchain interaction
- **Freighter API** for wallet integration

## Networks

| Network   | RPC URL                              |
|-----------|--------------------------------------|
| Testnet   | https://soroban-testnet.stellar.org |
| Futurenet | https://soroban-futurenet.stellar.org|

## License

MIT