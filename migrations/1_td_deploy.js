
var TDErc20 = artifacts.require("ERC20TD.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var ERC20Mintable = artifacts.require("ERC20Mintable.sol");
var evaluator = artifacts.require("Evaluator.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        // await deployTDToken(deployer, network, accounts); 
        // await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts); 
        // await deployRecap(deployer, network, accounts); 
        await hardCodeContractAddress(deployer, network, accounts); 
        await testDeployment(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function hardCodeContractAddress(deplaoyer, network, accounts){
	TDToken = await TDErc20.at("0x77dAe18835b08A75490619DF90a3Fa5f4120bB2E")
	Evaluator = await evaluator.at("0x384C00Ff43Ed5376F2d7ee814677a15f3e330705")
    ClaimableToken = await ERC20Claimable.at("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94")
}

async function testDeployment(deployer, network, accounts) {
	// init and prep
	acc = accounts[0]
	console.log("Address used : " + acc.toString())
	getBalance = await TDToken.balanceOf(acc);
	console.log("Init balance : " + getBalance.toString());

	myERC20Mintable = await ERC20Mintable.new("ERC20_LES", "ERC20_LES", {from: acc});	
	myExSol = await ExerciceSolution.new("ERC20_LES", "ERC20_LES", ClaimableToken.address, myERC20Mintable.address, {from: acc});
	await myERC20Mintable.setMinter(myExSol.address, true, {from: acc});
	await Evaluator.submitExercice(myExSol.address, {from: acc});

	// ex1
	await ClaimableToken.claimTokens({from: acc});
	await Evaluator.ex1_claimedPoints({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex1 balance : " + getBalance.toString());

	// ex2
	// await Evaluator.ex2_claimedFromContract({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex2 balance : " + getBalance.toString());


	// ex3
	await Evaluator.ex3_withdrawFromContract({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex3 balance : " + getBalance.toString());

	// ex4
	await ClaimableToken.approve(myExSol.address,  10, {from: acc});
	await Evaluator.ex4_approvedExerciceSolution({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex4 balance : " + getBalance.toString());


	// ex5
	await ClaimableToken.approve(myExSol.address,  0, {from: acc});
	await Evaluator.ex5_revokedExerciceSolution({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex5 balance : " + getBalance.toString());


	// ex6
	await Evaluator.ex6_depositTokens({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex6 balance : " + getBalance.toString());


	// ex7
	await Evaluator.ex7_createERC20({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex7 balance : " + getBalance.toString());
	

	// ex8
	await Evaluator.ex8_depositAndMint({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex8 balance : " + getBalance.toString());


	// ex9
	await Evaluator.ex9_withdrawAndBurn({from: acc});
	getBalance = await TDToken.balanceOf(acc);
	console.log("Ex9 balance : " + getBalance.toString());


}


