#!/bin/bash

set -e

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org:443"

if [ -z "$1" ]; then
  echo "Usage: $0 <SOURCE_SECRET_KEY>"
  exit 1
fi

SOURCE_SECRET="$1"

echo "Deploying HelloWorld contract to $NETWORK..."

# Create contract using soroban CLI if available
if command -v soroban &> /dev/null; then
  soroban contract deploy \
    --source-secret-key "$SOURCE_SECRET" \
    --wasm ../contracts/target/wasm32-unknown-unknown/release/hello_world.wasm \
    --rpc-url "$RPC_URL" \
    --network "$NETWORK"
else
  echo "soroban CLI not found. Please install soroban CLI:"
  echo "  cargo install soroban-cli"
  exit 1
fi