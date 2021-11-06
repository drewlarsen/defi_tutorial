const BearToken = artifacts.require("BearToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should();

const one_million = '1000000';
function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract ('TokenFarm', ([owner, investor]) => {

    let daiToken, bearToken, tokenFarm;

    before(async() => {
        daiToken = await DaiToken.new();
        bearToken = await BearToken.new();
        tokenFarm = await TokenFarm.new(bearToken.address, daiToken.address);

        await bearToken.transfer(tokenFarm.address, tokens(one_million));

        await daiToken.transfer(investor, tokens('100'), {from:owner})
    })

    describe('Mock Dai deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    })

    describe('Bear deployment', async() => {
        it('has a name', async() => {
            const name = await bearToken.name();
            assert.equal(name, 'Bear Token');
        })
    })

    describe('Token Farm deployment', async() => {
        it('has a name', async() => {
            const name = await tokenFarm.name();
            assert.equal(name, 'Bear Token Farm');
        })

        it('contract has tokens', async() => {
            let balance = await bearToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens(one_million))
        })
    })
})