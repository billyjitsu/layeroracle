import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const aribtrumSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'ABA',
}

const flareContract: OmniPointHardhat = {
    eid: EndpointId.FLARE_V2_TESTNET,
    contractName: 'ABA',
}

const alfajoresContract: OmniPointHardhat = {
    eid: EndpointId.CELO_V2_TESTNET,
    contractName: 'ABA',
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: flareContract }, { contract: aribtrumSepoliaContract }, { contract: alfajoresContract }],
      connections: [
        {
          from: aribtrumSepoliaContract,
          to: flareContract,
        },
        {
          from: flareContract,
          to: aribtrumSepoliaContract,
        },
        {
          from: alfajoresContract,
          to: flareContract,
        },
        {
          from: flareContract,
          to: alfajoresContract,
        },
      ],
}

export default config
