// sample configuration in `~/.ELaunch/config.js`
module.exports = {
    // other config properties
    plugins: {
    // ...
    // config for other plugins

    // the path of the plugin
        script: `${__dirname}/../plugins/enso/index.js`,
        command: {
            // key is command, value is custom plugin config for command
            e: {
                engine: 'Bing',
                url: 'https://www.bing.com/search/?q=%s', // search url
                icon: 'https://cn.bing.com/sa/simg/bing_p_rr_teal_min.ico' // icon
            }
        }
    }
};
