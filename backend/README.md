<p align="center">
  <a href="https://layerzero.network">
    <img alt="LayerZero" style="width: 200px" src="https://s2.coinmarketcap.com/static/img/coins/200x200/7950.png"/>
  </a>
</p>

<p align="center">
  <a href="https://layerzero.network">
    <img alt="LayerZero" style="width: 400px" src="https://docs.layerzero.network/img/LayerZero_Logo_White.svg"/>
  </a>
</p>


<h1 align="center">Layer0racle w/ Flare Network</h1>


This project enhances DeFi by integrating oracles into unsupported blockchain networks. Using Flare's reliable price feeds and bridging them via the LayerZero protocol to a Layer 2 (L2) solution, we enable a borrow-lending decentralized exchange (DEX). The L2 setup ensures scalability, low transaction costs, and secure data transfer. Our smart contracts handle collateral management, borrowing, lending, and liquidation, providing a robust and efficient DeFi platform. This approach makes DeFi more accessible and functional for a wider range of blockchain networks.


## How it Works
### Leveraging flare network blocktime updates
Using Flare network price updates every block, I can get an precise price at the moment of borrowing or leveraging a position on a defi dapp.  Being off by .5% on a 100 times leverage position can be costly to a dapp.  
We've created an adaptor for the price feed to allow the price feeds to be used with existing defi repos that don't want or can afford to audit or refactor their code (Adaptors folder).  

The borrow lending dapp allows token assets to be setup by the owner, if there is an Flare oracle in existance it can be leveraged on that dapp by adding the token and the oracle associated to its price. 

Layer 0 is utilized by also requesting the price data from another L2 network and requesting that message.  The layer zero contract is modified to read the oracle in question and then return that data to the original chain.  This allows using an oracle on chains that don't have oracles but have Layer Zero support.

The request is made in the original chain and the transaction request made to the layer zer0 contract on flare network to read the data feed and then respond back to the original network and then execute the borrow transaction.  


## Details
Mock Tokens are used to mimic token and the oracles according to their true value.  Tokens Folder
Because of the data structure of the oracle, it is not intuative to just integrate the feed.  We created an adaptor that will convert the data feed to a more familiar format to be used in repos so no refactor of the primary dapp is required.

The primary contract `Borrow.sol` gets initialized with the tokens and feeds that it supports.  If there is a feed for it available on Flare, it can be used.  An adaptor must be deployed for it.  Once the tokens are registerd, the dapp can be used as a borrow lend dapp as you must deposit liqudity to be able to borrow what other assets are availbe to be borrowed.

We utilized layer zero's cli kit to build the frame for us to use the lz commands to get an ABA framework up and running. 

The `LayerZeroABAData.sol` is the contract that handles the messaging between networks.  Calling on the pricefeed oracle to return the data to be used.  The simulation on this can be found in the `test -> foundry -> ABA.t.sol`  Using the layerzero toolk kit, we used the automate the series of request to recieve the data back.

1. **Contract Address:**

`USDC`
- Token: 0x34C28d60c8177f65AFF5c48212a687F16b4ab71f
- Oracle adaptor:  0x9FBe9D872df9701108fD2d33d96383269DC059fb

`WETH` 
- Token: 0x834c88758EeE333b01e52D6de610166E19E6CCd3
- Oracle adaptor: 0xAE40A252ad7E2BFc8a86c5f8724d807F5326cd43

`Flare`
- Oracle adaptor: 0xBAE8146473796c202ED0439fc67e6F161C430159

`Borrow lending contract:` 
- 0x7Cd8f07401Ea6bC761b75184AfB33D4121A48754

`Layer Zero Deployment on Flare`
- 0xc883a9b9Bd6a0eD5a7d3283a11844d139aaABA70

`Layer Zero Deployment on Arbitrum Sepolia`
- 0x1e95F58B075b395bcBCdcE715653b84b933c9986

`Layer Zero Deployment on Flare`
- 0x2Da847eA6c71460d0Ff2EeaE4aaE64064d09C597
