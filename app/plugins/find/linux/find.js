const path = require('path');
const fs = require('fs-extra');
const child = require('child_process');
const config = require('../../../config');
const os = require('os');
const readline = require('readline');
const pluginConfig = {
    limit: 20
}; let
    fp;
module.exports = {
    setConfig(pConfig) {
        config.merge(pluginConfig, pConfig);
        const rep = p => path.normalize(p.replace(/^~/, os.homedir()));
        pluginConfig.include_path = pluginConfig.include_path.map(rep) || os.homedir();
    },
    exec(args, event) {
        if (args.join('').trim() === '') return; // 空格返回空
        let patt = args.join('').toLocaleLowerCase();
        if (patt.indexOf('*') < 0) {
            patt = patt.replace(/(.)/g, '*$1*');
        }
        const includePara = pluginConfig.include_path.map(ip => `"${ip}"`).join(' ');


        const excludePara = pluginConfig.excludePaths.map(ep => `-path "${ep}"`).join(' -o ');
        // find "/Users/z" \( -path "**/.*" -o -path "**/node_*" \)  -a -prune -o \( -type d -o -type f \) -name "*a*" -print | grep "." -m 20
        const cmd = `find ${includePara} ${
            excludePara ? `\\( ${excludePara} \\)  -a -prune ` : ''
        }-o \\( -type d -o -type f \\) ${
            pluginConfig.maxdepth ? `-maxdepth ${pluginConfig.maxdepth} ` : ''
        }-name "${patt}" -print | grep "." -m ${pluginConfig.limit}`;// if using readline, childProcess can't be killed
        // console.log(cmd);
        const defaultIcon = `${__dirname}/../assets/file.svg`;
        fp && fp.kill();
        console.time('find');
        fp = child.execFile('sh', ['-c', cmd], (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                event.sender.send('exec-reply', []);
                return;
            }
            stdout = `${stdout}`;
            console.timeEnd('find');
            const items = stdout.split('\n').slice(0, pluginConfig.limit)
                .filter(file => !/^\s*$/.test(file))
                .map(file => {
                    return {
                        name: path.basename(file),
                        detail: file,
                        icon: defaultIcon,
                        value: file,
                        opts: [
                            { name: 'open', label: 'Open' }, // first is default
                            { name: 'open-folder', label: 'Open Folder' },
                            { name: 'copy-path', label: 'Copy Path' }
                        ]
                    };
                });
            // console.log(items);
            event.sender.send('exec-reply', items);
        });
    },
    execItem(item, event) {
        switch (item.opt) {
        case 'copy-path':
            require('electron').clipboard.writeText(item.value);
            break;
        case 'open-folder':
            require('electron').shell.openItem(path.dirname(item.value));
            break;
        case 'open':
        default:
            require('electron').shell.openItem(item.value);
        }

        event.sender.send('exec-item-reply');
    }
};
