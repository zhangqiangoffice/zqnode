var express = require('express');
var app = express();
var birds = require('./birds');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var multer = require('multer');
var upload = multer();

app.locals.title = 'My APP!';

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./public'));
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.setHeader("Set-Cookie", 'a=000');
    console.log("Cookie:", req.cookies);
    res.send('Hello World');
});

app.post('/', function(req, res) {
    res.send('Got a POST request');
});

app.post('/profile', upload.array(), function(req, res, next) {
    console.log(req.body);
    res.json(req.body);
});

app.get('/profile', function(req, res) {
    console.log("Cookie:", req.cookies);
    res.render('profile', {pageTitle: 'express learning', youAreUsingPug:true});
});

app.get('/supervisor', function(req, res) {
    console.log("Cookie:", req.cookies);
    res.send('supervisor on working');
});

app.get('/hostname', function(req, res) {
    res.send('hostname:' + req.hostname);
});

app.get('/ip', function(req, res) {
    console.log(res.headersSent);
    res.send('ip:' + req.ip + '\n');
    res.send('method:' + req.method + '\n');
    console.log(res.headersSent);
});

app.get('/params/:name/:age', function(req, res) {
    res.send('name:' + req.params.name + '  age:' + req.params.age);
});

app.get('/query', function(req, res) {
    res.send('params:' + req.query.name);
});

app.get('/download', function(req, res) {
    res.send('start download');
    res.download('/report-12345.pdf', 'zq.pdf', function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('well done!');
        }
    });
});


app.get('/example/a', function(req, res) {
    res.send('Hello From A');
});

app.get('/example/b', function(req, res, next) {
    console.log('response will be sent by the next function ...');
    next();
}, function(req, res) {
    res.send('Hello from B');
});

var cb0 = function(req, res, next) {
    console.log('cb0');
    next();
};

var cb1 = function(req, res, next) {
    console.log('cb1');
    next();
};

var cb2 = function(req, res) {
    res.send('Hello from C');
};

app.get('/example/c', [cb0, cb1, cb2]);

var Ojson = {name:'zhangqiang',age: 28};
app.get('/example/j', function(req, res) {
    res.json(Ojson);
});

app.use('/birds', birds);


var admin = express();

admin.on('mount', function(parent) {
    console.log('Admin Mounted');
    console.log(parent);
});

admin.get('/', function(req, res) {
    console.log(admin.mountpath);
    res.send('Admin Homepage');
});

var secret = express();

secret.get('/', function(req, res) {
    console.log(secret.mountpath);
    res.send('Admin Secret');
});

admin.use('/secr*t', secret);

app.use('/admin', admin);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});