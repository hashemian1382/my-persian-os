export class CalculatorApp {
    constructor() {
        this.title = 'ماشین‌حساب';
        this.icon = 'calculator';
        this.width = '300px';
        this.height = '400px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-gray-100 p-2 flex flex-col';
        container.innerHTML = `
            <div class="bg-white border rounded h-16 mb-2 text-left px-2 flex items-center justify-end text-2xl font-mono">0</div>
            <div class="grid grid-cols-4 gap-1 flex-1">
                <button class="bg-gray-200 hover:bg-gray-300 rounded">C</button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded">/</button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded">*</button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded">-</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">7</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">8</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">9</button>
                <button class="bg-gray-200 hover:bg-gray-300 rounded row-span-2">+</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">4</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">5</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">6</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">1</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">2</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">3</button>
                <button class="bg-blue-500 text-white hover:bg-blue-600 rounded row-span-2 shadow-sm">=</button>
                <button class="bg-white hover:bg-gray-100 rounded col-span-2 shadow-sm">0</button>
                <button class="bg-white hover:bg-gray-100 rounded shadow-sm">.</button>
            </div>
        `;
        return container;
    }
}