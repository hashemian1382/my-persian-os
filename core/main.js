import { FileSystem } from './filesystem.js';
import { WindowManager } from './windowManager.js';
import { Desktop } from './desktop.js';

import { TerminalApp } from '../apps/terminal.js';
import { NotepadApp } from '../apps/notepad.js';
import { PaintApp } from '../apps/paint.js';
import { CalculatorApp } from '../apps/calculator.js';
import { SettingsApp } from '../apps/settings.js';
import { XoApp } from '../apps/xo.js';
import { ExplorerApp } from '../apps/explorer.js';

class OS {
    constructor() {
        this.fs = new FileSystem();
        this.wm = new WindowManager();
        this.desktop = new Desktop(this.fs, this.wm, this.openApp.bind(this));
        
        this.appRegistry = {
            'terminal': TerminalApp,
            'explorer': ExplorerApp,
            'notepad': NotepadApp,
            'paint': PaintApp,
            'calculator': CalculatorApp,
            'xo': XoApp,
            'settings': SettingsApp
        };
        
        this.initTaskbar();
        this.setupStartMenu();
    }

    openApp(appId, fileData = null) {
        const AppClass = this.appRegistry[appId];
        if (AppClass) {
            const appInstance = new AppClass(this);
            if (appInstance.loadFile && fileData) {
                appInstance.loadFile(fileData);
            }
            this.wm.createWindow({
                title: fileData && appId !== 'explorer' ? `${appInstance.title} - ${fileData.name}` : (fileData ? fileData.name : appInstance.title),
                icon: fileData && appId === 'explorer' ? 'folder-open' : appInstance.icon,
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
            const date = now.toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
            
            clockEl.innerHTML = `
                <span class="font-bold text-[15px] tracking-wide drop-shadow-md leading-tight">${time}</span>
                <span class="text-[11px] text-gray-300 opacity-90 mt-0.5">${date}</span>
            `;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    setupStartMenu() {
        const startBtn = document.getElementById('start-btn');
        const startMenu = document.getElementById('start-menu');
        const appsContainer = document.getElementById('start-menu-apps');

        appsContainer.innerHTML = '';
        Object.keys(this.appRegistry).forEach(appId => {
            const appInstance = new this.appRegistry[appId](this);
            const btn = document.createElement('button');
            btn.className = 'flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-blue-50/80 transition group active:scale-95 border border-transparent hover:border-blue-100';
            btn.innerHTML = `
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1 transition duration-200">
                    <i data-lucide="${appInstance.icon}" class="w-6 h-6"></i>
                </div>
                <span class="text-[11px] font-bold text-gray-700 truncate w-full text-center mt-1">${appInstance.title.split(' ')[0]}</span>
            `;
            btn.onclick = () => {
                this.openApp(appId);
                this.toggleStartMenu(false);
            };
            appsContainer.appendChild(btn);
        });

        if (window.lucide) window.lucide.createIcons();

        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                this.toggleStartMenu(false);
            }
        });
    }

    toggleStartMenu(forceState) {
        const menu = document.getElementById('start-menu');
        const isHidden = menu.classList.contains('opacity-0');
        const show = forceState !== undefined ? forceState : isHidden;
        
        if (show) {
            menu.classList.remove('hidden');
            requestAnimationFrame(() => {
                menu.classList.remove('translate-y-10', 'opacity-0');
                menu.classList.add('translate-y-0', 'opacity-100');
            });
        } else {
            menu.classList.remove('translate-y-0', 'opacity-100');
            menu.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => menu.classList.add('hidden'), 300);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.systemOS = new OS();
});