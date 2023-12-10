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
    { id: 1, nimi: "1kasutaja", tootajatekood: 12345, aeg: '2023-03-17 09:23:45' },
    { id: 2, nimi: "2kasutaja", tootajatekood: 12122, aeg: '2023-05-22 14:36:21' },
    {id: 3, nimi: "3kasutaja", tootajatekood: 11221, aeg: '2023-08-01 18:45:12'},
    { id: 4, nimi: "Alice", tootajatekood: 67890, aeg: "2023-04-10 07:30:00" },
    { id: 5, nimi: "Bob", tootajatekood: 54321, aeg: "2023-09-05 22:11:55" },
    { id: 6, nimi: "Charlie", tootajatekood: 98765, aeg: "2023-01-28 11:05:33" },
    { id: 7, nimi: "Alice", tootajatekood: 12345, aeg: "2023-06-14 15:20:48" },
    { id: 8, nimi: "Eve", tootajatekood: 67890, aeg: "2023-02-19 05:40:26" },
    { id: 9, nimi: "Bob", tootajatekood: 54321, aeg: "2023-11-03 20:16:09" },
    { id: 10, nimi: "Mallory", tootajatekood: 98765, aeg: "2023-07-08 13:55:30" },
    { id: 11, nimi: "Alice", tootajatekood: 12345, aeg: "2023-10-12 08:02:17" },
    { id: 12, nimi: "Charlie", tootajatekood: 67890, aeg: "2023-12-01 23:45:00" },
    { id: 13, nimi: "Eve", tootajatekood: 54321, aeg: "2023-04-05 03:18:57" }
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
    if (!req.body.nimi || !req.body.tootajatekood || !req.body.aeg) {
        return res.status(400).send({ error: 'One or all params are missing' });
    }
    let user = {
        id: kasutajad.length + 1,
        nimi: req.body.nimi,
        tootajatekood: req.body.tootajatekood,
        aeg: req.body.aeg,
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
