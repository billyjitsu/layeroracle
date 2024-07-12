// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import "@nomicfoundation/hardhat-verify";
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.19',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        sepolia: {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: process.env.RPC_URL_SEPOLIA || 'https://rpc.sepolia.org/',
            accounts,
        },
        // fuji: {
        //     eid: EndpointId.AVALANCHE_V2_TESTNET,
        //     url: process.env.RPC_URL_FUJI || 'https://rpc.ankr.com/avalanche_fuji',
        //     accounts,
        // },
        // amoy: {
        //     eid: EndpointId.AMOY_V2_TESTNET,
        //     url: process.env.RPC_URL_AMOY || 'https://polygon-amoy-bor-rpc.publicnode.com',
        //     accounts,
        // },
        // arbitrumSepolia: {
        //     eid: EndpointId.ARBSEP_V2_TESTNET,
        //     url: process.env.RPC_URL_ARBITRUM_SEPOLIA || 'https://rpc.ankr.com/arbitrum_sepolia',
        //     accounts,
        // },
        // alfajores: {
        //     eid: EndpointId.CELO_V2_TESTNET,  // ask about this
        //     url: "https://alfajores-forno.celo-testnet.org",
        //     accounts,
        // },
        flare: {
            eid: EndpointId.FLARE_V2_TESTNET,
            url: "https://flaretestnet-bundler.etherspot.io",
            accounts,
        }
    },
    etherscan: {
        apiKey: {
          coston2: "coston2", // apiKey is not required, just set a placeholder
        },
        customChains: [
          {
            network: "coston2",
            chainId: 114,
            urls: {
              apiURL: "https://api.routescan.io/v2/network/testnet/evm/114/etherscan",
              browserURL: "https://coston2.testnet.flarescan.com"
            }
          }
        ]
      },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
}

export default config
