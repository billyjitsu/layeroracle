"use client";

import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClientFromWallet } from "@dynamic-labs/viem-utils";
import type { NextPage } from "next";
import { Hash, TransactionReceipt, createPublicClient, http } from "viem";
import { flareTestnet } from "viem/chains";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { BORROW_ABI } from "~~/lib/ABI";
import { USDC_ABI } from "~~/lib/USDC_ABI";
import { flareAddress, usdcAddress, wethAddress } from "~~/lib/constants";

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http(),
});

const Home: NextPage = () => {
  const { primaryWallet } = useDynamicContext();
  const connectedAddress = primaryWallet?.address;
  const [amountSupply, setAmountSupply] = useState<{ [key: string]: string }>({});
  const [amountBorrow, setAmountBorrow] = useState<{ [key: string]: string }>({});
  const [hash, setHash] = useState<Hash>();
  // const [receipt, setReceipt] = useState<TransactionReceipt>();

  const handleInputChange = (assetName: string, value: string, type: "supply" | "borrow") => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      if (type === "supply") {
        setAmountSupply({
          ...amountSupply,
          [assetName]: value,
        });
      } else {
        setAmountBorrow({
          ...amountBorrow,
          [assetName]: value,
        });
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        // setReceipt(receipt);
      }
    })();
  }, [hash]);

  const handleSupply = async (assetName: string, tokenAddress: string | undefined) => {
    const amountInEth = amountSupply[assetName];
    const amountNoDecimals = BigInt(parseFloat(amountInEth) * 1e18);
    console.log(`Supplying ${amountNoDecimals} of ${assetName} from ${connectedAddress}`);

    try {
      if (!primaryWallet) return;
      if (tokenAddress) {
        const walletClient = await createWalletClientFromWallet(primaryWallet);
        const { request: approval } = await publicClient.simulateContract({
          address: usdcAddress,
          abi: USDC_ABI,
          functionName: "approve",
          args: [flareAddress, BigInt(amountNoDecimals)],
          account: connectedAddress,
        });
        console.log(approval, "approval");

        const hash = await walletClient.writeContract(approval);
        setHash(hash);
        console.log(`Approval successful. Hash: ${hash}`);
        const { request: supplyRequest } = await publicClient.simulateContract({
          address: flareAddress,
          abi: BORROW_ABI,
          functionName: "depositToken",
          args: [tokenAddress, BigInt(amountNoDecimals)],
          account: connectedAddress,
        });
        console.log(supplyRequest, "supply request");

        const supplyHash = await walletClient.writeContract(supplyRequest);
        setHash(supplyHash);
        console.log(`Supply transaction successful. Hash: ${supplyHash}`);
      } else {
        const walletClient = await createWalletClientFromWallet(primaryWallet);
        const { request } = await publicClient.simulateContract({
          address: flareAddress,
          abi: BORROW_ABI,
          functionName: "depositNative",
          value: BigInt(amountNoDecimals),
          account: connectedAddress,
        });
        console.log(request, "request");

        const hash = await walletClient.writeContract(request);
        setHash(hash);
        console.log(`Supply transaction successful. Hash: ${hash}`);
      }
    } catch (error) {
      console.error("Error during supply transaction:", error);
    }
  };

  const handleBorrow = async (assetName: string, tokenAddress: string | undefined) => {
    const amountInEth = amountBorrow[assetName];
    const amountNoDecimals = BigInt(parseFloat(amountInEth) * 1e18);
    console.log(`Borrowing ${amountNoDecimals} of ${assetName} from ${connectedAddress}`);

    try {
      if (!primaryWallet) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      const { request } = await publicClient.simulateContract({
        address: flareAddress,
        abi: BORROW_ABI,
        functionName: "borrow",
        args: [tokenAddress, BigInt(amountNoDecimals)],
        account: connectedAddress,
      });
      console.log(request, "request");

      const hash = await walletClient.writeContract(request);
      setHash(hash);
      console.log(`Borrowing ${amountNoDecimals} of ${assetName}`);
    } catch (error) {
      console.error("Error during borrow transaction:", error);
    }
  };

  const supplyAssets = [
    { name: "Flare", balance: 0, apy: "10.00%", collateral: true },
    {
      name: "USDC",
      balance: 0,
      apy: "2.07%",
      collateral: true,
      tokenAddress: usdcAddress,
    },
    {
      name: "WETH",
      balance: 0,
      apy: "2.07%",
      collateral: true,
      tokenAddress: wethAddress,
    },
    { name: "WBTC", balance: 0, apy: "0.14%", collateral: true, disabled: true },
    { name: "weETH", balance: 0, apy: "0.11%", collateral: true, disabled: true },
  ];

  const borrowAssets = [
    {
      name: "USDC",
      availableToBorrow: 0,
      borrowApy: "0.53%",
      tokenAddress: usdcAddress,
    },
    {
      name: "wETH",
      availableToBorrow: 0,
      borrowApy: "2.72%",
      tokenAddress: wethAddress,
    },
    { name: "WBTC", availableToBorrow: 0, borrowApy: "1.27%", disabled: true },
    { name: "weETH", availableToBorrow: 0, borrowApy: "2.00%", disabled: true },
    { name: "wFlare", availableToBorrow: 0, borrowApy: "5.83 - 8.33%", disabled: true },
  ];

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">layer0racle</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          {/* {receipt && (
            <>
              <div>
                Receipt:{" "}
                <pre>
                  <code>{stringify(receipt, null, 2)}</code>
                </pre>
              </div>
            </>
          )} */}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col w-full bg-base-100 px-10 py-10 text-center items-center max-w-m rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>Assets To Supply</p>
              <table className="w-full bg-base-100 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="rounded-lg px-4 py-2">Assets</th>
                    <th className="rounded-lg px-4 py-2">Amount</th>
                    <th className="rounded-lg px-4 py-2">APY</th>
                    <th className="rounded-lg px-4 py-2">Collateral</th>
                  </tr>
                </thead>
                <tbody>
                  {supplyAssets.map((asset, index) => (
                    <tr key={index} className="text-center last:rounded-b-lg">
                      <td className="border px-4 py-2">{asset.name}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={amountSupply[asset.name] || ""}
                          onChange={e => handleInputChange(asset.name, e.target.value, "supply")}
                          className="input input-bordered w-full max-w-xs"
                        />
                      </td>
                      <td className="border px-4 py-2">{asset.apy}</td>
                      <td className="border px-4 py-2">{asset.collateral ? "Yes" : "No"}</td>

                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleSupply(asset.name, asset.tokenAddress)}
                          className="btn btn-primary"
                          disabled={asset.disabled}
                        >
                          Supply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col w-full bg-base-100 px-10 py-10 text-center items-center max-w-m rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>Assets to borrow</p>
              <table className="w-full bg-base-100 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Assets</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">APY</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowAssets.map((asset, index) => (
                    <tr key={index} className="text-center last:rounded-b-lg">
                      <td className="border px-4 py-2">{asset.name}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={amountBorrow[asset.name] || ""}
                          onChange={e => handleInputChange(asset.name, e.target.value, "borrow")}
                          className="input input-bordered w-full max-w-xs"
                        />
                      </td>
                      <td className="border px-4 py-2">{asset.borrowApy}</td>

                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleBorrow(asset.name, asset.tokenAddress)}
                          className="btn btn-primary"
                          disabled={asset.disabled}
                        >
                          Borrow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
