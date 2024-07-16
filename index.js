const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let userCounter = 1;
const users = [];

// exercise 
// {
//   username: "fcc_test",
//   description: "test",
//   duration: 60,
//   date: "Mon Jan 01 1990",
//   _id: "5fb5853f734231456ccb3b05"
// }

// user
// {
//   username: "fcc_test",
//   _id: "5fb5853f734231456ccb3b05"
// }

// log
// {
//   username: "fcc_test",
//   count: 1,
//   _id: "5fb5853f734231456ccb3b05",
//   log: [{
//     description: "test",
//     duration: 60,
//     date: "Mon Jan 01 1990",
//   }]
// }

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const newUser = {username, _id: String(userCounter), log: []};
  userCounter++;
  users.push(newUser);
  res.json(newUser);
});

app.get('/api/users', (req, res) => {
  res.json(users.map((user) => {
    return {
      username: user.username,
      _id: user._id
    }
  }))
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const description = req.body.description;
  const duration = +req.body.duration;
  let date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();

  const foundUser = users.find((user) => {
    return user._id === req.params._id;
  })

  if (!foundUser) {
    res.json({error: 'user not found'})
  } else {
    foundUser.log.push({
      description,
      duration,
      date
    })
    res.json({
      username: foundUser.username,
      description,
      duration,
      date,
      _id: foundUser._id
    })
  }
})

app.get('/api/users/:_id/logs', (req, res) => {
  const from = req.query.from ? new Date(req.query.from).toDateString() : null;
  const to = req.query.to ? new Date(req.query.to).toDateString() : null;
  const limit = req.query.limit

  const foundUser = users.find((user) => {
    return user._id === req.params._id;
  })

  if (!foundUser) {
    res.json({error: 'user not found'})
  } else {
    let logs = foundUser.log.sort((a,b) => {return a.date>b.date});;
    if(from) {
      logs = logs.filter((log) => {
        return new Date(log.date).getTime()>new Date(from).getTime();       
      }) 
    }
    if(to) {
      logs = logs.filter((log) => {
        return new Date(log.date).getTime()<new Date(to).getTime()
      }) 
    }
    if(limit) {
      logs = logs.slice(0,limit);
    }

    res.json(
      {
        username: foundUser.username,
        count: foundUser.log.length,
        _id: foundUser._id,
        log: logs
      }
    )
  }
})
//https://3000-exiltruman-fccboilerpla-wn0kyk0eewh.ws-eu115.gitpod.io/api/users/12/logs

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
