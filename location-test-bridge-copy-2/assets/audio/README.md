# Audio

未来背景音乐、按钮点击音效和返航定位器打开音效放在此目录。

建议文件名：`bgm.mp3`、`button-click.mp3`、`device-open.mp3`

配置位置：`app.js` → `audioConfig.bgmSrc`、`buttonClickSrc`、`deviceOpenSrc`

示例：

- `bgmSrc: "assets/audio/bgm.mp3"`
- `buttonClickSrc: "assets/audio/button-click.mp3"`
- `deviceOpenSrc: "assets/audio/device-open.mp3"`

音量可分别通过 `bgmVolume`、`buttonClickVolume`、`deviceOpenVolume` 调整。路径保持空字符串时不会加载文件。

背景音乐在主场景经纬网出现时尝试播放，不受右上角音效按钮控制；浏览器如拦截自动播放，会在首次点击或按键时重试。右上角按钮默认开启，控制按钮、返航定位器和记录 tick 音效。
