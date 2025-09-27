# Bounty Board 🏆

A decentralized bounty board platform built with Next.js, Hardhat, and Web3 technologies. Connect your wallet, post bounties, and earn rewards for completing tasks! 🚀

## Features ✨

- 🔗 **Wallet Integration**: Connect your Ethereum wallet seamlessly
- 📝 **Post Bounties**: Create and manage bounty listings
- 🎯 **Bounty Dashboard**: Track your posted and claimed bounties
- 📊 **Activity Feed**: Stay updated with platform activities
- 🌐 **Multi-Network Support**: Switch between different blockchain networks
- 🎨 **Modern UI**: Beautiful, responsive interface with dark/light themes

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Ethereum, Hardhat, Solidity
- **Web3**: ethers.js, wagmi
- **Package Manager**: pnpm

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bounty-board.git
   cd bounty-board
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Deploy smart contracts (optional)**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application! 🎉

## Smart Contract 📄

The platform uses a Solidity smart contract (`BountyBoard.sol`) for managing bounties on-chain.

### Contract Features:
- 💰 Bounty creation and claiming
- 🔒 Secure escrow system
- ✅ Bounty completion verification
- 💸 Reward distribution

## Scripts 📜

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `npx hardhat compile` - Compile smart contracts
- `npx hardhat test` - Run contract tests

## Project Structure 📁

```
bounty-board/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── contracts/             # Solidity smart contracts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
├── scripts/               # Deployment and seed scripts
└── styles/                # Global styles
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request. 📥

1. Fork the project 🍴
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request ✨

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Connect with Us 🌐

- 🐦 Twitter: [@bountyboard](https://twitter.com/bountyboard)
- 💬 Discord: [Join our community](https://discord.gg/bountyboard)
- 📧 Email: hello@bountyboard.com

---

Made with ❤️ and lots of ☕ by the Bounty Board team
