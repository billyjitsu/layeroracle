// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint() external {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}
