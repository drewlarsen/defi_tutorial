const BearToken = artifacts.require("BearToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should();

const one_million = '1000000';
const one_hundred = '100';
const zero = '0';
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

    describe('Farming tokens', async() => {
        it('rewards investors for staking dai tokens', async() => {
            let result;

            // check starting balance
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens(one_hundred), 'investor dai balance before staking');

            // stake tokens
            await daiToken.approve(tokenFarm.address, tokens(one_hundred), { from: investor})
            await tokenFarm.stakeTokens(tokens(one_hundred), { from: investor})

            // check end balance
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens(zero), 'investor dai balance after staking');

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens(one_hundred), 'farm dai balance after staking');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens(one_hundred), 'investor staking balance after staking');

            result = await tokenFarm.isStaking(investor);
            assert.isOk(result, 'investor staking status after staking');

            // issue tokens
            await tokenFarm.issueTokens({ from: owner });
            result = await bearToken.balanceOf(investor);
            assert.equal(result.toString(), tokens(one_hundred), 'investor Bear Token wallet balance correct after issuance');

            // ensure only owner can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            // unstake
            await tokenFarm.unstakeTokens({ from: investor});

            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens(one_hundred), 'investor DAI wallet balance correct after unstaking');

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens(zero), 'Token Farm DAI balance correct after unstaking.');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens(zero), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor);
            assert.isNotOk(result, 'investor staking status correct after staking')
        })
    })
})