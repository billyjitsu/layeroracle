// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IFlareContractRegistry} from
    "@flarenetwork/flare-periphery-contracts/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IFastUpdater} from "@flarenetwork/flare-periphery-contracts/coston2/ftso/userInterfaces/IFastUpdater.sol";

contract FlareAdaptor {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;

    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    // uint256[] public feedIndexes = [0, 2, 9];
    uint256[] public feedIndexes = [9];

    constructor() {
        contractRegistry = IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);
        ftsoV2 = IFastUpdater(contractRegistry.getContractAddressByName("FastUpdater"));
    }

    function getFtsoV2CurrentFeedValues()
        public // for testing to view both external and internal
        view
        returns (uint256[] memory _feedValues, int8[] memory _decimals, uint64 _timestamp)
    {
        (uint256[] memory feedValues, int8[] memory decimals, uint64 timestamp) = ftsoV2.fetchCurrentFeeds(feedIndexes);
        /* Your custom feed consumption logic. In this example the values are just returned. */
        return (feedValues, decimals, timestamp);
    }

    function read() public view returns (uint256, uint256) {
        (uint256[] memory unadjustedValues, int8[] memory decimals, uint64 unadjustedTimestamp) =
            getFtsoV2CurrentFeedValues();

        // Because an adaptor will be needed for each feed, we use the first feed only
        uint256 unadjustedValue = unadjustedValues[0];
        int8 decimalPlaces = decimals[0];

        // Adjust the value to 18 decimals
        uint256 adjustedValue;
        if (decimalPlaces >= 0) {
            adjustedValue = unadjustedValue * 10 ** (18 - uint8(decimalPlaces));
        } else {
            // adjust for any decimal places less than 0 so we don't crash our app
            adjustedValue = unadjustedValue / 10 ** (uint8(-decimalPlaces) + 18);
        }

        // Convert timestamp to uint256
        uint256 adjustedTimestamp = uint256(unadjustedTimestamp);

        return (adjustedValue, adjustedTimestamp);
    }
}
