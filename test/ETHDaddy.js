const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {

  let ethDaddy;
  let deployer, owner1, owner2;

  const NAME = "Test name"
  const SYMBOL = "TN"

  beforeEach(async () => {
    [ deployer, owner1, owner2 ] = await ethers.getSigners()

    const ETHDaddy = await ethers.getContractFactory('ETHDaddy')
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL)

    const transaction = await ethDaddy.connect(deployer).listDomain("jack.eth", tokens(10))
    await transaction.wait()
  })

  describe("Constructor checks", () => {
    it("confirms the public variable name", async () => {
      const name = await ethDaddy.name()
      expect(name).to.equal(NAME)
    })
  
    it("confirms the public variable symbol", async () => {
      const symbol = await ethDaddy.symbol()
      expect(symbol).to.equal(SYMBOL)
    })

    it("sets the owner", async () => {
      const result = await ethDaddy.owner()
      expect(result).to.equal(deployer.address)
    })
  })

  describe("Domain", () => {
    it("returns domain attributes", async () => {
      let domain = await ethDaddy.getDomain(1)
      expect(domain.name).to.be.equal("jack.eth")
      expect(domain.cost).to.be.equal(tokens(10))
      expect(domain.isOwned).to.be.equal(false)
    })

    it("checks maxSupply", async () => {
      const count = await ethDaddy.maxSupply()
      expect(count).to.equal(1)
    })

    it("checks totalSupply", async () => {
      const count = await ethDaddy.totalSupply()
      expect(count).to.equal(0)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", "ether")

    beforeEach(async () => {
      const transaction = await ethDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it("updates the owner", async () => {
      const owner = await ethDaddy.ownerOf(ID)
      expect(owner).to.be.equal(owner1.address)
    })

    it("updates the contract balance", async () => {
      const balance = await ethDaddy.getBalance()
      expect(balance).to.be.equal(AMOUNT)
    })

    it("updates the domain status", async () => {
      const domain = await ethDaddy.getDomain(ID)
      expect(domain.isOwned).to.be.equal(true)
    })

    it("updates totalSupply", async () => {
      const count = await ethDaddy.totalSupply()
      expect(count).to.equal(1)
    })
  })

  describe("Withdrawal", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await ethDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await ethDaddy.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("updates the deployer's balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it("updates the contract balance", async () => {
      const balance = await ethDaddy.getBalance()
      expect(balance).to.equal(0)
    })
  })
})
