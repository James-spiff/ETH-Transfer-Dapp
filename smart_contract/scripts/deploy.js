const hre = require("hardhat");

const main = async () => {

  const Transactions = await hre.ethers.getContractFactory("Transactions"); //A function factory that generates instances of the specified contract
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error)
    process.exit(1);
  }
}

runMain();
