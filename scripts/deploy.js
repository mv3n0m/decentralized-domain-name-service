
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const NAME = "ETH Daddy"
  const SYMBOL = "ETHD"

  const ETHDaddy = await ethers.getContractFactory('ETHDaddy')
  const ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL)
  await ethDaddy.deployed()

  console.log(`Deployed Domain Contact at: ${ ethDaddy.address }\n`)

  const domains = {
    "hydrogen.eth": tokens(2),
    "helium.eth": tokens(6),
    "lithium.eth": tokens(11),
    "beryllium.eth": tokens(20),
    "boron.eth": tokens(30),
    "carbon.eth": tokens(42)
  }

  Object.entries(domains).forEach(async ([k, v]) => {
    const transaction = await ethDaddy.connect(deployer).listDomain(k, v)
    await transaction.wait()

    console.log(`Listed Domain ${ k } @ ${ v } tokens.`)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
