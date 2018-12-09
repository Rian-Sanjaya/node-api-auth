// mongodb connection: mongodb+srv://rian:yF0tawNfhh858hfJ@cluster0-6jkog.mongodb.net/test?retryWrites=true

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Thing = require('./models/thing');
const app = express()

// app.use( (req, res, next) => {
//     console.log('Request received!')
//     next()
// })

// app.use((req, res, next) => {
//     res.status(201)
//     next()
// })

// app.use((req, res, next) => {
//     res.json({ message: 'Your request was successful!' })
//     next()
// })

// app.use((req, res, next) => {
//     console.log('Response sent successfully!')
// })

// This will allow all requests from all origins to access your API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect('mongodb+srv://rian:yF0tawNfhh858hfJ@cluster0-6jkog.mongodb.net/test?retryWrites=true')
.then( () => {
    console.log('Successfully connected to MongoDB Atlas!');
})
.catch( (error) => {
    console.log('Unable to connect to MongoDB Atlas');
    console.log(error);
})

// set json function as global middleware
app.use(bodyParser.json())

// POST route to add a new item
app.post('/api/stuff', (req, res, next) => {
    // console.log(req.body)
    const thing = new Thing({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });

    thing.save().then( () => {
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
})

// GET route to return a specific item
app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({_id: req.params.id}).then( (thing) => {
        res.status(200).json(thing);
    }).catch( (error) => {
        res.status(404).json({
            error: error
        });
    });
});

// PUT route to edit a specific item
app.put('/api/stuff/:id', (req, res, next) => {
    // Using the new keyword with a Mongoose model creates a new _id field by default. 
    // In this case, that would throw an error, as we would be trying to modify an immutable field on a database document. 
    // Therefore, we must use the  id  parameter from the request to set our Thing up with the same _id as before
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });

    Thing.updateOne({_id: req.params.id}, thing).then( () => {
        res.status(201).json({
            message: 'Thing updated successfully!'
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});

// DELETE route to delete a specific item
app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({_id: req.params.id}).then( () => {
        res.status(200).json({
            message: "Deleted!"
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});

// GET route to return all items
app.use('/api/stuff', (req, res, next) => {
    // const stuff = [
    //     {
    //         _id: 'oiisjdk',
    //         title: 'My first thing',
    //         description: 'All of the info about my first thing',
    //         imageUrl: 'https://store.storeimages.cdn-apple.com/4981/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp13touch/space/mbp13touch-space-select-201807?wid=452&hei=420&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1529520060550',
    //         price: 4900,
    //         userId: 'kksjfkks'
    //     },
    //     {
    //         _id: 'oiisjdplk',
    //         title: 'My second thing',
    //         description: 'All of the info about my second thing',
    //         imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPtrO_cZDl2TYaTyWyfcrK2s4KChBjAogKvvBCUMK6xzQntZnM',
    //         price: 2900,
    //         userId: 'kksjfkks'
    //     }
    // ]

    // res.status(200).json(stuff)

    Thing.find().then( (things) => {
        res.status(200).json(things);
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});



module.exports = app
