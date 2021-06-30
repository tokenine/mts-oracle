const Web3 = require("web3");
const fs = require("fs");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

let web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  //new Web3.providers.WebsocketProvider("wss://ws-bsc.dome.cloud")
  new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org/'))
  
);

const aggregatorV3InterfaceABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newMaintainer",
        type: "address",
      },
    ],
    name: "changeMaintainer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_maintainer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_bases",
        type: "string",
      },
      {
        internalType: "string",
        name: "_quotes",
        type: "string",
      },
    ],
    name: "getReferenceData",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdatedBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdatedQuote",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maintainer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

//BTC bitcoin /
//BNB binancecoin /
//BUSD binance-usd
//ALPHA alpha-finance /
//JFIN fin-coin /
//PAXG pax-gold /
//ETH ethereum //
//DOGE dogecoin //
//BAND band-protocol
//USDT tether
//DA dai
// 0x58dB3F7B478c3c1921A6B2feA10b5c8F2cbD86fF JFIN
// 0xE8C90C14f03064cc93cf5b125aadfcBe637cDAcD GASH
// 0xf9bA1cBE2a55b5f0Bb6A71F49A8bDb54712660B3 BNB
// 0xc6201204fAb5454bD1aEB202f89FD6C79f499e92 BTC
// 0xCB04729Beff68c36a75c800931e03293eddfDadd ALPHA
// 0xFcB1e649db03C519D38E27E29bB8BA0Ce5F30D16 ETH
// 0xF336fd661aB3C0F7C279f80A2058A9359Bc29C07 DOGE
// 0x1704Cc813ff9d104229f27e302E5A5d87437ABfE BAND
// 0x9aaE7088644D4D677F42C2f0aB5090ad36d5b3f9 USDT

async function updatePrice(pubkey, privatekey) {
  web3.eth.accounts.wallet.add(privatekey);
  let data = await CoinGeckoClient.simple.price({
    ids: [
      "ethereum",
      "dai",
      "bitcoin",
      "binancecoin",
      "alpha-finance",
      "jfin-coin",
      "dogecoin",
      "band-protocol",
      "tether",
      "pax-gold",
    ],
    vs_currencies: ["usd"],
  });
  console.log(data.data);
  //console.log(data.data["jfin-coin"].usd);

  var jfinprice = parseFloat(data.data["jfin-coin"].usd);
  var gashprice = parseFloat(data.data["pax-gold"].usd) / 1000;
  var bnbprice = parseFloat(data.data["binancecoin"].usd);
  var btcprice = parseFloat(data.data["bitcoin"].usd);
  var alphaprice = parseFloat(data.data["alpha-finance"].usd);
  var ethprice = parseFloat(data.data["ethereum"].usd);
  var dogeprice = parseFloat(data.data["dogecoin"].usd);
  var bandprice = parseFloat(data.data["band-protocol"].usd);
  var usdtprice = parseFloat(data.data["tether"].usd);

  gashprice = (gashprice / 28.3495231); // oz to gram

  bnboracle='0xf9bA1cBE2a55b5f0Bb6A71F49A8bDb54712660B3';
  jfinoracle='0x58dB3F7B478c3c1921A6B2feA10b5c8F2cbD86fF';
  gashoracle='0xE8C90C14f03064cc93cf5b125aadfcBe637cDAcD';
  btcoracle='0xc6201204fAb5454bD1aEB202f89FD6C79f499e92';
  alphaoracle='0xCB04729Beff68c36a75c800931e03293eddfDadd';
  ethoracle='0xFcB1e649db03C519D38E27E29bB8BA0Ce5F30D16';
  dogeoracle='0xF336fd661aB3C0F7C279f80A2058A9359Bc29C07';
  bandoracle='0x1704Cc813ff9d104229f27e302E5A5d87437ABfE';
  usdtoracle='0x9aaE7088644D4D677F42C2f0aB5090ad36d5b3f9';

  // USDT
  contractAddr = usdtoracle;
  console.log(web3.utils.toWei(usdtprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  console.log(gasPrice);
  //gasPrice = 13000000000;
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(usdtprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(usdtprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  //return;
  // BAND
  contractAddr = bandoracle;
  console.log(web3.utils.toWei(bandprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(bandprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(bandprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // DOGE
  contractAddr = dogeoracle;
  console.log(web3.utils.toWei(dogeprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(dogeprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(dogeprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // ETH
  contractAddr = ethoracle;
  console.log(web3.utils.toWei(ethprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(ethprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(ethprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // ALPHA
  contractAddr = alphaoracle;
  console.log(web3.utils.toWei(alphaprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(alphaprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(alphaprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // BTC
  contractAddr = btcoracle;
  console.log(web3.utils.toWei(btcprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(btcprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(btcprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // BNB
  contractAddr = bnboracle;
  console.log(web3.utils.toWei(bnbprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(bnbprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(bnbprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

  // JFIN
  contractAddr = jfinoracle;
  console.log(web3.utils.toWei(jfinprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(jfinprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(jfinprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });
  // GASH
  contractAddr = gashoracle;
  console.log(web3.utils.toWei(gashprice.toString(), "ether"));
  contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(gashprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  await contract.methods
    .updatePrice(web3.utils.toWei(gashprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return process.kill(process.pid);
      }
    });
}
privkey = "";
updatePrice("0xxxxxxx", privkey);
