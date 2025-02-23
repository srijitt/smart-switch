const express = require('express')
const router = express.Router()
const { getAllUsers, getAllSwitches, insertUser,
        getSwitchTopic, insertSwitchToUser, insertSwitch,
        updateSwitch, getSwitch, getUserSwitches, 
        configureSwitch,
        deleteSwitchFromUser} = require('../controllers/serverController')

const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', getAllUsers); // get all users
router.get('/switches', getAllSwitches); // get all switches

router.post('/userSwitches', getUserSwitches); // get all switches of a specific user



router.get('/:id', getSwitch); // get switch using id
router.post('/getSwitchTopic', getSwitchTopic); // get switch using topic
router.post('/configure', configureSwitch);


router.post('/insertUser', insertUser); // insert an user in database
router.post('/insertSwitch', insertSwitch); // insert a switch in database
router.post('/insertSwitchToUser', insertSwitchToUser); // insert a switch in users' accounts
router.delete('/deleteSwitchFromUser', deleteSwitchFromUser); // delete a switch from user's account

router.patch('/update/:id', updateSwitch) // update switch using id


module.exports = router