import styles from './style.scss'
import electron from 'electron'
import React, { PropTypes } from 'react'
import Input from 'react-toolbox/lib/input'
import Dropdown from 'react-toolbox/lib/dropdown'
import Checkbox from 'react-toolbox/lib/checkbox'
import Table from 'react-toolbox/lib/table'
import FontIcon from 'react-toolbox/lib/font_icon'
import Snackbar from 'react-toolbox/lib/snackbar'
import dotDrop from 'dot-prop'
import autoBind from 'autobind-decorator'
import KeyInput from './KeyInput'

import { platformSource } from '../../constants'
import { BaseConfigForm, configForm, configFormProptypes } from '../ConfigForm'

const globalShortcutMgr = electron.remote.require('./main/shortcutMgr')


class Shortcuts extends BaseConfigForm {

  static propTypes = configFormProptypes

  constructor(props) {
    super(props)
    const { config, rawConfig, t } = props
    this.state = {
      platform: process.platform,
      activeSnackbar: true,
    }
    autoBind(this.constructor)
  }

  componentWillMount() {
    this.setState({ activeSnackbar: true })
    globalShortcutMgr.unregisterAll()
  }
  componentWillUnmount() {
    globalShortcutMgr.registerAll()
  }

  getSource() {
    const { config, rawConfig, defaultConfig, t } = this.props
    const { platform } = this.state
    const shortcuts = dotDrop.get(rawConfig, 'shortcuts')
    const defaultShortcuts = dotDrop.get(defaultConfig, 'shortcuts')
    const source = []
    Object.keys(shortcuts).forEach(command => {
      const shortcut = shortcuts[command][platform]
      let defaultShortcut = shortcuts[command].default
      if (!defaultShortcut && defaultShortcuts[command]) {
        const ds = defaultShortcuts[command]
        defaultShortcut = ds[platform] || ds.default
      }
      source.push({
        command: t(command),
        shortcut: (
          <KeyInput
            value={shortcut || ''}
            placeholder={defaultShortcut}
            onChange={this.changeAndUpdate(`shortcuts.${command}.${platform}`, 1500)}
          />
        ),
      })
    })
    return source
  }


  handleChangePlatform(value) {
    this.setState({ platform: value })
  }

  handleSnackbarClick() {
    this.setState({ activeSnackbar: false })
  }

  render() {
    const { t } = this.props
    const ShortcutModel = {
      command: { type: Object, title: t('Command') },
      shortcut: { type: Object, title: t('Shortcut') },
    }
    return (
      <div>
        <section>
          <Dropdown
            auto
            label={t('Choose Platform')}
            onChange={this.handleChangePlatform}
            source={platformSource}
            value={this.state.platform}
          />
        </section>
        <section>
          <Table
            model={ShortcutModel}
            // onChange={this.handleChange}
            // onSelect={this.handleSelect}
            selectable={false}
            multiSelectable={false}
            source={this.getSource()}
          />
        </section>
        <section>
          <Snackbar
            action={t('Dismiss')}
            icon="warning"
            active={this.state.activeSnackbar}
            label={t('disable global shortcuts warning')}
            onClick={this.handleSnackbarClick}
            type="warning"
          />
        </section>
      </div>
    )
  }
}

export default configForm(Shortcuts)
