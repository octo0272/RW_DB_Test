const express = require('express')
const app = express()
const port = 3000
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/08b81dde30cc4f5aae0fca93ebdd0a65"))


let ABI=[
	{
		"inputs": [],
		"name": "read",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "test_",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "input_",
				"type": "string"
			}
		],
		"name": "write",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

let CA = "0x7d596074951335a66dfa3109cae78c95527d1962"

let Contract = new web3.eth.Contract(ABI,CA)

async function get_A() {
    try {
        result_ = await Contract.methods.read().call();
		return result_;
    } catch (e) {
        console.log(e);
        return e;
    }
}

async function put_A(A) {
	try {
		await Contract.methods.write(A).call();
	} catch (e) {
		console.log(e);
		return e;
	}
}

// async function check() {
// 	try {
// 		testvalue = await Contract.methods.test_().call();
// 		return testvalue;
// 	} catch (e) {
// 		console.log(e);
// 		return e;
// 	}
// }

async function test() {
    try {
        address_ = await Contract.methods.test_().call();
		return address_;
    } catch (e) {
        console.log(e);
        return e;
    }
}

app.get('/read', async function(req,res){
    A = await get_A();
	res.send(A);
})

app.get('/write', async function(req,res){
	var input = "write test";
	put_A(input);
})

// app.get('/test', async function(req,res){
// 	test_ = await check();
// 	res.send(test_)
// })

app.get('/test', async function(req,res){
    address_ = await test();
	res.send(address_);
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})