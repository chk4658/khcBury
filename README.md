# khc-bury [![npm license](https://img.shields.io/npm/l/@xmon/bury.svg?sanitize=true)](https://github.com/darkXmo/bury/blob/main/LICENSE)

# Fix & New

### 不完全依赖[data-]做 filter 条件

```
元素绑定了onclick || addEventListener || [data-]

chrome devTools 可以使用getEventListeners() 获取元素绑定的事件，但无法在js执行

重构原型的 addEventListener 和 removeEventListener 实现 getEventListeners() ： 获取target元素绑定的事件

初始化后立即执行overrideEventListeners
```

### 关闭 tab 或浏览器不触发 Leave

```
todo
```
