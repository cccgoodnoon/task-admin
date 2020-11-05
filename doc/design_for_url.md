# **模块分解与组织**

 

[TOC]

 

## 0 名词术语

 

## 1 概要（2018.07.13）

 本文档是概要设计文档的一部分，存放在 doc\design(outline)\module下面。

它与Excel版文档配合，陈述系统中的模块功能分解与组织



## 2 Html模块分解与组织（2020.05.05）

### 2.1 URL的基本分配原则和组织体系

### 1 Web应用下面直接分模块

| 类别   | URL                                                          |
| ------ | ------------------------------------------------------------ |
| 主页   | http://<domain_name>[:port]/<application_name>/<index>       |
|        | 例如：http://<domain_name>[:port]/openedu/index.html/#/home  |
| 模块   | http://<domain_name>[:port]/<application_name>/index.html/#/<module_name> (对单页面应用)<br />http://<domain_name>[:port]/<application_name>/<module_name>.html (对简单的单页面应用)<br />http://<domain_name>[:port]/<application_name>/<module_name>/index.html (对复杂的多页面应用) |
| 子模块 | http://<domain_name>[:port]/<application_name>/index.html/#/<module_name>/<sub_module_name> (对单页面应用)<br />http://<domain_name>[:port]/<application_name>/<module_name>/#/<sub_module_name> (对多页面应用) |

对简单的、规模较小的单页面应用（SPA），可采用上述URL分配方式。

在系统不是很复杂时，模块应首先采用并入index.html的方式而不是采用独立html的方式以简化开发。

所有模块有相同的前缀URL：

http://<domain_name>[:<port>]/<application_name>

但是应注意：前缀 URL会根据配置有所不同，因此，代码中一般不应使用绝对路径，包括假设的域名和应用名称。但是层级是固定的，以方便用.和..这些方式来引用。

对子模块：一般不独立html，而是作为模块html的一部分实现。

注：我们较少采用这种方式，除非是一些学习、测试用途的小规模应用。



 

### 2 Web主应用下面进一步区分子应用（本项目要求采用 ）

实际中经常要求按照用户身份或应用场景区分不同子应用，例如anon专用于匿名用户和一般登录用户，u专用于一般登录用户的后台，admin专用于管理员，su专用于超级用户等等。子应用anon一般是对外的，admin和su一般仅在管理区方可使用，不对外，这些安全性约束可在部署时即实现。

| 主页                                 | http://<domain_name>[:port]/<application_name>/<index>       |
| ------------------------------------ | ------------------------------------------------------------ |
| 按照常用用户角色和使用场景划分子应用 | 面向公网用户特别是匿名用户<br/>http://<domain_name>:<port>/<application_name>/anon  <br/>面向一般登录用户 <br>http://<domain_name>:<port>/<application_name>/u <br>面向管理员用户 <br>http://<domain_name>:<port>/<application_name>/admin <br>面向学生用户 <br>http://<domain_name>:<port>/<application_name>/student<br>面向教师用户 <br>http://<domain_name>:<port>/<application_name>/teacher<br/>面向校友用户 <br>http://<domain_name>:<port>/<application_name>/alumni<br/>面向超级管理员用户 <br>http://<domain_name>:<port>/<application_name>/su<br/>面向一般性学习 <br> http://<domain_name>:<port>/<application_name>/learn <br>一般情况下，每个子应用（sub application）所采用技术路线、应用场景和风格不同，所以经常独立开发和测试，很少有交集，仅在部署时合并到一个大的Web站点应用中。 |
| 模块                                 | 在前面子应用URL基础上再拼接模块路径 <module_name>，既可以作为合并进子应用html作为其一个component，也可以独立html页形态存在。大部分情况下，整个子应用是一个page。 |
| 子模块                               | 在前面模块URL基础上再拼接模块路径 <sub_module_name>，子模块一般作为模块html的一个component，不以独立的html页面形态存在。 |
|                                      |                                                              |
|                                      |                                                              |
|                                      |                                                              |

 

要点

- 整个Web主应用（简称应用Application）可以划分成多个子应用，子应用的来源有：多页面应用（MPA）中的每个html文件；历史继承的老版本项目的html；第三方的html。

- 每个子应用（sub-application）在开发阶段是一个独立的前端工程，可以有自己的源代码和资源文件夹，以及自己的风格与技术路线，不同子应用之间在开发上可以完全独立，并支持独立发布。

- 每个子应用在部署之后就是存放在Web主应用根目录下的一个个子文件夹，它可以包含自己的css、js、image等assets。对部分的第三方子应用，仅在迫不得已的情况下，才允许部署到根目录下。尽管整个Web主应用的URL前缀（  http://<domain_name>[:port]/<application_name> ）会根据配置不同而不同，特别是<application_name>部分存在不确定性，但是子应用的名称（anon、admin、su等）是可以在开发时固定下来的，不因部署和配置不同而不同。但即使如此，也要充分注意各种资源的引用问题，应尽量采用相对路径以解决URL前缀中<application_name> 待确定的问题。

- 对子应用下属的模块（module），根据子应用和模块的复杂程度，可以作为子应用html的一部分存在（SPA方式），也可以分配独立的html，但是在不是很复杂时优先SPA方式。

- 对模块下属的子模块（sub-module），优先作为子应用或模块的一部分存在（SPA），一般没有必要作为独立html存在。

  

这种URL分配规则适合集成各种第三方子应用，适合我们的现状，故本项目要求采用如上URL分配。

例：

http://47.119.119.23:8085/openedu/admin/task/index.html

(可以简化为http://47.119.119.23:8085/openedu/admin/task/)

http://47.119.119.23:8085/openedu/anon/task/index.html

http://<domainname>/insight/admin/member/index.html

http://<domainname>/dm365/anon/dataset/index.html

 

反例

http://47.111.234.116/openedu/list

list这种命名不应出现，因为index.html或index通常已经起到了显示表格数据的作用。

 

## 附：URL命名规范

 

**主页的命名**

http://47.111.222.116/openedu/admin

http://47.111.222.116/openedu/admin/#/home

 

**url****的命名应优先采用名词**

一般不采用动词。即要体现url是资源的统一标识符这一本质，而不是动作或行为的标识。

例：

http://47.111.222.116/openedu/admin/#/task

http://47.111.222.116/openedu/admin/#/task/424 （424表示单个资源的标识符）

（等效于http://47.111.222.116/openedu/admin/#/task/424/viewer ）

http://47.111.222.116/openedu/admin/#/task/new （调用editor新增对象）

http://47.111.222.116/openedu/admin/#/task/424/editor (调用editor修改对象)

反例

http://47.111.222.116/openedu/admin/#/task/create

 

**url****应仅包含小写字母和url****允许的常用字符，不应出现大写、空格、中文**。

 

 
2020.06.14
假定
AppRootUrl = http://47.111.222.116/openedu/admin

对应到Task模块
显示Task主界面
http://47.111.222.116/openedu/admin/#/task/

查看任务详情
http://47.111.222.116/openedu/admin/#/task/{id}
本质上就是调用taskviewer显示详情，尽管URL中没有出现viewer字样

显示新增或编辑任务
http://47.111.222.116/openedu/admin/#/task/new
http://47.111.222.116/openedu/admin/#/task/{id}/editor

上传文件页面
http://47.111.222.116/openedu/admin/#/task/new/uploader
http://47.111.222.116/openedu/admin/#/task/{id}/editor/uploader

 

 

 