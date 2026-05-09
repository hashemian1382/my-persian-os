export class PaintApp {
    constructor() {
        this.title = 'نقاشی';
        this.icon = 'palette';
        this.width = '600px';
        this.height = '450px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex flex-col bg-white';
        container.innerHTML = `
            <div class="h-10 bg-gray-100 border-b flex items-center px-2 gap-2">
                <div class="w-6 h-6 bg-black rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition"></div>
                <div class="w-6 h-6 bg-red-500 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition"></div>
                <div class="w-6 h-6 bg-blue-500 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition"></div>
                <div class="w-6 h-6 bg-green-500 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition"></div>
                <div class="w-[1px] h-6 bg-gray-300 mx-2"></div>
                <button class="hover:bg-gray-200 p-1 rounded" title="پاک کن"><i data-lucide="eraser" class="w-5 h-5 text-gray-700"></i></button>
                <button class="hover:bg-gray-200 p-1 rounded" title="ذخیره"><i data-lucide="save" class="w-5 h-5 text-gray-700"></i></button>
            </div>
            <canvas class="flex-1 w-full bg-white cursor-crosshair"></canvas>
        `;
        return container;
    }
}