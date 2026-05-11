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
            if(e.target.closest('.window-container')) return;
            e.preventDefault();
            
            const iconEl = e.target.closest('.desktop-icon');
            if (iconEl) {
                const fileId = iconEl.dataset.id;
                const file = this.fs.findNode(this.fs.tree, fileId);
                this.showIconContextMenu(e.clientX, e.clientY, file);
            } else {
                this.showDesktopContextMenu(e.clientX, e.clientY);
            }
        });

        document.addEventListener('click', () => {
            this.contextMenuEl.classList.add('hidden');
        });
    }

    showDesktopContextMenu(x, y) {
        this.contextMenuEl.innerHTML = `
            <div class="py-1">
                <button id="ctx-new-folder" class="w-full text-right px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="folder-plus" class="w-4 h-4 text-yellow-500"></i> پوشه جدید
                </button>
                <div class="h-[1px] bg-gray-200/60 my-1 mx-2"></div>
                <button id="ctx-new-text" class="w-full text-right px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="file-text" class="w-4 h-4 text-blue-500"></i> فایل متنی (.متن)
                </button>
                <button id="ctx-new-paint" class="w-full text-right px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="image" class="w-4 h-4 text-purple-500"></i> فایل نقاشی (.نقش)
                </button>
            </div>
        `;
        
        this.contextMenuEl.style.left = `${x}px`;
        this.contextMenuEl.style.top = `${y}px`;
        this.contextMenuEl.classList.remove('hidden');
        window.lucide.createIcons();

        document.getElementById('ctx-new-folder').onclick = () => { this.fs.createFolder('desktop', 'پوشه جدید'); this.renderIcons(); };
        document.getElementById('ctx-new-text').onclick = () => { this.fs.createFile('desktop', 'سند جدید', 'متن'); this.renderIcons(); };
        document.getElementById('ctx-new-paint').onclick = () => { this.fs.createFile('desktop', 'طرح جدید', 'نقش'); this.renderIcons(); };
    }

    showIconContextMenu(x, y, file) {
        this.contextMenuEl.innerHTML = `
            <div class="py-1">
                <button id="ctx-open" class="w-full text-right px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition font-medium">
                    <i data-lucide="external-link" class="w-4 h-4 text-blue-500"></i> باز کردن
                </button>
                <div class="h-[1px] bg-gray-200/60 my-1 mx-2"></div>
                <button id="ctx-rename" class="w-full text-right px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm transition">
                    <i data-lucide="edit-2" class="w-4 h-4 text-gray-600"></i> تغییر نام
                </button>
                <button id="ctx-delete" class="w-full text-right px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm transition text-red-600 font-medium">
                    <i data-lucide="trash-2" class="w-4 h-4"></i> حذف
                </button>
            </div>
        `;
        
        this.contextMenuEl.style.left = `${x}px`;
        this.contextMenuEl.style.top = `${y}px`;
        this.contextMenuEl.classList.remove('hidden');
        window.lucide.createIcons();

        document.getElementById('ctx-open').onclick = () => this.openFile(file);
        
        document.getElementById('ctx-rename').onclick = () => {
            const newName = prompt('نام جدید را وارد کنید:', file.name);
            if (newName && newName.trim() !== '') {
                this.fs.renameNode(file.id, newName.trim());
                this.renderIcons();
            }
        };

        document.getElementById('ctx-delete').onclick = () => {
            if (confirm(`آیا از حذف "${file.name}" اطمینان دارید؟`)) {
                this.fs.deleteNode(file.id);
                this.renderIcons();
            }
        };
    }

    openFile(file) {
        if(file.type === 'shortcut') {
            this.openAppCallback(file.appId);
        } else if (file.type === 'folder') {
            this.openAppCallback('explorer', file);
        } else if (file.type === 'file') {
            if(file.extension === 'متن') this.openAppCallback('notepad', file);
            if(file.extension === 'نقش') this.openAppCallback('paint', file);
        }
    }

    renderIcons() {
        this.iconsContainer.innerHTML = '';
        const files = this.fs.getDesktopFiles();

        files.forEach(file => {
            const iconEl = document.createElement('div');
            iconEl.className = 'desktop-icon absolute w-24 p-2 flex flex-col items-center gap-1.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 cursor-pointer group active:bg-white/20';
            iconEl.dataset.id = file.id;
            
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
                ' : ''}
                
                ${displayName}</span>
            `;

            this.setupIconDrag(iconEl, file);

            iconEl.addEventListener('dblclick', () => {
                this.openFile(file);
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
                
                const gridSize = 20;
                const newX = Math.round(parseInt(iconEl.style.left) / gridSize) * gridSize;
                const newY = Math.round(parseInt(iconEl.style.top) / gridSize) * gridSize;
                
                iconEl.style.left = `${newX}px`;
                iconEl.style.top = `${newY}px`;
                
                this.fs.updateCoordinates(file.id, newX, newY);
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
