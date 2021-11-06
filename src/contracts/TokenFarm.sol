pragma solidity ^0.5.0;

import "./BearToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Bear Token Farm";

    BearToken public bearToken;
    DaiToken public daiToken;

    constructor(BearToken _bearToken, DaiToken _daiToken) public {
        bearToken = _bearToken;
        daiToken = _daiToken;
    }

}
