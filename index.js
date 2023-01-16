const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000
const Web3 = require('web3');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');


const con = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '1234',
	database: 'express_db'
})

con.connect(function(err){
	if(err) throw err;
	console.log('Connected'); // DB 연결

	// Database 생성
	// conn.query('CREATE DATABASE express_db', function(err,result){
	// 	if(err) throw err;
	// 	console.log('database created'); 
	// });

	// TABLE 생성
	// const sql = 'CREATE TABLE sample_table(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL)';
	// con.query(sql, function(err,result){
	// 	if (err) throw err;
	// 	console.log('table created');
	// });

	// Table에 있는 내용 READ하기 => 하기 전에 Table에 내용 INSERT 해야함
	// const sql = "select * from sample_table"
	// con.query(sql, function(err, result, fields){
	// 	if (err) throw err;
	// 	console.log(result)
	// });
	//	console.log(result[0].address) 이런 식으로 조회하고 싶은 정보만 READ 할 수 있음
	// 밑에 있는 app.get 써서 브라우저에 표시할 수도 있음

	// INSERT 문
	// const sql = "INSERT INTO sample_table(name,address) VALUES('user2','0x479FDB692CfEbE9C749e238C3f8CB32C8182F064')"
	// con.query(sql, function(err,result,fields){
	// 	if (err) throw err;
	// 	console.log(result)
	// })
	// ? 사용해도 됨

});

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

let CA = "0x36aaA223B8211cc65A5edc12bDaC24405ee5dE08"

let Contract = new web3.eth.Contract(ABI,CA)

const connectWalletHandler = async () => {
	// Check if Metamask is available
	if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
		try {
			//request wallet connect
			await window.ethereum.request({ method: "eth_requestAccounts" })

			//set web3 instance
			web3 = new Web3(window.ethereum)
			setWeb3(web3)

			//get list of accounts
			const accounts = await web3.eth.getAccounts()
			setUserAddress(accounts[0])

		} catch (err) {
			setError(err.message)
		}

	} else {
		// meta not installed
		console.log("Please install Metamask")
	}
}

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

	await Contract.methods.write(A).send({
		from: '0x4b17eE8c85ed57eA56f49F664a119b4b6c7AE51A',
		gas: '250000'
	}).then(res => {if(res){alert("값 변경 성공")}
	if(!res)alert("오류 발생");
	});
}

// A 읽기
app.get('/read', async function(req,res){
    A = await get_A();
	res.send(A);
})

// A에 어떤 수 넣기
app.get('/write', async function(req,res){
	var input = "write test";
	await put_A(input);
})

// 브라우저에 DB 내용 출력
app.get('/print', (req,res) => {
	const sql = "select * from sample_table;"
	con.query(sql, function(err, result, fields) {
		if (err) throw err;
		res.send(result)
	});
});

// 루트 라우팅을 html 파일로 변경
app.get('/',(req,res) =>
res.sendFile(path.join(__dirname, 'form.html')))

// UD.ejs 파일에서 select문 실행 결과 표시
app.get('/UD', (req,res) => {
	const sql = "SELECT * from sample_table";
	con.query(sql, function(err,result,fields){
		if (err) throw err;
		res.render('UD',{sample_table:result});
	});
})

// bodyparser를 미들웨어로 설정. ####### post 밑에 이게 있으면 오류남
app.use(bodyParser.urlencoded({extended:true}));

// POST 방식으로 TABLE에 원소 넣기
app.post('/',(req,res) => {
	const sql = "INSERT INTO sample_table SET ?"

	con.query(sql,req.body,function(err,result,fields){
		if (err) throw err;
		console.log(result);
		res.send('등록이 완료되었습니다');
	});
});

// DELETE나 UPDATE를 하기 위해서는 HTML에서 변수를 써야함
// => HTML과 Javascript를 함께 작성할 수 있도록 하는 템플릿 엔진인 ejs 사용
app.set('view engine', 'ejs');

// DELETE 동작. ejs 코드와 함께 씀
app.get('/delete/:id', (req,res)=>{
	const sql = "DELETE FROM sample_table WHERE id = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		console.log(result)
		res.redirect('/UD');
	})
});

// UPDATE 동작
app.post('/update/:id', (req,res)=>{
	const sql = "UPDATE sample_table SET ? WHERE id = " + req.params.id;
	con.query(sql,req.body,function(err,result,fields){
		if (err) throw err;
		console.log(result);
		res.redirect('/UD');
	})
})

// 업데이트 처리
app.get('/edit/:id',(req,res)=>{
	const sql = "SELECT * FROM sample_table WHERE id = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		res.render('edit',{sample_table:result});
	});
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})