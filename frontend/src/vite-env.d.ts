/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STELLAR_RPC_URL: string
  readonly VITE_NETWORK: string
  readonly VITE_TOKEN_CONTRACT: string
  readonly VITE_HELPER_CONTRACT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
