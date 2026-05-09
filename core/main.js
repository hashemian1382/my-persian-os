import { FileSystem } from './filesystem.js';
import { WindowManager } from './windowManager.js';
import { Desktop } from './desktop.js';

import { TerminalApp } from '../apps/terminal.js';
import { NotepadApp } from '../apps/notepad.js';
import { PaintApp } from '../apps/paint.js';
import { CalculatorApp } from '../apps/calculator.js';
import { SettingsApp } from '../apps/settings.js';
import { XoApp } from '../apps/xo.js';

class OS {
    constructor() {
        this.fs = new FileSystem();
        this.wm = new WindowManager();
        this.desktop = new Desktop(this.fs, this.wm, this.openApp.bind(this));
        
        this.appRegistry = {
            'terminal': TerminalApp,
            'notepad': NotepadApp,
            'paint': PaintApp,
            'calculator': CalculatorApp,
            'settings': SettingsApp,
            'xo': XoApp
        };
        
        this.initTaskbar();
        this.setupStartMenu();
    }

    openApp(appId, fileData = null) {
        const AppClass = this.appRegistry[appId];
        if (AppClass) {
            const appInstance = new AppClass();
            if (fileData && appInstance.loadFile) {
                appInstance.loadFile(fileData);
            }
            this.wm.createWindow({
                title: fileData ? `${appInstance.title} - ${fileData.name}` : appInstance.title,
                icon: appInstance.icon,
                width: appInstance.width,
                height: appInstance.height,
                render: () => appInstance.render()
            });
        }
    }

    initTaskbar() {
        const clockEl = document.getElementById('taskbar-clock');
        const updateClock = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
            const date = now.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
            
            clockEl.innerHTML = `
                <span class="font-bold text-[14px] leading-tight">${time}</span>
                <span class="text-[10px] text-gray-300 opacity-90">${date}</span>
            `;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    setupStartMenu() {
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', () => {
            this.openApp('settings');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.systemOS = new OS();
});