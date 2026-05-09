export class ExplorerApp {
    constructor() {
        this.title = 'کاوشگر فایل';
        this.icon = 'folder';
        this.width = '700px';
        this.height = '500px';
        this.currentFolder = null;
        this.history = [];
        this.container = null;
        this.contentArea = null;
        this.pathDisplay = null;
    }

    loadFile(folderData) {
        this.currentFolder = folderData;
    }

    render() {
        if (!this.currentFolder) {
            this.currentFolder = window.systemOS.fs.findNode(window.systemOS.fs.tree, 'desktop');
        }

        this.container = document.createElement('div');
        this.container.className = 'w-full h-full flex flex-col bg-white text-gray-800';
        
        this.container.innerHTML = `
            <div class="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-3 no-select">
                <button id="btn-back" class="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50 transition">
                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
                <div class="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm flex items-center gap-2 shadow-inner">
                    <i data-lucide="folder" class="w-4 h-4 text-yellow-500"></i>
                    <span id="path-display" class="truncate font-medium"></span>
                </div>
            </div>
            <div id="explorer-content" class="flex-1 overflow-y-auto p-4 flex flex-wrap content-start gap-4 bg-white relative">
            </div>
        `;

        this.contentArea = this.container.querySelector('#explorer-content');
        this.pathDisplay = this.container.querySelector('#path-display');
        const backBtn = this.container.querySelector('#btn-back');

        backBtn.addEventListener('click', () => {
            if (this.history.length > 0) {
                const prevFolderId = this.history.pop();
                this.currentFolder = window.systemOS.fs.findNode(window.systemOS.fs.tree, prevFolderId);
                this.renderContent();
            }
        });

        this.setupContextMenu();
        this.renderContent();

        return this.container;
    }

    renderContent() {
        this.contentArea.innerHTML = '';
        this.pathDisplay.textContent = this.currentFolder.name;
        
        const backBtn = this.container.querySelector('#btn-back');
        backBtn.disabled = this.history.length === 0;

        const files = this.currentFolder.children || [];

        if (files.length === 0) {
            this.contentArea.innerHTML = `
                <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 select-none">
                    <i data-lucide="folder-open" class="w-16 h-16 mb-2 opacity-50"></i>
                    <p>این پوشه خالی است</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        files.forEach(file => {
            const iconEl = document.createElement('div');
            iconEl.className = 'explorer-icon w-24 p-2 flex flex-col items-center gap-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-pointer group transition';
            
            let bgIcon = 'bg-blue-100';
            let iconColor = 'text-blue-600';
            
            if(file.type === 'folder') { bgIcon = 'bg-yellow-100'; iconColor = 'text-yellow-600'; }
            else if(file.extension === 'متن') { bgIcon = 'bg-blue-100'; iconColor = 'text-blue-600'; }
            else if(file.extension === 'نقش') { bgIcon = 'bg-purple-100'; iconColor = 'text-purple-600'; }
            else if(file.type === 'shortcut') { bgIcon = 'bg-gray-200'; iconColor = 'text-gray-700'; }

            const displayName = file.type === 'file' ? `${file.name}.${file.extension}` : file.name;

            iconEl.innerHTML = `
                <div class="w-14 h-14 rounded-xl ${bgIcon} flex items-center justify-center group-hover:scale-105 transition duration-200">
                    <i data-lucide="${file.icon}" class="w-8 h-8 ${iconColor}"></i>
                </div>
                <span class="text-gray-700 text-xs text-center font-medium truncate w-full px-1" dir="ltr" style="text-align: center;">${displayName}</span>
            `;

            iconEl.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if(file.type === 'folder') {
                    this.history.push(this.currentFolder.id);
                    this.currentFolder = file;
                    this.renderContent();
                } else {
                    window.systemOS.openApp(file.type === 'shortcut' ? file.appId : (file.extension === 'متن' ? 'notepad' : 'paint'), file);
                }
            });

            iconEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showItemContextMenu(e.clientX, e.clientY, file);
            });

            this.contentArea.appendChild(iconEl);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    setupContextMenu() {
        this.contentArea.addEventListener('contextmenu', (e) => {
            if(e.target.closest('.explorer-icon')) return;
            e.preventDefault();
            this.showBgContextMenu(e.clientX, e.clientY);
        });
    }

    showBgContextMenu(x, y) {
        const contextMenuEl = document.getElementById('context-menu');
        contextMenuEl.innerHTML = `
            <div class="py-1">
                <button id="exp-new-folder" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="folder-plus" class="w-4 h-4 text-yellow-500"></i> پوشه جدید
                </button>
                <div class="h-[1px] bg-gray-200/50 my-1 mx-2"></div>
                <button id="exp-new-text" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-500"></i> فایل متنی (.متن)
                </button>
                <button id="exp-new-paint" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="image" class="w-4 h-4 text-purple-500"></i> فایل نقاشی (.نقش)
                </button>
            </div>
        `;
        
        contextMenuEl.style.left = `${x}px`;
        contextMenuEl.style.top = `${y}px`;
        contextMenuEl.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();

        document.getElementById('exp-new-folder').onclick = () => { window.systemOS.fs.createFolder(this.currentFolder.id, 'پوشه جدید'); this.renderContent(); };
        document.getElementById('exp-new-text').onclick = () => { window.systemOS.fs.createFile(this.currentFolder.id, 'سند جدید', 'متن'); this.renderContent(); };
        document.getElementById('exp-new-paint').onclick = () => { window.systemOS.fs.createFile(this.currentFolder.id, 'طرح جدید', 'نقش'); this.renderContent(); };
    }

    showItemContextMenu(x, y, file) {
        const contextMenuEl = document.getElementById('context-menu');
        contextMenuEl.innerHTML = `
            <div class="py-1">
                <button id="exp-rename" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="edit-2" class="w-4 h-4 text-gray-600"></i> تغییر نام
                </button>
                <button id="exp-delete" class="w-full text-right px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-sm transition text-red-600">
                    <i data-lucide="trash-2" class="w-4 h-4"></i> حذف
                </button>
            </div>
        `;
        
        contextMenuEl.style.left = `${x}px`;
        contextMenuEl.style.top = `${y}px`;
        contextMenuEl.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
        
        document.getElementById('exp-rename').onclick = () => {
            const newName = prompt('نام جدید:', file.name);
            if (newName && newName.trim() !== '') {
                window.systemOS.fs.renameNode(file.id, newName.trim());
                this.renderContent();
                if(this.currentFolder.id === 'desktop') window.systemOS.desktop.renderIcons();
            }
        };

        document.getElementById('exp-delete').onclick = () => {
            if (confirm(`آیا از حذف مطمئن هستید؟`)) {
                window.systemOS.fs.deleteNode(file.id);
                this.renderContent();
                if(this.currentFolder.id === 'desktop') window.systemOS.desktop.renderIcons();
            }
        };
    }
}