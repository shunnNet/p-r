var express = require('express');
var router = express.Router();
const controller = require('../controller/page')

/* GET home page. */
router.get('/login', 
        controller.redirectIfhasLogin,
        controller.getLogin);

router.get('/app', 
        controller.redirectIfNoReqToken,
        controller.getAccessTokenIfhavent,
        controller.createUserIfNotExist,
        controller.toApp
        );

module.exports = router;
