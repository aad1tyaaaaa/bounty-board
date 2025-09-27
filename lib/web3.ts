import { ethers } from "ethers"

// Contract ABI (complete version)
export const BOUNTY_BOARD_ABI = [
  "function postBounty(string memory title, string memory description) external payable returns (uint256)",
  "function claimBounty(uint256 bountyId) external",
  "function completeBounty(uint256 bountyId) external",
  "function approveBounty(uint256 bountyId) external",
  "function getBounty(uint256 bountyId) external view returns (tuple(uint256 id, address poster, address worker, string title, string description, uint256 reward, uint8 status, uint256 createdAt))",
  "function getBountiesCount() external view returns (uint256)",
  "function getAllBounties() external view returns (tuple(uint256 id, address poster, address worker, string title, string description, uint256 reward, uint8 status, uint256 createdAt)[])",
  "function getOpenBounties() external view returns (tuple(uint256 id, address poster, address worker, string title, string description, uint256 reward, uint8 status, uint256 createdAt)[])",
  "function getUserBounties(address user) external view returns (tuple(uint256 id, address poster, address worker, string title, string description, uint256 reward, uint8 status, uint256 createdAt)[])",
  "event BountyPosted(uint256 indexed bountyId, address indexed poster, string title, uint256 reward)",
  "event BountyClaimed(uint256 indexed bountyId, address indexed worker)",
  "event BountyCompleted(uint256 indexed bountyId, address indexed worker)",
  "event BountyApproved(uint256 indexed bountyId, address indexed poster, address indexed worker, uint256 reward)",
]

// Mock contract address (replace with actual deployed contract)
export const BOUNTY_BOARD_ADDRESS = "0x1234567890123456789012345678901234567890"

export interface Bounty {
  id: number
  poster: string
  worker: string
  title: string
  description: string
  reward: string
  status: BountyStatus
  createdAt: number
}

export enum BountyStatus {
  Open = 0,
  Claimed = 1,
  Completed = 2,
  Approved = 3,
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null

  async connectWallet(): Promise<{ success: boolean; account?: string; error?: string }> {
    try {
      if (!window.ethereum) {
        return { success: false, error: "MetaMask not found. Please install MetaMask." }
      }

      this.provider = new ethers.BrowserProvider(window.ethereum)
      await this.provider.send("eth_requestAccounts", [])
      this.signer = await this.provider.getSigner()
      const account = await this.signer.getAddress()

      this.contract = new ethers.Contract(BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI, this.signer)

      return { success: true, account }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async postBounty(title: string, description: string, reward: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.contract) throw new Error("Contract not initialized")

      const rewardWei = ethers.parseEther(reward)
      const tx = await this.contract.postBounty(title, description, { value: rewardWei })
      await tx.wait()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async claimBounty(bountyId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.contract) throw new Error("Contract not initialized")

      const tx = await this.contract.claimBounty(bountyId)
      await tx.wait()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async completeBounty(bountyId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.contract) throw new Error("Contract not initialized")

      const tx = await this.contract.completeBounty(bountyId)
      await tx.wait()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async approveBounty(bountyId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.contract) throw new Error("Contract not initialized")

      const tx = await this.contract.approveBounty(bountyId)
      await tx.wait()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getAllBounties(): Promise<Bounty[]> {
    try {
      if (!this.contract) {
        // Return mock data for development
        return this.getMockBounties()
      }

      const bounties = await this.contract.getAllBounties()
      return bounties.map((bounty: any) => ({
        id: Number(bounty.id),
        poster: bounty.poster,
        worker: bounty.worker,
        title: bounty.title,
        description: bounty.description,
        reward: ethers.formatEther(bounty.reward),
        status: bounty.status,
        createdAt: Number(bounty.createdAt),
      }))
    } catch (error) {
      console.error("Error fetching bounties:", error)
      return this.getMockBounties()
    }
  }

  async getOpenBounties(): Promise<Bounty[]> {
    try {
      if (!this.contract) {
        return this.getMockBounties().filter((b) => b.status === BountyStatus.Open)
      }

      const bounties = await this.contract.getOpenBounties()
      return bounties.map((bounty: any) => ({
        id: Number(bounty.id),
        poster: bounty.poster,
        worker: bounty.worker,
        title: bounty.title,
        description: bounty.description,
        reward: ethers.formatEther(bounty.reward),
        status: bounty.status,
        createdAt: Number(bounty.createdAt),
      }))
    } catch (error) {
      console.error("Error fetching open bounties:", error)
      return this.getMockBounties().filter((b) => b.status === BountyStatus.Open)
    }
  }

  async getUserBounties(userAddress: string): Promise<Bounty[]> {
    try {
      if (!this.contract) {
        return this.getMockBounties().filter(
          (b) =>
            b.poster.toLowerCase() === userAddress.toLowerCase() ||
            b.worker.toLowerCase() === userAddress.toLowerCase(),
        )
      }

      const bounties = await this.contract.getUserBounties(userAddress)
      return bounties.map((bounty: any) => ({
        id: Number(bounty.id),
        poster: bounty.poster,
        worker: bounty.worker,
        title: bounty.title,
        description: bounty.description,
        reward: ethers.formatEther(bounty.reward),
        status: bounty.status,
        createdAt: Number(bounty.createdAt),
      }))
    } catch (error) {
      console.error("Error fetching user bounties:", error)
      return this.getMockBounties().filter(
        (b) =>
          b.poster.toLowerCase() === userAddress.toLowerCase() || b.worker.toLowerCase() === userAddress.toLowerCase(),
      )
    }
  }

  private getMockBounties(): Bounty[] {
    return [
      {
        id: 1,
        poster: "0x1234567890123456789012345678901234567890",
        worker: "0x0000000000000000000000000000000000000000",
        title: "Build a React Component",
        description: "Create a reusable button component with TypeScript support and proper styling.",
        reward: "0.5",
        status: BountyStatus.Open,
        createdAt: Date.now() - 86400000,
      },
      {
        id: 2,
        poster: "0x2345678901234567890123456789012345678901",
        worker: "0x3456789012345678901234567890123456789012",
        title: "Smart Contract Audit",
        description: "Review and audit a DeFi smart contract for security vulnerabilities.",
        reward: "2.0",
        status: BountyStatus.Claimed,
        createdAt: Date.now() - 172800000,
      },
      {
        id: 3,
        poster: "0x4567890123456789012345678901234567890123",
        worker: "0x0000000000000000000000000000000000000000",
        title: "Logo Design",
        description:
          "Design a modern logo for a blockchain startup. Should be scalable and work in both light and dark themes.",
        reward: "1.2",
        status: BountyStatus.Open,
        createdAt: Date.now() - 259200000,
      },
    ]
  }
}

export const web3Service = new Web3Service()

// Utility functions
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  return "Just now"
}

declare global {
  interface Window {
    ethereum?: any
  }
}
