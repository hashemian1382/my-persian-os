export class TerminalApp {
    constructor(osInstance) {
        this.os = osInstance;
        this.title = 'پایانه (ترمینال)';
        this.icon = 'terminal';
        this.width = '650px';
        this.height = '400px';
        this.currentFolderId = 'desktop';
        this.history = [];
        this.historyIndex = -1;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-vazir p-3 text-[13px] flex flex-col overflow-hidden';
        
        container.innerHTML = `
            <div id="term-output" class="flex-1 overflow-y-auto flex flex-col gap-1 pb-2 scroll-smooth">
                <div class="text-green-400 mb-2">سیستم عامل وب فارسی - نسخه توسعه<br>برای راهنمایی دستور «کمک» را وارد کنید.</div>
            </div>
            <div class="flex items-center gap-2 mt-1 shrink-0">
                <span id="term-prompt" class="text-blue-400 font-bold whitespace-nowrap"></span>
                <input type="text" id="term-input" class="flex-1 bg-transparent border-none outline-none text-[#d4d4d4] font-vazir" autocomplete="off" spellcheck="false" autofocus>
            </div>
        `;

        this.outputArea = container.querySelector('#term-output');
        this.inputEl = container.querySelector('#term-input');
        this.promptEl = container.querySelector('#term-prompt');

        this.updatePrompt();

        container.addEventListener('click', () => this.inputEl.focus());

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.inputEl.value.trim();
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.printLine(`<span class="text-blue-400 font-bold">${this.promptEl.innerText} ${cmd}`);
                    this.executeCommand(cmd);
                }
                this.inputEl.value = '';
                this.scrollToBottom();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputEl.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputEl.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputEl.value = '';
                }
            }
        });

        return container;
    }

    updatePrompt() {
        const path = this.os.fs.getPathString(this.currentFolderId);
        this.promptEl.innerText = `${path}>`;
    }

    printLine(htmlContent) {
        const line = document.createElement('div');
        line.innerHTML = htmlContent;
        this.outputArea.appendChild(line);
    }

    scrollToBottom() {
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }

    executeCommand(commandString) {
        const parts = commandString.split(' ').filter(p => p !== '');
        const cmd = parts[0];
        const args = parts.slice(1).join(' ');

        switch (cmd) {
            case 'کمک':
                this.printLine('دستورات موجود:');
                this.printLine('لیست : نمایش محتویات پوشه فعلی');
                this.printLine('برو [نام‌پوشه] : ورود به پوشه (اگر نباشد ساخته می‌شود). برای برگشت: برو ..');
                this.printLine('ایجاد [نام.فرمت] : ساخت فایل جدید (فرمت‌های مجاز: متن، نقش)');
                this.printLine('حذف [نام] : حذف فایل یا پوشه');
                this.printLine('اجرا [نام.فرمت] : باز کردن فایل یا برنامه');
                this.printLine('پاک : پاک کردن صفحه نمایش');
                break;

            case 'پاک':
                this.outputArea.innerHTML = '';
                break;

            case 'لیست':
                const folder = this.os.fs.findNode(this.os.fs.tree, this.currentFolderId);
                if (folder.children.length === 0) {
                    this.printLine('این پوشه خالی است.');
                } else {
                    folder.children.forEach(child => {
                        if (child.type === 'folder') {
                            this.printLine(` ${child.name}</span>`);
                        } else if (child.type === 'shortcut') {
                            this.printLine(`<i data-lucide="box" class="inline w-3 h-3 mr-1 text-gray-400"></i> <span class="text-gray-300">${child.name} [برنامه]`);
                        } else {
                            this.printLine(` ${child.name}.${child.extension}`);
                        }
                    });
                    if (window.lucide) window.lucide.createIcons();
                }
                break;

            case 'برو':
                if (!args) {
                    this.printLine('خطا: نام پوشه وارد نشده است.');
                    break;
                }
                if (args === '..') {
                    const parent = this.os.fs.findParent(this.os.fs.tree, this.currentFolderId);
                    if (parent) {
                        this.currentFolderId = parent.id;
                        this.updatePrompt();
                    } else {
                        this.printLine('خطا: شما در ریشه هستید.');
                    }
                } else {
                    let target = this.os.fs.getChildByName(this.currentFolderId, args);
                    if (target) {
                        if (target.type === 'folder') {
                            this.currentFolderId = target.id;
                            this.updatePrompt();
                        } else {
                            this.printLine(`خطا: '${args}' یک پوشه نیست.</span>`);
                        }
                    } else {
                        this.printLine(`<span class="text-yellow-300">پوشه '${args}' وجود نداشت. در حال ایجاد...`);
                        const newFolder = this.os.fs.createFolder(this.currentFolderId, args);
                        this.currentFolderId = newFolder.id;
                        this.updatePrompt();
                        this.refreshDesktopIfNeeded();
                    }
                }
                break;

            case 'ایجاد':
                if (!args || !args.includes('.')) {
                    this.printLine('خطا: فرمت فایل وارد نشده است (مثال: فایل.متن).');
                    break;
                }
                const splitArgs = args.split('.');
                const ext = splitArgs.pop();
                const name = splitArgs.join('.');
                
                if (ext !== 'متن' && ext !== 'نقش') {
                    this.printLine('خطا: فرمت نامعتبر است. فقط .متن و .نقش مجاز است.');
                    break;
                }
                
                if (this.os.fs.getChildByName(this.currentFolderId, args)) {
                    this.printLine('خطا: فایلی با این نام از قبل وجود دارد.');
                    break;
                }

                this.os.fs.createFile(this.currentFolderId, name, ext);
                this.printLine(`فایل '${args}' با موفقیت ایجاد شد.</span>`);
                this.refreshDesktopIfNeeded();
                break;

            case 'حذف':
                if (!args) {
                    this.printLine('<span class="text-red-400">خطا: نام فایل یا پوشه وارد نشده است.</span>');
                    break;
                }
                const toDelete = this.os.fs.getChildByName(this.currentFolderId, args);
                if (toDelete) {
                    this.os.fs.deleteNode(toDelete.id);
                    this.printLine(`<span class="text-green-400">آیتم '${args}' با موفقیت حذف شد.`);
                    this.refreshDesktopIfNeeded();
                } else {
                    this.printLine(`خطا: '${args}' پیدا نشد.</span>`);
                }
                break;

            case 'اجرا':
                if (!args) {
                    this.printLine('<span class="text-red-400">خطا: نام برنامه یا فایل وارد نشده است.</span>');
                    break;
                }
                const toRun = this.os.fs.getChildByName(this.currentFolderId, args);
                if (toRun) {
                    if (toRun.type === 'shortcut') {
                        this.os.openApp(toRun.appId);
                        this.printLine(`<span class="text-green-400">برنامه اجرا شد.</span>`);
                    } else if (toRun.type === 'file') {
                        if (toRun.extension === 'متن') this.os.openApp('notepad', toRun);
                        if (toRun.extension === 'نقش') this.os.openApp('paint', toRun);
                        this.printLine(`<span class="text-green-400">فایل در ویرایشگر باز شد.</span>`);
                    } else {
                        this.printLine(`<span class="text-red-400">خطا: پوشه‌ها قابل اجرا نیستند. از دستور 'برو' استفاده کنید.</span>`);
                    }
                } else {
                    this.printLine(`<span class="text-red-400">خطا: '${args}' پیدا نشد.`);
                }
                break;

            default:
                this.printLine(`خطا: دستور '${cmd}' شناخته نشد. برای راهنمایی 'کمک' را وارد کنید.</span>`);
        }
    }

    refreshDesktopIfNeeded() {
        if (this.currentFolderId === 'desktop') {
            this.os.desktop.renderIcons();
        }
    }
}
