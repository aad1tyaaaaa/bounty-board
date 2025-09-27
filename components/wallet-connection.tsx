"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, ExternalLink, AlertCircle, ChevronDown } from "lucide-react"
import { web3Service, formatAddress } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WalletConnectionProps {
  isConnected: boolean
  account: string
  onConnectionChange: (connected: boolean) => void
  onAccountChange: (account: string) => void
}

export function WalletConnection({ isConnected, account, onConnectionChange, onAccountChange }: WalletConnectionProps) {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>("")
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkMetaMaskInstallation()
    if (isConnected && account) {
      loadWalletInfo()
    }
  }, [isConnected, account])

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          onConnectionChange(false)
          onAccountChange("")
          setBalance("")
          setNetworkId(null)
        } else if (accounts[0] !== account) {
          // User switched accounts
          onAccountChange(accounts[0])
          loadWalletInfo()
        }
      }

      const handleChainChanged = (chainId: string) => {
        setNetworkId(Number.parseInt(chainId, 16))
        loadWalletInfo()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account, onConnectionChange, onAccountChange])

  const checkMetaMaskInstallation = () => {
    setIsMetaMaskInstalled(typeof window !== "undefined" && typeof window.ethereum !== "undefined")
  }

  const loadWalletInfo = async () => {
    try {
      if (window.ethereum && account) {
        const provider = new (await import("ethers")).BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(account)
        const network = await provider.getNetwork()

        setBalance((await import("ethers")).formatEther(balance))
        setNetworkId(Number(network.chainId))
      }
    } catch (error) {
      console.error("Error loading wallet info:", error)
    }
  }

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await web3Service.connectWallet()

      if (result.success && result.account) {
        onConnectionChange(true)
        onAccountChange(result.account)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${formatAddress(result.account)}`,
        })
      } else {
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect wallet",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    onConnectionChange(false)
    onAccountChange("")
    setBalance("")
    setNetworkId(null)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet"
      case 11155111:
        return "Sepolia Testnet"
      case 1337:
        return "Localhost"
      case 31337:
        return "Hardhat"
      default:
        return `Chain ID: ${chainId}`
    }
  }

  if (!isMetaMaskInstalled) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>MetaMask is required to use this application</span>
          <Button variant="outline" size="sm" asChild>
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Install MetaMask
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {loading ? "Connecting..." : "Connect Wallet"}
        <span className="ml-1">🔥</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-card/50 border-border/50">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">{formatAddress(account)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Connected Wallet</p>
          <p className="text-xs text-muted-foreground font-mono">{account}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Balance:</span>
            <span className="text-sm font-medium">{Number.parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          {networkId && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">Network:</span>
              <Badge variant="outline" className="text-xs">
                {getNetworkName(networkId)}
              </Badge>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>Copy Address</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            View on Etherscan
            <ExternalLink className="ml-auto h-4 w-4" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-red-600">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
