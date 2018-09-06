import config from './config'
var mysql      = require('mysql2');
var connection = mysql.createConnection(config.mysqlConfig);
connection.connect();
 
export async function getEosAccounts(begin,limit){	
    return new Promise(function(resolve,reject){
    	try{
		
 		let accounts = [];

 		//pool.getConnection(function(err, connection){
 			//if(err) throw reject(err)
 			connection.query(`SELECT eos_name from eos_creation_account WHERE is_already_send = 0 limit ${begin},${limit}`, function (error, results, fields) {//账号地址为空的没有取
		  	
			  	if (error) {
			  		throw reject(error);
			  		process.exit();
			  	}

			    for(let res of results){
			  	 	accounts.push(
			  	 		{
				  	 		account: res.eos_name,	
				  	 		amount: "0.0001",	
			  	 		}
			  	 	)
			  	}
		  	
		  		if(accounts.length == 0){console.log('全部完成');process.exit();}
		  		resolve(accounts);
			
			});
 		//})
		


    }catch(e){
    	reject(e);
    }
	
	})
}

/**
 * This function will update eos account transfer state in mysql
 * @params eosAccount 	The eos account need to udpate
 * @return return a Promise object
 */
export function setCompleteRecord(eosAccount){
	return new Promise((resolve, reject) => {
		let sql = `UPDATE eos_creation_account SET is_already_send = '1' WHERE eos_name = '${eosAccount}' and is_already_send != 1`;
		connection.query(sql, (error) => {
			if (error) {
				console.log(`UPDATE eos_creation_account SET is_already_send = '1' WHERE eos_name = '${eosAccount}',err：${error}`)
				reject(error)
			}
			resolve()
		});
	});
}

