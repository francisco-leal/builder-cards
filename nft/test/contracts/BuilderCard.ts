import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import calculateTransactionFee from "../calculateTransactionFee";
import { BuilderCard } from "../../typechain-types";

const CONTRACT_NAME = "BuilderCard";
const URI = "https://token-cdn-domain/{id}/json";

const COLLECTION_FEE_IN_WEI = ethers.parseEther("0.001");
const BUILDER_REWARD_IN_WEI = ethers.parseEther("0.0005");
const FIRST_COLLECTOR_REWARD_IN_WEI = ethers.parseEther("0.0003");

describe(CONTRACT_NAME, function () {
  async function deployBuilderCardFixture() {
    // Contracts are deployed using the first signer/account by default
    const [contractDeployer, accountA, accountB, accountC, accountD] =
      await hre.ethers.getSigners();

    const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);

    const chargingPolicy: BuilderCard.ChargingPolicyStruct = {
      collectionFee: COLLECTION_FEE_IN_WEI,
      builderReward: BUILDER_REWARD_IN_WEI,
      firstCollectorReward: FIRST_COLLECTOR_REWARD_IN_WEI,
    };
    const builderCard = await BuilderCard.deploy(
      URI,
      chargingPolicy,
      contractDeployer
    );

    return {
      contractDeployer,
      builderCard,
      accountA,
      accountB,
      accountC,
      accountD,
    };
  }

  describe("#collect", function () {
    describe("finances", function () {
      context(
        "when ether value passed is less than the collection fee required",
        function () {
          const value = ethers.parseEther("0.0");

          it("reverts with the error about the collection fee requirement", async function () {
            const { builderCard, accountA: builderAccountToCollect } =
              await loadFixture(deployBuilderCardFixture);

            // fire

            await expect(
              builderCard.collect(builderAccountToCollect, { value })
            )
              .to.be.revertedWithCustomError(
                builderCard,
                "WrongValueForCollectionFee"
              )
              .withArgs(COLLECTION_FEE_IN_WEI, 0);
          });
        }
      );

      context(
        "when ether value passed is equal to the collection fee required",
        function () {
          const value = COLLECTION_FEE_IN_WEI;

          it("reverts with the error about the collection fee requirement", async function () {
            const { builderCard, accountA: builderAccountToCollect } =
              await loadFixture(deployBuilderCardFixture);

            // fire

            await expect(
              builderCard.collect(builderAccountToCollect, { value })
            ).not.to.be.revertedWithCustomError(
              builderCard,
              "WrongValueForCollectionFee"
            );
          });
        }
      );

      context(
        "when ether value passed is greater than the collection fee required",
        function () {
          const value = ethers.parseEther("0.0011");

          it("does not revert", async function () {
            const { builderCard, accountA: builderAccountToCollect } =
              await loadFixture(deployBuilderCardFixture);

            // fire

            await expect(
              builderCard.collect(builderAccountToCollect, { value })
            ).to.be.revertedWithCustomError(
              builderCard,
              "WrongValueForCollectionFee"
            );
          });
        }
      );

      it("rewards the builder with 0.0005 ether", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
          await loadFixture(deployBuilderCardFixture);

        const balanceBefore = await ethers.provider.getBalance(
          builderAccountToCollect
        );

        // fire
        await builderCard.collect(builderAccountToCollect, {
          value: COLLECTION_FEE_IN_WEI,
        });

        const balanceAfter = await ethers.provider.getBalance(
          builderAccountToCollect
        );

        expect(balanceAfter).to.equal(balanceBefore + BUILDER_REWARD_IN_WEI);
      });

      context(
        "when collector is the first collector for the given builder card",
        function () {
          it("rewards the collector with 0.0003 ether", async function () {
            const {
              contractDeployer,
              builderCard,
              accountA: builderAccountToCollect,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
              contractDeployer
            );

            // fire
            const trx = await builderCard
              .connect(contractDeployer)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            const receipt = await trx.wait();

            const transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
              contractDeployer
            );

            expect(balanceAfter).to.equal(
              balanceBefore +
                FIRST_COLLECTOR_REWARD_IN_WEI -
                COLLECTION_FEE_IN_WEI -
                transactionFee
            );
          });

          it("rewards the platform with 0.001 - 0.005 - 0.0003 which is 0.0002", async function () {
            const { builderCard, accountA: builderAccountToCollect } =
              await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(builderCard);

            // fire
            await builderCard.collect(builderAccountToCollect, {
              value: COLLECTION_FEE_IN_WEI,
            });

            const balanceAfter = await ethers.provider.getBalance(builderCard);

            expect(balanceAfter).to.equal(
              balanceBefore +
                (COLLECTION_FEE_IN_WEI -
                  BUILDER_REWARD_IN_WEI -
                  FIRST_COLLECTOR_REWARD_IN_WEI)
            );
          });
        }
      );

      context(
        "when collector is not the first collector of the particular builder card",
        function () {
          it("doesn't reward them with the first collector reward", async function () {
            const {
              contractDeployer,
              builderCard,
              accountA: builderAccountToCollect,
              accountB: otherCollector,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
              otherCollector
            );

            let trx = await builderCard
              .connect(contractDeployer)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            await trx.wait();

            // fire OtherCollector collects the same builder card

            trx = await builderCard
              .connect(otherCollector)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            const receipt = await trx.wait();

            const transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
              otherCollector
            );

            expect(balanceAfter).to.equal(
              balanceBefore - COLLECTION_FEE_IN_WEI - transactionFee
            );
          });

          it("rewards the platform with 0.001 - 0.0005 which is 0.0005", async function () {
            const {
              builderCard,
              accountA: builderAccountToCollect,
              accountB: otherCollector,
            } = await loadFixture(deployBuilderCardFixture);

            let trx = await builderCard.collect(builderAccountToCollect, {
              value: COLLECTION_FEE_IN_WEI,
            });

            await trx.wait();

            // fire OtherCollector collects the same builder card

            const balanceBefore = await ethers.provider.getBalance(builderCard);

            trx = await builderCard
              .connect(otherCollector)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            await trx.wait();

            const balanceAfter = await ethers.provider.getBalance(builderCard);

            expect(balanceAfter).to.equal(
              balanceBefore + (COLLECTION_FEE_IN_WEI - BUILDER_REWARD_IN_WEI)
            );
          });
        }
      );
    });

    it("collector balance on input builder is increased by 1", async function () {
      const {
        builderCard,
        accountA: collectorAccount,
        accountB: builderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      const builderAccountTokenId = ethers.toBigInt(builderAccount.address);
      const previousNumberOfTokens = await builderCard[
        "balanceOf(address,uint256)"
      ](collectorAccount.address, builderAccountTokenId);

      // fire
      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount.address, { value: COLLECTION_FEE_IN_WEI });

      const numberOfTokens = await builderCard["balanceOf(address,uint256)"](
        collectorAccount.address,
        builderAccountTokenId
      );

      expect(numberOfTokens).to.equal(previousNumberOfTokens + BigInt("1"));
    });

    it("prevents transferring the same builder card to the same collector more than once", async function () {
      // collector A collects B1
      // collector B collects B1
      // collector A transfers B1 to collector C
      // collector B transfers B1 to collector C. This will revert
      // collector A transfers B1 to collector B. This will revert
      const {
        builderCard,
        accountA: collectorA,
        accountB: b1,
        accountC: collectorB,
        accountD: collectorC,
      } = await loadFixture(deployBuilderCardFixture);

      await builderCard
        .connect(collectorA)
        .collect(b1, { value: COLLECTION_FEE_IN_WEI });

      await builderCard
        .connect(collectorB)
        .collect(b1, { value: COLLECTION_FEE_IN_WEI });

      const b1Id = BigInt(b1.address);

      await builderCard
        .connect(collectorA)
        ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
          collectorA,
          collectorC,
          b1Id,
          BigInt("1"),
          "0x"
        );

      await expect(
        builderCard
          .connect(collectorB)
          ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
            collectorB,
            collectorC,
            b1Id,
            BigInt("1"),
            "0x"
          )
      ).to.be.revertedWithCustomError(
        builderCard,
        "RecipientAlreadyCollectorOfBuilderCard"
      );

      let balance = await builderCard["balanceOf(address,address)"](
        collectorC,
        b1
      );

      expect(balance).to.equal(BigInt("1"));

      await expect(
        builderCard
          .connect(collectorA)
          ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
            collectorA,
            collectorB,
            b1Id,
            BigInt("1"),
            "0x"
          )
      ).to.be.revertedWithCustomError(
        builderCard,
        "RecipientAlreadyCollectorOfBuilderCard"
      );

      balance = await builderCard["balanceOf(address,address)"](collectorB, b1);

      expect(balance).to.equal(BigInt("1"));
    });

    it("emits the CardCollected event", async function () {
      const {
        contractDeployer,
        builderCard,
        accountA: builderAccountToCollect,
      } = await loadFixture(deployBuilderCardFixture);

      await expect(
        builderCard.collect(builderAccountToCollect, {
          value: COLLECTION_FEE_IN_WEI,
        })
      )
        .to.emit(builderCard, "CardCollected")
        .withArgs(builderAccountToCollect, contractDeployer);
    });

    context("when contract is paused", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: builderAccountToCollect } =
          await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        await expect(
          builderCard.collect(builderAccountToCollect, {
            value: COLLECTION_FEE_IN_WEI,
          })
        ).to.be.revertedWithCustomError(builderCard, "EnforcedPause");
      });
    });
  });

  describe("#balanceFor - Total Supply", function () {
    describe("a builder card - Total Supply of a Builder Card", function () {
      it("returns the number of collections for a builder address", async function () {
        const {
          builderCard,
          accountA: collectorAccount,
          accountB: otherCollector,
          accountC: builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        // collect once
        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: COLLECTION_FEE_IN_WEI });

        // fire 1: check number of collections to be 1
        let numberOfCollections = await builderCard["balanceFor(address)"](
          builderAccount.address
        );

        expect(numberOfCollections).to.equal(BigInt("1"));

        // collect second time
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount.address, { value: COLLECTION_FEE_IN_WEI });

        // fire 2: check number of collections to be 2
        numberOfCollections = await builderCard["balanceFor(address)"](
          builderAccount.address
        );

        expect(numberOfCollections).to.equal(BigInt("2"));

        // check number of collections for another builder to be 0
        const otherAccountNumberOfCollections = await builderCard[
          "balanceFor(address)"
        ](collectorAccount.address);

        expect(otherAccountNumberOfCollections).to.equal(BigInt("0"));
      });
    });

    describe("all builder cards - Total Supply for all Builder Cards", function () {
      it("returns the sum of balances for all builders together", async function () {
        const {
          builderCard,
          accountA: collectorAccount,
          accountB: otherCollector,
          accountC: builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        const secondBuilderAccount = hre.ethers.Wallet.createRandom();

        // collect once
        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

        // fire 1: check balance to be 1
        let balance = await builderCard["balanceFor()"]();

        expect(balance).to.equal(BigInt("1"));

        // collect second time
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

        // fire 2: check balance to be 2
        balance = await builderCard["balanceFor()"]();

        expect(balance).to.equal(BigInt("2"));

        // collect first time second builder
        await builderCard
          .connect(otherCollector)
          .collect(secondBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

        // fire 3: check balance to be 3
        balance = await builderCard["balanceFor()"]();

        expect(balance).to.equal(BigInt("3"));
      });
    });
  });

  describe("#balanceOf", function () {
    describe("collector for Builder Card", function () {
      it("returns the number of collections a collector has for a specific builder card", async function () {
        const {
          builderCard,
          accountA: collectorAccount,
          accountB: builderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        // initially, it should be 0

        let balance = await builderCard["balanceOf(address, address)"](
          collectorAccount.address,
          builderAccount.address
        );

        expect(balance).to.equal(BigInt("0"));

        // we collect once

        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: COLLECTION_FEE_IN_WEI });

        balance = await builderCard["balanceOf(address, address)"](
          collectorAccount.address,
          builderAccount.address
        );

        expect(balance).to.equal(BigInt("1"));

        // we collect once more.
        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount.address, { value: COLLECTION_FEE_IN_WEI });

        balance = await builderCard["balanceOf(address, address)"](
          collectorAccount.address,
          builderAccount.address
        );

        // It should remain 1, because we don't allow
        // collector to collect a Builder Card more than once.
        expect(balance).to.equal(BigInt("1"));
      });
    });

    describe("collector for any builder card", function () {
      it("returns the number of builder cards a collector owns", async function () {
        const {
          builderCard,
          accountA: collectorAccount,
          accountB: builderAccount,
          accountC: otherCollector,
        } = await loadFixture(deployBuilderCardFixture);

        const secondBuilderAccount = hre.ethers.Wallet.createRandom();

        // +collectorAccount+ collects once
        await builderCard
          .connect(collectorAccount)
          .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

        // +otherCollector+ collects once
        await builderCard
          .connect(otherCollector)
          .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

        // +collectorAccount+ collects twice
        await builderCard
          .connect(collectorAccount)
          .collect(secondBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

        // fire
        let balance = await builderCard["balanceOf(address)"](collectorAccount);

        expect(balance).to.equal(BigInt("2"));

        balance = await builderCard["balanceOf(address)"](otherCollector);

        expect(balance).to.equal(BigInt("1"));

        // collectorAccount transfers secondBuilder card to otherCollector

        const secondBuilderCardId = BigInt(secondBuilderAccount.address);
        const value = BigInt("1");

        await builderCard
          .connect(collectorAccount)
          ["safeTransferFrom(address,address,uint256,uint256,bytes)"](
            collectorAccount,
            otherCollector,
            secondBuilderCardId,
            value,
            "0x"
          );

        balance = await builderCard["balanceOf(address)"](collectorAccount);

        expect(balance).to.equal(BigInt("1")); // previously was 2

        balance = await builderCard["balanceOf(address)"](otherCollector);

        expect(balance).to.equal(BigInt("2")); // previously was 1

        // otherCollector transfers secondBuilder card back to collectorAccount
        // using the safeBatchTransferFrom
        await builderCard
          .connect(otherCollector)
          ["safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"](
            otherCollector,
            collectorAccount,
            [secondBuilderCardId],
            [value],
            "0x"
          );

        balance = await builderCard["balanceOf(address)"](otherCollector);

        expect(balance).to.equal(BigInt("1")); // previously was 2

        balance = await builderCard["balanceOf(address)"](collectorAccount);

        expect(balance).to.equal(BigInt("2")); // previously was 1
      });
    });
  });

  describe("#withDraw", function () {
    context("when called by a non-owner", function () {
      it("reverts with appropriate error", async function () {
        const { builderCard, accountA: otherAccount } = await loadFixture(
          deployBuilderCardFixture
        );

        const amountToWithDraw = ethers.parseEther("0.0001");

        // fire
        await expect(
          builderCard
            .connect(otherAccount)
            ["withDraw(uint256)"](amountToWithDraw)
        ).to.be.revertedWithCustomError(
          builderCard,
          "OwnableUnauthorizedAccount"
        );
      });
    });

    context("when called by a the owner", function () {
      it("withdraws part of the accumulated funds", async function () {
        const {
          contractDeployer,
          builderCard,
          accountA: otherCollector,
          accountB: builderAccount,
          accountC: otherBuilderAccount,
        } = await loadFixture(deployBuilderCardFixture);

        // let's collect so that we put some value to the contract

        await builderCard
          .connect(otherCollector)
          .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });
        await builderCard
          .connect(otherCollector)
          .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

        const amountToWithDraw = ethers.parseEther("0.0001");

        const balanceBeforeForContract = await ethers.provider.getBalance(
          builderCard
        );

        const balanceBeforeForOwner = await ethers.provider.getBalance(
          contractDeployer
        );

        // fire
        const trx = await builderCard["withDraw(uint256)"](amountToWithDraw);

        const receipt = await trx.wait();

        const transactionFee = calculateTransactionFee(receipt);

        const balanceAfterForContract = await ethers.provider.getBalance(
          builderCard
        );

        const balanceAfterForOwner = await ethers.provider.getBalance(
          contractDeployer
        );

        expect(balanceAfterForContract).to.equal(
          balanceBeforeForContract - amountToWithDraw
        );

        expect(balanceAfterForOwner).to.equal(
          balanceBeforeForOwner + amountToWithDraw - transactionFee
        );
      });

      context("when contract is paused", function () {
        it("withdraws as before", async function () {
          const {
            builderCard,
            accountA: otherCollector,
            accountB: builderAccount,
            accountC: otherBuilderAccount,
          } = await loadFixture(deployBuilderCardFixture);

          // let's collect so that we put some value to the contract

          await builderCard
            .connect(otherCollector)
            .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });
          await builderCard
            .connect(otherCollector)
            .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

          const amountToWithDraw = ethers.parseEther("0.0001");

          const balanceBeforeForContract = await ethers.provider.getBalance(
            builderCard
          );

          await builderCard.pause();

          // fire
          await builderCard["withDraw(uint256)"](amountToWithDraw);

          const balanceAfterForContract = await ethers.provider.getBalance(
            builderCard
          );

          expect(balanceAfterForContract).to.equal(
            balanceBeforeForContract - amountToWithDraw
          );
        });
      });

      context(
        "when amount to withdraw exceeds smart contract balance",
        function () {
          it("reverts with appropriate error", async function () {
            const {
              contractDeployer,
              builderCard,
              accountA: otherCollector,
              accountB: builderAccount,
              accountC: otherBuilderAccount,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBeforeForContract = await ethers.provider.getBalance(
              builderCard
            );

            const amountToWithDraw = balanceBeforeForContract + BigInt("1");

            // fire
            await expect(
              builderCard["withDraw(uint256)"](amountToWithDraw)
            ).to.be.revertedWithCustomError(
              builderCard,
              "InsufficientSmartContractBalance"
            );
          });
        }
      );
    });
  });

  describe("#earnings", function () {
    it("returns the earnings for each party involved", async function () {
      const {
        builderCard,
        accountA: collectorAccount,
        accountB: builderAccount,
        accountC: otherBuilderAccount,
      } = await loadFixture(deployBuilderCardFixture);

      await builderCard
        .connect(collectorAccount)
        .collect(builderAccount, { value: COLLECTION_FEE_IN_WEI });

      // fire
      let earningsForCollector = await builderCard.earnings(collectorAccount);
      let earningsForBuilder = await builderCard.earnings(builderAccount);
      let earningsForPlatform = await builderCard.earnings(builderCard);

      expect(earningsForCollector).to.equal(hre.ethers.parseEther("0.0003"));
      expect(earningsForBuilder).to.equal(hre.ethers.parseEther("0.0005"));
      expect(earningsForPlatform).to.equal(hre.ethers.parseEther("0.0002"));

      // more collections earnings are accumulated

      await builderCard
        .connect(collectorAccount)
        .collect(otherBuilderAccount, { value: COLLECTION_FEE_IN_WEI });

      earningsForCollector = await builderCard.earnings(collectorAccount);
      earningsForBuilder = await builderCard.earnings(builderAccount);
      earningsForPlatform = await builderCard.earnings(builderCard);
      const earningsForOtherBuilderAccount = await builderCard.earnings(
        otherBuilderAccount
      );

      expect(earningsForCollector).to.equal(hre.ethers.parseEther("0.0006"));
      expect(earningsForBuilder).to.equal(hre.ethers.parseEther("0.0005"));
      expect(earningsForPlatform).to.equal(hre.ethers.parseEther("0.0004"));
      expect(earningsForOtherBuilderAccount).to.equal(
        hre.ethers.parseEther("0.0005")
      );
    });
  });

  describe("#setChargingPolicy", function () {
    context("when called by a non-contract owner", function () {
      it("reverts with the appropriate error", async function () {
        const { builderCard, accountA } = await loadFixture(
          deployBuilderCardFixture
        );

        const collectionFee = ethers.parseEther("0.001");
        const builderReward = ethers.parseEther("0.0005");
        const firstCollectorReward = ethers.parseEther("0.0003");

        await expect(
          builderCard
            .connect(accountA)
            ["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            )
        ).to.be.revertedWithCustomError(
          builderCard,
          "OwnableUnauthorizedAccount"
        );
      });
    });

    context("when called by the contract owner", function () {
      context("when collection fee is 0", function () {
        it("reverts with the appropriate custom error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          const collectionFee = ethers.parseEther("0.0");
          const builderReward = ethers.parseEther("0.0005");
          const firstCollectorReward = ethers.parseEther("0.0003");

          await expect(
            builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            )
          )
            .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
            .withArgs("Collection fee should be positive");
        });
      });

      context(
        "when builder reward + first collector reward is equal to collection fee",
        function () {
          it("reverts with the appropriate custom error", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.0008");
            const builderReward = ethers.parseEther("0.0005");
            const firstCollectorReward = ethers.parseEther("0.0003");

            await expect(
              builderCard["setChargingPolicy(uint256,uint256,uint256)"](
                collectionFee,
                builderReward,
                firstCollectorReward
              )
            )
              .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
              .withArgs(
                "Collection fee should be greater than the sum of the builder and first collector reward"
              );
          });
        }
      );

      context(
        "when builder reward + first collector reward is greater than the collection fee",
        function () {
          it("reverts with the appropriate custom error", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.0008");
            const builderReward = ethers.parseEther("0.0005");
            const firstCollectorReward = ethers.parseEther("0.00031");

            await expect(
              builderCard["setChargingPolicy(uint256,uint256,uint256)"](
                collectionFee,
                builderReward,
                firstCollectorReward
              )
            )
              .to.be.revertedWithCustomError(builderCard, "ChargingPolicyError")
              .withArgs(
                "Collection fee should be greater than the sum of the builder and first collector reward"
              );
          });
        }
      );

      context(
        "when builder reward + first collector reward is less than the collection fee",
        function () {
          it("sets the new charging policy values accordingly", async function () {
            const { builderCard } = await loadFixture(deployBuilderCardFixture);

            const collectionFee = ethers.parseEther("0.002");
            const builderReward = ethers.parseEther("0.0006");
            const firstCollectorReward = ethers.parseEther("0.0004");

            await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              collectionFee,
              builderReward,
              firstCollectorReward
            );

            const collectionFeeRead = await builderCard.getCollectionFee();

            expect(collectionFeeRead).to.equal(collectionFee);

            const builderRewardRead = await builderCard.getBuilderReward();

            expect(builderRewardRead).to.equal(builderReward);

            const firstCollectorRewardRead =
              await builderCard.getFirstCollectorReward();

            expect(firstCollectorRewardRead).to.equal(firstCollectorReward);
          });

          context("when contract is paused", function () {
            it("sets the new charging policy values accordingly", async function () {
              const { builderCard } = await loadFixture(
                deployBuilderCardFixture
              );

              const collectionFee = ethers.parseEther("0.002");
              const builderReward = ethers.parseEther("0.0006");
              const firstCollectorReward = ethers.parseEther("0.0004");

              await builderCard.pause();

              await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
                collectionFee,
                builderReward,
                firstCollectorReward
              );

              const collectionFeeRead = await builderCard.getCollectionFee();

              expect(collectionFeeRead).to.equal(collectionFee);

              const builderRewardRead = await builderCard.getBuilderReward();

              expect(builderRewardRead).to.equal(builderReward);

              const firstCollectorRewardRead =
                await builderCard.getFirstCollectorReward();

              expect(firstCollectorRewardRead).to.equal(firstCollectorReward);
            });
          });

          it("charges using the new values and not the default ones", async function () {
            const {
              contractDeployer,
              builderCard,
              accountA: builderAccountToCollect,
              accountB: otherCollector,
              accountC: otherBuilderAccountToCollect,
            } = await loadFixture(deployBuilderCardFixture);

            const balanceBefore = await ethers.provider.getBalance(
              contractDeployer
            );

            let trx = await builderCard
              .connect(contractDeployer)
              .collect(builderAccountToCollect, {
                value: COLLECTION_FEE_IN_WEI,
              });

            let receipt = await trx.wait();

            let transactionFee = calculateTransactionFee(receipt);

            const balanceAfter = await ethers.provider.getBalance(
              contractDeployer
            );

            expect(balanceAfter).to.equal(
              balanceBefore +
                FIRST_COLLECTOR_REWARD_IN_WEI -
                COLLECTION_FEE_IN_WEI -
                transactionFee
            );

            // now change the charging policy

            const newCollectionFee =
              COLLECTION_FEE_IN_WEI + ethers.parseEther("0.002");
            const newBuilderReward =
              BUILDER_REWARD_IN_WEI + ethers.parseEther("0.0006");
            const newFirstCollectorReward =
              FIRST_COLLECTOR_REWARD_IN_WEI + ethers.parseEther("0.0004");

            await builderCard["setChargingPolicy(uint256,uint256,uint256)"](
              newCollectionFee,
              newBuilderReward,
              newFirstCollectorReward
            );

            const otherBuilderAccountBalanceBefore =
              await ethers.provider.getBalance(otherBuilderAccountToCollect);

            const platformBalanceBefore = await ethers.provider.getBalance(
              builderCard
            );

            const otherCollectorBalanceBefore =
              await ethers.provider.getBalance(otherCollector);

            trx = await builderCard
              .connect(otherCollector)
              .collect(otherBuilderAccountToCollect, {
                value: newCollectionFee,
              });

            receipt = await trx.wait();

            transactionFee = calculateTransactionFee(receipt);

            const otherBuilderAccountBalanceAfter =
              await ethers.provider.getBalance(otherBuilderAccountToCollect);

            const platformBalanceAfter = await ethers.provider.getBalance(
              builderCard
            );

            const otherCollectorBalanceAfter = await ethers.provider.getBalance(
              otherCollector
            );

            expect(otherBuilderAccountBalanceAfter).to.equal(
              otherBuilderAccountBalanceBefore + newBuilderReward
            );

            expect(platformBalanceAfter).to.equal(
              platformBalanceBefore +
                newCollectionFee -
                newBuilderReward -
                newFirstCollectorReward
            );

            expect(otherCollectorBalanceAfter).to.equal(
              otherCollectorBalanceBefore -
                newCollectionFee -
                transactionFee +
                newFirstCollectorReward
            );
          });
        }
      );
    });
  });

  describe("#pause", function () {
    context("when called by a non-owner account", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: nonOwnerAccount } = await loadFixture(
          deployBuilderCardFixture
        );

        await expect(
          builderCard.connect(nonOwnerAccount).pause()
        ).to.be.revertedWithCustomError(
          builderCard,
          "OwnableUnauthorizedAccount"
        );
      });
    });

    context("when called by the owner", function () {
      it("pauses the contract", async function () {
        const { builderCard } = await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        const isPaused = await builderCard.paused();

        expect(isPaused).to.be.equal(true);
      });

      context("when already paused", function () {
        it("reverts with corresponding error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          await builderCard.pause();

          // fire

          await expect(builderCard.pause()).to.be.revertedWithCustomError(
            builderCard,
            "EnforcedPause"
          );
        });
      });
    });
  });

  describe("#unpause", function () {
    context("when called by a non-owner account", function () {
      it("reverts with the correct error", async function () {
        const { builderCard, accountA: nonOwnerAccount } = await loadFixture(
          deployBuilderCardFixture
        );

        await expect(
          builderCard.connect(nonOwnerAccount).unpause()
        ).to.be.revertedWithCustomError(
          builderCard,
          "OwnableUnauthorizedAccount"
        );
      });
    });

    context("when called by the owner", function () {
      it("unpauses the contract", async function () {
        const { builderCard } = await loadFixture(deployBuilderCardFixture);

        await builderCard.pause();

        // fire
        await builderCard.unpause();

        const isPaused = await builderCard.paused();

        expect(isPaused).to.be.equal(false);
      });

      context("when already unpaused", function () {
        it("reverts with corresponding error", async function () {
          const { builderCard } = await loadFixture(deployBuilderCardFixture);

          await builderCard.pause();
          await builderCard.unpause();

          // fire
          await expect(builderCard.unpause()).to.be.revertedWithCustomError(
            builderCard,
            "ExpectedPause"
          );
        });
      });
    });
  });

  describe("#safeTransferFrom", function () {
    it("transfers a Builder Card from one collector to another", async function () {
      const {
        contractDeployer,
        builderCard,
        accountA: otherCollector,
        accountB: builderAccountToCollect,
      } = await loadFixture(deployBuilderCardFixture);

      await builderCard.collect(builderAccountToCollect, {
        value: COLLECTION_FEE_IN_WEI,
      });

      const builderCardId = BigInt(builderAccountToCollect.address);

      // fire
      await builderCard.safeTransferFrom(
        contractDeployer,
        otherCollector,
        builderCardId,
        1n,
        "0x"
      );

      expect(
        await builderCard["balanceOf(address,address)"](
          contractDeployer,
          builderAccountToCollect
        )
      ).to.equal(BigInt("0"));

      expect(
        await builderCard["balanceOf(address,address)"](
          otherCollector,
          builderAccountToCollect
        )
      ).to.equal(BigInt("1"));
    });

    context("when contract is paused", function () {
      it("reverts with the correct error", async function () {
        const {
          contractDeployer,
          builderCard,
          accountA: otherCollector,
          accountB: builderAccountToCollect,
        } = await loadFixture(deployBuilderCardFixture);

        await builderCard.collect(builderAccountToCollect, {
          value: COLLECTION_FEE_IN_WEI,
        });

        const builderCardId = BigInt(builderAccountToCollect.address);

        await builderCard.pause();

        // fire
        await expect(
          builderCard.safeTransferFrom(
            contractDeployer,
            otherCollector,
            builderCardId,
            1n,
            "0x"
          )
        ).to.be.revertedWithCustomError(builderCard, "EnforcedPause");
      });
    });
  });

  describe("#safeBatchTransferFrom", function () {
    it("transfers a Builder Card from one collector to another", async function () {
      const {
        contractDeployer,
        builderCard,
        accountA: otherCollector,
        accountB: builderAccountToCollect,
      } = await loadFixture(deployBuilderCardFixture);

      await builderCard.collect(builderAccountToCollect, {
        value: COLLECTION_FEE_IN_WEI,
      });

      const builderCardId = BigInt(builderAccountToCollect.address);

      // fire
      await builderCard.safeBatchTransferFrom(
        contractDeployer,
        otherCollector,
        [builderCardId],
        [1n],
        "0x"
      );

      expect(
        await builderCard["balanceOf(address,address)"](
          contractDeployer,
          builderAccountToCollect
        )
      ).to.equal(BigInt("0"));

      expect(
        await builderCard["balanceOf(address,address)"](
          otherCollector,
          builderAccountToCollect
        )
      ).to.equal(BigInt("1"));
    });

    context("when contract is paused", function () {
      it("reverts with the correct error", async function () {
        const {
          contractDeployer,
          builderCard,
          accountA: otherCollector,
          accountB: builderAccountToCollect,
        } = await loadFixture(deployBuilderCardFixture);

        await builderCard.collect(builderAccountToCollect, {
          value: COLLECTION_FEE_IN_WEI,
        });

        const builderCardId = BigInt(builderAccountToCollect.address);

        await builderCard.pause();

        // fire
        await expect(
          builderCard.safeBatchTransferFrom(
            contractDeployer,
            otherCollector,
            [builderCardId],
            [1n],
            "0x"
          )
        ).to.be.revertedWithCustomError(builderCard, "EnforcedPause");
      });
    });
  });

  describe("#transferOwnership", function () {
    context("when not called by the current owner", function () {
      it("reverts with custom error OwnableUnauthorizedAccount", async function () {
        const {
          builderCard,
          accountA: newOwner,
          accountB: nonOwner,
        } = await loadFixture(deployBuilderCardFixture);

        await expect(
          builderCard.connect(nonOwner).transferOwnership(newOwner)
        ).to.be.revertedWithCustomError(
          builderCard,
          "OwnableUnauthorizedAccount"
        );
      });
    });

    context("when called by the current owner", function () {
      it("transfers the ownership", async function () {
        const { builderCard, accountA: newOwner } = await loadFixture(
          deployBuilderCardFixture
        );

        await builderCard.transferOwnership(newOwner);

        const checkNewOwner = await builderCard.owner();

        expect(checkNewOwner).to.equal(newOwner);
      });
    });
  });
});
