console.clear();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const {
  PrivateKey,
  Client,
  TokenAssociateTransaction,
  AccountBalanceQuery,
  TokenGrantKycTransaction,
  TokenRevokeKycTransaction
} = require("@hashgraph/sdk");
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(secondAccountId, secondPrivateKey);

async function associateToken(tokenId) {
  let associateTokenTx = await new TokenAssociateTransaction()
    .setAccountId(secondAccountId)
    .setTokenIds([tokenId])
    .execute(client);
  let receipt = await associateTokenTx.getReceipt(client);
  console.log("Associate Token: ", receipt.status.toString());
}

async function queryAccountBalance(accountId) {
  console.log("QueryAccountBalance----------------");
  const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
  const accountBalance = await balanceQuery.execute(client);
  console.log(JSON.stringify(accountBalance, null, 4));
  console.log("-----------------------------------");
}

async function grantKyc(accountId, tokenId) {
  client.setOperator(myAccountId, myPrivateKey);
  const transaction = await new TokenGrantKycTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);

  console.log("Grant KYC " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function revokeKyc(accountId, tokenId) {
  client.setOperator(myAccountId, myPrivateKey);
  const transaction = await new TokenRevokeKycTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);

  console.log("Revoke KYC " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function main() {
  const tokenId = "0.0.6741757";
  await associateToken(tokenId);
  //await grantKyc(secondAccountId, tokenId);
  //await revokeKyc(secondAccountId, tokenId);
  // await queryAccountBalance(secondAccountId);
}
main();
