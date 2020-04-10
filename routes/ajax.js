var express = require('express');
var router = express.Router();
const controller = require('../controller/ajax')

/* GET home page. */

router.get('/login', 
        controller.redirectIfNotAjax,
        controller.getRequestToken
);

router.get('/retrieve',
        controller.rejectIfHaventLogin,
        controller.rejectIfNotAjax,
        controller.retrieveData
);
router.get('/retrieve/preset',
        controller.rejectIfHaventLogin,
        controller.rejectIfNotAjax,
        controller.retrievePresetData
);

router.post('/modify', 
            controller.rejectIfHaventLogin,
            controller.rejectIfNotAjax,
            controller.modify)

router.post('/accomplish', 
            controller.rejectIfHaventLogin, 
            controller.rejectIfNotAjax,
            controller.addTagForAccomplish,
            controller.pushRecord)

router.post('/removerecord', 
            controller.rejectIfHaventLogin,
            controller.rejectIfNotAjax,
            controller.removeRecord,
            controller.removeAccomplishTag)

router.post('/update/setting', 
            controller.rejectIfHaventLogin,
            controller.rejectIfNotAjax,
            controller.updateSettings)

            



module.exports = router;
