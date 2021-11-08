const socket = io('ws://localhost:30000');

let data = [];

socket.on('message', cards => {
    console.log(cards);
    data = cards;
    renderExistingCards(cards);
});

function clearGroups() {
    const grp1 = document.getElementById('grp1');
    const grp2 = document.getElementById('grp2');
    const grp3 = document.getElementById('grp3');
    grp1.innerHTML = 'Group 1';
    grp2.innerHTML = 'Group 2';
    grp3.innerHTML = 'Group 3';
}

function renderExistingCards(cards) {
    clearGroups();
    cards.forEach(element => {
        const parent = document.getElementById(element.group);
        const el = document.createElement('div');
        el.classList = 'card';
        el.style.cssText = 'width: 18rem;';
        el.innerHTML= createCards(element);
        parent.appendChild(el);
    });
}

function createCards(card) {
    return `<div class="card-body">
        <h5 class="card-title">${card.name}</h5>
        <a href="#" class="btn btn-primary" onClick=move(${card.id})>Move</a>
    </div>`;
}

function move(id) {
    const newData = data.map(element => {
        if (id === element.id) {
            const newElement = {
                id: element.id,
                name: element.name
            };
            if(element.group === 'grp1') newElement.group = 'grp2';
            if(element.group === 'grp2') newElement.group = 'grp3';
            if(element.group === 'grp3') newElement.group = 'grp1';
            return newElement;
        }
        return element;
    });
    socket.emit('message', newData);
}

function newCard() {
    const name = prompt('Enter Card name', 'Default');
    socket.emit('newcard', name);
}