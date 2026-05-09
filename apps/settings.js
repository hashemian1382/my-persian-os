export class SettingsApp {
    constructor() {
        this.title = 'تنظیمات سیستم';
        this.icon = 'settings';
        this.width = '450px';
        this.height = '350px';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'w-full h-full bg-gray-50 p-4 overflow-y-auto text-gray-800';
        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-3 rounded shadow-sm border">
                    <h3 class="font-bold mb-3 border-b pb-1">نمایش</h3>
                    <label class="flex items-center gap-2 cursor-pointer mb-2">
                        <input type="checkbox" class="w-4 h-4 rounded text-blue-600">
                        <span>حالت تاریک (Dark Mode)</span>
                    </label>
                    <div class="flex items-center gap-2 mt-3">
                        <span>تصویر پس‌زمینه:</span>
                        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">انتخاب تصویر</button>
                    </div>
                </div>
                <div class="bg-white p-3 rounded shadow-sm border">
                    <h3 class="font-bold mb-3 border-b pb-1">درباره سیستم عامل</h3>
                    <p class="text-sm">نسخه: 1.0 (توسعه)</p>
                    <p class="text-sm mt-1">ساخته شده با جاوااسکریپت وانیلا</p>
                </div>
            </div>
        `;
        return container;
    }
}