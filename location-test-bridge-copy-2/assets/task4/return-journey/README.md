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

## 3. 珠江口与粤港澳大湾区科技地图

- 运行时文件：`pearl-river-delta-tech-map.png`
- 本地矢量数据：`pearl-river-delta-osm-coastline.json`
- 用途：三段式返航影像第三幕
- 来源名称：OpenStreetMap 海岸线数据（`natural=coastline`）
- 官方地图与版权说明：<https://www.openstreetmap.org/copyright>
- 获取方式：通过 Overpass API 查询 112.5°E–114.7°E、21.8°N–23.6°N 范围内的 OSM 海岸线；原始结果包含 3257 条海岸线和 166721 个坐标点
- 数据时间戳：Overpass 返回的 OSM 基础数据时间为 2026-07-24T11:04:51Z；本地成品生成于 2026-10-12
- 处理方式：仅做 Douglas-Peucker 轻量简化、Web Mercator 投影和视觉样式渲染；不移动海岸线、岛屿或城市坐标
- 成品分辨率：1920 × 1080 PNG
- 使用许可：OpenStreetMap 数据依据 Open Database License（ODbL）使用；运行画面持续显示 `Map data © OpenStreetMap contributors · ODbL`
- 城市点：广州、东莞、深圳、香港、澳门、中山、江门以 WGS84 经纬度经同一投影绘制；珠海继续使用游戏既定坐标 22.27°N、113.58°E
- 旧文件：`pearl-river-delta-map.jpg` 为此前的 OSM Standard 道路瓦片成品，仅作为 Git 回退资源保留，运行时不再引用

## 运行时路径

- `assets/task4/return-journey/earth-asia-pacific.jpg`
- `assets/task4/return-journey/china-south-sea.jpg`
- `assets/task4/return-journey/pearl-river-delta-tech-map.png`

三张运行时图片和第三阶段海岸线数据均已本地化，无临时目录依赖、无用户绝对路径、无运行时外部地图请求。
