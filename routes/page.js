var express = require('express');
var router = express.Router();
const controller = require('../controller/page')

/* GET home page. */
router.get('/login', controller.getLogin);

router.get('/app', 
        controller.redirectIfNoReqToken,
        controller.getAccessTokenIfhavent,
        controller.toApp
        );

module.exports = router;
