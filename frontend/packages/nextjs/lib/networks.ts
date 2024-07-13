import flareicon from "~~/components/assets/flareicon.webp";

export const customEvmNetworks = [
  {
    blockExplorerUrls: ["https://explorer-holesky.morphl2.io/"],
    chainId: 2810,
    name: "Morph",
    rpcUrls: ["https://rpc-quicknode-holesky.morphl2.io"],
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 2810,
  },
  {
    blockExplorerUrls: ["https://explorer.zero.network"],
    chainId: 4457845,
    name: "ZERϴ",
    rpcUrls: ["https://rpc.zerion.io/v1/zero-sepolia"],
    iconUrls: ["https://pbs.twimg.com/profile_images/1805906049213329408/oZFUGW9L_400x400.jpg"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 4457845,
  },
  {
    blockExplorerUrls: ["https://explorer.zero.network"],
    chainId: 114,
    name: "Flare Testnet",
    rpcUrls: ["https://flaretestnet-bundler.etherspot.io"],
    icon: flareicon,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 114,
  },
];
