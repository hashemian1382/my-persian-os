export class NotepadApp {
    constructor() {
        this.title = 'ویرایشگر متن';
        this.icon = 'file-text';
        this.width = '550px';
        this.height = '400px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex flex-col bg-white';
        container.innerHTML = `
            <div class="h-8 bg-gray-100 border-b flex items-center px-2 gap-2 text-sm">
                <button class="hover:bg-gray-200 px-2 py-1 rounded">فایل</button>
                <button class="hover:bg-gray-200 px-2 py-1 rounded">ویرایش</button>
                <button class="hover:bg-gray-200 px-2 py-1 rounded">فرمت</button>
            </div>
            <textarea class="flex-1 w-full p-3 resize-none outline-none border-none" placeholder="متن خود را اینجا بنویسید..."></textarea>
        `;
        return container;
    }
}