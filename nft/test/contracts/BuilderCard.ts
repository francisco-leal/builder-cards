import hre from "hardhat";
import { expect } from "chai";
import Nft from "../../src/nft/utils";

const CONTRACT_NAME = "BuilderCard";
const URI = "https://token-cdn-domain";

describe(CONTRACT_NAME, function () {
  describe("#constructor", async function () {
    it(`sets the contract uri to ${URI}`, async function () {
      const BuilderCard = await hre.ethers.getContractFactory(CONTRACT_NAME);
      const builderCard = await BuilderCard.deploy(URI);
      builderCard.waitForDeployment();

      const anId = 314592;
      expect(await builderCard.uri(anId)).to.equal(`${URI}/${anId}.json`);
    });
  });
});
