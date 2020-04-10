var express = require('express');
var router = express.Router();
const controller = require('../controller/page')

/* GET home page. */
router.get('/login', 
        controller.redirectIfhasLogin,
        controller.getLogin);

router.get('/app', 
        controller.loginProcess,
        controller.toApp
        );

module.exports = router;
