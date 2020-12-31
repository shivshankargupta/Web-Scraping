const request = require("request");
const cheerio = require("cheerio");
const converter = require("json-2-csv");
const fs = require("fs");

let jsonArray = [];

request(
  "https://www.quill.com/hanging-file-folders/cbl/4378.html",
  (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const allProductItems = $(".BrowseItem");
      const productCategory = $("#SearchCount").parent().find(".H1").text();

      allProductItems.each(function (i, product) {
        const productName = $(product).find("#skuName").text().trim();
        const productPrice = $(product).find(".priceupdate").first().text();
        const productCode = $(product).find(".iNumber ").text();
        const productModelNumber = $(product).find(".model-number ").text();
        const productDescriptions = $(product)
          .find(".skuBrowseBullets")
          .text()
          .trim();

        jsonArray.push({
          productName,
          productPrice,
          productCode,
          productModelNumber,
          productDescriptions,
          productCategory,
        });
      });

      console.log(jsonArray);

      converter.json2csv(jsonArray, (err, csv) => {
        if (err) {
          throw err;
        }

        // print CSV string
        console.log(csv);

        fs.writeFileSync("product.csv", csv);
      });
    }
  }
);
