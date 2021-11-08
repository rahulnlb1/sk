const express = require('express');
const path = require('path');
const { isBoxedPrimitive } = require('util/types');

let cards = [{
    id: 1,
    name: 'Card 1',
    group: 'grp1'
},
{
    id: 2,
    name: 'Card 2',
    group: 'grp2'
},
{
    id: 3,
    name: 'Card 3',
    group: 'grp3'
}]


const server = express();

server.use('/home', (req, res) => {
    res.send('Hello world');
});

server.use('/ui', express.static(path.join(__dirname, '/ui/index.html')));
server.use('/app.js', express.static(path.join(__dirname, '/ui/app.js')));

const httpServer = server.listen(30000, () => {
    console.log('Listening to port 30000');
});

const io = require('socket.io')(httpServer);

io.on('connection', client => {
    client.emit('message', cards);
    console.log('A user got connected');
    client.on('message', data => {
        cards = data;
        console.log('Received the data ' + JSON.stringify(data));
        io.emit('message', data);
    });

    client.on('newcard', data => {
        console.log('data ---> ' + JSON.stringify(data));
        const newCard = {
            id: cards.length + 1,
            name: data,
            group: 'grp1'
        };
        cards = [...cards, newCard];
        console.log(JSON.stringify(cards));
        io.emit('message', cards);
    });
});