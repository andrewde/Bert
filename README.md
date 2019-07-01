# Bert

## Intro

Bert is a cross platform launcher based on [Electron](https://github.com/electron/electron) and inspired by [ELaunch](https://github.com/zaaack/ELaunch) (MIT license), now only support linux and MacOS.

## Download

TBD

## Usages

TBD

## Donate

TBD

## Requirement

TBD

## Usage

>Default Shotcut: Super+Space for linux and windows, Cmd+Space for MacOS

Then you can type in app names or commands, see [Screen Captures](#screen-captures) below.

## Development

Based on Electron Forge, "a complete tool for creating, publishing, and publishing modern Electron applications".

### Debug

see: http://electron.atom.io/docs/tutorial/debugging-main-process/

```js

npm run debug-brk
ELECTRON_RUN_AS_NODE=true node_modules/.bin/electron node_modules/node-inspector/bin/inspector.js

```

### Build

see [electron-builder](https://github.com/electron-userland/electron-builder)

```js
npm run build
```

### Build distributable

```js
npm run make
```