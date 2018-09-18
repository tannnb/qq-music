# QQ音乐(vue版)

使用vue模仿QQ音乐官网,主要以PC端为主，没有考虑移动端适配，目前只做了主流浏览器兼容，移动端可访问(tannnb.com/h5music),获得更好体验

> [在线演示地址](http://tannnb.com/pcmusic)

## 如何安装与使用

``` bash
# 安装依赖
npm install 或者 yarn install

# 启动
npm run dev 或者yarn run dev

# 启动服务: 进入server目录
npm run app 或者yarn run app

# 项目打包
npm run build
```

## 技术栈

- Vue-Cli
- Vue + Vue-Router + Vuex
- ES6/7
- stylus
- axios
- node + express
- DPlayer
- vue-create-api



## 功能

- 歌单推荐
- 歌手页,歌手单曲MV
- 专辑大全
- 音乐排行榜
- 分类歌单
- 电台
- 搜索
- 播放器




## 其他说明
- 仅仅为个人学习练手项目，如需更好体验，请前往QQ音乐[QQ音乐](https://y.qq.com) ^_^
- 如果您喜欢该作品，您可以点右上角 "Star" "Fork" 表示支持 谢谢！



## 更新说明
- 完善电台播放功能，增加点击收藏高亮显示(2018-09-11)
- 修改电台歌词获取来源
- 将声明式组件改写成调用式，mixin混用代码(2018-09-14)
- 添加边界处理，封装图片组件
- 排行榜优化，封装Toast,Loading等基础组件
- 处理排行版以及专辑因版权无法播放跳转问题，删除亢余代码
- 添加精彩推荐(banner),增加歌手MV播放功能(2018-09-18)
- 增加歌曲列表fold
- 增加歌手MV播放外链，若高清MV无法播放，则使用标准MV播放




## 界面欣赏

仿照QQ音乐官网制作，向QQ音乐致敬^_^！！！

#### 首页
![首页](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/1.jpg)

#### 歌手列表
![歌手列表](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/2.jpg)

#### 专辑
![专辑](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/3.jpg)

#### 排行榜
![排行榜](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/4.jpg)

#### 分类歌单
![分类歌单](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/5.jpg)

#### 电台
![电台](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/6.jpg)

#### 搜索
![搜索](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/7.jpg)

#### MV
![MV](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/9.png)

#### 播放列表
![播放列表](https://raw.githubusercontent.com/tannnb/qq_music/master/screenshots/8.jpg)

