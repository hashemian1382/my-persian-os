export class WindowManager {
    constructor() {
        this.windows = [];
        this.activeZIndex = 100;
        this.windowArea = document.getElementById('window-area');
        this.taskbarApps = document.getElementById('taskbar-apps');
    }

    createWindow(appConfig) {
        this.activeZIndex++;
        const winId = `win-${Date.now()}`;
        
        const winEl = document.createElement('div');
        winEl.id = winId;
        winEl.className = `window-container absolute bg-white/95 glass rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col border border-white/60 pointer-events-auto overflow-hidden`;
        winEl.style.width = appConfig.width || '600px';
        winEl.style.height = appConfig.height || '450px';
        winEl.style.top = '10%';
        winEl.style.left = '15%';
        winEl.style.zIndex = this.activeZIndex;
        winEl.style.transform = 'scale(0.95)';
        winEl.style.opacity = '0';

        winEl.dataset.isMaximized = 'false';

        winEl.innerHTML = `
            <div class="window-header bg-gray-50/60 backdrop-blur-md h-12 flex items-center justify-between px-4 cursor-move no-select border-b border-gray-200/60">
                <div class="flex items-center gap-3 font-bold text-gray-700">
                    <i data-lucide="${appConfig.icon}" class="w-5 h-5 text-blue-600"></i>
                    <span class="text-[13.5px]">${appConfig.title}</span>
                </div>
                <div class="flex gap-2.5" dir="ltr">
                    <button class="win-close-btn w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 border border-red-500/30 shadow-sm transition active:scale-90"></button>
                    <button class="win-min-btn w-3.5 h-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 border border-yellow-500/30 shadow-sm transition active:scale-90"></button>
                    <button class="win-max-btn w-3.5 h-3.5 rounded-full bg-green-400 hover:bg-green-500 border border-green-500/30 shadow-sm transition active:scale-90"></button>
                </div>
            </div>
            <div class="window-body flex-1 bg-white/80 relative overflow-hidden flex flex-col">
            </div>
            <div class="resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"></div>
        `;

        this.windowArea.appendChild(winEl);
        
        requestAnimationFrame(() => {
            winEl.style.transform = 'scale(1)';
            winEl.style.opacity = '1';
        });

        if (appConfig.render) {
            const body = winEl.querySelector('.window-body');
            body.appendChild(appConfig.render());
        }

        this.createTaskbarItem(winId, appConfig);
        this.setupWindowEvents(winEl, winId);
        this.setupResizeEvents(winEl);
        
        if (window.lucide) window.lucide.createIcons();
        
        this.windows.push({ id: winId, element: winEl });
        return winId;
    }

    createTaskbarItem(winId, appConfig) {
        const item = document.createElement('button');
        item.id = `taskbar-${winId}`;
        item.className = 'w-12 h-12 rounded-xl hover:bg-white/20 bg-white/10 flex items-center justify-center transition shadow-sm border border-white/10 relative group active:scale-95';
        item.title = appConfig.title;
        item.innerHTML = `
            <i data-lucide="${appConfig.icon}" class="w-6 h-6 group-hover:-translate-y-1 drop-shadow-md transition duration-200"></i>
            <div class="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
        `;
        
        item.addEventListener('click', () => {
            const winEl = document.getElementById(winId);
            if (winEl.style.display === 'none') {
                winEl.style.display = 'flex';
                this.focusWindow(winEl);
            } else {
                if (winEl.style.zIndex == this.activeZIndex) {
                    winEl.style.display = 'none';
                } else {
                    this.focusWindow(winEl);
                }
            }
        });

        this.taskbarApps.appendChild(item);
    }

    focusWindow(winEl) {
        this.activeZIndex++;
        winEl.style.zIndex = this.activeZIndex;
    }

    setupWindowEvents(winEl, winId) {
        const header = winEl.querySelector('.window-header');
        const closeBtn = winEl.querySelector('.win-close-btn');
        const minBtn = winEl.querySelector('.win-min-btn');
        const maxBtn = winEl.querySelector('.win-max-btn');

        winEl.addEventListener('mousedown', () => this.focusWindow(winEl));

        closeBtn.addEventListener('click', () => {
            winEl.style.transform = 'scale(0.95)';
            winEl.style.opacity = '0';
            setTimeout(() => {
                winEl.remove();
                document.getElementById(`taskbar-${winId}`).remove();
                this.windows = this.windows.filter(w => w.id !== winId);
            }, 200);
        });

        minBtn.addEventListener('click', () => {
            winEl.style.display = 'none';
        });

        maxBtn.addEventListener('click', () => {
            if (winEl.dataset.isMaximized === 'true') {
                winEl.classList.remove('maximized', 'rounded-none', 'border-none');
                winEl.style.width = winEl.dataset.prevWidth;
                winEl.style.height = winEl.dataset.prevHeight;
                winEl.style.top = winEl.dataset.prevTop;
                winEl.style.left = winEl.dataset.prevLeft;
                winEl.dataset.isMaximized = 'false';
            } else {
                winEl.dataset.prevWidth = winEl.style.width;
                winEl.dataset.prevHeight = winEl.style.height;
                winEl.dataset.prevTop = winEl.style.top;
                winEl.dataset.prevLeft = winEl.style.left;
                
                winEl.classList.add('maximized', 'rounded-none', 'border-none');
                winEl.style.width = '100%';
                winEl.style.height = '100%';
                winEl.style.top = '0';
                winEl.style.left = '0';
                winEl.dataset.isMaximized = 'true';
            }
        });

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            if (winEl.dataset.isMaximized === 'true') return;
            isDragging = true;
            winEl.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = winEl.offsetLeft;
            initialTop = winEl.offsetTop;
            document.body.classList.add('no-select');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            winEl.style.left = `${initialLeft + dx}px`;
            winEl.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                winEl.classList.remove('dragging');
                document.body.classList.remove('no-select');
            }
        });
    }

    setupResizeEvents(winEl) {
        const resizeHandle = winEl.querySelector('.resize-handle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft;

        resizeHandle.addEventListener('mousedown', (e) => {
            if (winEl.dataset.isMaximized === 'true') return;
            e.stopPropagation();
            isResizing = true;
            winEl.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(winEl).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(winEl).height, 10);
            startLeft = winEl.offsetLeft;
            document.body.classList.add('no-select');
            document.body.style.cursor = 'sw-resize';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            winEl.style.width = `${Math.max(300, startWidth - dx)}px`;
            winEl.style.left = `${startLeft + dx}px`;
            winEl.style.height = `${Math.max(250, startHeight + dy)}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                winEl.classList.remove('dragging');
                document.body.classList.remove('no-select');
                document.body.style.cursor = 'default';
            }
        });
    }
}