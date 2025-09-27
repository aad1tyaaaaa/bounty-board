"use client"

import { useState, useEffect, useCallback } from "react"
import { web3Service } from "@/lib/web3"

export interface WalletState {
  isConnected: boolean
  account: string
  balance: string
  networkId: number | null
  isLoading: boolean
  error: string | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    account: "",
    balance: "0",
    networkId: null,
    isLoading: false,
    error: null,
  })

  const updateWalletInfo = useCallback(async (account: string) => {
    try {
      if (window.ethereum) {
        const { BrowserProvider, formatEther } = await import("ethers")
        const provider = new BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(account)
        const network = await provider.getNetwork()

        setState((prev) => ({
          ...prev,
          balance: formatEther(balance),
          networkId: Number(network.chainId),
          error: null,
        }))
      }
    } catch (error) {
      console.error("Error updating wallet info:", error)
      setState((prev) => ({
        ...prev,
        error: "Failed to load wallet information",
      }))
    }
  }, [])

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await web3Service.connectWallet()

      if (result.success && result.account) {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: result.account!,
          isLoading: false,
        }))

        await updateWalletInfo(result.account)
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || "Failed to connect wallet",
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "An unexpected error occurred",
      }))
    }
  }, [updateWalletInfo])

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      account: "",
      balance: "0",
      networkId: null,
      isLoading: false,
      error: null,
    })
  }, [])

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setState((prev) => ({
              ...prev,
              isConnected: true,
              account: accounts[0],
            }))
            await updateWalletInfo(accounts[0])
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()
  }, [updateWalletInfo])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== state.account) {
        setState((prev) => ({
          ...prev,
          account: accounts[0],
        }))
        updateWalletInfo(accounts[0])
      }
    }

    const handleChainChanged = (chainId: string) => {
      setState((prev) => ({
        ...prev,
        networkId: Number.parseInt(chainId, 16),
      }))
      if (state.account) {
        updateWalletInfo(state.account)
      }
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [state.account, disconnect, updateWalletInfo])

  return {
    ...state,
    connect,
    disconnect,
    refresh: () => state.account && updateWalletInfo(state.account),
  }
}
