export class CalculatorApp {
    constructor() {
        this.title = 'ماشین‌حساب';
        this.icon = 'calculator';
        this.width = '320px';
        this.height = '480px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-[#f3f4f6] p-4 flex flex-col font-vazir';
        container.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-2xl h-24 mb-4 text-left px-4 flex flex-col items-end justify-center shadow-inner">
                <div class="text-gray-400 text-sm h-5 font-mono tracking-wider"></div>
                <div class="text-4xl font-bold text-gray-800 font-mono tracking-wider mt-1">0</div>
            </div>
            <div class="grid grid-cols-4 gap-2 flex-1">
                <button class="bg-red-100 text-red-600 hover:bg-red-200 rounded-xl font-bold text-lg transition active:scale-95">C</button>
                <button class="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl font-bold text-lg transition active:scale-95">()</button>
                <button class="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl font-bold text-lg transition active:scale-95">%</button>
                <button class="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl font-bold text-xl transition active:scale-95">÷</button>
                
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">7</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">8</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">9</button>
                <button class="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl font-bold text-xl transition active:scale-95">×</button>
                
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">4</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">5</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">6</button>
                <button class="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl font-bold text-2xl transition active:scale-95">-</button>
                
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">1</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">2</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">3</button>
                <button class="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-xl font-bold text-2xl transition active:scale-95">+</button>
                
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl col-span-2 transition active:scale-95">0</button>
                <button class="bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 font-bold text-xl transition active:scale-95">.</button>
                <button class="bg-blue-500 text-white hover:bg-blue-600 rounded-xl shadow-md font-bold text-2xl transition active:scale-95">=</button>
            </div>
        `;
        return container;
    }
}