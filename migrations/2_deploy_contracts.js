const BearToken = artifacts.require("BearToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();

    await deployer.deploy(BearToken);
    const bearToken = await BearToken.deployed();

    await deployer.deploy(TokenFarm, bearToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    await bearToken.transfer(tokenFarm.address, '1000000000000000000000000');

    await daiToken.transfer(accounts[1], '100000000000000000000');
};
