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
    it("collector balance on input builder is increased by 1", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const previousNumberOfTokens =
        await builderCard.balanceOfCollectorForBuilder(
          collectorAccount.address,
          builderAccount.address
        );

      // fire
      const weiForValue = hre.ethers.parseEther("100");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      const numberOfTokens = await builderCard.balanceOfCollectorForBuilder(
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

    it("increases the balance of the collector for any builder", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const balanceOfCollectorBefore = await builderCard.balanceOfCollector(
        collectorAccount.address
      );

      // fire
      const weiForValue = hre.ethers.parseEther("100");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      const balanceOfCollectorAfter = await builderCard.balanceOfCollector(
        collectorAccount.address
      );

      expect(balanceOfCollectorAfter).to.equal(balanceOfCollectorBefore + 1n);
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

  describe("#balanceOfCollector for builder", function () {
    it("returns the number of mints this collector has done on given builder", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
        otherCollector,
      } = await loadFixture(deployBuilderCardFixture);

      const weiForValue = hre.ethers.parseEther("0.001");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(otherCollector)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      // fire
      const numberOfMints = await builderCard.balanceOfCollectorForBuilder(
        collectorAccount.address,
        builderAccount.address
      );

      expect(numberOfMints).to.equal(2);
    });
  });

  describe("#balanceOfCollector any builder", function () {
    it("returns the number of mints this collector has done on any builder", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
        otherCollector,
      } = await loadFixture(deployBuilderCardFixture);

      const weiForValue = hre.ethers.parseEther("0.001");

      const secondBuilderAccount = hre.ethers.Wallet.createRandom();

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(otherCollector)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(collectorAccount)
        .collect(secondBuilderAccount.address, { value: weiForValue });

      // fire
      const numberOfMints = await builderCard.balanceOfCollector(
        collectorAccount.address
      );

      expect(numberOfMints).to.equal(3);
    });
  });

  describe("#balanceOfBuilder", function () {
    it("returns the number of collections for the given builder", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
        otherCollector,
      } = await loadFixture(deployBuilderCardFixture);

      const weiForValue = hre.ethers.parseEther("0.001");

      const secondBuilderAccount = hre.ethers.Wallet.createRandom();

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(otherCollector)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });
      await builderCard
        .connect(collectorAccount)
        .collect(secondBuilderAccount.address, { value: weiForValue });

      // fire
      const numberOfMintsForBuilder = await builderCard.balanceOfBuilder(
        builderAccount.address
      );
      const numberOfMintsForSecondBuilder = await builderCard.balanceOfBuilder(
        secondBuilderAccount.address
      );

      expect(numberOfMintsForBuilder).to.equal(3);
      expect(numberOfMintsForSecondBuilder).to.equal(1);
    });
  });

  describe("#earnings", function () {
    it("returns the earnings for each party involved", async function () {
      const {
        builderCard,
        otherAccount: collectorAccount,
        builderAccount,
        platformAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const weiForValue = hre.ethers.parseEther("0.001");

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: weiForValue });

      // fire
      const earningsForCollector = await builderCard.earnings(
        collectorAccount.address
      );
      const earningsForBuilder = await builderCard.earnings(
        builderAccount.address
      );
      const earningsForPlatform = await builderCard.earnings(
        platformAccount.address
      );

      expect(earningsForCollector).to.equal(hre.ethers.parseEther("0.0003"));
      expect(earningsForBuilder).to.equal(hre.ethers.parseEther("0.0005"));
      expect(earningsForPlatform).to.equal(hre.ethers.parseEther("0.0002"));
    });
  });
});
