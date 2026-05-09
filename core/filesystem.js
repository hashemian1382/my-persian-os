export class FileSystem {
    constructor() {
        const savedData = localStorage.getItem('os_filesystem');
        if (savedData) {
            this.tree = JSON.parse(savedData);
        } else {
            this.tree = {
                id: 'root',
                name: '/',
                type: 'folder',
                children: [
                    {
                        id: 'desktop',
                        name: 'میزکار',
                        type: 'folder',
                        children: [
                            { id: 'app-terminal', name: 'پایانه', type: 'shortcut', icon: 'terminal', appId: 'terminal', x: 20, y: 20 },
                            { id: 'app-settings', name: 'تنظیمات', type: 'shortcut', icon: 'settings', appId: 'settings', x: 20, y: 120 },
                            { id: 'app-calc', name: 'ماشین‌حساب', type: 'shortcut', icon: 'calculator', appId: 'calculator', x: 20, y: 220 },
                            { id: 'app-paint', name: 'نقاشی', type: 'shortcut', icon: 'palette', appId: 'paint', x: 120, y: 20 },
                            { id: 'app-notepad', name: 'ویرایشگر', type: 'shortcut', icon: 'file-text', appId: 'notepad', x: 120, y: 120 },
                            { id: 'app-xo', name: 'بازی دوز', type: 'shortcut', icon: 'gamepad-2', appId: 'xo', x: 120, y: 220 }
                        ]
                    }
                ]
            };
            this.save();
        }
    }

    save() {
        localStorage.setItem('os_filesystem', JSON.stringify(this.tree));
    }

    createFile(pathId, name, extension) {
        const folder = this.findNode(this.tree, pathId);
        if (folder && folder.type === 'folder') {
            const newFile = {
                id: `file-${Date.now()}`,
                name: name,
                type: 'file',
                extension: extension,
                icon: extension === 'متن' ? 'file-text' : 'image',
                content: '',
                x: 220,
                y: 20
            };
            folder.children.push(newFile);
            this.save();
            return newFile;
        }
        return null;
    }

    createFolder(pathId, name) {
        const folder = this.findNode(this.tree, pathId);
        if (folder && folder.type === 'folder') {
            const newFolder = {
                id: `folder-${Date.now()}`,
                name: name,
                type: 'folder',
                icon: 'folder',
                children: [],
                x: 220,
                y: 120
            };
            folder.children.push(newFolder);
            this.save();
            return newFolder;
        }
        return null;
    }

    deleteNode(id) {
        const parent = this.findParent(this.tree, id);
        if (parent) {
            parent.children = parent.children.filter(child => child.id !== id);
            this.save();
            return true;
        }
        return false;
    }

    renameNode(id, newName) {
        const node = this.findNode(this.tree, id);
        if (node) {
            node.name = newName;
            this.save();
            return true;
        }
        return false;
    }

    updateCoordinates(id, x, y) {
        const node = this.findNode(this.tree, id);
        if (node) {
            node.x = x;
            node.y = y;
            this.save();
        }
    }

    getDesktopFiles() {
        return this.findNode(this.tree, 'desktop').children;
    }

    findNode(node, id) {
        if (node.id === id) return node;
        if (node.children) {
            for (let child of node.children) {
                const found = this.findNode(child, id);
                if (found) return found;
            }
        }
        return null;
    }

    findParent(node, id) {
        if (node.children) {
            for (let child of node.children) {
                if (child.id === id) return node;
                const found = this.findParent(child, id);
                if (found) return found;
            }
        }
        return null;
    }
}