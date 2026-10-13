# S4-12 返航影像素材说明

生成日期：2026-10-13
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

## 2.1 亚洲—太平洋至中国与南海连续推进

- 本地文件：`earth-to-china-south-sea.mp4`
- 当前状态：保留的旧版构建成品；运行时已不再引用
- 数据来源：与前两幕相同的 NASA Blue Marble: Next Generation 2004 年 8 月合成影像
- 生成方式：构建脚本先扩大以 120°E、15°N 为中心的正射球体，并将观察中心平滑移向 104.5°E、30°N；当地球边缘离开画面后，再把投影连续过渡到第二幕 60°E–149°E、5°N–55°N 的等经纬范围
- 视频参数：1600 × 900、30 fps、4.2 秒、H.264 MP4；无声音
- 停用原因：视频后段逐像素混合正射球体与等经纬平面投影，在课堂画面中会产生地球被拉伸、压平的错误观感
- 当前运行方案：直接复用第一、第二幕两张 NASA 影像；第一幕只执行等比例缩放和观察中心移动，在球面边缘离开主要视野后，再柔和融合到第二幕并稳定落位。该方案保留接近地球的运动感，不再把球面影像强行变形成平面地图
- 许可与署名：同前两幕 NASA 影像

NASA 影像使用说明：<https://www.nasa.gov/nasa-brand-center/images-and-media/>

## 3. 珠江口与粤港澳大湾区科技地图

- 运行时文件：`pearl-river-delta-tech-map.png`
- 本地矢量数据：`pearl-river-delta-osm-coastline.json`、`pearl-river-delta-osm-geography.json`
- 用途：三段式返航影像第三幕
- 来源名称：OpenStreetMap 海岸线（`natural=coastline`）、河流/水道（`waterway=river`）及行政边界（`boundary=administrative`）
- 官方地图与版权说明：<https://www.openstreetmap.org/copyright>
- 获取方式：通过 Overpass API 查询 112.5°E–114.7°E、21.8°N–23.6°N。海岸线使用原有本地提取；河流先按名称和要素类型核验，再按 OSM way ID 获取几何；城市边界按已核验的 OSM relation ID 分城获取 `outer` 成员几何
- 数据时间戳：海岸线基础数据为 2026-07-24T11:04:51Z；河流合并使用 2026-10-13T02:43:06Z 与 2026-10-13T03:32:31Z 两次 OSM 基础数据快照；城市边界主要为 2026-10-13T02:53:21Z，珠海为 2026-10-13T02:54:11Z
- 河流水系：保留西江、北江、东江及原有三角洲水道，并补入后航道、佛山水道、沙湾水道、东莞水道、横门水道、小榄水道、鸡鸦水道、容桂水道和一段缺失的东江南支流；新增共 17 个 OSM way，均保留各自真实几何和分段，不在代码中强制拼接
- 河流标签：将“西江”锚定到思贤滘以西的 OSM 237902657 河段；在明确的 OSM 河段上增加较淡的“北江”和“东江北干流”；删除贴在广州单一河段上的泛称“珠江”，避免把整个珠江水系误解为一条具体水道
- 官方交叉核对：河流名称、干流起止及水系关系依据[《广东省主要河道名录》](https://www.shanwei.gov.cn/swsswj/gkmlpt/content/0/804/post_804300.html)、[《珠江水系航运简介》](https://zjhy.mot.gov.cn/zhuhanggk/shuixijj/201909/t20190916_3266853.html)和[《珠江中下游重要河道规划治导线》](https://www.pearlwater.gov.cn/zwgkcs/slghn/202109/P020210907321608156347.pdf)核对；广东省公共地图服务系统仅核对了官方服务入口，未从其交互地图采集几何或标签，不抓取瓦片、不采用截图描线
- 数据性质说明：上述政府和行业主管部门资料是名称、范围与关系的官方依据；实际绘图折线仍来自 OSM/Overpass 开放矢量，不称为官方 GIS 数据。规划 PDF 附图只用于核对相对关系，未直接描线或量取坐标
- 城市行政边界：广州、佛山、江门、中山、珠海、东莞、深圳、香港。澳门未在已核验提取中取得一个可信的完整统一行政关系，因此不补画边界，仅保留原城市定位点和名称
- 经纬网：由真实经纬度 113°E、114°E、22°N、23°N 通过与海岸线相同的 Web Mercator 投影实时生成；未使用装饰曲线或屏幕像素定位
- 处理方式：仅做 Douglas-Peucker 轻量简化、范围裁切、Web Mercator 投影和视觉样式渲染；不移动海岸线、河道、行政边界、岛屿或城市坐标。行政关系中伸入海面的边界段在视觉层以陆地遮罩裁切，避免海域边界抢占海岸线和珠海定位焦点；原始 OSM 几何仍保存在本地 JSON 中
- 成品分辨率：1920 × 1080 PNG
- 使用许可：OpenStreetMap 数据依据 Open Database License（ODbL）使用；运行画面持续显示 `Map data © OpenStreetMap contributors · ODbL`
- 城市点：广州、东莞、深圳、香港、澳门、中山、江门以 WGS84 经纬度经同一投影绘制；珠海继续使用游戏既定坐标 22.27°N、113.58°E
- 投影与坐标转换：经度线性映射；纬度先计算 `ln(tan(π/4 + φ/2))`，再按同一比例和统一边距映射到 1920 × 1080 画布；所有新增图层共用该转换
- 数据本地化：运行时只加载本地 PNG；处理后的 OSM way/relation ID、名称、坐标和许可元数据保存在 `pearl-river-delta-osm-geography.json`，不依赖临时目录或在线地图请求
- 旧文件：`pearl-river-delta-map.jpg` 为此前的 OSM Standard 道路瓦片成品，仅作为 Git 回退资源保留，运行时不再引用

## 运行时路径

- `assets/task4/return-journey/earth-asia-pacific.jpg`
- `assets/task4/return-journey/china-south-sea.jpg`
- `assets/task4/return-journey/pearl-river-delta-tech-map.png`
- `assets/task4/return-journey/pearl-river-delta-osm-geography.json`

三张运行时图片及第三阶段海岸线、河流和城市边界数据均已本地化，无临时目录依赖、无用户绝对路径、无运行时外部地图请求。旧推进视频仅作历史构建产物保留，不参与运行时预载与播放。
