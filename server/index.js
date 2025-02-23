const express = require('express');
const app = express();
const client = require('./mqtt').client;
require('dotenv').config();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const serverRoutes = require('./routes/serverRoutes');

const userSchema = require('./models/userSchema');
const switchSchema = require('./models/switchSchema');

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api', serverRoutes)



const port = process.env.PORT;
const uri = process.env.URI;



// connect to db
mongoose.connect(uri)
    .then(() => {
        // listen
        app.listen(port, () => {
            console.log("Connected to DB and Listening.")
        });
    })
    .catch((err) => {
        console.log(err)
    })

app.get('/', (req, res) => {

    res.status(200).send({
        message: "Hello from the server. MQTT Connected"
    });

});

app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValid = bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ _id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json({ user, token, message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);


// toggle the switch
app.post('/toggle', async (req, res) => {
    const { topic } = req.body;
    const serialId = topic;
    const switchObj = await switchSchema.findOne({ serialId }); // finds the switch

    var isOn = switchObj.status === 'on' ? true : false; // sets initial status of switch from the last stored status

    // publishes new message
    if (client) {
        client.publish(topic, isOn ? 'OFF' : 'ON', { qos: 0, retain: false }, async (error) => {

            // updates the new status to db for future calls
            switchObj.status = isOn ? 'off' : 'on';
            await switchObj.save();

            if (error) {
                console.error(error);
            }
        });

        res.status(200).json({
            message: `Toggled! light is ${switchObj.status}`,
            isOn: switchObj.status === 'on' ? true : false
        });
    } else {
        res.status(500).send({
            message: 'MQTT not connected',
            isOn: isOn
        });
    }
});



module.exports = app;