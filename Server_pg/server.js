/* =============================================  Requirements  ==============================================
================================================================================================================= */
// const path = require('path');//production related
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server'); 


const port = process.env.PORT || 3003;

const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

//TODO: hook up react part; currently only express and postgress are connected && add set up notes to MD


/* =============================================  Pool  =================================================
================================================================================================================= */
// pool manages postgreSQL clients;
const { Pool } = require('pg')
const pool = new Pool({
    user: 'codetl',
    host: 'localhost',
    database: 'final_project', //database_name
    password: 'password',
    port: 5432,
  })

// const pool = new Pool({
//     // 'postgres://localhost:5432/database_name'
//     connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/final_project ',
//     // Use SSL but only in production
//     ssl: process.env.NODE_ENV === 'production'
//   });



/* =================================== Routes for User Data  =======================================================
================================================================================================================= */

//test route
app.get('/', (request, response) => { 
    response.json({ info: "Test Message Testing" })
    })

//get all
app.get('/user', async (req, res) => {
    const client = await pool.connect();
    const contactsTable = await client.query('SELECT * FROM user_profile');
    res.json(contactsTable.rows);
    client.release();
    console.log('GET QUERY OF ALL USERS IS WORKING ON BACKEND') ///testing for true connection
})

// return single item by id
app.get('/user/:home_zip_code', async (req, res) =>{
  console.log('WWWWWWWWWW'+req.params.home_zip_code)
  const client = await pool.connect();
  const eventsTable = await client.query('SELECT * FROM user_profile WHERE home_zip_code = $1', [req.params.home_zip_code]); 
  res.json(eventsTable.rows); 
  client.release();
  console.log('GET SINGLE PARENT BY ZIP CODE QUERY IS WORKING ON BACKEND') ///testing for true connection
})

// add a new item //TODO: posting all at once, only works with 5 given params (do I want to return all or everything excluding phone number)
app.post('/user', async(req, res) => {

  console.log("============"+req.body.child_group)
  const client = await pool.connect();
  const eventsTable = await client.query("INSERT INTO user_profile  (user_id, user_name, email, home_zip_code, phone_number, num_children, child_group, description, Monday, Tuesday, Wednesday, Thursday, Saturday, Sunday, Friday) VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *", [req.body.user_name, req.body.email, req.body.home_zip_code, req.body.phone_number, req.body.num_children, req.body.child_group, req.body.description, req.body.Monday, req.body.Tuesday, req.body.Wednesday, req.body.Thursday, req.body.Saturday, req.body.Sunday, req.body.Friday, ]);
  res.json(eventsTable.rows[0]);
  client.release();
  console.log('POST QUERY TO DATABASE IS WORKING ON BACKEND') ///testing for true connection
})

/* =================================== Route for Request Contact  ==============================================
================================================================================================================= */
//https://ethereal.email/
// app.post('/api/form', (req, res) => {
//   nodemailer.createTestAccount((err, account) => {
//     const htmlEmail = `
//     <h3>Contact Details</h3>
//       <p>Name: ${req.body.name}</p>
//       <p>Email: ${req.body.email}</p>
//     <h3>Message</h3>
//     <p>${req.body.message}</p>
//     `
//     let transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587, 
//       auth: {
//         user: 'lupe15@ethereal.email', //TODO: how to get the requested user's information here
//         pass: 'WXZb1jMtWXMe4CGkz1' //==========================================================
//       }
//     })

//     let mailOptions = {
//       from: req.body.email, //logged in user email inputs email they want to be reached back at
//       to: 'lupe15@ethereal.email',  //TODO: how to get the requested user's information here
//       replyTo: req.body.email,
//       subject: 'Request for Playdate',
//       text: req.body.message,
//       html: htmlEmail
//     }

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err){
//         return console.log(err)
//       }
//       console.log('Message sent: %s', info.message)
//       console.log('Message URL: %s', nodemailer.getTestMessageUrl(info))
//       console.log('EMAIL SENT TO DESTINATION')
//       res.json(info)
//     })

//   })
// })

/* ================================================  Pusher Chatkit  ============================================
================================================================================================================= */

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:de6dff03-0811-41fc-b06a-878538c7b5dd',
  key: '44e927a9-421a-47ee-a8f1-9b6668ad648f:WwwEtrarl1prXwvQ1Ggyd2FEpqUFCdPid7/F7Dunscs='
})

app.post('/users', (req, res) => {
  const {username} = req.body

  chatkit.createUser({
    name: username, 
    id: username
  })
  .then(() => res.sendStatus(201))
  .catch(error => {
    if (error.error === 'services/chatkit/user_already_exists'){
      res.sendStatus(200)
    } else {
      res.status(error.status).json(error)
    }
  })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})




/* =============================================  Deploying Code  =======================================================
================================================================================================================= */


// if (process.env.NODE_ENV === "production") {  //production means live instead of local
//     // Serve any static files
//     app.use(express.static(path.join(__dirname, "../client/build"))); //build dir will be populated
//     // Handle React routing, return all requests to React app
//     app.get("*", function(req, res) {
//       res.sendFile(path.join(__dirname, "../client/build", "index.html"));
//     });
//   }
  
  /* =============================================  Listening Message  =======================================================
================================================================================================================= */

  app.listen(port, () => console.log(`>>>>>>>>>>>>> Back-End Express Server is Listening on Port ${port}! <<<<<<<<<<<<<`))