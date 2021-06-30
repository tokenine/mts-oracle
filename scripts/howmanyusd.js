const Web3 = require("web3");
const fs = require("fs");

let web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")
);


const valueABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "eths",
				"type": "int256"
			}
		],
		"name": "inUSDT",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function getPrice() {
const addr = "0x9c92a88be911CFe5e0F74f72A28A9648D86F1Ba0";
try {
	var args = process.argv.slice(2);
	const priceFeed = new web3.eth.Contract(valueABI, addr);
	priceFeed.methods.inUSDT(parseInt(args)).call()
    	.then((roundData) => {
        // Do something with roundData
        console.log("Price in usd:", roundData)
    });
} catch (e) {
	console.log(e)
}
}

getPrice();
