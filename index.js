const express = require('express');
const cors = require('cors');  // Подключение библиотеки cors
const app = express();
const port = 8080;
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

// Использование cors как middleware
app.use(cors());

app.use(express.json());

const kasutajad = [
    { id: 1, nimi: "1kasutaja", tootajatekood: 12345, aeg: '12:45' },
    { id: 2, nimi: "2kasutaja", tootajatekood: 12122, aeg: '11:27' }
];

app.get('/kasutajad', (req, res) => {
    res.send(kasutajad);
});

app.get('/kasutajad/:id', (req, res) => {
    if (typeof kasutajad[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "User not found" });
    }
    res.send(kasutajad[req.params.id - 1]);
});

app.post('/kasutajad', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' });
    }
    let user = {
        id: kasutajad.length + 1,
        price: req.body.price,
        name: req.body.name
    };
    kasutajad.push(user);

    res.status(201)
        .location(`${getBaseUrl(req)}/kasutajad/${kasutajad.length}`)
        .send(user);
});

app.delete('/kasutajad/:id', (req, res) => {
    if (typeof kasutajad[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "User not found" });
    }

    kasutajad.splice(req.params.id - 1, 1);

    res.status(204).send({ error: "No content" });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`;
}
