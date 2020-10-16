const electron = require('electron');
const {ipcRenderer} = electron;

document.querySelector('form').addEventListener('submit', event => {
   const {value} = document.querySelector('input');
   ipcRenderer.send('addComment', value);

})