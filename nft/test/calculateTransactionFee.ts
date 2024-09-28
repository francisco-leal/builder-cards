import { ContractTransactionReceipt } from "ethers";

const calculateTransactionFee = (
  receipt: ContractTransactionReceipt | null
) => {
  const gasUsed = receipt?.gasUsed || 0n;
  const gasPrice = receipt?.gasPrice || 0n;
  return gasUsed * gasPrice;
};

export default calculateTransactionFee;
