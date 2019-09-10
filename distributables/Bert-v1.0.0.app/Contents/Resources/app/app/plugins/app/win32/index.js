// Everything.exe -admin -startup -config <filename> -db <filename> # or cwd
// es -n 20 -r(regex) "haha"
// icotool.exe -i "<input path1>" "<input file path2>" "<input file path3>"... -o "<output file path1>.png" "<output file path2>.png" "<output file path3>.png"...
// TODO: finish app query
var fs = require('fs');
const path = require('path');
const child = require('child_process');
var fs = require('fs-extra');
const shell = require('electron').shell;
const globule = require('globule');
const chokidar = require('chokidar');

// app/apps.db 用于缓存应用信息，当有新应用安装时才更新
// {lastUpdateDate:0 ,apps:[]}
let appDbFile; let pluginConfig; let globalConfig;


let appDb; let isFirstIndexing;


const defaultIcon = `${__dirname}/../assets/app.svg`;

function init() {
    // init appDbFile and appDb
    appDbFile = `${globalConfig.dataPath}/app/app.db`;
    fs.ensureFileSync(appDbFile);
    appDb = fs.readJsonSync(appDbFile, { throws: false, encoding: 'utf-8' }) || {
        lastUpdateTime: 0,
        apps: {}
    };
    isFirstIndexing = appDb.lastUpdateTime === 0;

    // update in first run
    update();

    // watch and update
    const watcher = chokidar.watch(pluginConfig.appPaths, {
        ignore: /^.*(?!\.desktop)$/
    }); const delay = 3000; let t;

    watcher.on('raw', (event, path, details) => {
        if (['add', 'change', 'unlink'].indexOf(event) !== -1) {
            t && clearTimeout(t);
            t = setTimeout(() => {
                try {
                    update();
                } catch (e) {
                    console.error(e);
                }
            }, delay);
        }
    });
}

function getAppInfo(file) {
    let icon; let execCmd; let name; let enName;
    try {
        const content = fs.readFileSync(file, 'utf-8');
        const locale = child.execSync("locale|grep LANGUAGE |awk '{print substr($0,10)}'", 'utf-8').toString().trim();
        name = enName = content.match(/\n\s*Name\s*=\s*(.*?)\s*(\n|$)/)[1];
        const lm = content.match(new RegExp(`\n\\s*Name\\s*\\[\\s*${locale}\\s*\\]\\s*=\\s*(.*?)\\s*(\n|$)`));
        if (lm) {
            name = lm[1];
        }
        execCmd = content.match(/\n\s*Exec\s*=\s*(.*?)\s*(\n|$)/)[1];
        let appIcon = content.match(/\n\s*Icon\s*=\s*(.*?)\s*(\n|$)/)[1];
        if (fs.existsSync(appIcon)) {
            if (/jpg|png|svg/.test(path.extname(appIcon))) {
                icon = appIcon;
            }
        } else {
            appIcon = appIcon.replace(/[\u4e00-\u9fa5]+/g, '**')
                .replace(/(\.png|\.jpg|\.svg)$/, '');
            const findIconCmd = `find "${pluginConfig.iconPaths.join('" "')}" \\( -name "${appIcon}.png" -o -name  "${appIcon}.svg" \\) -follow -size +2k`;
            const iconList = child.execSync(findIconCmd, 'utf-8').toString().trim()
                .split('\n');
            icon = iconList[0];
        }
    } catch (e) {
    // console.error(e);
    }
    return {
        name,
        detail: file,
        icon: icon || defaultIcon,
        value: execCmd,
        en_name: enName
    };
}

function update() {
    let hasNewApp = false; const tmpApps = {};
    function walkDir(iter) {
        const data = iter.next();
        !data.done && fs.walk(data.value).on('data', (item) => {
            if (path.extname(item.path) === '.desktop') {
                const mtime = item.stats.mtime.getTime();


                const appKey = path.basename(item.path);
                if (mtime > appDb.lastUpdateTime
            || !appDb.apps[appKey]) {
                    const appInfo = getAppInfo(item.path);
                    tmpApps[appKey] = appInfo;
                    hasNewApp = true;
                } else {
                    tmpApps[appKey] = appDb.apps[appKey];
                }
            }
        }).on('end', () => {
            walkDir(iter);
        });

        if (data.done) {
            appDb.lastUpdateTime = Date.now();
            appDb.apps = tmpApps;
            hasNewApp && fs.writeFileSync(appDbFile, JSON.stringify(appDb), 'utf-8');
            if (isFirstIndexing) {
                globalConfig.context.notifier.notify('First Indexing Finished! Now Search Your Apps!');
            }
        }
    }
    walkDir(pluginConfig.appPaths[Symbol.iterator]());
}


module.exports = {
    setConfig(pConfig, gConfig) {
        if (globalConfig) return;
        pluginConfig = pConfig;
        globalConfig = gConfig;
        pluginConfig.appPaths = pluginConfig.appPaths.filter(dir => fs.existsSync(dir));
        pluginConfig.iconPaths = pluginConfig.iconPaths.filter(dir => fs.existsSync(dir));
        init();
    },
    exec(args, event) {
        if (args.join('').trim() === '') return; // 空格返回
        const patt = `*${args.join('').toLocaleLowerCase().split('')
            .join('*')}*`;
        const apps = Object.keys(appDb.apps).map(k => appDb.apps[k]);
        console.log(apps.length, 'len');
        if (apps.length === 0) {
            event.sender.send('exec-reply', [{
                icon: defaultIcon,
                name: 'This plugin has to index apps in first run',
                detail: 'Please try it later...',
                value: 'exit'
            }]);
            return;
        }
        const items = apps.filter(app => {
            try {
                return globule.isMatch(patt, app.name.toLocaleLowerCase()) || globule.isMatch(patt, app.en_name.toLocaleLowerCase());
            } catch (e) {
                console.error(app, e);
            }
        });
        event.sender.send('exec-reply', items);
    },
    execItem(item, event) {
        require('child_process').exec(item.value);
        event.sender.send('exec-item-reply');
    }
};
