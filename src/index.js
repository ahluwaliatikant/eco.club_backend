const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const carbonFootprint = require('carbon-footprint')
transport = carbonFootprint.transport
food = carbonFootprint.food
meal = carbonFootprint.meal
fashion = carbonFootprint.fashion

const FuzzySet = require('fuzzyset')

// import { transport, fashion, meal, food } from 'carbon-footprint'


const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 4000
// const port = 5500

app.get('/test-page', (req, res) => {
    console.log('testing')
    res.json({'Test':'success'});
});

app.get('/getcarbonfootprint', (req, res) => {
    item = req.query.item
    items = item.split(',')
    console.log(items)
    results = []

    for (i in items) {
        item = items[i]
        if (item == "")
            continue

        console.log(item)

        f1 = FuzzySet(Object.values(carbonFootprint.FashionType))
        f2 = FuzzySet(Object.values(carbonFootprint.FoodType))
        f3 = FuzzySet(Object.values(carbonFootprint.TransportType))
    
        x1 = f1.get(item)
        x2 = f2.get(item)
        x3 = f3.get(item)
    
        if (x1) {
            itemFound = x1[0][1]
            itemProb = x1[0][0]
            results.push({item: fashion[itemFound], 'category': 'fashion', 'status': 200, 'prob': itemProb, 'itemName': itemFound})
            // res.json({item: fashion[itemFound], 'category': 'fashion', 'status': 200})
            // return
        }
    
        if (x2) {
            itemFound = x2[0][1]
            itemProb = x2[0][0]
            results.push({item: food[itemFound], 'category': 'food', 'status': 200, 'prob': itemProb, 'itemName': itemFound})
            // res.json({item: food[itemFound], 'category': 'food', 'status': 200})
            // return
        }
    
        if (x3) {
            itemFound = x3[0][1]
            itemProb = x3[0][0]
            results.push({item: transport[itemFound], 'category': 'transport', 'status': 200, 'prob': itemProb, 'itemName': itemFound})
            // res.json({item: transport[itemFound], 'category': 'transport', 'status': 200})
            // return
        }           
    }

    maxProb = -1
    mostProbRes = null
    for (i in results) {
        result = results[i]
        if (result['prob'] > maxProb) {
            mostProbRes = result
            maxProb = result['prob']
        }
    }

    if (mostProbRes != null) {
        res.json(mostProbRes)
        return
    }

    res.json({item: 'NOT_FOUND', 'status': 400})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
