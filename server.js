const http = require("http");
const fs = require("fs");
const url = require("url");
const card = fs.readFileSync("./card.html") + "";

// const data = require("./data.json");
var count = 0;
var out = "";
var d = fs.readFileSync("./data.json");
// d = "" + d;
d = JSON.parse(d);
var productPageOriginal = fs.readFileSync("./product.html");
productPageOriginal = productPageOriginal + "";
// d.replace(/false/,"");// not to replace here, but the file that we are going to render
// console.log(d);
// productPage = productPage.replace(/Fresh Avacados/g,"Organic Avacados");
// productPage = productPage.replace(/{%PRODUCT NAME%}/g, d[0]["productName"] );
// productPage = productPage.replace(/{%IMAGE%}/g, d[0]["image"]);
// productPage = productPage.replace(/{%FROM%}/g, d[0]["from"]);
// productPage = productPage.replace(/{%QUANTITY%}/g, d[0]["quantity"]);
// productPage = productPage.replace(/{%PRICE%}/g, d[0]["price"]);
// productPage = productPage.replace(/{%NUTRIENTS%}/g, d[0]["nutrients"]);
// productPage = productPage.replace(/{%DESCRIPTION%}/g, d[0]["description"]);
// console.log(d[0]);
function getOverview(){
    var cardString = "";
    for(let i = 0; i < d.length ; i++){ 
        let tempCard = card;
        //can also write  a seprate replace function instead of this(given down below).... 
        tempCard = tempCard.replace(/{%PRODUCT NAME%}/g, d[i]["productName"]);
        tempCard = tempCard.replace(/{%IMAGE%}/g, d[i]["image"]);
        tempCard = tempCard.replace(/{%FROM%}/g, d[i]["from"]);
        tempCard = tempCard.replace(/{%QUANTITY%}/g, d[i]["quantity"]);
        tempCard = tempCard.replace(/{%PRICE%}/g, d[i]["price"]);
        tempCard = tempCard.replace(/{%NUTRIENTS%}/g, d[i]["nutrients"]);
        tempCard = tempCard.replace(/{%DESCRIPTION%}/g, d[i]["description"]);
        tempCard = tempCard.replace(/{%ID%}/g, i);

        if (d[i]["organic"] != false){
            tempCard = tempCard.replace(/{%ORGANIC%}/g, "Organic");

        }else{
            tempCard = tempCard.replace(/{%ORGANIC%}/g, "");

        }
        cardString += tempCard;

    }
    return cardString;
}
const server = http.createServer(function (req, res) {
    console.log("url requested " + req.url);// ye browser me kaha likha hoga?(yaha to cmd me h) aut yr teen lines firse chalti h. work kaise krti h. incrementer increment kyu ni hota

    console.log(count++ + "th visit");
    var WholeUrl = url.parse(req.url, true);
    // console.log(WholeUrl)
    //header
    // res.writeHead(200, { "content-type": "text/html" });

    // body
    // res.write("hi we are serving from node js"); 
    if (req.url == "/" || req.url == "/overview") {
        res.writeHead(200, { "content-type": "text/html" });
        var overviewFile = fs.readFileSync("./overview.html");
        overviewFile += "";
        // res.write('<h1>Hello from HOME</h1>');
        var cardStr = getOverview();
        overviewFile = overviewFile.replace(/{%CARD%}/g, cardStr);
        res.write(overviewFile);
    } else if (req.url == "/api") {
        // var d = toString(data);
        // d += "";

        res.writeHead(200, { "content-type": "application/json" });

        res.write(JSON.stringify(d));
    } else if (WholeUrl["pathname"] == "/product") {
        let id = url.parse(req.url, true).query.id;
        console.log("id" + id)
        let productPage = productPageOriginal;//we made Product page a duplicate as after changeong the % wala  name 
        //itll be replaced and will not get replaced further
        //, therfore to solve this we made a duplicate one
        productPage = productPage.replace(/{%PRODUCT NAME%}/g, d[id]["productName"]);
        productPage = productPage.replace(/{%IMAGE%}/g, d[id]["image"]);
        productPage = productPage.replace(/{%FROM%}/g, d[id]["from"]);
        productPage = productPage.replace(/{%QUANTITY%}/g, d[id]["quantity"]);
        productPage = productPage.replace(/{%PRICE%}/g, d[id]["price"]);
        productPage = productPage.replace(/{%NUTRIENTS%}/g, d[id]["nutrients"]);
        productPage = productPage.replace(/{%DESCRIPTION%}/g, d[id]["description"]);
        if (d[id]["organic"] != false) {
            productPage = productPage.replace(/{%ORGANIC%}/g, "Organic");
            productPage = productPage.replace(/{%ORGANIC_CLASS%}/g, "product__organic");
        } else {
            productPage = productPage.replace(/{%ORGANIC%}/g, "");
            productPage = productPage.replace(/{%ORGANIC_CLASS%}/g, "not-organic");

        }
        // console.log(d[id]);
        res.write(productPage);

    } else {
        // res.write('<h1>WRONG ROUTE</h1>');

        // var parsedUrl = url.parse(req.url, true).query.id;
        // console.log(parsedUrl);
        res.write("Wrong Url");
    }
    //end
    res.end();
});
server.listen(3000);
console.log("server has started at port 3000");
function myFunction(arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' + arr[i].display + '</a><br>';
    }
    document.getElementById("id01").innerHTML = out;

}