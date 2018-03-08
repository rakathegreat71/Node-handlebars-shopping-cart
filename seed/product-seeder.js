var Product = require('../models/product');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopping");

// Array of products
var products = [
  new Product({
    imagePath:'https://humblebundle.imgix.net/misc/files/hashed/f34fdaf585bb9283ddc1997e4f9353c1c13caf87.jpg?auto=format&fit=crop&w=616&h=353&s=8b3585752e7fb0b9eb8399e82c3e61f5',
    title:"TombRaider(1)",
    description:"Lara Croft confined on a hellish island and learns how to survive",
    price:1200
  }),
  new Product({
    imagePath:"https://humblebundle.imgix.net/misc/files/hashed/e8887bef61c0c2bc8e93173242f43ab86dd5ec20.jpg?auto=format&fit=crop&w=616&h=353&s=027458f8382fbde0b0cab3ae7420da7a",
    title:'MaxPayne 3',
    description:"Third installment of max-payne series",
    price:1500
  }),
  new Product({
    imagePath:"http://speeddemosarchive.com/gfx/IGI2_1.jpg",
    title:'IGI 2',
    description:"Our officer on a new mission to wipe out all the enimies",
    price:700
  }),
  new Product({
    imagePath:"https://images-1.gog.com/6fd0eb85a8af7db131c228bd7dd93707a8c69d3cdcbaee470c3ecdca393f4b51.jpg",
    title:"Saints Row 3",
    description:"Boss is gaining reputation and now he has more challenges because of new enimes morning stars, luchadors and manymore",
    price:2500
  }),
  new Product({
    imagePath:'https://images-na.ssl-images-amazon.com/images/I/81FnlknKjgL._SL1500_.jpg',
    title:"Saints Row 4",
    description:"Alien attack on earth, president Boss is strucked in simulation++++",
    price:3000
  })
];

var done = 0;

for(let i = 0; i < products.length; i++){
  products[i].save(function(err, result){
    done++;
    if(done === products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
