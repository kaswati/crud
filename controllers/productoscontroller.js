var mysql = require('mysql');
var dateFormat = require('dateFormat');

//product controller

module.exports = {

  getProductos : function(req, res, next){
    var config = require('.././database/config');

    var db = mysql.createConnection(config);
    db.connect();

    var productos = null;

    db.query('select * from productos', function(err, rows, fields){
        if(err) throw err;

        productos = rows;
        db.end();

        res.render('productos/productos', {productos : productos});
    });

  },

  getNuevoProducto : function(req, res, next){
    res.render('productos/nuevo');
  },

  postNuevoProducto : function(req, res, next){

    var fechaactual = new Date();
    var fecha = dateFormat(fechaactual, 'yyyy-mm-dd h:MM:ss');

    var producto = {
        nombre : req.body.nombre,
        precio : req.body.precio,
        stock :req.body.stock,
        fecha_creacion : fecha
    }

    var config = require('.././database/config');

    var db = mysql.createConnection(config);
    db.connect();

    db.query('insert into productos set ?', producto, function(err, rows, fields){
        if (err) throw err;

        db.end();
    });

    res.render('productos/nuevo', {info : 'producto creado correctamante'});

        //console.log(producto);
        // console.log(req.body);
  },

  eliminarProducto : function(req, res, next){
    var id = req.body.id;

    var config = require('.././database/config');

    var db = mysql.createConnection(config);
    db.connect();

    var respuesta = {res: false};

    db.query('delete from productos where id_producto = ?', id, function(err, rows, fields){
        if (err) throw err;
        
        db.end();
        respuesta.res = true;

        res.json(respuesta);
    });

  },

  getModificarProducto : function(req, res, next){
        var id = req.params.id;
        //console.log(id); 

        var config = require('.././database/config');

        var db = mysql.createConnection(config);
        db.connect();

        var producto = null;

        db.query('select * from productos where id_producto = ?', id, function(err, rows, fields){
            if (err) throw err;

            producto = rows;
            db.end();

            res.render('productos/modificar', {producto: producto});
        });
  },

  postModificarProducto : function(req, res, next){

        var producto = {
            nombre : req.body.nombre,
            precio : req.body.precio,
            stock : req.body.stock
        };

        var config = require('.././database/config');

        var db = mysql.createConnection(config);
        db.connect();

        db.query('update productos set ? where ?', [producto, {id_producto : req.body.id_producto}], function(err, rows, fields){
            if(err) throw err;
            db.end();
        });

        res.redirect('/productos');

  }
}