const Web3 = require("web3");
const fs = require("fs");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

let web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  //new Web3.providers.WebsocketProvider("wss://ws-bsc-testnet.dome.cloud")
  new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'))
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
  gashprice = (gashprice / 28.3495231) ;
  //console.log(bandprice);
  //console.log(usdtprice);
  //return;
  //console.log(web3.utils.toWei(jfinprice.toString(), 'ether'));
  //console.log(web3.utils.toWei(gashprice.toString(), 'ether'));
  //return;
  //console.log(web3.utils.toWei(intprice.toString(), 'ether'));
  bnboracle='0x47d9eEC9248fc3F02F08494E75d1A514e00dc589';
  jfinoracle='0x7813E51d542331F7c7633D70CB54B04B9F16fD95';
  gashoracle='0xB66E0dbcE1129b3a6E571829504E636d6AE83Af5';
  btcoracle='0xCD53121b459031c1c3Dd6316C2f041abF9BbDEBe';
  alphaoracle='0x4721cbFE01b6ADf1eE2C5eA55fb3532a20934194';
  ethoracle='0xcd06e89A613EF74252944B985e3e6b255b2fca48';
  dogeoracle='0xCc86026c8Fc509AF66316c327348ebD29BE64c45';
  bandoracle='0xD68747c47eFDA895E5b67eE77747330dEE0e017C';
  usdtoracle='0x2A9F10816d093337C7632584D2DAdD32255EB07b';
  
  // USDT
  contractAddr = usdtoracle;
  console.log(web3.utils.toWei(usdtprice.toString(), "ether"));
  var contract = new web3.eth.Contract(aggregatorV3InterfaceABI, contractAddr);
  gasPrice = await web3.eth.getGasPrice();
  //gasPrice = 21848;
  console.log(gasPrice);
  gasEstimate = await contract.methods
    .updatePrice(web3.utils.toWei(usdtprice.toString(), "ether"))
    .estimateGas({ from: pubkey });
  console.log(gasEstimate);
  //gasEstimate = gasEstimate * 2 ;
  await contract.methods
    .updatePrice(web3.utils.toWei(usdtprice.toString(), "ether"))
    .send({ from: pubkey, gasPrice: gasPrice, gas: gasEstimate })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      if (confirmationNumber >= 3) {
        return;
      }
    });

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
updatePrice("0xxxx", privkey);
