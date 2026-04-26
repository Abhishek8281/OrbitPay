#!/bin/bash

set -e

CONTRACT_NAME="hello_world"
NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org:443"

echo "Building Soroban contract..."

cd "$(dirname "$0")/../contracts"

cargo build --target wasm32-unknown-unknown --release

WASM_PATH="target/wasm32-unknown-unknown/release/${CONTRACT_NAME}.wasm"

if [ ! -f "$WASM_PATH" ]; then
  echo "Error: Contract WASM not found at $WASM_PATH"
  exit 1
fi

echo "Contract built successfully: $WASM_PATH"
echo "To deploy, use the deploy script with:"
echo "  ./scripts/deploy.sh <SOURCE_SECRET_KEY>"