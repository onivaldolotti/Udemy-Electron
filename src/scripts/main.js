const electron = require('electron');
const {ipcRenderer} = electron;

ipcRenderer.on('addComment', (event, comment) => {
    const p= document.createElement('p');
    const text = document.createTextNode(comment);

    p.appendChild(text);
    document.querySelector('div').appendChild(p);
})