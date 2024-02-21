const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();
const port = 3000;
// Endpoint to read data from CSV
app.get('/', (req, res) => {
  const results = [];
  fs.createReadStream('input.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results.length)
        const splitListByCity =results.reduce((acc, obj) => {
            const name = obj.City;
            if (!acc[name]) {
              acc[name] = [];
            }
            acc[name].push(obj);
            return acc;
          }, {});
    let globalPrices=[]
    console.log(splitListByCity)
    for(let City of  Object.keys(splitListByCity)){
        const totalPrice =splitListByCity[City].reduce((total, product) => total + parseFloat(product.Price), 0);
        globalPrices= [...globalPrices,{
            City:City,
            Total:totalPrice
        }]
    }
    sortedGolbalList=globalPrices.sort((a, b) => {
        const totalA = a.Total
        const totalB = b.Total
        if (totalA < totalB) {
          return -1; // a should come before b in the sorted order
        }
        if (totalA > totalB) {
          return 1; // a should come after b in the sorted order
        }
        return 0; // names are equal
      });
    let cheapestCity=sortedGolbalList[0]
    let cheapestCityProduct= splitListByCity[cheapestCity.City]
    // Sort products by price in ascending order
    const sortedProducts = cheapestCityProduct.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
     // Return the first 5 products
    const cheapest5= sortedProducts.slice(0, 5);
     const finalResult={
        City:cheapestCity.City,
        Total:cheapestCity.Total.toFixed(2),
        cheapest5:cheapest5
     }
     res.send(finalResult)
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
