const { promisify } = require("util");
const path = require("path");

const download = promisify(require("download-git-repo"));
const open = require("open");

const { vueRepo } = require("../config/repo-config");
const { commandSpawn } = require("../util/terminal");
const { compile, writeToFile, createDirSync } = require("../util/utils");

// 创建项目的action
const createProjectAction = async (project) => {
  console.log("欢迎使用zjt 脚手架！😊");

  // 1. clone项目
  console.log("正在克隆项目，请稍候...");
  await download(vueRepo, project, { clone: true });

  // 2. 执行 npm install
  console.log("项目克隆完成，正在安装依赖，请稍候...");
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  await commandSpawn(command, ["install"], { cwd: `./${project}` });

  // 3. 运行 npm run serve
  console.log("依赖安装完成，正在启动项目，请稍候...");
  commandSpawn(command, ["run", "serve"], { cwd: `./${project}` });

  // 4. 打开浏览器
  open("http://localhost:8080");
};

// 添加组件的action
const addComponentAction = async (name, dest) => {
  // 1. 编译ejs模版 result
  const result = await compile("vue-component.ejs", { name, lowerName: name.toLowerCase() });

  // 2. 将result写入到.vue文件中
  const targetPath = path.resolve(dest, `${name}.vue`);
  writeToFile(targetPath, result);
};


// 添加组件和路由的action
const addPageAndRouteAction = async (name, dest) => {
  // 1. 编辑ejs模版
  const nameObj = { name, lowerName: name.toLowerCase() };
  const pageResult = await compile("vue-component.ejs", nameObj);
  const routeResult = await compile("vue-router.ejs", nameObj);

  // 2. 写入文件
  // 判断path是否存在，如果不存在，创建对应的文件夹
  const targetPath = path.resolve(dest, name.toLowerCase());
  if (createDirSync(targetPath)) {
    const targetPagePath = path.resolve(targetPath, `${name}.vue`);
    const targetRoutePath = path.resolve(targetPath, "router.js");
    writeToFile(targetPagePath, pageResult);
    writeToFile(targetRoutePath, routeResult);
  }
}

// 添加store的action
const addStoreAction = async (name) => {
  // 1. 编译ejs模版
  const storeResult = await compile("vue-store.ejs", {});
  const typesResult = await compile("vue-types.ejs", {});

  // 2. 创建文件
  const targetPath = path.resolve("src/store/modules", name);
  if (createDirSync(targetPath)) {
    const targetStorePath = path.resolve(targetPath, "index.js");
    const targetTypesPath = path.resolve(targetPath, "types.js");
    writeToFile(targetStorePath, storeResult);
    writeToFile(targetTypesPath, typesResult);
  }
}

module.exports = {
  createProjectAction,
  addComponentAction,
  addPageAndRouteAction,
  addStoreAction,
};
