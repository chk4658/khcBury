# khc-bury [![npm license](https://img.shields.io/npm/l/@xmon/bury.svg?sanitize=true)](https://github.com/darkXmo/bury/blob/main/LICENSE)

## Fix & New

- ### 不完全依赖[data-]做 filter 条件

```
元素绑定了onclick || addEventListener || [data-]

chrome devTools 可以使用getEventListeners() 获取元素绑定的事件，但无法在js执行

重构原型的 addEventListener 和 removeEventListener 实现 getEventListeners()：
获取target元素绑定的事件

初始化后立即执行overrideEventListeners
```

- ### 关闭 tab 或浏览器 发送请求

[如何处理页面关闭时发送 HTTP 请求](https://juejin.cn/post/7113192304482975780)

```
记录页面停留时间时
离开时 使用beforeunload
可以打印信息，但http请求会被取消

js是单线程的，因此网络请求，包括fetch和XMLHttpRequest请求，被设计成是异步且非阻塞的。
异步操作有一个好处，就是它不会占用主进程，但是这也会带来问题，如果主进程销毁了，
例如页面关闭或者离开当前页面，那么原来异步进行的网络请求可能会被抛弃。
直观的体现就是我们可以在network中看到请求已经canceled。


建议使用fetch + keeplive 发送埋点信息

以下为优缺点

1. async/await

需要先阻止浏览器的默认事件，等到请求结束后再执行
由于需要等待网络请求执行完成，因此会导致用户长时间得不到反馈
如果业务场景不在乎等待时间，可以考虑

2. fetch + keepalive

fetch接口自带的属性，无需额外引入
如果请求需要支持GET、POST、PUT、DELETE等，可以选择使用fetch
兼容性较好，除了IE不支持

3. navigator.sendBeacon()

navigator.sendBeacon()只能是POST请求
发送的数据量少，并且需要更加简洁的API
该请求的优先级较低，不会与其他HTTP请求竞争资源
兼容性较好，除了IE不支持

4. ping

足够简单，仅依靠HTML就能完成，无需借助JavaScript
不会阻塞页面后续行为，与navigator.sendBeacon()类似；并且支持跨域
目前支持者a标签，其他元素设置ping属性是没有效果的
只能是POST请求，不能发送GET请求
无法自定义请求数据
兼容性很好，除了IE不支持，FireFox默认未启用，需要再FireFox设置中开启
```
