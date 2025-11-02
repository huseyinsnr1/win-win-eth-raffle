# 🎰 WIN WIN ETH Raffle Mini App

A decentralized Ethereum raffle system built on **BASE Network** and **Ethereum Sepolia Testnet**. This application enables users to participate in fair, transparent, and automated ETH lotteries with real-time wallet connectivity, live leaderboards, and admin controls.

## ✨ Features

- 🎫 **On-Chain Raffle System**: Fully decentralized lottery powered by smart contracts
- 💰 **ETH Prize Pools**: Automatic prize distribution to winners
- 🔗 **Multi-Network Support**: Works on BASE mainnet and Ethereum Sepolia testnet
- 👛 **Wallet Integration**: Seamless WalletConnect support for easy participation
- 📊 **Live Leaderboards**: Real-time tracking of participants and winners
- ⚡ **Gas Fee Optimization**: Efficient smart contract design to minimize costs
- 🎮 **Admin Dashboard**: Control panel for round management and settings
- 📱 **Responsive Design**: Mobile-friendly interface for all devices
- 🔐 **Secure**: Built with OpenZeppelin contracts and security best practices

## 🚀 Tech Stack

- **Frontend**: React 18.3.1, Next.js 15, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Ethers.js v6, WalletConnect
- **Smart Contracts**: Solidity, OpenZeppelin
- **Networks**: BASE (Mainnet), Ethereum Sepolia (Testnet)
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- MetaMask or compatible Web3 wallet
- ETH for gas fees (BASE or Sepolia testnet)
- WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com/))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/win-win-eth-raffle.git
   cd win-win-eth-raffle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your configuration:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID
   - `NEXT_PUBLIC_BASE_CONTRACT_ADDRESS`: Deployed contract address on BASE
   - `NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS`: Deployed contract address on Sepolia
   - `ADMIN_SECRET_KEY`: Your admin authentication key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Smart Contract Deployment

1. **Install Hardhat** (if not already installed)
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Compile the contract**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to Sepolia (Testnet)**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Deploy to BASE (Mainnet)**
   ```bash
   npx hardhat run scripts/deploy.js --network base
   ```

5. **Update environment variables** with the deployed contract addresses

## 🎮 Usage

### For Players

1. **Connect Wallet**: Click "Connect Wallet" and select your Web3 wallet
2. **Select Network**: Choose BASE or Sepolia testnet
3. **Buy Tickets**: Enter the number of tickets you want to purchase
4. **Confirm Transaction**: Approve the transaction in your wallet
5. **Wait for Round End**: Winners are selected automatically when the round ends
6. **Check Results**: View winners on the leaderboard

### For Admins

1. **Access Admin Panel**: Navigate to `/admin`
2. **Authenticate**: Enter your admin secret key
3. **Manage Rounds**: Start new rounds, end current rounds
4. **Configure Settings**: Adjust ticket price, max tickets, round duration
5. **Monitor Activity**: View real-time statistics and participant data

## 🔧 Configuration

### Raffle Parameters

Adjust these values in your `.env` file:

- `NEXT_PUBLIC_TICKET_PRICE`: Price per ticket in ETH (e.g., 0.001)
- `NEXT_PUBLIC_MAX_TICKETS`: Maximum tickets per round (e.g., 1000)
- `NEXT_PUBLIC_ROUND_DURATION`: Round duration in seconds (e.g., 3600 for 1 hour)

### Network Configuration

**BASE Network (Mainnet)**
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

**Ethereum Sepolia (Testnet)**
- Chain ID: 11155111
- RPC: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
- Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com

## 📂 Project Structure

```
win-win-eth-raffle/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main raffle interface
│   │   ├── admin/                # Admin dashboard
│   │   ├── leaderboard/          # Leaderboard page
│   │   └── api/                  # API routes
│   │       ├── buy/              # Ticket purchase endpoint
│   │       ├── admin/            # Admin controls endpoint
│   │       └── leaderboard/      # Leaderboard data endpoint
│   ├── components/               # React components
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   │   └── useAddMiniApp.ts      # Farcaster integration
│   └── lib/                      # Utility functions
├── contracts/
│   └── WinWinRaffle.sol          # Smart contract
├── public/                       # Static assets
├── .env.example                  # Environment template
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔐 Security

- Smart contracts audited and built with OpenZeppelin
- ReentrancyGuard protection against reentrancy attacks
- Pausable functionality for emergency stops
- Admin-only functions protected by access control
- Input validation on all user interactions
- Secure random number generation for winner selection

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Alternative Platforms

- **Netlify**: Follow similar steps as Vercel
- **Railway**: Use the provided railway.json configuration
- **Render**: See DEPLOYMENT_GUIDE.md for detailed instructions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Fails**
- Ensure you have a Web3 wallet installed (MetaMask, Rainbow, etc.)
- Check that you're on the correct network (BASE or Sepolia)
- Clear browser cache and try again

**Transaction Fails**
- Verify you have enough ETH for gas fees
- Check ticket price and number of tickets
- Ensure the round hasn't ended

**Contract Not Found**
- Verify contract addresses in `.env`
- Ensure you're connected to the correct network
- Check that the contract is deployed

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] Multi-chain support (Polygon, Arbitrum, Optimism)
- [ ] NFT ticket integration
- [ ] Automated round scheduling
- [ ] Enhanced analytics dashboard
- [ ] Mobile app version
- [ ] Token rewards system

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- BASE team for the excellent L2 infrastructure
- WalletConnect for seamless wallet integration
- shadcn for the beautiful UI components
- The Ethereum community for ongoing support

---

**Built with ❤️ on BASE** | [Website](#) | [Twitter](#) | [Discord](#)
