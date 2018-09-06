import Eos from 'eosjs'
import config from './config'
import {getEosAccounts, setCompleteRecord} from './mysqljs.js'


export async function eosTransfer(sendAcc, account, amount, keyProvider) {
  const eoscfg = {
    httpEndpoint: config.HTTP_END_POINT,
    chainId: config.CHAIN_ID,
    keyProvider: keyProvider
  };

  const eos = Eos(eoscfg);
  let ntsContract = await eos.contract('eosio.token');
  const options = {
            authorization: `${sendAcc}@active`,
            broadcast: true,
            sign: true
          };
  try {
    await ntsContract.transfer(sendAcc, account, amount, 'www..com', options);
  } catch (e) {
    console.log(`转账${account}失败： ${e}`)
  }
  
  try {
    await setCompleteRecord(account);
  } catch (err) {
    console.log(`修改转账${account}状态错误${err}`)
    process.exit();
  }
}


export async function execAirdrop(keyProvider, sendAcc) {

    let currOrder = 0 //记录已经完成了多少条
    
    try{
      let execItems = 0 //只用于输出记录数
      const perSqlItems = 100
      let DATA_SET = await getEosAccounts(0, perSqlItems)
      console.log(`本次开始处理第${currOrder} 到 ${currOrder + perSqlItems}条数据`)
      currOrder = currOrder + perSqlItems

      if(DATA_SET.length <= 0){
        console.log('没有查询到符合条件的记录，或者已经全部完成了')
        process.exit();
      }

      for (let data of DATA_SET) {

        let amount = data.amount + " EOS"
        
          await eosTransfer(sendAcc, data.account, amount, keyProvider)
          console.log('transfer to ', data.account)
          execItems++
          if(execItems % 30 === 0){
            console.log(`本轮已处理${execItems}条`)
          }
      }
    }catch(e){
       console.log(e);
    }

}