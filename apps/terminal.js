export class TerminalApp {
    constructor() {
        this.title = 'پایانه (ترمینال)';
        this.icon = 'terminal';
        this.width = '600px';
        this.height = '350px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-black text-green-500 font-mono p-2 text-sm flex flex-col';
        
        container.innerHTML = `
            <div class="mb-2">سیستم عامل فارسی - نسخه توسعه</div>
            <div class="flex">
                <span class="mr-2">کاربر@سیستم:~# </span>
                <input type="text" class="flex-1 bg-transparent border-none outline-none text-green-500 font-mono" autofocus>
            </div>
        `;
        
        return container;
    }
}