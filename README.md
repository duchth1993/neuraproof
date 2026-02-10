# NeuraProof - Onchain Income Verification dApp

![NeuraProof Banner](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop)

## Overview

NeuraProof is a decentralized application (dApp) that enables Web3 freelancers to create verifiable, on-chain proofs of their income. Built on Neura Testnet, it allows freelancers to mint soulbound NFTs containing their verified income metrics, which can be used for credit applications, rental agreements, and other financial verifications.

## Features

### 🔍 Wallet Income Analysis
- Scans connected wallet for incoming $USN token transfers
- Calculates monthly average income, payment frequency, and unique employer count
- Analyzes last 6 months of transaction history

### 🎨 Income Proof NFT (ERC-721)
- Mints non-transferable (soulbound) NFTs with verified income metrics
- On-chain metadata includes: wallet address, verification timestamp, average monthly income, payment frequency, employer count, and verification hash
- Third-party verification portal for lenders and landlords

### 🌍 Geo-Compliance Gate
- Jurisdiction checking via on-chain boolean flags
- Blocks minting for non-permitted jurisdictions
- Configurable permitted jurisdiction list

## Tech Stack

### Smart Contracts (Solidity)
- `NeuraProofNFT.sol` - ERC-721 compliant NFT contract with income metadata storage
- `NeuraPay.sol` - Mock payroll contract for demonstrating income verification
- `MockUSN.sol` - Mock USN stablecoin for testing

### Frontend (React + TypeScript)
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- ethers.js for blockchain interactions

## Getting Started

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Some testnet ANKR for gas fees

### Installation

```bash
# Clone the repository
git clone https://github.com/duchth1993/neuraproof.git
cd neuraproof

# Install dependencies
npm install

# Start development server
npm run dev
```

### Connecting to Neura Testnet

The app will automatically prompt you to add Neura Testnet to MetaMask:

- **Network Name:** Neura Testnet
- **Chain ID:** 267
- **RPC URL:** https://rpc.ankr.com/neura_testnet
- **Currency Symbol:** ANKR
- **Block Explorer:** https://testnet.explorer.neura.network

## Contract Addresses (Neura Testnet)

| Contract | Address |
|----------|---------|
| NeuraProofNFT | `0x742d35Cc6634C0532925a3b844Bc9e7595f1E123` |
| NeuraPay | `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199` |
| MockUSN | `0xdD2FD4581271e230360230F9337D5c0430Bf44C0` |

## Usage

### For Freelancers

1. **Connect Wallet** - Click "Connect Wallet" and approve the connection
2. **Scan Income** - The app automatically scans your wallet for income transactions
3. **Review Metrics** - View your calculated income metrics on the dashboard
4. **Select Jurisdiction** - Choose your jurisdiction for compliance
5. **Mint Proof** - Click "Mint Income Proof NFT" to create your verifiable proof

### For Verifiers (Lenders/Landlords)

1. **Navigate to Verify** - Click the "Verify" tab in the navigation
2. **Enter Details** - Input the Token ID, Verification Hash, or Wallet Address
3. **View Results** - See the verified income metrics and proof validity

## Smart Contract Functions

### NeuraProofNFT

```solidity
// Mint an income proof NFT
function mintIncomeProof(
    address recipient,
    uint256 averageMonthlyIncome,
    string memory paymentFrequency,
    uint256 employerCount,
    string memory jurisdictionCode,
    string memory tokenURI_
) external returns (uint256)

// Verify an income proof (for third parties)
function verifyIncomeProof(uint256 tokenId) external view returns (
    bool isValid,
    address walletAddress,
    uint256 verificationTimestamp,
    uint256 averageMonthlyIncome,
    string memory paymentFrequency,
    uint256 employerCount,
    bytes32 verificationHash
)

// Check jurisdiction permission
function isJurisdictionPermitted(string memory jurisdictionCode) public view returns (bool)
```

## Project Structure

```
neuraproof/
├── contracts/
│   ├── NeuraProofNFT.sol    # Main NFT contract
│   ├── NeuraPay.sol         # Mock payroll contract
│   └── MockUSN.sol          # Mock stablecoin
├── src/
│   ├── components/
│   │   ├── Background.tsx   # Animated background
│   │   ├── Dashboard.tsx    # Income dashboard
│   │   ├── Header.tsx       # App header with wallet
│   │   ├── History.tsx      # NFT history view
│   │   ├── MintProof.tsx    # Minting interface
│   │   ├── Navigation.tsx   # Bottom navigation
│   │   ├── Toast.tsx        # Toast notifications
│   │   └── Verify.tsx       # Verification portal
│   ├── store/
│   │   └── useStore.ts      # Zustand state management
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── utils/
│   │   ├── mockData.ts      # Mock data generators
│   │   └── wallet.ts        # Wallet utilities
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── public/
│   └── favicon.svg          # App favicon
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Security Considerations

- **Soulbound NFTs**: Income proof NFTs are non-transferable by default to prevent fraud
- **Verification Hash**: Each proof includes a unique cryptographic hash for authenticity
- **Jurisdiction Compliance**: Built-in geo-blocking for regulatory compliance
- **Admin Controls**: Contract owner can invalidate fraudulent proofs

## Demo Video Storyboard

**Format:** vertical (9:16), MP4/WebM

1. **Scene 1**: Freelancer connects Rabby wallet with glowing animation
2. **Scene 2**: Income scanning animation with data populating in real-time
3. **Scene 3**: NFT minting transaction confirmation and success celebration
4. **Scene 4**: Lender verification view showing "Verified & Valid" status

**Style:** Dark mysterious gradient, cyberpunk tech aesthetic, animated text overlay: "Your Payroll = Your Credit"

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Support

For support, please open an issue on GitHub or reach out on Discord.

---

**Built with ❤️ for the Web3 freelancer community**
