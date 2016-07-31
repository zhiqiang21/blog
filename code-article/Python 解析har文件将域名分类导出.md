### 前言
作为程序员平时主要是使用 `shadowsocks` 作为代理工具的。`shadowsocks` 有个很明显的优点儿就是可以设置白名单和黑名单。白名单是会走`shadowsocks`的自动代理模式。

### 遇到的问题：

`shadowsocks` 代理是分白名单和黑名单的。当我访问某个网站，而恰好这个网站的域名和静态文件域名都在白名单里，访问这个网站的`http`请求就会自动走代理模式；

如果访问某个网站的域名没有在白名单里，就需要手动设置 **全局代理模式** ；这有一个缺点就是电脑的所有的网络访问都会走代理，如果这个时候访问国内的网站，就会很慢或者是打不开。

最好的办法就是编辑`shadowsocks`的`.ShadowsocksX/gfwlist.js`文件。将没办法走自动代理模式的域名添加到这个文件里面。但是一个网站的在显示完全，需要访问的域名不止一个，那么手动添加就会很麻烦。那么可不可以使用程序来实现呢？


### 需求分析：
1. 将网站的所有请求访问的域名分类导出；
2. 可以导出为`.txt`的文件，也可以直接打印在控制台；


### 怎么将所有的网络请求导出
1.打开`chrome`的开发者模式，并且将`shadowsocks` 设置为**全局代理模式**访问**自动代理模式**无法访问的网站；

2.在chrome的network面板，右键导出 `har`文件，保存到自己想要的位置；

如下图：
![](http://ww3.sinaimg.cn/large/698e22a9jw1f5wobmj6ptj20ou0g8jvs.jpg)




### 程序怎么运行：
按照提示运行程序：

**运行效果展示：**

![](http://ww1.sinaimg.cn/large/698e22a9jw1f5wobvx9v7j20t40rek2z.jpg)

### 代码分析：

因为 `har` 文件的内容就是一个`json`格式文件。所以就是读取文件的内容，并且将文件内容转化为`json`，将所有的请求的url分类写入一个数组，最后选择方式输出；

python主要代码如下：
```python
with open(filePath, 'r') as readObj:
        harDirct = json.loads(readObj.read())
        requestList = harDirct['log']['entries']

        for item in requestList:
            urlString = (item['request']['url'])

            start = urlString.index('://')
            tempStr = urlString[start + 3:]
            end = tempStr.index('/')
            resultStr = tempStr[:end]

            # 判断是否是www开头的域名
            if 'www' in resultStr:
                resultStr = resultStr[4:]
            if resultStr not in hostList:
                hostList.append(resultStr)

    if str(outputType) is '1':
        with open(outputPath, 'w') as ff:
            for item in hostList:
                ff.write('"' + item + '",' + '\n')
    else:
        print '=============host start=============='
        for item in hostList:
            print '"' + item + '",'

        print '=============host end================'

```
