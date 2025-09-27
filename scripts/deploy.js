const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying BountyBoard contract...")

  // Get the ContractFactory and Signers here.
  const BountyBoard = await ethers.getContractFactory("BountyBoard")
  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()
  const hre = require("hardhat")

  console.log("Deploying contracts with the account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy the contract
  const bountyBoard = await BountyBoard.deploy()
  await bountyBoard.deployed()

  console.log("BountyBoard deployed to:", bountyBoard.address)

  // Verify the contract on Etherscan (optional)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await bountyBoard.deployTransaction.wait(6)

    console.log("Verifying contract on Etherscan...")
    try {
      await hre.run("verify:verify", {
        address: bountyBoard.address,
        constructorArguments: [],
      })
    } catch (e) {
      console.log("Verification failed:", e.message)
    }
  }

  return bountyBoard
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
