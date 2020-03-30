var express = require('express');
var router = express.Router();
const controller = require('../controller/ajax')

/* GET home page. */

router.get('/login', 
        controller.redirectIfNotAjax,
        controller.getRequestToken
);

router.get('/retrieve', 
        controller.rejectIfNotAjax,
        controller.retrieveData
);

router.post('/modify', 
            controller.rejectIfNotAjax,
            controller.modify)


module.exports = router;
