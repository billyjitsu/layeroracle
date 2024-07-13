import { arbitrumSepolia, baseSepolia } from "viem/chains";

export const USDC_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  [arbitrumSepolia.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
};

export const CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA = "0x480A24B3F71f8704066211e61CF6CCE430B8a5c7";

export const BASE_SEPOLIA_BLOCKSCOUT_TX_BASE_URL = "https://base-sepolia.blockscout.com/tx/";
export const flareAddress = "0x7Cd8f07401Ea6bC761b75184AfB33D4121A48754";

//"0x7aad729622232f36117b369466f0f51e3ce951d6";
export const usdcAddress = "0x34C28d60c8177f65AFF5c48212a687F16b4ab71f";
export const wethAddress = "0x834c88758EeE333b01e52D6de610166E19E6CCd3";
