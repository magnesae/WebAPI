const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Web3 = require('web3');
const ethTx = require('ethereumjs-tx');

const PORT = process.env.PORT || 3000;

let web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545'));

// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/WebAPI');
const db = mongoose.connection;

const locationSchema = new mongoose.Schema({
    id: String,
    keyValue: String,
    deviceId: String,
    sensorId: String,
    sensorCategoryId: String,
    sensorValue: String,
    sensorAlertMsg: String,
    sensorDescription: String,
    eventCreateTime: String
});

const gasSchema = new mongoose.Schema({
    id: String,
    keyValue: String,
    deviceId: String,
    sensorId: String,
    sensorCategoryId: String,
    sensorValue: String,
    sensorAlertMsg: String,
    sensorDescription: String,
    eventCreateTime: String
});

const specialEventSchema = new mongoose.Schema({
    id: String,
    keyValue: String,
    deviceId: String,
    sensorId: String,
    sensorCategoryId: String,
    sensorValue: String,
    sensorAlertMsg: String,
    sensorDescription: String,
    eventCreateTime: String,
});

const locationModel = mongoose.model("Location", locationSchema, 'LocationData');
const gasModel = mongoose.model("Gas", gasSchema, 'GasData');
const specialEventModel = mongoose.model("SpecialEvent", specialEventSchema, 'SpecialEventData');

web3.transactionConfirmationBlocks = 1;

const contractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "GetGasData",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "GetLocationData",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "GetSpecialEventData",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_data",
                "type": "string"
            }
        ],
        "name": "SetGasData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_data",
                "type": "string"
            }
        ],
        "name": "SetLocationData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_data",
                "type": "string"
            }
        ],
        "name": "SetSpecialEventData",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contractAddress = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0';

let contract = new web3.eth.Contract(contractABI, contractAddress);

const addressFrom = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
const privKey = Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex');
const contractData = "0x608060405234801561001057600080fd5b506111c1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063064d2f49146100675780636a8738a8146101b957806388409cdf146102ed5780638e9b4b7b14610421578063b68c0c6814610573578063dcca587f146106c5575b600080fd5b6101b76004803603604081101561007d57600080fd5b810190808035906020019064010000000081111561009a57600080fd5b8201836020820111156100ac57600080fd5b803590602001918460018302840111640100000000831117156100ce57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561013157600080fd5b82018360208201111561014357600080fd5b8035906020019184600183028401116401000000008311171561016557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506107f9565b005b610272600480360360208110156101cf57600080fd5b81019080803590602001906401000000008111156101ec57600080fd5b8201836020820111156101fe57600080fd5b8035906020019184600183028401116401000000008311171561022057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506109d8565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102b2578082015181840152602081019050610297565b50505050905090810190601f1680156102df5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103a66004803603602081101561030357600080fd5b810190808035906020019064010000000081111561032057600080fd5b82018360208201111561033257600080fd5b8035906020019184600183028401116401000000008311171561035457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610ae6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103e65780820151818401526020810190506103cb565b50505050905090810190601f1680156104135780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6105716004803603604081101561043757600080fd5b810190808035906020019064010000000081111561045457600080fd5b82018360208201111561046657600080fd5b8035906020019184600183028401116401000000008311171561048857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156104eb57600080fd5b8201836020820111156104fd57600080fd5b8035906020019184600183028401116401000000008311171561051f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610bf4565b005b6106c36004803603604081101561058957600080fd5b81019080803590602001906401000000008111156105a657600080fd5b8201836020820111156105b857600080fd5b803590602001918460018302840111640100000000831117156105da57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561063d57600080fd5b82018360208201111561064f57600080fd5b8035906020019184600183028401116401000000008311171561067157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610dd4565b005b61077e600480360360208110156106db57600080fd5b81019080803590602001906401000000008111156106f857600080fd5b82018360208201111561070a57600080fd5b8035906020019184600183028401116401000000008311171561072c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610fb4565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107be5780820151818401526020810190506107a3565b50505050905090810190601f1680156107eb5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600015156001836040518082805190602001908083835b602083106108335780518252602082019150602081019050602083039250610810565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff161515146108cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806111686025913960400191505060405180910390fd5b600180836040518082805190602001908083835b6020831061090657805182526020820191506020810190506020830392506108e3565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806001836040518082805190602001908083835b6020831061098a5780518252602082019150602081019050602083039250610967565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000190805190602001906109d39291906110c2565b505050565b60606000826040518082805190602001908083835b60208310610a1057805182526020820191506020810190506020830392506109ed565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ada5780601f10610aaf57610100808354040283529160200191610ada565b820191906000526020600020905b815481529060010190602001808311610abd57829003601f168201915b50505050509050919050565b60606001826040518082805190602001908083835b60208310610b1e5780518252602082019150602081019050602083039250610afb565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610be85780601f10610bbd57610100808354040283529160200191610be8565b820191906000526020600020905b815481529060010190602001808311610bcb57829003601f168201915b50505050509050919050565b600015156000836040518082805190602001908083835b60208310610c2e5780518252602082019150602081019050602083039250610c0b565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff16151514610cca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806111686025913960400191505060405180910390fd5b60016000836040518082805190602001908083835b60208310610d025780518252602082019150602081019050602083039250610cdf565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806000836040518082805190602001908083835b60208310610d865780518252602082019150602081019050602083039250610d63565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000019080519060200190610dcf9291906110c2565b505050565b600015156002836040518082805190602001908083835b60208310610e0e5780518252602082019150602081019050602083039250610deb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff16151514610eaa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806111686025913960400191505060405180910390fd5b60016002836040518082805190602001908083835b60208310610ee25780518252602082019150602081019050602083039250610ebf565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806002836040518082805190602001908083835b60208310610f665780518252602082019150602081019050602083039250610f43565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000019080519060200190610faf9291906110c2565b505050565b60606002826040518082805190602001908083835b60208310610fec5780518252602082019150602081019050602083039250610fc9565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110b65780601f1061108b576101008083540402835291602001916110b6565b820191906000526020600020905b81548152906001019060200180831161109957829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061110357805160ff1916838001178555611131565b82800160010185558215611131579182015b82811115611130578251825591602001919060010190611115565b5b50905061113e9190611142565b5090565b61116491905b80821115611160576000816000905550600101611148565b5090565b9056fe494420697320616c726561647920696e207573652028536d61727420436f6e747261637429a265627a7a72315820bf5b56ca8f5eb5221ad3f1cfdaa13bbebabefe7e7348000835e1c6abcc6e1ccf64736f6c63430005110032";

// // Currently not in use
// app.get('/', (req, res) => {
//     res.send('Test');
// });

app.post('/locationSet', (req, res) => {
    let id = req.query.id;
    let keyValue = req.query.keyValue;
    let deviceId = req.query.deviceId;
    let sensorId = req.query.sensorId;
    let sensorCategoryId = req.query.sensorCategoryId;
    let sensorValue = req.query.sensorValue;
    let sensorAlertMsg = req.query.sensorAlertMsg;
    let sensorDescription = req.query.sensorDescription;
    let eventCreateTime = req.query.eventCreateTime;

    if (!id || !keyValue || !deviceId || !sensorId || !sensorCategoryId || !sensorValue || !sensorAlertMsg || !sensorDescription || !eventCreateTime) {
        res.status(400).json(
            {
                "status": "One or more data fields are empty!",
            }
        );
        return;
    }

    let locationForm = new locationModel();
    locationForm.id = id;
    locationForm.keyValue = keyValue;
    locationForm.deviceId = deviceId;
    locationForm.sensorId = sensorId;
    locationForm.sensorCategoryId = sensorCategoryId;
    locationForm.sensorValue = sensorValue;
    locationForm.sensorAlertMsg = sensorAlertMsg;
    locationForm.sensorDescription = sensorDescription;
    locationForm.eventCreateTime = eventCreateTime;

    let separator = "/";
    let data = id + separator + keyValue + separator + deviceId + separator + sensorId + separator + sensorCategoryId
        + separator + sensorValue + separator + sensorAlertMsg + separator + sensorDescription + separator + eventCreateTime;

    locationModel.exists({id: id }, (err, obj) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!obj) {
            locationForm.save((err2) => {
                if (err2) {
                    console.error(err2);
                    return;
                }
                console.log("LocationData is registered");
            });
        }
        else {
            console.log('ID is already in use!');
        }
    });

    web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {

        var txObject = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1000),
            gasLimit: web3.utils.numberToHex(3000000),
            data: contract.methods.SetLocationData(id, data).encodeABI(),
            to: contract.options.address
        };

        var tx = new ethTx(txObject);
        tx.sign(privKey);

        var serializedTx = tx.serialize();
        var rawTxHex = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(rawTxHex)
            .then(receipt => {
                console.log("Receipt:", receipt);
                res.status(200).json(
                    {
                        "status": "SetLocationData transaction sent!",
                        "transaction_Hash": rawTxHex
                    }
                );
            })
            .catch(error => {
                if(error) {
                    res.status(401).json(
                        {
                            "status": "Transaction failed!",
                        }
                    );
                    console.log('Error: ', error.message);
                }
            });
        console.log("Contract transaction sent, waiting for receipt");
    })
        .catch(error => { console.log('Error: ', error.message); });
});

app.get('/locationGet', (req, res) => {
    let id = req.query.id;

    if (!id) {
        res.status(400).json(
            {
                "status": "ID field is empty!",
            }
        );
    }
    contract.methods.GetLocationData(id).call()
        .then(results => {
        console.log("Results: " + results);
        let resultArray = results.split('/');
        res.status(200).json(
            {
                "status": "GetLocationData request sent!",
                "id": resultArray[0],
                "keyValue": resultArray[1],
                "deviceId": resultArray[2],
                "sensorId": resultArray[3],
                "sensorCategoryId": resultArray[4],
                "sensorValue": resultArray[5],
                "sensorAlertMsg": resultArray[6],
                "sensorDescription": resultArray[7],
                "eventCreateTime": resultArray[8],
            }
        );
    });
});

app.get('/locationGetAll', (req, res) => {
    const locationCollection = db.collection('LocationData');

    locationCollection.find({}).toArray((err, result) => {
        if (err) {
            console.err(err);
        }
        if (!result.length) {
            res.status(400).json(
                {
                    "status": "Failed! No stored data!",
                }
            );
        } else {
            res.status(200).json(
                {
                    "status": "Success!",
                    "Results": result
                }
            );
        }
    });
});

app.post('/gasSet', (req, res) => {
    let id = req.query.id;
    let keyValue = req.query.keyValue;
    let deviceId = req.query.deviceId;
    let sensorId = req.query.sensorId;
    let sensorCategoryId = req.query.sensorCategoryId;
    let sensorValue = req.query.sensorValue;
    let sensorAlertMsg = req.query.sensorAlertMsg;
    let sensorDescription = req.query.sensorDescription;
    let eventCreateTime = req.query.eventCreateTime;

    if (!id || !keyValue || !deviceId || !sensorId || !sensorCategoryId || !sensorValue || !sensorAlertMsg || !sensorDescription || !eventCreateTime) {
        res.status(400).json(
            {
                "status": "One or more data fields are empty!",
            }
        );
        return;
    }

    let gasForm = new gasModel();
    gasForm.id = id;
    gasForm.keyValue = keyValue;
    gasForm.deviceId = deviceId;
    gasForm.sensorId = sensorId;
    gasForm.sensorCategoryId = sensorCategoryId;
    gasForm.sensorValue = sensorValue;
    gasForm.sensorAlertMsg = sensorAlertMsg;
    gasForm.sensorDescription = sensorDescription;
    gasForm.eventCreateTime = eventCreateTime;

    let separator = "/";
    let data = id + separator + keyValue + separator + deviceId + separator + sensorId + separator + sensorCategoryId
        + separator + sensorValue + separator + sensorAlertMsg + separator + sensorDescription + separator + eventCreateTime;

    gasModel.exists({id: id }, (err, obj) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!obj) {
            gasForm.save((err2) => {
                if (err2) {
                    console.error(err2);
                    return;
                }
                console.log("GasData is registered");
            });
        }
        else {
            console.log("ID is already in use!");
        }
    });

    web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {

        var txObject = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1000),
            gasLimit: web3.utils.numberToHex(3000000),
            data: contract.methods.SetGasData(id, data).encodeABI(),
            to: contract.options.address
        };

        var tx = new ethTx(txObject);
        tx.sign(privKey);

        var serializedTx = tx.serialize();
        var rawTxHex = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(rawTxHex)
            .then(receipt => {
                console.log('Receipt: ', receipt);
                res.status(200).json(
                    {
                        "status": "SetGasData transaction sent!",
                        "transaction_Hash": rawTxHex
                    }
                );
            })
            .catch(error => {
                if (error) {
                    res.status(401).json(
                        {
                            "status": "Transaction failed!",
                        }
                    );
                    console.log('Error: ', error.message);
                }
            });
        console.log("Contract transaction sent, waiting for receipt");
    })
        .catch(error => { console.log('Error: ', error.message); });
});

app.get('/gasGet', (req, res) => {
    let id = req.query.id;
    if (!id) {
        res.status(400).json(
            {
                "status": "ID field is empty!",
            }
        );
    }

    contract.methods.GetGasData(id).call().then((results) => {
        console.log("Results: " + results);
        let resultArray = results.split('/');
        res.status(200).json(
            {
                "status": "GetLocationData request sent!",
                "id": resultArray[0],
                "keyValue": resultArray[1],
                "deviceId": resultArray[2],
                "sensorId": resultArray[3],
                "sensorCategoryId": resultArray[4],
                "sensorValue": resultArray[5],
                "sensorAlertMsg": resultArray[6],
                "sensorDescription": resultArray[7],
                "eventCreateTime": resultArray[8],
            }
        );
    });
});

app.get('/gasGetAll', (req, res) => {
    const gasCollection = db.collection('GasData');

    gasCollection.find({}).toArray((err, result) => {
        if (err) {
            console.err(err);
        }
        if (!result.length) {
            res.status(400).json(
                {
                    "status": "Failed! No stored data!",
                }
            );
        } else {
            res.status(200).json(
                {
                    "status": "Success!",
                    "Results": result
                }
            );
        }
    });
});

app.post('/specialEventSet', (req, res) => {
    let id = req.query.id;
    let keyValue = req.query.keyValue;
    let deviceId = req.query.deviceId;
    let sensorId = req.query.sensorId;
    let sensorCategoryId = req.query.sensorCategoryId;
    let sensorValue = req.query.sensorValue;
    let sensorAlertMsg = req.query.sensorAlertMsg;
    let sensorDescription = req.query.sensorDescription;
    let eventCreateTime = req.query.eventCreateTime;

    if (!id || !keyValue || !deviceId || !sensorId || !sensorCategoryId || !sensorValue || !sensorAlertMsg || !sensorDescription || !eventCreateTime) {
        res.status(400).json(
            {
                "status": "One or more data fields are empty!",
            }
        );
        return;
    }

    let specialEventForm = new specialEventModel();
    specialEventForm.id = id;
    specialEventForm.keyValue = keyValue;
    specialEventForm.deviceId = deviceId;
    specialEventForm.sensorId = sensorId;
    specialEventForm.sensorCategoryId = sensorCategoryId;
    specialEventForm.sensorValue = sensorValue;
    specialEventForm.sensorAlertMsg = sensorAlertMsg;
    specialEventForm.sensorDescription = sensorDescription;
    specialEventForm.eventCreateTime = eventCreateTime;

    let separator = "/";
    let data = id + separator + keyValue + separator + deviceId + separator + sensorId + separator + sensorCategoryId
        + separator + sensorValue + separator + sensorAlertMsg + separator + sensorDescription + separator + eventCreateTime;

    specialEventModel.exists({id: id }, (err, obj) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!obj) {
            specialEventForm.save((err2) => {
                if (err2) {
                    console.error(err2);
                    return;
                }
                console.log("SpecialEventData is registered");
            });
        }
        else {
            console.log("ID is already in use!");
        }
    });

    web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {

        var txObject = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1000),
            gasLimit: web3.utils.numberToHex(3000000),
            data: contract.methods.SetSpecialEventData(id, data).encodeABI(),
            to: contract.options.address
        };

        var tx = new ethTx(txObject);
        tx.sign(privKey);

        var serializedTx = tx.serialize();
        var rawTxHex = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(rawTxHex)
            .then(receipt => {
                console.log('Receipt: ', receipt);
                res.status(200).json(
                    {
                        "status": "SetSpecialEventData transaction sent!",
                        "transaction_Hash": rawTxHex
                    }
                );
            })
            .catch(error => {
                if(error) {
                    res.status(401).json(
                        {
                            "status": "Transaction failed!",
                        }
                    );
                    console.log('Error: ', error.message);
                }
            });
        console.log("Contract transaction sent, waiting for receipt");
    })
        .catch(error => { console.log('Error: ', error.message); });
});

app.get('/specialEventGet', (req, res) => {
    let id = req.query.id;

    if (!id) {
        res.status(400).json(
            {
                "status": "ID field is empty!",
            }
        );
    }

    contract.methods.GetSpecialEventData(id).call().then((results) => {
        console.log("Results: " + results);
        let resultArray = results.split('/');
        res.status(200).json(
            {
                "status": "GetLocationData request sent!",
                "id": resultArray[0],
                "keyValue": resultArray[1],
                "deviceId": resultArray[2],
                "sensorId": resultArray[3],
                "sensorCategoryId": resultArray[4],
                "sensorValue": resultArray[5],
                "sensorAlertMsg": resultArray[6],
                "sensorDescription": resultArray[7],
                "eventCreateTime": resultArray[8],
            }
        );
    });
});

app.get('/specialEventGetAll', (req, res) => {
    const specialEventCollection = db.collection('SpecialEventData');

    specialEventCollection.find({}).toArray((err, result) => {
        if (err) {
            console.err(err);
        }
        if (!result.length) {
            res.status(400).json(
                {
                    "status": "Failed! No stored data!",
                }
            );
        } else {
            res.status(200).json(
                {
                    "status": "Success!",
                    "Results": result
                }
            );
        }
    });
});

// Post method to send a create smart contract transaction.
app.post('/', (req, res) => {
    const addressFrom = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
    const privKey = Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex');
    const contractData = "0x608060405234801561001057600080fd5b506111b5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063064d2f49146100675780636a8738a8146101b957806388409cdf146102ed5780638e9b4b7b14610421578063b68c0c6814610573578063dcca587f146106c5575b600080fd5b6101b76004803603604081101561007d57600080fd5b810190808035906020019064010000000081111561009a57600080fd5b8201836020820111156100ac57600080fd5b803590602001918460018302840111640100000000831117156100ce57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561013157600080fd5b82018360208201111561014357600080fd5b8035906020019184600183028401116401000000008311171561016557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506107f9565b005b610272600480360360208110156101cf57600080fd5b81019080803590602001906401000000008111156101ec57600080fd5b8201836020820111156101fe57600080fd5b8035906020019184600183028401116401000000008311171561022057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506109d2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102b2578082015181840152602081019050610297565b50505050905090810190601f1680156102df5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103a66004803603602081101561030357600080fd5b810190808035906020019064010000000081111561032057600080fd5b82018360208201111561033257600080fd5b8035906020019184600183028401116401000000008311171561035457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610ae0565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103e65780820151818401526020810190506103cb565b50505050905090810190601f1680156104135780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6105716004803603604081101561043757600080fd5b810190808035906020019064010000000081111561045457600080fd5b82018360208201111561046657600080fd5b8035906020019184600183028401116401000000008311171561048857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156104eb57600080fd5b8201836020820111156104fd57600080fd5b8035906020019184600183028401116401000000008311171561051f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610bee565b005b6106c36004803603604081101561058957600080fd5b81019080803590602001906401000000008111156105a657600080fd5b8201836020820111156105b857600080fd5b803590602001918460018302840111640100000000831117156105da57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561063d57600080fd5b82018360208201111561064f57600080fd5b8035906020019184600183028401116401000000008311171561067157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610dce565b005b61077e600480360360208110156106db57600080fd5b81019080803590602001906401000000008111156106f857600080fd5b82018360208201111561070a57600080fd5b8035906020019184600183028401116401000000008311171561072c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610fa8565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107be5780820151818401526020810190506107a3565b50505050905090810190601f1680156107eb5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6001826040518082805190602001908083835b6020831061082f578051825260208201915060208101905060208303925061080c565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff16156108c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061115c6025913960400191505060405180910390fd5b600180836040518082805190602001908083835b6020831061090057805182526020820191506020810190506020830392506108dd565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806001836040518082805190602001908083835b602083106109845780518252602082019150602081019050602083039250610961565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000190805190602001906109cd9291906110b6565b505050565b60606000826040518082805190602001908083835b60208310610a0a57805182526020820191506020810190506020830392506109e7565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ad45780601f10610aa957610100808354040283529160200191610ad4565b820191906000526020600020905b815481529060010190602001808311610ab757829003601f168201915b50505050509050919050565b60606001826040518082805190602001908083835b60208310610b185780518252602082019150602081019050602083039250610af5565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610be25780601f10610bb757610100808354040283529160200191610be2565b820191906000526020600020905b815481529060010190602001808311610bc557829003601f168201915b50505050509050919050565b600015156000836040518082805190602001908083835b60208310610c285780518252602082019150602081019050602083039250610c05565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff16151514610cc4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061115c6025913960400191505060405180910390fd5b60016000836040518082805190602001908083835b60208310610cfc5780518252602082019150602081019050602083039250610cd9565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806000836040518082805190602001908083835b60208310610d805780518252602082019150602081019050602083039250610d5d565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000019080519060200190610dc99291906110b6565b505050565b6002826040518082805190602001908083835b60208310610e045780518252602082019150602081019050602083039250610de1565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900460ff1615610e9e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061115c6025913960400191505060405180910390fd5b60016002836040518082805190602001908083835b60208310610ed65780518252602082019150602081019050602083039250610eb3565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160006101000a81548160ff021916908315150217905550806002836040518082805190602001908083835b60208310610f5a5780518252602082019150602081019050602083039250610f37565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000019080519060200190610fa39291906110b6565b505050565b60606002826040518082805190602001908083835b60208310610fe05780518252602082019150602081019050602083039250610fbd565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110aa5780601f1061107f576101008083540402835291602001916110aa565b820191906000526020600020905b81548152906001019060200180831161108d57829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110f757805160ff1916838001178555611125565b82800160010185558215611125579182015b82811115611124578251825591602001919060010190611109565b5b5090506111329190611136565b5090565b61115891905b8082111561115457600081600090555060010161113c565b5090565b9056fe494420697320616c726561647920696e207573652028536d61727420436f6e747261637429a265627a7a72315820d6e3accd797a8ba22b14fd242f40f23064aac6b8b73c059ee98495abda7ca9a164736f6c63430005110032";

    web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {

        var txObject = {
            nonce: web3.utils.numberToHex(txnCount),
            gasPrice: web3.utils.numberToHex(1000),
            gasLimit: web3.utils.numberToHex(3000000),
            data: contractData
        };

        var tx = new ethTx(txObject);
        tx.sign(privKey);

        var serializedTx = tx.serialize();
        var rawTxHex = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(rawTxHex).on('receipt', receipt => { console.log('Receipt: ', receipt);})
            .catch(error => { console.log('Error: ', error.message); });
        console.log("Contract transaction sent, waiting for receipt");
        res.status(200).json(
            {
                "status": "Contract transaction sent!",
                "transaction_Hash": rawTxHex
            }
        );
    })
        .catch(error => { console.log('Error: ', error.message); });
});

// Listens to port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));