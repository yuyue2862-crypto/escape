# Audio

背景音乐、按钮点击音效和返航定位器打开音效放在此目录。

建议文件名：`bgm.mp3`、`return-journey-bgm.mp3`、`return-finale-bgm.mp3`、`button-click.mp3`、`device-open.mp3`

配置位置：`app.js` → `audioConfig.bgmSrc`、`buttonClickSrc`、`deviceOpenSrc`

示例：

- `bgmSrc: "assets/audio/bgm.mp3"`
- `returnJourneyBgmSrc: "assets/audio/return-journey-bgm.mp3"`
- `returnFinaleBgmSrc: "assets/audio/return-finale-bgm.mp3"`
- `buttonClickSrc: "assets/audio/button-click.mp3"`
- `deviceOpenSrc: "assets/audio/device-open.mp3"`

音量可分别通过 `bgmVolume`、`buttonClickVolume`、`deviceOpenVolume` 调整。路径保持空字符串时不会加载文件。

`return-journey-bgm.mp3` 会在北京、里约热内卢定位完成后、返航定位器正式打开时接替常规背景音乐；`return-finale-bgm.mp3` 会在最终返航记录展开时接替前一首音乐。把正式 MP3 直接放入本目录即可，无需修改剧情代码。

背景音乐在主场景经纬网出现时尝试播放，浏览器如拦截自动播放，会在首次点击或按键时重试。右上角按钮默认开启，同时控制背景音乐、按钮、返航定位器和记录 tick 音效。若新增音乐文件尚未放入，播放器会只记录一次不可用状态，剧情会继续正常推进。
