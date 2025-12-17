const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

function readJson(file) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}
function writeJson(file, data) {
    fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 4));
}

app.get('/api/products', (req, res) => res.json(readJson('src/database/products.json')));
app.get('/api/products2', (req, res) => res.json(readJson('src/database/products2.json')));
app.get('/api/products3', (req, res) => res.json(readJson('src/database/products3.json')));
app.get('/api/products4', (req, res) => res.json(readJson('src/database/products4.json')));

app.post('/api/save1', (req, res) => { writeJson('src/database/products.json', req.body); res.send({ message: 'Products1 saved successfully!' }); });
app.post('/api/save2', (req, res) => { writeJson('src/database/products2.json', req.body); res.send({ message: 'Products2 saved successfully!' }); });
app.post('/api/save3', (req, res) => { writeJson('src/database/products3.json', req.body); res.send({ message: 'Products3 saved successfully!' }); });
app.post('/api/save4', (req, res) => { writeJson('src/database/products4.json', req.body); res.send({ message: 'Products4 saved successfully!' }); });


app.get('/api/cart', (req, res) => {
    res.json(readJson('src/database/cart.json'));
});
app.post('/api/saveCart', (req, res) => {
    writeJson('src/database/cart.json', req.body);
    res.send({ message: 'Cart saved successfully!' });
});

app.get('/api/orders', (req, res) => {
    res.json(readJson('src/database/order.json'));
});

app.post('/api/saveOrder', (req, res) => {
    writeJson('src/database/order.json', req.body);
    res.send({ message: 'Order saved successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});