const userSchema = require('../models/userSchema');
const switchSchema = require('../models/switchSchema');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 11;
const client = require('../mqtt').client;

// get all users
const getAllUsers = async (req, res) => {
    const users = await userSchema.find({}).sort({ createdAt: -1 })
    res.json(users)
}

// get all switches
const getAllSwitches = async (req, res) => {
    const switches = await switchSchema.find({}).sort({ createdAt: -1 })
    res.json(switches)
}

// get one switch
const getSwitch = async (req, res) => {
    const switchObj = await switchSchema.findById(req.params.id);
    res.json(switchObj)
}

// get switch by topic
const getSwitchTopic = async (req, res) => {
    const { topic } = req.body;
    const serialId = topic;
    const switchObj = await switchSchema.findOne({ serialId });
    res.json(switchObj);
}

// get all switches of a specific user
const getUserSwitches = async (req, res) => {
    const { email } = req.body;

    const user = await userSchema.findOne({ email }); // finds the user
    const switches = user.switches; // gets the switches of the user
    if (switches.length === 0) return res.status(404).json({ message: "No switches found" }); // if no switches found  
    res.status(200).json(user.switches); // returns the switches of the user
}

// register a user
const insertUser = async (req, res) => {

    let { email, password, fullname } = req.body;

    // stores the hashed password
    bcrypt.hash(password.toString(), saltRounds, async function (err, hash) {
        password = hash;
        try {
            const newUser = await userSchema.create({ email, password, fullname });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });


}

// register a switch in db (ONLY ADMIN CONTROLLED)
const insertSwitch = async (req, res) => {

    const { serialId, status, ssid, name } = req.body;

    try {
        const newSwitch = await switchSchema.create({ serialId, status, ssid, name });
        res.status(201).json(newSwitch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// update a switch
const updateSwitch = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such ID" })
    }

    const update = await switchSchema.findByIdAndUpdate({ _id: id }, req.body, { new: true })

    res.status(200).json({ update, message: "Switch updated" });
}

// insert a switch to a user's account
const insertSwitchToUser = async (req, res) => {
    const { email, serialId } = req.body;

    try {
        const user = await userSchema.findOne({ email }); // finds the user
        const switchObj = await switchSchema.findOne({ serialId }); // finds the switch

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else if (!switchObj) {
            return res.status(404).json({ message: 'Switch not found' });
        } else {
            user.switches.push(switchObj._id); // adds the switch to the user's account
            await user.save(); // saves the user
            res.status(201).json({ switchObj, user, message: 'Switch added to user' }); // returns the switch and user
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteSwitchFromUser = async (req, res) => {
    const { email, serialId } = req.body;

    try {
        const user = await userSchema.findOne({ email }); // finds the user
        const switchObj = await switchSchema.findOne({ serialId }); // finds the switch

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else if (!switchObj) {
            return res.status(404).json({ message: 'Switch not found' });
        } else {
            user.switches.pull(switchObj._id); // removes the switch from the user's account
            await user.save(); // saves the user
            res.status(201).json({ switchObj, user, message: 'Switch removed from user' }); // returns the switch and user
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const configureSwitch = async (req, res) => {
    const { serialId, name, ssid, password } = req.body;
    const topic = serialId;
    try {
        const switchObj = await switchSchema.findOne({ serialId });
        if (!switchObj) return res.status(404).json({ message: "No such switch" });

        const message = {
            ssid, password
        }

        if (client) {
            client.publish(topic, JSON.stringify(message), { qos: 0, retain: false }, async (error) => {

                switchObj.ssid = ssid;
                switchObj.name = name;
                await switchObj.save();

                if (error) {
                    console.error(error);
                }
            });
        } else {
            return res.status(500).json({ message: "MQTT not connected" });
        }

        res.status(200).json({ switchObj, message: 'Switch configured' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getAllSwitches,
    getSwitch,
    getSwitchTopic,
    getUserSwitches,
    insertUser,
    insertSwitch,
    insertSwitchToUser,
    deleteSwitchFromUser,
    updateSwitch,
    configureSwitch
}