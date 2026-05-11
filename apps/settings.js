export class SettingsApp {
    constructor() {
        this.title = 'تنظیمات سیستم';
        this.icon = 'settings';
        this.width = '600px';
        this.height = '400px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full flex bg-gray-50 font-vazir';
        
        container.innerHTML = `
            <div class="w-1/3 bg-white border-l border-gray-200 py-4 px-2 flex flex-col gap-1">
                <button class="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold transition">
                    <i data-lucide="monitor" class="w-5 h-5"></i> نمایش
                </button>
                <button class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition">
                    <i data-lucide="user" class="w-5 h-5"></i> حساب کاربری
                </button>
                <button class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition">
                    <i data-lucide="info" class="w-5 h-5"></i> درباره سیستم
                </button>
            </div>
            <div class="flex-1 p-6 overflow-y-auto">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">تنظیمات نمایش</h2>
                
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-bold text-gray-800">حالت تاریک (Dark Mode)</div>
                            <div class="text-xs text-gray-500 mt-1">تغییر رنگ‌بندی سیستم به تیره</div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-4">
                    <div class="font-bold text-gray-800 mb-3">تصویر پس‌زمینه</div>
                    <div class="flex gap-3">
                        <div class="w-24 h-16 rounded-lg bg-blue-500 border-2 border-blue-600 cursor-pointer"></div>
                        <div class="w-24 h-16 rounded-lg bg-purple-500 hover:border-2 hover:border-gray-400 cursor-pointer transition"></div>
                        <div class="w-24 h-16 rounded-lg bg-gray-800 hover:border-2 hover:border-gray-400 cursor-pointer transition flex items-center justify-center text-white">
                            <i data-lucide="plus" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <i data-lucide="shield-check" class="w-6 h-6 text-blue-500 shrink-0 mt-0.5"></i>
                    <div>
                        <div class="text-sm font-bold text-blue-800">سیستم عامل وب فارسی</div>
                        <div class="text-xs text-blue-600 mt-1">نسخه 1.0.0 (پایدار)<br>طراحی شده با جاوااسکریپت وانیلا و تیلویند.</div>
                    </div>
                </div>
            </div>
        `;
        return container;
    }
}