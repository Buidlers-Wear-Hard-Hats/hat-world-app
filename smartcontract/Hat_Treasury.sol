// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IExternalContract {
    function balanceOf(address addr) external view returns (uint256);
    function addressVerifiedUntil(address addr) external view returns (uint256);
}

contract TreasuryHATv1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    IERC20Upgradeable public token;
    uint256 public amountPerClaim;
    uint256 public claimInterval; 

    mapping(address => uint256) public lastClaim;

    constructor() {
        _disableInitializers(); 
    }

    function initialize(
        address _token,
        uint256 _amountPerClaim,
        uint256 _claimInterval
    ) public initializer {
        __Ownable_init(msg.sender);           
        __UUPSUpgradeable_init();              
        token = IERC20Upgradeable(_token);
        amountPerClaim = _amountPerClaim; // 1000000000000000000 = 1 Hat
        claimInterval = _claimInterval; // 3600 = 1H
    }

    function getHatBalance() external view returns (uint256) {
        return IExternalContract(0xCA981aD7C6425298D13A3006615dAeaE5AE952D3).balanceOf(msg.sender);
    }

    function getAddressVerification() external view returns (uint256) {
        return IExternalContract(0x57b930D551e677CC36e2fA036Ae2fe8FdaE0330D).addressVerifiedUntil(msg.sender);
    }

    function claim() external {
        require(
            IExternalContract(0x57b930D551e677CC36e2fA036Ae2fe8FdaE0330D).addressVerifiedUntil(msg.sender) > 0,
            "Address not verified"
        );

        require(
            block.timestamp >= lastClaim[msg.sender] + claimInterval,
            "You must wait before claiming again"
        );
        require(
            token.transfer(msg.sender, amountPerClaim),
            "Token transfer failed"
        );
        lastClaim[msg.sender] = block.timestamp;
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(
            token.transfer(owner(), amount),
            "Token transfer failed"
        );
    }

    function setAmountPerClaim(uint256 newAmount) external onlyOwner {
        amountPerClaim = newAmount;
    }

    function setClaimInterval(uint256 newInterval) external onlyOwner {
        claimInterval = newInterval;
    }

    function setToken(address newToken) external onlyOwner {
        token = IERC20Upgradeable(newToken);
    }

    function getTreasuryBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

}