pragma solidity ^0.5.0;

import "./BearToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Bear Token Farm";
    address public owner;

    BearToken public bearToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address=> uint) public stakingBalance;
    mapping(address=> bool) public hasStaked;
    mapping(address=> bool) public isStaking;

    constructor(BearToken _bearToken, DaiToken _daiToken) public {
        bearToken = _bearToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // stake tokens - deposit
    // investor sends tokens to the farm to earn interest in bear tokens
    function stakeTokens(uint _amount) public {

        require(_amount > 0, "must stake more than zero tokens");

        // transfer dai in
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update staking stakingBalance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // update staking status
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // unstake tokens - withdrawal
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'no tokens to withdrawal');
        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // issue tokens - paying interest
    function issueTokens() public {

        require(msg.sender == owner, "only the owner can issue tokens.");

        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                bearToken.transfer(recipient, balance);
            }
        }
    }

}
