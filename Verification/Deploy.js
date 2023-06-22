// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log('Running daytona.finance farm script...')



        //* tokenomics *//
        // Seed amount = 20 million
        // Toni per block = 20
        // Toni per minute = 116 
        // Toni per hour = 6,960
        // Toni per day = 167,040
        // Toni per month = 5,011,200
        // Toni per year = 60,969,600

        let tokensPerBlock = '20000000000000000000'
        let initialAmount = '10000000000000000000000000'
        let dev1Amount = '10000000000000000000000000'
        let dev1Address = '0x207337059Cde9c8FD2f517831279a1aCbFd11cDE'
        let toniTokenContract

        // let swapAddress = '0xDaE9dd3d1A52CfCe9d5F2fAC7fDe164D500E50f7'

        let masterChefContract
        //create the toniToken



        const toniTokenContractAddress = '0x9F8182aD65c53Fd78bd07648a1b3DDcB675c6772'
    


        let contractName = 'ToniToken' // Change this for other contract
        let constructorArgs = []    // Put constructor args (if any) here for your contract
    
        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        let artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Change this for different path

        let metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
      
        let accounts = await web3.eth.getAccounts()
      /*
        let contract = new web3.eth.Contract(metadata.abi)
    
        contract = contract.deploy({
            data: metadata.data.bytecode.object,
            arguments: constructorArgs
        })
    
        let newContractInstance = await contract.send({
            from: accounts[0]
        })
        console.log('Toni Contract deployed at address: ', newContractInstance.options.address)
        */

        toniTokenContract = new web3.eth.Contract(metadata.abi, toniTokenContractAddress);

         //** create the MasterChef **/

        //currentBlock = await web3.eth.getBlockNumber();
        currentBlock = 17308888
        console.log('Current block number is: ', currentBlock);

        contractName = 'MasterChef' // Change this for other contract
        constructorArgs = [toniTokenContractAddress, dev1Address, dev1Address, tokensPerBlock, currentBlock]    // Put constructor args (if any) here for your contract
    

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Change this for different path

        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        
        contract = new web3.eth.Contract(metadata.abi)
    
        contract = contract.deploy({
            data: metadata.data.bytecode.object,
            arguments: constructorArgs
        })
    
        newContractInstance = await contract.send({
            from: accounts[0]
        })

        console.log(contractName, 'Master Chef Contract deployed at address: ', newContractInstance.options.address)
        masterChefContract = newContractInstance

        //All Contracts are now deployed

        //** Set Up */

        //mint some initial tokens
       
/*
        //allow devaccount to send tokes to masterchef
        await toniTokenContract.methods.approve(masterChefContract.options.address,'1000000000000000000000000000000000000').send({from: accounts[0]});
        console.log('Set approval on toni Token to Mastrchef: ')
      

        //deposit tokens into the pool
    //    await masterChefContract.methods.enterStaking('1000000000000000000000').send({from: accounts[0]});
    //    console.log('Stake tokens: ')
      
        //Add LP's liquidity


        // add liquidity for the pls-toni pair
        await addLiquidityEth(toniTokenContract, accounts, swapAddress, currentBlock).catch(console.error);

        // get the pair address
        
        let pair_tonipls = await getPairAddress(toniTokenContract.options.address)
       

        // add liquidity for the rest of the tokens

       const addresses = [
            '0x3a3baaf519d20bd1dc561dd72eae0c2cea925589',
            '0x2b1baaf519d20bd1dc561dd72eae0c2cea925589',
            // add more addresses here...
        ];

        for (let i = 0; i < addresses.length; i++) {
            await addLiquidity(
                toniTokenContract.options.address,
                addresses[i],
                '500000000000000000000',
                '100000000000000000000000',
                '500000000000000000000',
                '100000000000000000000000',
                accounts[0]
            );
        }




        //Create Farm for LP token with usdc

        //create Farm for LP token with pls
*/
        console.log("done :)")

    } catch (e) {
        console.log(e.message)
    }
  })()


    async function getPairAddress(tokenAddress) {
        let wpls = "0x70499adEBB11Efd915E3b69E700c331778628707"
        // get the liquidty pool address
        // get the contract
        let factoryAddress = '0xFf0538782D122d3112F75dc7121F61562261c0f7'

        contractName = 'IPulseXFactory'
        artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Change this for different path
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))

        const factoryContract = new web3.eth.Contract(metadata.abi, factoryAddress);
        const pairAddress = await factoryContract.methods.getPair(tokenAddress, wpls).call();

        console.log('Pair Address:', pairAddress);

    }

    async function addLiquidityEth(tokenAAddress, tokenBAddress, amountADesired, amountBDesired, amountAMin, amountBMin, recipientAddress) {
        let accounts = await web3.eth.getAccounts()
        let currentBlock = await web3.eth.getBlockNumber();
        // Contract details
        const routerContractName = 'PulseXRouter02';
        const erc20ContractName = 'ERC20';
        const swapAddress = '0xDaE9dd3d1A52CfCe9d5F2fAC7fDe164D500E50f7';

        const routerArtifactsPath = `browser/contracts/artifacts/${routerContractName}.json`;
        const erc20ArtifactsPath = `browser/contracts/artifacts/${erc20ContractName}.json`;

        // Fetch contracts metadata
        const routerMetadata = JSON.parse(await remix.call('fileManager', 'getFile', routerArtifactsPath));
        const erc20Metadata = JSON.parse(await remix.call('fileManager', 'getFile', erc20ArtifactsPath));

        // Instantiate the contracts
        const plsxrouter = new web3.eth.Contract(routerMetadata.abi, swapAddress);
        const tokenAContract = new web3.eth.Contract(erc20Metadata.abi, tokenAAddress);
        const tokenBContract = new web3.eth.Contract(erc20Metadata.abi, tokenBAddress);

        // Approve tokenA and tokenB transfer
        await tokenAContract.methods.approve(plsxrouter.options.address, amountADesired).send({from: accounts[0]});
        await tokenBContract.methods.approve(plsxrouter.options.address, amountBDesired).send({from: accounts[0]});
        console.log('Set approval on tokenA and tokenB to lpcontract: ');

        // Add the liquidity
        const params = {
            tokenA: tokenAAddress,
            tokenB: tokenBAddress,
            amountADesired: amountADesired,
            amountBDesired: amountBDesired,
            amountAMin: amountAMin,
            amountBMin: amountBMin,
            to: recipientAddress,
            deadline: currentBlock + 20,
        };

        // Call addLiquidity
        await plsxrouter.methods.addLiquidity(
            params.tokenA, 
            params.tokenB, 
            params.amountADesired, 
            params.amountBDesired, 
            params.amountAMin, 
            params.amountBMin, 
            params.to, 
            params.deadline
        ).send({from: accounts[0]});

        console.log('Liquidity added');
    }

async function addLiquidity(tokenAAddress, tokenBAddress, amountADesired, amountBDesired, amountAMin, amountBMin, recipientAddress) {
    let accounts = await web3.eth.getAccounts()
    let currentBlock = await web3.eth.getBlockNumber();
    // Contract details
    const routerContractName = 'PulseXRouter02';
    const erc20ContractName = 'ERC20';
    const lpAddress = '0xDaE9dd3d1A52CfCe9d5F2fAC7fDe164D500E50f7';

    const routerArtifactsPath = `browser/contracts/artifacts/${routerContractName}.json`;
    const erc20ArtifactsPath = `browser/contracts/artifacts/${erc20ContractName}.json`;

    // Fetch contracts metadata
    const routerMetadata = JSON.parse(await remix.call('fileManager', 'getFile', routerArtifactsPath));
    const erc20Metadata = JSON.parse(await remix.call('fileManager', 'getFile', erc20ArtifactsPath));

    // Instantiate the contracts
    const plsxrouter = new web3.eth.Contract(routerMetadata.abi, lpAddress);
    const tokenAContract = new web3.eth.Contract(erc20Metadata.abi, tokenAAddress);
    const tokenBContract = new web3.eth.Contract(erc20Metadata.abi, tokenBAddress);

    // Approve tokenA and tokenB transfer
    await tokenAContract.methods.approve(plsxrouter.options.address, amountADesired).send({from: accounts[0]});
    await tokenBContract.methods.approve(plsxrouter.options.address, amountBDesired).send({from: accounts[0]});
    console.log('Set approval on tokenA and tokenB to lpcontract: ');

    // Add the liquidity
    const params = {
        tokenA: tokenAAddress,
        tokenB: tokenBAddress,
        amountADesired: amountADesired,
        amountBDesired: amountBDesired,
        amountAMin: amountAMin,
        amountBMin: amountBMin,
        to: recipientAddress,
        deadline: currentBlock + 20,
    };

    // Call addLiquidity
    await plsxrouter.methods.addLiquidity(
        params.tokenA, 
        params.tokenB, 
        params.amountADesired, 
        params.amountBDesired, 
        params.amountAMin, 
        params.amountBMin, 
        params.to, 
        params.deadline
    ).send({from: accounts[0]});

    console.log('Liquidity added');
}

