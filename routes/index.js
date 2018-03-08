var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  var products;
  Product.find(function(err, data){
      if(err){
        console.log(err)
      }
      products = data;
      res.render('index', { "title": 'Shopping-cart', "products":products});
      
  });
});

router.get('/checkout', function(req, res){
  if(!req.isAuthenticated()){
    res.redirect('/users/signin');
  }
  else{
    res.render('checkout');
  }
})


router.get('/reduceByOne/:id', function(req, res){

  var cart = new Cart(req.session.cart);
  cart.reduceByOne(req.params.id);
  req.session.cart_items = cart.generateArray();
  req.session.cart = cart;
  
  res.redirect("/shopping-cart")
})

router.get('/remove/:id', function(req, res){
  var cart = new Cart(req.session.cart);
  cart.remove(req.params.id);
  req.session.cart_items = cart.generateArray();
  req.session.cart = cart;

  res.redirect("/shopping-cart")
})
router.get('/removeAll', function(req, res){
  delete req.session.cart;

  res.redirect("/shopping-cart")
})

router.get('/shopping-cart', function(req, res){
  res.render('shopping-cart');
})

router.get('/add-to-cart/:id', function(req, res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/')
    }
    
    cart.add(product, product.id);
    req.session.cart = cart;
    req.session.cart_items = cart.generateArray();
    // console.log("cart Array:"+cart.generateArray().pop().price);
    res.redirect('/');

  })

})

module.exports = router;
