var express = require('express');
var router = express.Router();
const controller = require('../controller/pocket')

/* GET home page. */

router.get('/login', 
        controller.redirectIfNotAjax,
        controller.getRequestToken,
        controller.sendAuthUrl
);

router.get('/retrieve', 
        controller.rejectIfNotAjax,
        controller.retrieveData
);

module.exports = router;
