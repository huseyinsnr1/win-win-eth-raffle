# 🚀 Deployment Guide - WIN WIN ETH Raffle

This guide covers deployment options for the WIN WIN ETH Raffle Mini App to various platforms.

## Table of Contents

1. [Vercel Deployment](#vercel-deployment) (Recommended)
2. [Environment Variables](#environment-variables)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Post-Deployment Checklist](#post-deployment-checklist)
5. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment

Vercel is the recommended platform for deploying this Next.js application.

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Deployed smart contracts on BASE and/or Sepolia

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/win-win-eth-raffle.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   
   In the Vercel dashboard, go to **Settings → Environment Variables** and add:

   ```
   NEXT_PUBLIC_NETWORK=base
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0xYourContractAddress
   NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS=0xYourSepoliaAddress
   ADMIN_SECRET_KEY=your_secure_admin_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   NEXT_PUBLIC_TICKET_PRICE=0.001
   NEXT_PUBLIC_MAX_TICKETS=1000
   NEXT_PUBLIC_ROUND_DURATION=3600
   ```

5. **Deploy**
   - Click **Deploy**
   - Wait for build to complete (usually 1-3 minutes)
   - Visit your deployed site at `your-project.vercel.app`

### Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_NETWORK` | Active network | `base` or `sepolia` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect ID | `abc123def456...` |
| `NEXT_PUBLIC_BASE_CONTRACT_ADDRESS` | BASE contract address | `0x1234...5678` |
| `NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS` | Sepolia contract address | `0xabcd...efgh` |
| `ADMIN_SECRET_KEY` | Admin authentication key | `your-secure-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_TICKET_PRICE` | Ticket price in ETH | `0.001` |
| `NEXT_PUBLIC_MAX_TICKETS` | Max tickets per round | `1000` |
| `NEXT_PUBLIC_ROUND_DURATION` | Round duration (seconds) | `3600` |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging | `false` |

### Getting Required Values

**WalletConnect Project ID:**
1. Visit [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID

**Contract Addresses:**
- Deploy contracts to BASE and Sepolia (see next section)
- Use the deployed contract addresses

---

## Smart Contract Deployment

### Prerequisites

- Hardhat installed: `npm install --save-dev hardhat`
- Private key with ETH for gas fees
- RPC URLs for BASE and Sepolia

### Setup Hardhat

1. **Initialize Hardhat**
   ```bash
   npx hardhat init
   ```

2. **Configure hardhat.config.js**
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: process.env.SEPOLIA_RPC_URL,
         accounts: [process.env.PRIVATE_KEY],
         chainId: 11155111,
       },
       base: {
         url: "https://mainnet.base.org",
         accounts: [process.env.PRIVATE_KEY],
         chainId: 8453,
       },
     },
     etherscan: {
       apiKey: {
         sepolia: process.env.ETHERSCAN_API_KEY,
         base: process.env.BASESCAN_API_KEY,
       },
     },
   };
   ```

3. **Create Deployment Script** (`scripts/deploy.js`)
   ```javascript
   const hre = require("hardhat");

   async function main() {
     const ticketPrice = ethers.parseEther("0.001"); // 0.001 ETH
     const maxTickets = 1000;
     const roundDuration = 3600; // 1 hour

     console.log("Deploying WinWinRaffle...");

     const WinWinRaffle = await hre.ethers.getContractFactory("WinWinRaffle");
     const raffle = await WinWinRaffle.deploy(
       ticketPrice,
       maxTickets,
       roundDuration
     );

     await raffle.waitForDeployment();

     console.log("WinWinRaffle deployed to:", await raffle.getAddress());
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

### Deploy to Sepolia (Testnet)

```bash
# Compile contract
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract (optional)
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "1000000000000000" 1000 3600
```

### Deploy to BASE (Mainnet)

```bash
# Deploy to BASE
npx hardhat run scripts/deploy.js --network base

# Verify contract on BaseScan
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS "1000000000000000" 1000 3600
```

### Get Testnet ETH

**Sepolia Testnet Faucets:**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

**BASE Testnet:**
- Use [BASE Sepolia Bridge](https://bridge.base.org/) to bridge from Sepolia

---

## Post-Deployment Checklist

### Verify Everything Works

- [ ] Website loads correctly
- [ ] Wallet connection works
- [ ] Network switching functions properly
- [ ] Ticket purchase flow completes
- [ ] Admin panel is accessible
- [ ] Leaderboard displays data
- [ ] Contract interactions succeed
- [ ] Mobile responsive design works

### Security Checks

- [ ] Admin secret key is secure and unique
- [ ] Private keys are not exposed in code or logs
- [ ] Environment variables are properly set
- [ ] Contract ownership is transferred to secure wallet
- [ ] Rate limiting is configured
- [ ] HTTPS is enabled (Vercel provides this automatically)

### Performance Optimization

- [ ] Images are optimized
- [ ] Caching is configured
- [ ] Analytics are tracking correctly
- [ ] Error logging is set up
- [ ] Load times are acceptable (<3 seconds)

### Smart Contract Verification

1. **Verify on Etherscan/BaseScan**
   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS CONSTRUCTOR_ARGS
   ```

2. **Test Contract Functions**
   - Call read functions to verify state
   - Test write functions with small amounts
   - Verify events are emitted correctly

3. **Transfer Ownership** (if needed)
   ```javascript
   const contract = await ethers.getContractAt("WinWinRaffle", contractAddress);
   await contract.transferOwnership(newOwnerAddress);
   ```

---

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: Environment variables not found**
- Verify all required variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Wallet Connection Issues

**WalletConnect not working**
- Verify PROJECT_ID is correct
- Check that domain is whitelisted in WalletConnect dashboard
- Clear browser cache

**Network switching fails**
- Ensure RPC URLs are correct
- Check that chain IDs match
- Verify network is added to wallet

### Contract Interaction Fails

**Transaction reverts**
- Check gas fees are sufficient
- Verify contract is not paused
- Ensure user has enough ETH
- Check round status (active, ended, etc.)

**Contract address invalid**
- Verify deployment was successful
- Check contract address in environment variables
- Ensure you're on the correct network

### Performance Issues

**Slow load times**
- Enable Vercel Edge Functions
- Optimize images with Next.js Image component
- Use static generation where possible
- Enable CDN caching

**High gas fees**
- Deploy on BASE (lower fees than mainnet)
- Optimize contract functions
- Batch operations where possible

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [BASE Network Docs](https://docs.base.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [WalletConnect Docs](https://docs.walletconnect.com/)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/yourusername/win-win-eth-raffle/issues)
2. Review the [troubleshooting section](#troubleshooting)
3. Contact the development team
4. Join our community Discord

---

**Happy Deploying! 🚀**
