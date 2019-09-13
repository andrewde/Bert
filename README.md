# Bert

- [Bert](#bert)
  - [Intro](#intro)
    - [Features](#features)
      - [*app* - Search an app on the system](#app---search-an-app-on-the-system)
      - [*find* - Search a file](#find---search-a-file)
      - [*websearch* - Web search](#websearch---web-search)
      - [*shell* - Shell prompt](#shell---shell-prompt)
      - [*calc* - Calculator](#calc---calculator)
  - [FAQ](#faq)
    - [Download](#download)
    - [How to open Bert launcher](#how-to-open-bert-launcher)
    - [How to save a new command/shortcut](#how-to-save-a-new-commandshortcut)
    - [How to open a command previously saved](#how-to-open-a-command-previously-saved)
    - [How to update or delete a command](#how-to-update-or-delete-a-command)
    - [Where does Bert save its data](#where-does-bert-save-its-data)
    - [Where are my commands/shortcuts saved](#where-are-my-commandsshortcuts-saved)
    - [How to change my user settings](#how-to-change-my-user-settings)
    - [Where are the logs located](#where-are-the-logs-located)
  - [Roadmap](#roadmap)

![](screenshots/open-test.png)

## Intro

Bert is a cross-platform launcher based on [Electron](https://github.com/electron/electron) and inspired by [Enso Launcher by Humanized](https://www.reddit.com/r/answers/comments/2dw0n2/what_happened_to_humanized_especially_their/).

It's initially a fork from [ELaunch](https://github.com/zaaack/ELaunch).

I rely on Bert daily on MAC OS for work. I have hundreds of web links saved.
Bert has never been tested on Windows or Linux.

### Features

Bert essentially adds [a new plugin](https://github.com/andrewde/Bert/blob/master/app/plugins/enso/index.js) to simulate Enso Launcher.

We support the plugins initially included in [ELaunch](https://github.com/zaaack/ELaunch):

#### *app* - Search an app on the system

![](screenshots/app.png)

#### *find* - Search a file

#### *websearch* - Web search

#### *shell* - Shell prompt

![](screenshots/shell.png)
![](screenshots/shell-pwd.png)

#### *calc* - Calculator

## FAQ

### Download

Find a zip of the app file for `Mac OS` [here](https://github.com/andrewde/Bert/releases/tag/v1.0).

For Windows and Linux, you have to build it yourself.
See our [developer guide](Development.md).

### How to open Bert launcher

Default Shotcut: `Command+E` for linux and windows, `Cmd+E` for MacOS.

This can be changed by updating the `toggle` property from your user settings located at `~/.bert/config.json5`.

### How to save a new command/shortcut

Open Bert.
Type: `learn <name> as <url>`
Example: `learn google as https://google.com`

### How to open a command previously saved

Open Bert.
Type: `open <name>`
Example: `open google`

### How to update or delete a command

This can be done by changing the underlying `.url` the file linked to a command.

Coommands are saved as `.url` files under `~/.bert/Enso`.
'.url' is presumably a cross-platform format for URLs.

Just rename the file name (which is the command name).

### Where does Bert save its data

Everything is saved in a hidden directory under the current user home directory (`os.homedir()`) at `~/.bert`.

### Where are my commands/shortcuts saved

Coommands are saved as `.url` files under `~/.bert/Enso`.
'.url' is presumably a cross-platform format for URLs.

### How to change my user settings

There is a settings JSON file that you can customize.
The file is located in Bert's data directory `~/.bert/config.json5`.
It's auto-generated the first time you launch Bert.

When the file is missing, Bert auto-regenerates it [from default config file](https://github.com/andrewde/Bert/blob/master/app/config/config.default.js).

### Where are the logs located

Our [logger facade](https://github.com/andrewde/Bert/blob/master/app/utils/logger.js) is based on [electron-log](https://www.npmjs.com/package/electron-log).

By default it writes logs to the following locations:

- on Linux: `~/.config/bert/log.log`
- on macOS: `~/Library/Logs/bert/log.log`
- on Windows: `%USERPROFILE%\AppData\Roaming\bert\log.log`

## Roadmap

Our priorities are as follow:

- Reduce redistributables size. ~ 500 MB uncompressed currently.
- Fix auto-launch at startup. You have to manually re-launch Bert currently.
- Fuzzy search. Currently, we have a naive string matching ([see code](https://github.com/andrewde/Bert/blob/master/app/plugins/enso/index.js#L20)).
- Recursively search files from `~/.bert/Enso`. Currently any subdirectory is ignored (Example: `~/.bert/Enso/work` or `~/.bert/Enso/perso`).
- Add capability to save system paths and not just web URLs. The idea here is to invoke scripts on-demand.
