pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution is ERC20
{   
 	// mapping(address => uint256) public tokenAmount;
 	ERC20Claimable claimable_contract;
 	ERC20Mintable mintable_contract;
	constructor (string memory name_, string memory symbol_, ERC20Claimable claimable_contract_, ERC20Mintable mintable_contract_) public ERC20(name_, symbol_){
        claimable_contract = claimable_contract_;
        mintable_contract = mintable_contract_;
	}

	function claimTokensOnBehalf() external {
		uint256 init_value = claimable_contract.balanceOf(address(this));
		claimable_contract.claimTokens();
		uint256 diff_value = claimable_contract.balanceOf(address(this)) - init_value;
		mintable_contract.mint(msg.sender, diff_value);
	}

	// function claimTokensOnBehalf() external {
	// 	uint256 added_value = claimable_contract.claimTokens();
	// 	mintable_contract.mint(msg.sender, added_value);
	// }

	function tokensInCustody(address callerAddress) view external returns (uint256){
		return mintable_contract.balanceOf(callerAddress);
	}

	function withdrawTokens(uint256 amountToWithdraw) external returns (uint256){
		require(amountToWithdraw <= mintable_contract.balanceOf(msg.sender),  "You don't have enough token to withdraw");
		claimable_contract.transfer(msg.sender, amountToWithdraw);
		mintable_contract.burn(msg.sender, amountToWithdraw);
		return mintable_contract.balanceOf(msg.sender);
	}

	function depositTokens(uint256 amountToWithdraw) external returns (uint256){
		claimable_contract.transferFrom(msg.sender, address(this), amountToWithdraw);
		mintable_contract.mint(msg.sender, amountToWithdraw);
		return mintable_contract.balanceOf(msg.sender);
	}

	function getERC20DepositAddress() external returns (address){
		return address(mintable_contract);
	}
}
