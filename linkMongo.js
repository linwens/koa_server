//获取应用配置文件信息
// import config from './config';
//链接数据库
//import mongoose from 'mongoose';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;//mongoose支持es6异步
mongoose.connect('mongodb://localhost:27017/mongodbTest');

mongoose.connection.on('error', function cb(){
	console.log("connection error");
});
mongoose.connection.once('open', function cb(){
	console.log("mongo working!");
});
module.exports =  mongoose;