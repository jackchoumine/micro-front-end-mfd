# webpack 5 模块联邦实现微前端

微前端的好处

1. 应用自治：各个应用相互独立，规模更小，更容易扩展、测试、构建、维护、排错、升级依赖等；
2. 团队自治：应用独立后，团队也会独立，减少很多人在一个巨石应用中同时开发，相互影响；
3. 技术无关：各个应用可选择不同的框架开发，**尽量保持统一**，否则应用之间交互会可能遇到麻烦，比如无
   法功能组件级别的代码；

缺点：

1. 代码规范统一比较困难（人员多、项目多），容易克服
2. 开发时可能需要同时运行多个项目，容易克服
3. 集成测试比较困难
4. UI、交互等容易不统一，容易克服

相比微前端的优点，缺点基本可忽略不计。

实施建议：

1. 一致的工作方法：团队成员要达成一致的工作方法，尤其是宿主应用和远程应用之间的**交互协议**，需要提
   取约定好。
2. 结合业务：在使用为微前端架构之前，思考业务划分和微前端给团队给来的价值
3. 遵从一致的代码标准，方便后期维护
4. 不要过度使用：微前端适合周期长、团队人员多（3 人以上）或者人员流动频繁的**多种业务（功能）聚合**的应用。

## 模块联邦 -- Module Federation

模块联邦是 webpack5 引入的特性，能**轻易实现**在两个使用 webpack 构建的项目之间**共享代码**，甚至**组合不同的应用为一个应用**。

[Module Federation 官网](https://module-federation.github.io/)

### 应用之间如何共享数据

`函数调用`,函数调用的特点:

1. 在定义处获取到参数，在调用出获取到返回值，**参数**和**返回值**将定义处和调用处联系起来。
2. 函数没有其他依赖，非常容易扩展。

## 参考

[Webpack 5 and Module Federation - A Microfrontend Revolution](https://dev.to/marais/webpack-5-and-module-federation-4j1i)

[Webpack 5 Module Federation: A game-changer in JavaScript architecture](https://indepth.dev/posts/1173/webpack-5-module-federation-a-game-changer-in-javascript-architecture)

[webpack 5 模块联邦实现微前端疑难问题解决](https://blog.csdn.net/mjzhang1993/article/details/115871597)
