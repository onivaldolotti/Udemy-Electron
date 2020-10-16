const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let commentWindow;
//não desejo a barra de menu
let commentMenu = null;

// Funcionalidades do app
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

//Cria janela principal e suas funcionalidades
function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(`file://${__dirname}/main.html`)
    mainWindow.on('closed', ()=>{
        app.quit()
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
}

//cria nova janela e sua funcionalidades
function createCommentWindow() {
    commentWindow = new BrowserWindow({
        width:500,
        height:300,
        title: 'Novo comentártio',
        webPreferences: {
            nodeIntegration: true
        }
    });

    commentWindow.loadURL(`file://${__dirname}/comment.html`);
    commentWindow.on('closed',()=> commentWindow= null);
    if(process.platform !=='darwin') {
        commentWindow.setMenu(commentMenu);
    }
}

//Define o meu principal
const menuTemplate = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Adicionar comentário',
                click() {
                    createCommentWindow();
                }
            },
            {
                label: 'Sair da Aplicação',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//Define menu de desenvolvedor
if(process.env.NODE_ENV !== 'production') {
    const devTemplate = {
        label: 'Dev',
        submenu: [
            { role: 'reload' },
            {
                label: 'Debug',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    };

    menuTemplate.push(devTemplate);

    if(process.platform !== 'darwin') {
        commentMenu = Menu.buildFromTemplate([devTemplate]);
    }
}

//Eventos por IPC
ipcMain.on('addComment', (event, comment) => {
    mainWindow.webContents.send('addComment', comment);
    commentWindow.close();
});