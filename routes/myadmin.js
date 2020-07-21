const multer = require('multer');

exports.login = function(req, res){
    let message = '';
    let sess = req.session;
    let md5 = require('md5');

    if (req.method == 'POST') {
        let post = req.body;
        let name = post.username;
        let pass = md5(post.password);

        req.getConnection(function(err, connect){
            let sql = "SELECT id_admin, username, name, admin_level FROM admin_tbl WHERE username='"+name+"' AND password='"+pass+"'";
            let query = connect.query(sql, function(err, results){
                if (results.length) {
                    req.session.adminId = results[0].id_admin;
                    req.session.admin = results[0];
                    console.log(results[0].id_admin);
                    res.redirect('./home');
                } else {
                    message = 'Username or Password incorrect! Please try again.';
                    res.render('./admin/index', {
                        message: message
                    });
                }
            });
        });

    } else {
        res.render('./admin/index', {
            message: message
        });
    } 
}

exports.home = function(req, res){
    let admin = req.session.admin;
    let adminId = req.session.adminId;
    console.log('id_admin=' + adminId);

    if (adminId == null) {
        res.redirect('/ecommerce/admin/login');
        return;
    }

    req.getConnection(function(err, connect){
        let sql = "SELECT * FROM product ORDER BY createdate DESC";
        let query = connect.query(sql, function(err, results){
            res.render('./admin/home', {
                pathname: 'home',
                data: results
            });
        });
    });
}

exports.add_product = function(req, res){
    let admin = req.session.admin;
    let adminId = req.session.adminId;

    console.log('id_product=' + adminId);

    if (adminId == null) {
        res.redirect('/ecommerce/admin/login');
        return;
    }

    res.render('./admin/home', {
        pathname: 'add_product'
    });
}

exports.process_add_product = function(req, res){
    let storage = multer.diskStorage({
        destination: './public/images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    let upload = multer({ storage: storage }).single('image');
    let date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            return res.end('Error uploading image!');
        }
        
        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            let post = {
                nama_produk: req.body.nama_produk,
                harga_product: req.body.harga_product,
                des_product: req.body.des_product,
                gambar_produk: req.file.filename,
                createdate: date
            }

            console.log(post);

            let sql = "INSERT INTO product SET ?";
            let query = connect.query(sql, post, function(err, results) {
                if (err) {
                    console.log('Error input product: %s', err);
                }

                res.redirect('/ecommerce/admin/home');
            });
        });
    });
}

exports.edit_product = function(req, res){
    let id_product = req.params.id_product;
    let admin = req.session.admin;
    let adminId = req.session.adminId;

    console.log('id_admin=' + adminId);

    if (adminId == null) {
        res.redirect('/ecommerce/admin/login');
        return;
    }

    req.getConnection(function(err, connect) {
        let sql = "SELECT * FROM product WHERE id_product=?";
        let query = connect.query(sql, id_product, function(err, results) {
            if (err) {
                console.log('Error show product: %s', err);
            }

            res.render('./admin/home', {
                id_news: id_product,
                pathname: 'edit_product',
                data: results
            });
        });
    });
}

exports.process_edit_product = function(req, res) {
    let id_product = req.params.id_product;
    let storage = multer.diskStorage({
        destination: './public/images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    let upload = multer({ storage: storage }).single ('image');
    let date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            var image = req.body.image_old;
            console.log('Upload failed!');
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            let post = {
                nama_produk: req.body.nama_produk,
                harga_product: req.body.harga_product,
                des_product: req.body.des_product,
                gambar_produk: image,
                createdate: date
            }

            let sql = "UPDATE product SET ? WHERE id_product=?";
            let query = connect.query(sql, [post, id_product], function(err, results) {
                if (err) {
                    console.log('Error edit product: %s', err);
                }

                res.redirect('/ecommerce/admin/home');
            });
        });
    });    
}

exports.delete_product = function(req, res) {
    let id_product = req.params.id_product;

    req.getConnection(function(err, connect) {
        let sql = "DELETE FROM product WHERE id_product=?";
        let query = connect.query(sql, id_product, function(err, results) {
            if (err) {
                console.log('Error delete producr: %s', err);
            }

            res.redirect('/ecommerce/admin/home');
        });
    });
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/ecommerce/admin/login');
    });
}