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

## Usage

>Default Shotcut: Super+Space for linux and windows, Cmd+Space for MacOS

Then you can type in app names or commands, see [Screen Captures](#screen-captures) below.

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

Notes:

I was getting a bunch of errors, switched to `node/8.12.0` and all of my issues got fixed.

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
