# S4-12 返航影像素材说明

生成日期：2026-10-12  
生成脚本：`scripts/build_s4_12_return_assets.py`

本目录只保存游戏运行时使用的本地化成品。游戏不会在运行时请求外部图片或地图服务。

## 1. 亚洲—太平洋半球真实地球影像

- 本地文件：`earth-asia-pacific.jpg`
- 用途：三段式返航影像第一幕
- 来源名称：NASA Blue Marble: Next Generation，August 2004 monthly composite
- 官方页面：<https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/>
- 原始下载：<https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/august/world.200408.3x21600x10800.jpg>
- 下载方式：从 NASA Science 官方资源地址下载 2 km JPEG 月合成图，再用构建脚本执行正射投影，视图中心为 120°E、15°N
- 原始分辨率：21600 × 10800
- 成品分辨率：1920 × 1080
- 日期/版本：Blue Marble Next Generation，2004 年 8 月合成；本地成品生成于 2026-10-12
- 使用许可：NASA 影像通常可用于教育与信息用途；不得暗示 NASA 背书，并应注明来源。若单项资源另有第三方版权标记，以该标记为准
- 署名：NASA Earth Observatory / NASA Goddard Space Flight Center；Blue Marble data courtesy Reto Stöckli and NASA Earth Observatory

## 2. 中国与南海卫星影像

- 本地文件：`china-south-sea.jpg`
- 用途：三段式返航影像第二幕
- 来源名称：NASA Blue Marble: Next Generation，August 2004 monthly composite
- 官方页面与原始下载：同上
- 下载方式：从同一 NASA 全球月合成图按 60°E–149°E、5°N–55°N 裁切并缩放，不修改地理轮廓
- 原始分辨率：21600 × 10800
- 成品分辨率：1920 × 1080
- 日期/版本、许可与署名：同上

NASA 影像使用说明：<https://www.nasa.gov/nasa-brand-center/images-and-media/>

## 3. 珠江三角洲标准地图

- 本地文件：`pearl-river-delta-map.jpg`
- 用途：三段式返航影像第三幕
- 来源名称：OpenStreetMap Standard tile layer
- 官方地图与版权说明：<https://www.openstreetmap.org/copyright>
- 官方瓦片服务：<https://tile.openstreetmap.org/>
- 瓦片使用政策：<https://operations.osmfoundation.org/policies/tiles/>
- 下载方式：构建脚本以专用 User-Agent 一次性请求固定小范围内的 24 张 z=9 标准图层瓦片，按 112.0°E–115.47°E、21.7°N–23.5°N 拼接、精确裁切并缩放；不是离线地图或批量预抓取流程，不应频繁重复运行
- 原始瓦片分辨率：256 × 256；本次覆盖范围由多张 z=9 瓦片拼接
- 成品分辨率：1920 × 1080
- 日期/版本：OpenStreetMap 数据与标准图层于 2026-10-12 获取
- 使用许可：地图数据依据 Open Database License（ODbL）；标准图层需保留 OpenStreetMap 贡献者署名
- 署名：© OpenStreetMap contributors
- 珠海目标点：游戏运行时依据 22.27°N、113.58°E 在成品地图同一边界投影中叠加，不修改底图地理数据

## 运行时路径

- `assets/task4/return-journey/earth-asia-pacific.jpg`
- `assets/task4/return-journey/china-south-sea.jpg`
- `assets/task4/return-journey/pearl-river-delta-map.jpg`

三张图均已本地化，无临时目录依赖、无用户绝对路径、无外部图片 URL。
