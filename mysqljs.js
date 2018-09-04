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


export async  function setCompleteRecord(eosAccount){
	return new Promise(function(resolve,reject){
		try{
			//connection.connect();

			//pool.getConnection(function(err, connection){
 		//		if(err) throw reject(err)

				connection.query(`UPDATE eos_creation_account SET is_already_send = '1' WHERE eos_name = '${eosAccount}' and is_already_send != 1`, function (error, results, fields) {
										
					if (error) {
						console.log(`update ${eosAccount} error: ${error}`);
						process.exit();
					}

					resolve(`eosAccount:${eosAccount} mark success`);
				})
				
 		//	})

			//console.log(`UPDATE eos_creation_account SET is_already_send = '1' WHERE eos_name = '${eosAccount}'`)
			
		}catch(e){
			console.log(`UPDATE eos_creation_account SET is_already_send = '1' WHERE eos_name = '${eosAccount}',err：${e}`)
			process.exit();
		}

	})
}

