const amino = require("@cosmjs/amino");
const crypto = require("@cosmjs/crypto");
const { verifyADR36Amino } = require('@keplr-wallet/cosmos');
const express = require('express')
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.post('/verify',
    async function (req, res) {
        try {

            // {
            //     pub_key: {
            //       type: 'tendermint/PubKeySecp256k1',
            //       value: 'Ax6wV+2qwcR7+bWFyZtFgCRgZUzOh/zsmMJwSqt1DKWt'
            //     },
            //     signature: '76tRlEPhToLXtbbFnZq2sUyzkD8VCVOZF/hFtwKfm+U0H6pTdK6C+TUPHdChG7C045fnYXV44og1wsKVVpPU7A=='
            //   }

            // {
            //     "title": "Oraichain Testnet Network Login",
            //     "description": "This is a transaction that allows Oraichain Network to authenticate you with our application.",
            const nonce = req.body.nonce
            //   }

            const signature = req.body;
            const address = amino.pubkeyToAddress(signature.pub_key, "orai");
            console.log(signature)
            const { pubkey: decodedPubKey, signature: decodedSignature } = amino.decodeSignature(signature);
            const data = JSON.stringify({
                title: 'Oraichain Testnet Network Login',
                description: 'This is a transaction that allows Oraichain Network to authenticate you with our application.',
                nonce: nonce
            });
            // https://github.com/chainapsis/keplr-wallet/blob/master/packages/cosmos/src/adr-36/amino.ts
            const verified = verifyADR36Amino("orai", address, data, decodedPubKey, decodedSignature);
            console.log("Gia tri duoc verify la: ", verified)
            if (verified) {
                res.status(200).json({ msg: "Valid signature",  address: address });
            } else {
                res.status(401).json({ msg: "Invalid sigature" });

            }
        }
        catch (err) {
            res.status(401).json({ msg: "Invalid sigature"});
        }
    })
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
app.listen(3002, function () {
    console.log('Node app is running on port 3002');
});
module.exports = app;