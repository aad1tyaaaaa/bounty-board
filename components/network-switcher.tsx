"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Network, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NetworkSwitcherProps {
  currentNetworkId?: number
  targetNetworkId?: number
}

export function NetworkSwitcher({ currentNetworkId, targetNetworkId = 1337 }: NetworkSwitcherProps) {
  const [switching, setSwitching] = useState(false)
  const { toast } = useToast()

  const networks = {
    1: { name: "Ethereum Mainnet", rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY" },
    11155111: { name: "Sepolia Testnet", rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY" },
    1337: { name: "Localhost", rpcUrl: "http://127.0.0.1:8545" },
    31337: { name: "Hardhat", rpcUrl: "http://127.0.0.1:8545" },
  }

  const isCorrectNetwork = currentNetworkId === targetNetworkId
  const currentNetwork = currentNetworkId ? networks[currentNetworkId as keyof typeof networks] : null
  const targetNetwork = networks[targetNetworkId as keyof typeof networks]

  const switchNetwork = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to switch networks",
        variant: "destructive",
      })
      return
    }

    setSwitching(true)
    try {
      // Try to switch to the target network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetNetworkId.toString(16)}` }],
      })

      toast({
        title: "Network Switched",
        description: `Switched to ${targetNetwork?.name}`,
      })
    } catch (error: any) {
      // If the network doesn't exist, add it (for testnets/local networks)
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetNetworkId.toString(16)}`,
                chainName: targetNetwork?.name,
                rpcUrls: [targetNetwork?.rpcUrl],
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          })

          toast({
            title: "Network Added",
            description: `Added and switched to ${targetNetwork?.name}`,
          })
        } catch (addError) {
          toast({
            title: "Failed to Add Network",
            description: "Could not add the network to MetaMask",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Network Switch Failed",
          description: error.message || "Failed to switch network",
          variant: "destructive",
        })
      }
    } finally {
      setSwitching(false)
    }
  }

  if (!currentNetworkId) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Connected to {currentNetwork?.name}</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Network className="h-3 w-3 mr-1" />
            Correct Network
          </Badge>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Wrong Network</p>
            <p className="text-sm">
              Currently on {currentNetwork?.name || "Unknown"}. Switch to {targetNetwork?.name} to use this app.
            </p>
          </div>
          <Button onClick={switchNetwork} disabled={switching} size="sm">
            {switching ? "Switching..." : "Switch Network"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
