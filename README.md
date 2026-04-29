# 🚀 OrbitPay – Stellar Token dApp

A production-ready decentralized application (dApp) built on Stellar Soroban that allows users to mint, transfer, and view token balances using the Freighter wallet.

[![CI](https://github.com/Abhishek8281/OrbitPay/actions/workflows/ci.yml/badge.svg)](https://github.com/Abhishek8281/OrbitPay/actions/workflows/ci.yml)

---

## 🌐 Live Demo

👉 https://orbit-pay-frontend.vercel.app/

---

## ✨ Features

* 🔗 Connect wallet (Freighter)
* 🪙 Mint custom tokens
* 💸 Transfer tokens to other users
* 📊 View token balance in real-time

---

## 🛠 Tech Stack

| Layer           | Technology         |
| --------------- | ------------------ |
| Smart Contracts | Rust + Soroban SDK |
| Blockchain      | Stellar (Testnet)  |
| Frontend        | React + TypeScript |
| Build Tool      | Vite               |
| Styling         | Tailwind CSS       |
| Wallet          | Freighter          |

---

## 📱 Screenshots

### Desktop

![Desktop UI](./docs/desktop.png)

### Mobile Responsive

![Mobile UI](./docs/mobile.png)

---

## 📦 Contract Details

| Field            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| Network          | Testnet                                                    |
| Contract ID      | `CCXJ5UCFQLRFKIXQXZQH5ZHQZWUYF5ZCBL45RQOEALNKVIWSMUJCLEQJ` |
| Deployer Address | `GCKMULYRGBQSBKSOBZFWX6NHOOD4NPVVUU3EVXU6ZEM7F5NZSDKGCNUY` |
| Functions        | `init`, `mint`, `transfer`, `balance_of`                   |

---

## 🔗 Example Transaction

https://stellar.expert/explorer/testnet/tx/9d320907cb0fd5a1fb8a0045b8e4712e643a30aa57f67ef20a35a85adfc68205

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Abhishek8281/OrbitPay.git
cd OrbitPay/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🔄 CI/CD

GitHub Actions pipeline automatically builds the frontend on every push.

---

## 📌 Notes

* Inter-contract calls: Not used in this project
* This project demonstrates a complete token lifecycle on Stellar Soroban
* Works on Stellar Testnet with Freighter wallet

---

## 📁 Folder Structure

```
OrbitPay/
├── contracts/         # Soroban smart contracts
├── frontend/          # React frontend
├── .github/workflows/ # CI/CD pipeline
└── README.md
```

---

## 🧾 License

MIT
