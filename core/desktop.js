export class Desktop {
    constructor(fileSystem, windowManager, openAppCallback) {
        this.fs = fileSystem;
        this.wm = windowManager;
        this.openAppCallback = openAppCallback;
        this.desktopEl = document.getElementById('desktop');
        this.iconsContainer = document.getElementById('desktop-icons');
        this.contextMenuEl = document.getElementById('context-menu');
        this.init();
    }

    init() {
        this.setupContextMenu();
        this.renderIcons();
    }

    setupContextMenu() {
        this.desktopEl.addEventListener('contextmenu', (e) => {
            if(e.target.closest('.window-container') || e.target.closest('.desktop-icon')) return;
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        document.addEventListener('click', () => {
            this.contextMenuEl.classList.add('hidden');
        });
    }

    showContextMenu(x, y) {
        this.contextMenuEl.innerHTML = `
            <div class="py-1">
                <button id="ctx-new-folder" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="folder-plus" class="w-4 h-4 text-yellow-500"></i> پوشه جدید
                </button>
                <div class="h-[1px] bg-gray-200/50 my-1 mx-2"></div>
                <button id="ctx-new-text" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-500"></i> فایل متنی (.متن)
                </button>
                <button id="ctx-new-paint" class="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="image" class="w-4 h-4 text-purple-500"></i> فایل نقاشی (.نقش)
                </button>
            </div>
        `;
        
        this.contextMenuEl.style.left = `${x}px`;
        this.contextMenuEl.style.top = `${y}px`;
        this.contextMenuEl.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();

        document.getElementById('ctx-new-folder').onclick = () => {
            this.fs.createFolder('desktop', 'پوشه جدید');
            this.renderIcons();
        };
        document.getElementById('ctx-new-text').onclick = () => {
            this.fs.createFile('desktop', 'سند جدید', 'متن');
            this.renderIcons();
        };
        document.getElementById('ctx-new-paint').onclick = () => {
            this.fs.createFile('desktop', 'طرح جدید', 'نقش');
            this.renderIcons();
        };
    }

    renderIcons() {
        this.iconsContainer.innerHTML = '';
        const files = this.fs.getDesktopFiles();

        files.forEach(file => {
            const iconEl = document.createElement('div');
            iconEl.className = 'desktop-icon absolute w-20 p-2 flex flex-col items-center gap-1 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 cursor-pointer group';
            
            iconEl.style.left = `${file.x || 0}px`;
            iconEl.style.top = `${file.y || 0}px`;

            let bgIcon = 'bg-blue-500';
            let iconColor = 'text-white';
            
            if(file.type === 'folder') bgIcon = 'bg-yellow-400';
            else if(file.extension === 'متن') bgIcon = 'bg-blue-500';
            else if(file.extension === 'نقش') bgIcon = 'bg-purple-500';
            else if(file.type === 'shortcut') bgIcon = 'bg-gray-800/80 glass';

            const displayName = file.type === 'file' ? `${file.name}.${file.extension}` : file.name;

            iconEl.innerHTML = `
                <div class="w-12 h-12 rounded-2xl ${bgIcon} shadow-lg flex items-center justify-center group-hover:scale-105 transition duration-200 border border-white/20">
                    <i data-lucide="${file.icon}" class="w-6 h-6 ${iconColor}"></i>
                </div>
                <span class="text-white text-[11px] text-center drop-shadow-md font-medium truncate w-full px-1" dir="ltr" style="text-align: center;">${displayName}</span>
            `;

            this.setupIconDrag(iconEl, file);

            iconEl.addEventListener('dblclick', () => {
                if(file.type === 'shortcut') {
                    this.openAppCallback(file.appId);
                } else if (file.type === 'file') {
                    if(file.extension === 'متن') this.openAppCallback('notepad', file);
                    if(file.extension === 'نقش') this.openAppCallback('paint', file);
                }
            });

            this.iconsContainer.appendChild(iconEl);
        });

        if (window.lucide) window.lucide.createIcons();
    }

    setupIconDrag(iconEl, file) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            iconEl.style.left = `${initialLeft + dx}px`;
            iconEl.style.top = `${initialTop + dy}px`;
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                iconEl.classList.remove('dragging');
                document.body.classList.remove('no-select');
                file.x = parseInt(iconEl.style.left);
                file.y = parseInt(iconEl.style.top);
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        iconEl.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            iconEl.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(iconEl.style.left || 0);
            initialTop = parseInt(iconEl.style.top || 0);
            document.body.classList.add('no-select');
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}