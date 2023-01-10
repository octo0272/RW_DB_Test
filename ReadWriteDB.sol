//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract web3 {

    string result;

    function read() view public returns(string memory) {
        return result;
    }

    function write(string memory input_) public {
        result = input_;
    }

    // function test_() public pure returns(string memory) {
    //     string memory testValue = "test value";
    //     return testValue;
    // }

    function test_() pure public returns(address) {
        address A_ = 0x4b17eE8c85ed57eA56f49F664a119b4b6c7AE51A;
        return A_;
    }
}