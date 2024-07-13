import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { platform } from "os";

const CONTRACT_NAME = "BuilderCard";
const URI = "https://token-cdn-domain";

describe(CONTRACT_NAME, function () {
  async function deployBuilderCardFixture() {
    // Contracts are deployed using the first signer/account by default
    const [
      contractDeployer,
      otherAccount,
      platformAccount,
      otherCollector,
      builderAccount,
    ] = await hre.ethers.getSigners();

    const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);

    const builderCard = await BuilderCard.deploy(URI, platformAccount.address);

    return {
      builderCard,
      contractDeployer,
      otherAccount,
      platformAccount,
      otherCollector,
      builderAccount,
    };
  }

  describe("#constructor", async function () {
    it(`sets the contract uri to ${URI}`, async function () {
      const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);
      const platformAccount = hre.ethers.Wallet.createRandom();
      const builderCard = await BuilderCard.deploy(
        URI,
        platformAccount.address
      );
      builderCard.waitForDeployment();

      const anId = 314592;
      expect(await builderCard.uri(anId)).to.equal(`${URI}/${anId}.json`);
    });
  });

  describe("#uri", function () {
    it("returns the token specific uri", async function () {
      const { builderCard } = await loadFixture(deployBuilderCardFixture);

      const anId = 314592;
      expect(await builderCard.uri(anId)).to.equal(`${URI}/${anId}.json`);
    });
  });

  describe("#collect", function () {
    it("collector balance on input token is increased by 1", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const previousNumberOfTokens = await builderCard.balanceOfCollector(
        collectorAccount.address,
        builderAccount.address
      );

      // fire
      const weiForValue = hre.ethers.parseEther("100");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      const numberOfTokens = await builderCard.balanceOfCollector(
        collectorAccount.address,
        builderAccount.address
      );

      expect(numberOfTokens).to.equal(previousNumberOfTokens + BigInt("1"));
    });

    it("total supply of the builder token is increased by 1", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const balanceOfBuilderBefore = await builderCard.balanceOfBuilder(
        builderAccount.address
      );

      // fire
      const weiForValue = hre.ethers.parseEther("100");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      const balanceOfBuilderAfter = await builderCard.balanceOfBuilder(
        builderAccount.address
      );

      expect(balanceOfBuilderAfter).to.equal(balanceOfBuilderBefore + 1n);
    });

    it("total supply of the NFT is increased by 1", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const balanceOfNFTBefore = await builderCard.balance();

      // fire
      const weiForValue = hre.ethers.parseEther("100");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      const balanceOfNFTAfter = await builderCard.balance();

      expect(balanceOfNFTAfter).to.equal(balanceOfNFTBefore + 1n);
    });

    context("when collector is the first collector of the token", function () {
      it("collector should pay 0.001ETH plus tx cost minus the first collector reward which is 0.0003ETH", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const collectorEthBalanceBefore = await hre.ethers.provider.getBalance(
          collectorAccount.address
        );

        // fire
        const weiForValue = hre.ethers.parseEther("0.001");

        const tx = await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });
        const txReceipt = await tx.wait();
        const gasUsed = txReceipt?.gasUsed || 0n;
        const gasPrice = txReceipt?.gasPrice || 0n;
        const txCost = gasUsed * gasPrice;

        const collectorEthBalanceAfter = await hre.ethers.provider.getBalance(
          collectorAccount.address
        );

        const expectedCollectorEthBalanceAfter =
          collectorEthBalanceBefore -
          weiForValue -
          txCost +
          hre.ethers.parseEther("0.0003");

        expect(collectorEthBalanceAfter).to.equal(
          expectedCollectorEthBalanceAfter
        );
      });

      it("builder gets 0.0005ETH", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const builderEthBalanceBefore = await hre.ethers.provider.getBalance(
          builderAccount.address
        );

        // fire
        const weiForValue = hre.ethers.parseEther("100");

        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });

        const builderEthBalanceAfter = await hre.ethers.provider.getBalance(
          builderAccount.address
        );

        expect(builderEthBalanceAfter).to.equal(
          builderEthBalanceBefore + hre.ethers.parseEther("0.0005")
        );
      });

      it("platform wallet gets 0.0002ETH", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          platformAccount,
          builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const platformEthBalanceBefore = await hre.ethers.provider.getBalance(
          platformAccount.address
        );

        // fire
        const weiForValue = hre.ethers.parseEther("100");

        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });

        const platformEthBalanceAfter = await hre.ethers.provider.getBalance(
          platformAccount.address
        );

        expect(platformEthBalanceAfter).to.equal(
          platformEthBalanceBefore + hre.ethers.parseEther("0.0002")
        );
      });
    });

    context("when collector is not the first one", function () {
      it("collector should pay 0.001ETH plus tx cost", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          otherCollector,
          builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const collectorEthBalanceBefore = await hre.ethers.provider.getBalance(
          collectorAccount.address
        );

        const weiForValue = hre.ethers.parseEther("0.001");

        // another collector has already collected first
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount.address, { value: weiForValue });

        // fire
        const tx = await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });
        const txReceipt = await tx.wait();
        const gasUsed = txReceipt?.gasUsed || 0n;
        const gasPrice = txReceipt?.gasPrice || 0n;
        const txCost = gasUsed * gasPrice;

        const collectorEthBalanceAfter = await hre.ethers.provider.getBalance(
          collectorAccount.address
        );

        const expectedCollectorEthBalanceAfter =
          collectorEthBalanceBefore - weiForValue - txCost;

        expect(collectorEthBalanceAfter).to.equal(
          expectedCollectorEthBalanceAfter
        );
      });

      it("builder gets 0.0005ETH", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          otherCollector,
          builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const weiForValue = hre.ethers.parseEther("0.001");

        // another collector has already collected first
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount.address, { value: weiForValue });

        // fire
        const builderEthBalanceBefore = await hre.ethers.provider.getBalance(
          builderAccount.address
        );

        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });

        const builderEthBalanceAfter = await hre.ethers.provider.getBalance(
          builderAccount.address
        );

        expect(builderEthBalanceAfter).to.equal(
          builderEthBalanceBefore + hre.ethers.parseEther("0.0005")
        );
      });

      it("platform wallet gets 0.0002ETH", async function () {
        const {
          builderCard,
          otherAccount: collectorAccount,
          otherCollector,
          builderAccount,
          platformAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const weiForValue = hre.ethers.parseEther("0.001");

        // another collector has already collected first
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount.address, { value: weiForValue });

        // fire
        const platformEthBalanceBefore = await hre.ethers.provider.getBalance(
          platformAccount.address
        );

        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: weiForValue });

        const platformEthBalanceAfter = await hre.ethers.provider.getBalance(
          platformAccount.address
        );

        expect(platformEthBalanceAfter).to.equal(
          platformEthBalanceBefore + hre.ethers.parseEther("0.0002")
        );
      });
    });
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
