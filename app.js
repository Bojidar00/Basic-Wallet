const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');
const axios = require('axios');

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


(function menu(){
rl.question("Menu \n1 - Generate keys\n2 - Send Transaction\n",
function(choice) {if(choice==='1'){
    const keyPair = ec.genKeyPair();
    console.log(`public key:${keyPair.getPublic('hex')}`);
    console.log(`private key:${keyPair.getPrivate('hex')}`);
    menu();}
else if(choice==='2'){
    rl.question("Sender:", function(sender) {
        rl.question("Recipient:", function(recipient) {
            rl.question("Amount:", function(amount) {
                var time=Date.now();
                var hash =SHA256(time+sender+recipient+amount).toString();
                console.log(hash);
                rl.question("Private key:", function(privateKey) {
                    var key = ec.keyFromPrivate(privateKey, 'hex');
                    var signature = key.sign(hash);
                    isValid(sender,hash,signature);
                   // sendRequest(time,sender,recipient,amount,signature);
                });
            });
        });
    });
}});}());

function sendRequest(time,sender,recipient,amount,signature){
    axios.post('/user', {
        time:time,
        fromAddress: sender,
        toAddress: recipient,
        amount:amount,
        signature:signature,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}

function isValid(fromAddress,hash, signature){
    
    
    
   
    //var pub = fromAddress.encode('hex');                                 
    
    
    // Import public key
    var key = ec.keyFromPublic(fromAddress, 'hex');
    
    
    
    console.log(key.verify(hash, signature));
}