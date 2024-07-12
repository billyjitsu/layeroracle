import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOApp',
}

const flareContract: OmniPointHardhat = {
    eid: EndpointId.FLARE_V2_TESTNET,
    contractName: 'MyOApp',
}

// const fujiContract: OmniPointHardhat = {
//     eid: EndpointId.AVALANCHE_V2_TESTNET,
//     contractName: 'MyOApp',
// }

// const amoyContract: OmniPointHardhat = {
//     eid: EndpointId.AMOY_V2_TESTNET,
//     contractName: 'MyOApp',
// }

// const arbitrumSepoliaContract: OmniPointHardhat = {
//     eid: EndpointId.ARBSEP_V2_TESTNET,
//     contractName: 'MyOApp',
// }

// const alfajoresContract: OmniPointHardhat = {
//     eid: EndpointId.CELO_V2_TESTNET,
//     contractName: 'MyOApp',
// }

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: flareContract }, { contract: sepoliaContract }],
    // connections: [  //fix order
    //     {
    //         from: flareContract,
    //         to: sepoliaContract,
    //         config: {
    //             sendConfig: {
    //                 executorConfig: {
    //                     maxMessageSize: 10000,
    //                     executor: '0x71d7a02cDD38BEa35E42b53fF4a42a37638a0066',
    //                 },
    //                 ulnConfig: {
    //                     confirmations: BigInt(42),
    //                     requiredDVNs: [],
    //                     optionalDVNs: [
    //                         '0xe9dCF5771a48f8DC70337303AbB84032F8F5bE3E',
    //                         '0x0AD50201807B615a71a39c775089C9261A667780',
    //                     ],
    //                     optionalDVNThreshold: 2,
    //                 },
    //             },
    //             receiveConfig: {
    //                 ulnConfig: {
    //                     confirmations: BigInt(42),
    //                     requiredDVNs: [],
    //                     optionalDVNs: [
    //                         '0x3Eb0093E079EF3F3FC58C41e13FF46c55dcb5D0a',
    //                         '0x0AD50201807B615a71a39c775089C9261A667780',
    //                     ],
    //                     optionalDVNThreshold: 2,
    //                 },
    //             },
    //         },
    //     },
    //     // {
    //     //     from: fujiContract,
    //     //     to: amoyContract,
    //     // },
    //     // {
    //     //     from: sepoliaContract,
    //     //     to: fujiContract,
    //     // },
    //     // {
    //     //     from: sepoliaContract,
    //     //     to: amoyContract,
    //     // },
    //     // {
    //     //     from: amoyContract,
    //     //     to: sepoliaContract,
    //     // },
    //     // {
    //     //     from: amoyContract,
    //     //     to: fujiContract,
    //     // },
    // ],
    connections: [
        {
          from: flareContract,
          to: sepoliaContract,
          config: {
            sendLibrary: "0x00C5C0B8e0f75aB862CbAaeCfff499dB555FBDD2",
            receiveLibraryConfig: {
              receiveLibrary: "0x1d186C560281B8F1AF831957ED5047fD3AB902F9",
              gracePeriod: BigInt(0),
            },
            sendConfig: {
              executorConfig: {
                maxMessageSize: 10000,
                executor: "0x9dB9Ca3305B48F196D18082e91cB64663b13d014",
              },
              ulnConfig: {
                confirmations: BigInt(1),
                requiredDVNs: ["0x12523de19dc41c91F7d2093E0CFbB76b17012C8d"],
                optionalDVNs: [],
                optionalDVNThreshold: 0,
              },
            },
            receiveConfig: {
              ulnConfig: {
                confirmations: BigInt(2),
                requiredDVNs: ["0x12523de19dc41c91F7d2093E0CFbB76b17012C8d"],
                optionalDVNs: [],
                optionalDVNThreshold: 0,
              },
            },
          },
        },
        {
          from: sepoliaContract,
          to: flareContract,
          config: {
            sendLibrary: "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE",
            receiveLibraryConfig: {
              receiveLibrary: "0xdAf00F5eE2158dD58E0d3857851c432E34A3A851",
              gracePeriod: BigInt(0),
            },
            sendConfig: {
              executorConfig: {
                maxMessageSize: 10000,
                executor: "0x718B92b5CB0a5552039B593faF724D182A881eDA",
              },
              ulnConfig: {
                confirmations: BigInt(2),
                requiredDVNs: ["0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193"],
                optionalDVNs: [],
                optionalDVNThreshold: 0,
              },
            },
            receiveConfig: {
              ulnConfig: {
                confirmations: BigInt(1),
                requiredDVNs: ["0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193"],
                optionalDVNs: [],
                optionalDVNThreshold: 0,
              },
            },
          },
        },
      ],
}

export default config
