export class PaintApp {
    constructor() {
        this.title = 'نقاشی';
        this.icon = 'palette';
        this.width = '650px';
        this.height = '500px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex flex-col bg-gray-100 font-vazir';
        container.innerHTML = `
            <div class="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm z-10">
                <div class="flex items-center gap-1 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                    <button class="hover:bg-gray-200 p-2 rounded transition" title="قلم‌مو"><i data-lucide="pen-tool" class="w-5 h-5 text-gray-700"></i></button>
                    <button id="paint-clear" class="hover:bg-red-50 p-2 rounded transition" title="پاک کردن کل صفحه"><i data-lucide="trash" class="w-5 h-5 text-red-600"></i></button>
                </div>
                <div class="w-[1px] h-8 bg-gray-200"></div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 font-bold">رنگ:</span>
                    <input type="color" id="paint-color" value="#000000" class="w-8 h-8 rounded cursor-pointer border-0 p-0">
                </div>
                <div class="w-[1px] h-8 bg-gray-200"></div>
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-xs text-gray-500 font-bold">ضخامت:</span>
                    <input type="range" id="paint-size" min="1" max="20" value="3" class="w-24 cursor-pointer accent-blue-500">
                </div>
                <button class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition text-sm font-bold flex items-center gap-2 border border-blue-200">
                    <i data-lucide="save" class="w-4 h-4"></i> خروجی
                </button>
            </div>
            <div class="flex-1 p-4 overflow-auto flex items-center justify-center">
                <canvas id="paint-canvas" class="bg-white shadow-md rounded border border-gray-300 cursor-crosshair" width="800" height="600"></canvas>
            </div>
        `;

        requestAnimationFrame(() => this.initCanvas(container));
        return container;
    }

    initCanvas(container) {
        const canvas = container.querySelector('#paint-canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = container.querySelector('#paint-color');
        const sizePicker = container.querySelector('#paint-size');
        const clearBtn = container.querySelector('#paint-clear');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = sizePicker.value;
            ctx.stroke();

            lastX = x;
            lastY = y;
        };

        const stopDrawing = () => isDrawing = false;

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        clearBtn.addEventListener('click', () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }
}