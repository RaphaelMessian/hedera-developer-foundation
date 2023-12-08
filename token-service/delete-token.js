console.clear();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const {
  PrivateKey,
  Client,
  TokenDeleteTransaction,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function deleToken(tokenId) {
    let deleteTokenTx = await new TokenDeleteTransaction()
        .setTokenId(tokenId)
        .freezeWith(client);
    const signTx = await deleteTokenTx.sign(myPrivateKey);
    const txResponse = await signTx.execute(client);
    let receipt = await txResponse.getReceipt(client);
    console.log("Delete Token: ", receipt.status.toString()); 
}

async function queryAccountBalance(accountId) {
    console.log("QueryAccountBalance----------------");
    const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
    const accountBalance = await balanceQuery.execute(client);
    console.log(JSON.stringify(accountBalance, null, 4));
    console.log("-----------------------------------");
  }

async function main() {
  const tokenId = "0.0.768328";
  await deleToken(tokenId);
  await queryAccountBalance(myAccountId);
}
main();
