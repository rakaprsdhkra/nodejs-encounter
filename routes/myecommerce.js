exports.home = function(req, res) {
    req.getConnection(function(err, connect) {
        let query = connect.query("SELECT * FROM product", function(err, rows) {
            if (err) {
                console.log('Error message: ' + err);
            }

            res.render('home', {
                page_title: "ECommerce Home",
                data: rows
            });
        });
    });
}

exports.products = function(req, res) {
    let id_product = req.params.id_product;
    req.getConnection(function(err, connect) {
        let query = connect.query("SELECT * FROM product WHERE id_product=?", id_product, function(err, rows){
            if (err) {
                console.log('Error message: ' + err);
            }

            res.render('products', {
                page_title: "ECommerce Products",
                data: rows
            });
        });
    });
}