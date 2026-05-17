export class NotepadApp {
    constructor() {
        this.title = 'ویرایشگر متن';
        this.icon = 'file-text';
        this.width = '600px';
        this.height = '450px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex flex-col bg-white font-vazir';
        container.innerHTML = `
            <div class="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-2 gap-1 text-sm font-medium">
                <button class="hover:bg-gray-200 px-3 py-1.5 rounded transition flex items-center gap-2 text-gray-700">
                    <i data-lucide="save" class="w-4 h-4 text-blue-600"></i> ذخیره
                </button>
                <div class="w-[1px] h-5 bg-gray-300 mx-1"></div>
                <button class="hover:bg-gray-200 px-3 py-1.5 rounded transition text-gray-700">ویرایش</button>
                <button class="hover:bg-gray-200 px-3 py-1.5 rounded transition text-gray-700">فرمت</button>
                <button class="hover:bg-gray-200 px-3 py-1.5 rounded transition text-gray-700">نمایش</button>
            </div>
            <textarea class="flex-1 w-full p-4 resize-none outline-none border-none text-gray-800 leading-relaxed" placeholder="متن خود را اینجا بنویسید..."></textarea>
            <div class="h-6 bg-gray-100 border-t border-gray-200 flex items-center px-3 text-[11px] text-gray-500 justify-between">
                <span>رمزگذاری: UTF-8</span>
                <span>۱۰۰ کلمه</span>
            </div>
        `;
        return container;
    }
}