# Berthe

## Intro

Berthe is a cross platform launcher based on [Electron](https://github.com/electron/electron) and inspired by [ELaunch](https://github.com/zaaack/ELaunch) (MIT license), now only support linux and MacOS.

## Download

TBD

## Usages

Result in the `app` plugin being invoked:

- chrome

Result in the `calc` plugin being invoked:

- calc 1+1

Result in the `shell` plugin being invoked:

- > pwd
- > ls
- etc.

Result in the `find` plugin being invoked:

- find something

## Donate

If you really like my work here, please support me a cup of coffee, thanks! :smile:

## Requirement

* Linux: none
* MacOS: none
* Windows:
  * Everything.exe for fastly searching files, this is already packed in, what you need to do is not to quit it on tray.
  * .NET Framework 2.0 for reading file icon. Usually this is already installed in most PCs, but in some old system like windowsXP it may not being installed, you can download it on [Microsoft's website](https://www.microsoft
  * .com/zh-cn/download/confirmation.aspx?id=1639).

## Config

> Custom config directory: `~/.ELaunch/`
> Custom config path: `~/.ELaunch/config.js`

Plugins in default config are built-in plugins, you can overwrite them or add new plugin in custom config(`~/.ELaunch/config.js`). After the program started, it would automatically merge custom config.js to config.default.js. If you want to use platform-specific config, you can add `linux/darwin/win32` fields in plugin config and them would be merged into plugin config according to `process.platform`. This works in command config too. See [default config](app/config/config.default.js).

Notice: after you edit your config, you need to reload config(on tray menu) or restart the app to make config changes work.

## Usage

>Default Shotcut: Super+Space for linux and windows, Cmd+Space for MacOS

Then you can type in app names or commands, see [Screen Captures](#screen-captures) below.

# Install plugins

You can find a plugin list on [wiki](https://github.com/zaaack/ELaunch/wiki).

```sh
cd ~/.ELaunch
npm i <package name of the plugin> --save
```
or

```sh
cd ~/.ELaunch
mkdir node_modules
cd node_modules
git clone --depth 1 <repository url of the plugin>
```
Then, edit your ELaunch config file (path: `~/.ELaunch/config.js`),
add this plugin in plugins field, something like this:
```js
module.exports = {
  //... other config fields
  plugins: {
    //... config for other plugins
    devdocs: {
      path: `<path to the plugin>`,
      command: {
        `<command of the plugin>`: {}
      }
    }
  }
}
```

Then, restart ELaunch or click `Reload config` on tray menu to reload the config file.


## Develop

You need install [nodejs](https://nodejs.org/en/) first, than run commands below
```sh
git clone https://github.com/zaaack/ELaunch.git
cd ELaunch/app && npm i
cd ../ && npm i

# build native modules (node-inspector)
./node_modules/.bin/electron-rebuild

```
then you can start it by
```sh
npm start
```
or
```sh
npm i -g electron-prebuilt
electron ./app/index.js
```

## Debug

see: http://electron.atom.io/docs/tutorial/debugging-main-process/

```js

npm run debug-brk
ELECTRON_RUN_AS_NODE=true node_modules/.bin/electron node_modules/node-inspector/bin/inspector.js

```

## Build

see [electron-builder](https://github.com/electron-userland/electron-builder)

```js
npm run dist
```

### More details

We’ll be using electron-builder since it has a built-in support for Code Signing/Auto Update etc.

#### Build directory

Create a directory build in the root of the project and save a background.png (macOS DMG background), icon.icns (macOS app icon) and icon.ico (Windows app icon) into it. The Linux icon set will be generated automatically based on the macOS.

## Screen Captures

### Plugin app

![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/app.jpg)

### Plugin find

![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/find.jpg)


### Plugin websearch

![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/search.jpg)



### Plugin shell

#### node
![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/shell1.jpg)

#### iterm
![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/shell2.jpg)
![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/shell3.jpg)


### Plugin youdao

![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/youdao.jpg)

### Plugin calc

![](https://raw.githubusercontent.com/zaaack/ELaunch/master/docs/captures/calc.jpg)

## Plugin Develop

see [plugin.md](https://github.com/zaaack/ELaunch/wiki/Plugin-Development)

## Plan

[Dev Plan](https://github.com/zaaack/ELaunch/issues/1)


## Welcome fork and contribute!
