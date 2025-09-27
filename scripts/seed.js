const { ethers } = require("hardhat")

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"

  const BountyBoard = await ethers.getContractFactory("BountyBoard")
  const bountyBoard = BountyBoard.attach(contractAddress)

  const [deployer, user1, user2] = await ethers.getSigners()

  console.log("Seeding bounties...")

  // Post some sample bounties
  const bounties = [
    {
      title: "Build a React Component",
      description: "Create a reusable button component with TypeScript support and proper styling.",
      reward: ethers.utils.parseEther("0.5"),
    },
    {
      title: "Smart Contract Audit",
      description: "Review and audit a DeFi smart contract for security vulnerabilities.",
      reward: ethers.utils.parseEther("2.0"),
    },
    {
      title: "Logo Design",
      description:
        "Design a modern logo for a blockchain startup. Should be scalable and work in both light and dark themes.",
      reward: ethers.utils.parseEther("1.2"),
    },
    {
      title: "Frontend Bug Fix",
      description: "Fix responsive design issues on mobile devices for an existing React application.",
      reward: ethers.utils.parseEther("0.3"),
    },
    {
      title: "API Integration",
      description: "Integrate third-party payment API with existing Node.js backend.",
      reward: ethers.utils.parseEther("0.8"),
    },
  ]

  for (let i = 0; i < bounties.length; i++) {
    const bounty = bounties[i]
    const signer = i % 2 === 0 ? deployer : user1

    console.log(`Posting bounty: ${bounty.title}`)
    const tx = await bountyBoard.connect(signer).postBounty(bounty.title, bounty.description, { value: bounty.reward })
    await tx.wait()

    // Claim some bounties
    if (i === 1) {
      console.log(`Claiming bounty: ${bounty.title}`)
      const claimTx = await bountyBoard.connect(user2).claimBounty(i + 1)
      await claimTx.wait()
    }
  }

  console.log("Seeding completed!")

  // Display current state
  const bountyCount = await bountyBoard.getBountiesCount()
  console.log(`Total bounties: ${bountyCount}`)

  const allBounties = await bountyBoard.getAllBounties()
  console.log("All bounties:")
  allBounties.forEach((bounty, index) => {
    console.log(
      `${index + 1}. ${bounty.title} - ${ethers.utils.formatEther(bounty.reward)} ETH - Status: ${bounty.status}`,
    )
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
