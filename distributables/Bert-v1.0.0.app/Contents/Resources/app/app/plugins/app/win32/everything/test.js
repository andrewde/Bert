const child = require('child_process');
const p = child.spawn('C:\\Documents and Settings\\Administrator\\我的文档\\SharpDevelop Projects\\icotool\\icotool\\bin\\Debug\\icotool.exe', ['aa']);
p.stdout.on('data', (data) => {
    console.log(`${data}`);
});
