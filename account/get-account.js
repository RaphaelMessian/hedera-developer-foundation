const { Client, AccountInfoQuery, Mnemonic } = require("@hashgraph/sdk");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);

  //Create a new account with 1,000 tinybar starting balance
  const myAccountInfo = await new AccountInfoQuery()
    .setAccountId(myAccountId)
    .execute(client);

  console.log(myAccountInfo.tokenRelationships);
}
main();
