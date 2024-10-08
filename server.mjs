// 1. create server.mjs file
// 2. npm init -y - creates package.json
// 3. correct package.json
// 4. npm i express - download express
// 5. import express at top of page
// 6. initialize express into a variable
// 7. listen to express(app) at the BOTTOM of the page

import express from 'express';
import userRoutes from './routes/userRoutes.mjs';
import fs from 'fs';

// Initialize express into a variable
const app = express();
const PORT = 3000;

// Server static files to be used by template
app.use(express.static("./styles"))

// Creating template engine
app.engine('rtt', (filePath, options, callback) => {
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);

        const rendered = content.toString().replaceAll(
            "#title#", `${options.tiltle}`
        ).replace(
            "#content#", `${options.content}`
        );
        return callback(null, rendered);
    });
});
app.set('views', './views')
app.set('view engine', 'rtt')


// Middleware
const logReq = function(req, res, next) {
    console.log("Request Received");
    next();
};

app.use(logReq);

// Error Handler
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
})


// Routes - order of routes is most specific --> least specific
// first arg is path - always in quotes
app.get('/', (req, res)=>{
    let options = {
        title: 'My app',
        content: 'This is magic!'
    }
    res.render('template', options)
});

app.get('*', (req, res) => {
    res.redirect('http://www.youtube.com')
})
// app.get('/user/:id', (req, res)=> {
//     console.log(req.params.id)
//     res.send(`Welcome user ${req.params.id}`)
// })

app.use('/user', userRoutes)

// App.listen should ALWAYS be the last thing in your server
app.listen(PORT, ()=> {
    console.log(`Server is running on Port: ${PORT}`)
})
