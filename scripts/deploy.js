const hre = require("hardhat");

async function main() {
  const DAOFactory = await hre.ethers.getContractFactory("DAOFactory");
  const daoFactory = await DAOFactory.deploy();
  await daoFactory.deployed();

  console.log("DAOFactory deployed at:", daoFactory.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
