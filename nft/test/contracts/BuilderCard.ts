import hre from "hardhat";
import { expect } from "chai";
import Nft from "../../src/nft/utils";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const CONTRACT_NAME = "BuilderCard";
const URI = "https://token-cdn-domain";

describe(CONTRACT_NAME, function () {
  async function deployBuilderCardFixture() {
    // Contracts are deployed using the first signer/account by default
    const [contractDeployer, otherAccount] = await hre.ethers.getSigners();

    const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);

    const builderCard = await BuilderCard.deploy(URI);

    return { builderCard, contractDeployer, otherAccount };
  }

  describe("#constructor", async function () {
    it(`sets the contract uri to ${URI}`, async function () {
      const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);
      const builderCard = await BuilderCard.deploy(URI);
      builderCard.waitForDeployment();

      const anId = 314592;
      expect(await builderCard.uri(anId)).to.equal(`${URI}/${anId}.json`);
    });
  });

  // TODO: unit test for #uri()

  describe("#uri", function () {
    it("returns the token specific uri", async function () {
      const { builderCard } = await loadFixture(deployBuilderCardFixture);

      const anId = 314592;
      expect(await builderCard.uri(anId)).to.equal(`${URI}/${anId}.json`);
    });
  });

  describe("#collect", function () {
    it("collector balance on input token is increased by 1", async function () {
      const { builderCard, otherAccount: collectorAccount } = await loadFixture(
        deployBuilderCardFixture
      );

      const tokenId = 3234123;

      const previousNumberOfTokens = await builderCard.balanceOf(
        collectorAccount.address,
        tokenId
      );

      // fire
      await builderCard.connect(collectorAccount).collect(tokenId);

      const numberOfTokens = await builderCard.balanceOf(
        collectorAccount.address,
        tokenId
      );

      expect(numberOfTokens).to.equal(previousNumberOfTokens + BigInt("1"));
    });

    it("total supply of the builder token is increased by 1");

    it("total supply of the NFT is increased by 1");

    context("when collector is the first collector of the token", function () {
      it("collector ETH balance should be decreased by 0.00085ETH");

      it("builder gets 0.0005ETH");

      it("platform wallet gets 0.00035ETH");
    });

    context("when collector is not the first one", function () {
      it("collector ETH balance should be decreased by 0.001ETH");
    });

    it("builder gets 0.0005ETH");

    it("platform wallet gets 0.00035ETH");
  });

  describe("#balanceOf specific token", function () {
    // input: 1. owner address
    //        2. token id
    // returns: number of instances of given token this address owns
    it("x");
  });

  describe("#balanceOf any token uniquely", function () {
    // input: 1. owner address
    // returns: number of instances of any unique tokens owner owns
    it("x");
  });

  describe("#balanceOf tokenId", function () {
    it("returns the number of collections for the given token");
  });

  describe("#earnings", function () {
    // input: 1. token id
    // output: returns the ETH earnings for given token id
    // or
    // no input
    // output: returns the ETH earnings for all tokens
    // or
    // no input
    // output: returns the ETH earnings for platform
    it("x");
  });
});
