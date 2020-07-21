const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');
const conn = require('express-myconnection');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const myecommerce = require('./routes/myecommerce');
const myadmin = require('./routes/myadmin');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    conn(mysql, {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'ecommerce'
    }, 'single')
);
app.use(
    session({
        secret: 'babastudio',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 120000}
    })
);

app.get('/', function(req, res){
    res.send('Server is running on port ' + app.get('port') + '!');
});

app.get('/ecommerce', myecommerce.home);
app.get('/ecommerce/products/:id_product', myecommerce.products);
app.get('/ecommerce/admin', myadmin.home);
app.get('/ecommerce/admin/login', myadmin.login);
app.post('/ecommerce/admin/login', myadmin.login);
app.get('/ecommerce/admin/home', myadmin.home);
app.get('/ecommerce/admin/add_product', myadmin.add_product);
app.post('/ecommerce/admin/add_product', myadmin.process_add_product);
app.get('/ecommerce/admin/edit_product/:id_product', myadmin.edit_product);
app.post('/ecommerce/admin/edit_product/:id_product', myadmin.process_edit_product);
app.get('/ecommerce/admin/delete_product/:id_product', myadmin.delete_product);
app.get('/ecommerce/admin/logout', myadmin.logout);

app.listen(app.get('port'), function(){
    console.log('Server is running on port ' + app.get('port') + '!');
});