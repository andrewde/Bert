const http = require('http');
const electron = require('electron');
const fs = require('fs-extra');
const querystring = require('querystring');

const errorMsg = {
    20: '要翻译的文本过长',
    30: '无法进行有效的翻译',
    40: '不支持的语言类型',
    50: '无效的key',
    60: '无词典结果，仅在获取词典结果生效'
}; const defaultIcon = `${__dirname}/assets/youdao.png`;


const delay = 300; let timer; let key = '917764008';

function queryApi(query, cb) {
    http.get(`http://fanyi.youdao.com/openapi.do?keyfrom=ELaunch&key=${key}&type=data&doctype=json&version=1.1&q=${query}`, (res) => {
        let html = '';
        res.on('data', (data) => {
            html += data;
        });
        res.on('end', data => {
            cb(JSON.parse(html));
        });
    });
}
// TODO: Fav words and list fav words by `yd -fav`
function saveFav() {
}
function newOpts() {
    return [{ name: 'copy', label: 'Copy' },
        { name: 'fav', label: 'Fav' },
        { name: 'dict', label: 'Dict' },
        { name: 'translate', label: 'Translate' }];
}
module.exports = {
    setConfig(pConfig, gConfig) {
        key = pConfig.key || key;
    },
    exec(args, event, cmdInfo) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            this._exec.call(this, ...arguments);
        }, delay);
    },
    _exec(args, event, cmdInfo) {
        args = args.join(' ').trim();
        if (!args) return;
        let ret = [];
        args = querystring.escape(args);
        queryApi(args, (data) => {
            if (data.errorCode > 0) {
                ret.push({
                    name: '<font color="red">Error</font>',
                    icon: defaultIcon,
                    value: args,
                    detail: errorMsg[`${data.errorCode}`]
                });
            } else {
                const detail = data.basic ? data.basic.explains.join('，') : data.translation;
                ret.push({
                    name: `${data.query} ${data.basic ? `<span style="font-size:12px;color:gray;">[${data.basic.phonetic || ''}]</span>` : ''}`,
                    icon: defaultIcon,
                    value: {
                        query: data.query,
                        detail
                    },
                    detail,
                    opts: newOpts()
                });
                ret = data.web ? ret.concat(data.web.map(web => {
                    return {
                        name: `${web.key} <span style="font-size:12px;color:gray;">网络释义</span>`,
                        icon: defaultIcon,
                        detail: web.value.join('，'),
                        value: {
                            query: web.key,
                            detail: web.value.join('，')
                        },
                        opts: newOpts()
                    };
                })) : ret;
            }
            event.sender.send('exec-reply', ret);
        });
    },
    execItem(item, event) {
        switch (item.opt) {
        case 'copy':
            electron.clipboard.writeText(item.value.detail);
            break;
        case 'dict':
            electron.shell.openExternal(`http://dict.youdao.com/search?q=${item.value.query}`);
            break;
        case 'translate':
            electron.shell.openExternal(`http://fanyi.baidu.com/#en/zh/${item.value.query}`);
            break;
        default:
        }
        event.sender.send('exec-item-reply');
    }
};
