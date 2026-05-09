export class XoApp {
    constructor() {
        this.title = 'بازی دوز (XO)';
        this.icon = 'gamepad-2';
        this.width = '300px';
        this.height = '380px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-white flex flex-col items-center justify-center p-4';
        container.innerHTML = `
            <div class="mb-4 text-lg font-bold">نوبت: <span class="text-blue-600">X</span></div>
            <div class="grid grid-cols-3 gap-2 w-full max-w-[200px] aspect-square">
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
                <button class="bg-gray-100 hover:bg-gray-200 text-4xl font-bold rounded flex items-center justify-center"></button>
            </div>
            <button class="mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">شروع مجدد</button>
        `;
        return container;
    }
}