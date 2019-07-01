# Bert

## Intro

Bert is a cross platform launcher based on [Electron](https://github.com/electron/electron) and inspired by [ELaunch](https://github.com/zaaack/ELaunch) (MIT license), now only support linux and MacOS.

## Usage

>Default Shotcut: Super+Space for linux and windows, Cmd+Space for MacOS

Then you can type in app names or commands, see [Screen Captures](#screen-captures) below.

## Development

Based on Electron Forge, "a complete tool for creating, publishing, and publishing modern Electron applications".

### Debug

Start form the console to see the logs:

```
npm run start
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

Based on `electron-forge make`.

#### Where is electron-forge make configured?

`package.json` > `config` > `forge` > `make_targets`

##### How to get a DMG?

Just use the same command as above, but from a MAC.

```
The DMG target builds .dmg files, which are the standard format for sharing macOS apps.  The DMG acts like a zip file, but provides an easy way for users to take the app and put it in the /Applications directory. You can only build the DMG target on macOS machines.
```

Information about DMG makers: https://www.electronforge.io/config/makers/dmg
