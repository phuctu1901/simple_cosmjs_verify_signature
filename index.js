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
            const original = req.body.original
            const signature = req.body.signature_data;
            const prefix = req.body.prefix;

            const address = amino.pubkeyToAddress(signature.pub_key, prefix);
            console.log(signature)
            const { pubkey: decodedPubKey, signature: decodedSignature } = amino.decodeSignature(signature);
            const data = JSON.stringify(original);
            // https://github.com/chainapsis/keplr-wallet/blob/master/packages/cosmos/src/adr-36/amino.ts
            const verified = verifyADR36Amino("orai", address, data, decodedPubKey, decodedSignature);
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