console.clear();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const {
  PrivateKey,
  Client,
  TransferTransaction,
  AccountBalanceQuery,
  TokenFreezeTransaction,
  TokenUnfreezeTransaction,
  TokenWipeTransaction,
  TokenPauseTransaction,
  TokenUnpauseTransaction
} = require("@hashgraph/sdk");
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const secondAccountId = process.env.SECOND_ACCOUNT_ID;
const secondPrivateKey = PrivateKey.fromString(process.env.SECOND_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function transferToken(senderId, receiverId, tokenId, amount) {
  const sendToken = await new TransferTransaction()
    .addTokenTransfer(tokenId, senderId, -amount)
    .addTokenTransfer(tokenId, receiverId, amount)
    .execute(client);

  let receipt = await sendToken.getReceipt(client);
  console.log("Transfer Token: ", receipt.status.toString());
}

async function freezeToken(accountId, tokenId) {
  console.log("FreezeToken-----------------------");
  const transaction = await new TokenFreezeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);
  console.log("Freeze token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function unfreezeToken(accountId, tokenId) {
  console.log("UnfreezeToken----------------------");
  const transaction = await new TokenUnfreezeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .execute(client);
  const receipt = await transaction.getReceipt(client);
  console.log("Unfreeze token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function queryAccountBalance(accountId) {
  console.log("QueryAccountBalance----------------");
  const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);
  const accountBalance = await balanceQuery.execute(client);
  console.log(JSON.stringify(accountBalance, null, 4));
  console.log("-----------------------------------");
}

async function wipeToken(accountId, tokenId, amount) {
  const transaction = await new TokenWipeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .setAmount(amount)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log("Wipe token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function pauseToken(tokenId) {
  const transaction = await new TokenPauseTransaction()
    .setTokenId(tokenId)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log("Pause token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function unpauseToken(tokenId) {
  const transaction = await new TokenUnpauseTransaction()
    .setTokenId(tokenId)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log("Unpause token:  " + receipt.status.toString());
  console.log("-----------------------------------");
}

async function main() {
  const tokenId = "0.0.6741746";
  await queryAccountBalance(secondAccountId);
  await transferToken(myAccountId, secondAccountId, tokenId, 100);
  client.setOperator(secondAccountId, secondPrivateKey);
  await transferToken(secondAccountId, myAccountId, tokenId, 80);
  await queryAccountBalance(secondAccountId);
  //client.setOperator(myAccountId, myPrivateKey);
  //await wipeToken(secondAccountId, tokenId, 20);
  //await queryAccountBalance(secondAccountId);
  //await freezeToken(secondAccountId, tokenId);
  //await unfreezeToken(secondAccountId, tokenId);
  //await pauseToken(tokenId);
  // await unpauseToken(tokenId);
  // await transferToken(myAccountId, secondAccountId, tokenId, 100);
}
main();
