// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Mock imports
import {ABA} from "../../contracts/ABA.sol";
import {FlareAdaptor} from "../../contracts/FlareAdaptor.sol"; // Add this import to access FlareAdaptor

// OApp imports
import {
    IOAppOptionsType3,
    EnforcedOptionParam
} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee, MessagingReceipt, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTCore.sol";

// OZ imports
import {IERC20} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Forge imports
import "forge-std/console.sol";
import {Vm} from "forge-std/Test.sol";
import "forge-std/Test.sol";

// DevTools imports
import {TestHelperOz5} from "@layerzerolabs/test-devtools-evm-foundry/contracts/TestHelperOz5.sol";

contract ABATest is TestHelperOz5 {
    using OptionsBuilder for bytes;

    uint32 aEid = 1;
    uint32 bEid = 2;

    uint16 REQUEST_READ = 3;
    uint16 RETURN_DATA = 4;

    ABA aSender;
    ABA bReceiver;
    FlareAdaptor flareAdaptor; // Add this line to include FlareAdaptor

    address public userA = address(0x1);
    address public userB = address(0x2);
    uint256 public initialBalance = 100 ether;

    string public _a = "A";
    string public _b = "B";

    function setUp() public virtual override {
        vm.deal(userA, 1000 ether);
        vm.deal(userB, 1000 ether);

        super.setUp();
        setUpEndpoints(2, LibraryType.UltraLightNode);

        aSender = ABA(payable(_deployOApp(type(ABA).creationCode, abi.encode(address(endpoints[aEid]), address(this)))));

        bReceiver =
            ABA(payable(_deployOApp(type(ABA).creationCode, abi.encode(address(endpoints[bEid]), address(this)))));

        // Deploy FlareAdaptor on Chain B
        flareAdaptor = FlareAdaptor(payable(_deployOApp(type(FlareAdaptor).creationCode, abi.encode())));

        // config and wire the
        address[] memory oapps = new address[](2);
        oapps[0] = address(aSender);
        oapps[1] = address(bReceiver);
        this.wireOApps(oapps);
    }

    function test_combine_options() public {
        EnforcedOptionParam[] memory aEnforcedOptions = new EnforcedOptionParam[](2);
        aEnforcedOptions[0] = EnforcedOptionParam({
            eid: bEid,
            msgType: REQUEST_READ,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0)
        });
        aEnforcedOptions[1] = EnforcedOptionParam({
            eid: bEid,
            msgType: RETURN_DATA,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(500000, 0)
        });

        EnforcedOptionParam[] memory bEnforcedOptions = new EnforcedOptionParam[](2);
        bEnforcedOptions[0] = EnforcedOptionParam({
            eid: aEid,
            msgType: REQUEST_READ,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0)
        });
        bEnforcedOptions[1] = EnforcedOptionParam({
            eid: aEid,
            msgType: RETURN_DATA,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0)
        });

        aSender.setEnforcedOptions(aEnforcedOptions);
        bReceiver.setEnforcedOptions(bEnforcedOptions);

        bytes memory _extraReturnOptions = OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0); // gas settings for B -> A

        // Quote the return call B -> A.
        MessagingFee memory returnFee = bReceiver.quote(
            aEid, REQUEST_READ, "Remote chain says hello!", _extraReturnOptions, OptionsBuilder.newOptions(), false
        );

        bytes memory _extraSendOptions =
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(100000, uint128(returnFee.nativeFee)); // gas settings for A -> B

        bytes memory expectedOptions =
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(600000, uint128(returnFee.nativeFee));

        bytes memory combinedOptions = aSender.combineOptions(bEid, RETURN_DATA, _extraSendOptions);
        assertEq(combinedOptions, expectedOptions);
    }

    function test_aba() public {
        EnforcedOptionParam[] memory aEnforcedOptions = new EnforcedOptionParam[](2);
        // Send gas for lzReceive (A -> B).
        aEnforcedOptions[0] = EnforcedOptionParam({
            eid: bEid,
            msgType: REQUEST_READ,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0)
        }); // gas limit, msg.value
        // Send gas for lzReceive + msg.value for nested lzSend (A -> B -> A).
        aEnforcedOptions[1] = EnforcedOptionParam({
            eid: bEid,
            msgType: RETURN_DATA,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(600000, 200000)
        });

        EnforcedOptionParam[] memory bEnforcedOptions = new EnforcedOptionParam[](2);
        // Send gas for lzReceive (A -> B).
        bEnforcedOptions[0] = EnforcedOptionParam({
            eid: aEid,
            msgType: REQUEST_READ,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0)
        });
        // Send gas for lzReceive (B -> A).
        bEnforcedOptions[1] = EnforcedOptionParam({
            eid: aEid,
            msgType: RETURN_DATA,
            options: OptionsBuilder.newOptions().addExecutorLzReceiveOption(600000, 200000)
        });

        aSender.setEnforcedOptions(aEnforcedOptions);
        bReceiver.setEnforcedOptions(bEnforcedOptions);

        bytes memory _extraReturnOptions = OptionsBuilder.newOptions().addExecutorLzReceiveOption(50000, 0); // gas settings for B -> A

        // Quote the return call B -> A.
        MessagingFee memory returnFee =
            bReceiver.quote(aEid, REQUEST_READ, "Request Data", _extraReturnOptions, OptionsBuilder.newOptions(), false);

        bytes memory _extraSendOptions =
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(100000, uint128(returnFee.nativeFee)); // gas settings for A -> B

        // Use the return call quote to generate a new quote for A -> B.
        // src chain cost + price of gas that I want to send + fees for my chosen security Stack / Executor
        MessagingFee memory sendFee =
            aSender.quote(bEid, RETURN_DATA, "Request Data", _extraSendOptions, _extraReturnOptions, false);

        // Use the new quote for the msg.value of the send call.
        vm.startPrank(userA);
        aSender.send{value: sendFee.nativeFee}(
            bEid, REQUEST_READ, "Request Data", _extraSendOptions, _extraReturnOptions
        );

        verifyPackets(bEid, addressToBytes32(address(bReceiver)));

        verifyPackets(aEid, addressToBytes32(address(aSender)));

        // Assuming FlareAdaptor read function returns specific data for the test
        // Here you need to implement the logic to verify the received data
        // For example, you can use mock data or actual values from the FlareAdaptor

        // Mock expected values for verification
        (uint256 expectedValue, uint256 expectedTimestamp) = flareAdaptor.read();

        // Create the expected return message string
        string memory expectedReturnMessage =
            string(abi.encodePacked("Value: ", expectedValue, ", Timestamp: ", expectedTimestamp));

        // Verify that the data returned to aSender matches the expected values
        assertEq(aSender.data(), expectedReturnMessage);
    }
}
