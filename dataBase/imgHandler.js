
const Img = require('./mongoose').Img;
const multer = require('koa-multer');
const qiniu = require('qiniu');
const uuid = require('node-uuid');

//multer配置
//存为buffer
var storage = multer.memoryStorage();
var multerConf = multer({
    storage: storage,
    limits:{
        fileSize:2097152 //2M
    },
    fileFilter:function(req, file, cb){
        var type = '|' + file.mimetype.slice(file.mimetype.lastIndexOf('/') + 1) + '|';
        var fileTypeValid = '|jpg|png|x-png|jpeg|'.indexOf(type) !== -1;
        cb(null, !!fileTypeValid);
    }
}).single('imgFiles');
//图片上传
var Add_img = async (ctx) => {
    let req,res;
    await multerConf(ctx).then(rslt=>{
        req = ctx.req;
        res = ctx.res
        return ctx.req
    }).catch(err=>{
        throw Error('multer出错');
    })
    //七牛配置---生成token
    var accessKey = 'Y_k8Ymui6QCIKcg_dENCZR3TGgZ_aP65jwnj3KCU';
    var secretKey = 'oWRin6KjO5dD1SGmjT9jIRaBG0d02lX5AdFwWpqn';
    //var bucket = 'linwens-img';
    var bucket = req.body.bucketType === 'galleryImg'?'linwens-img':'blog-img';//配置上传不同传出空间
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: bucket,
        returnBody: '{"key":"$(key)","hash":"$(etag)","width":"$(imageInfo.width)","height":"$(imageInfo.height)","model":"$(exif.Model.val)","iso":"$(exif.ISOSpeedRatings.val)","shutter":"$(exif.ExposureTime.val)","aperture":"$(exif.FNumber.val)","Flength":"$(exif.FocalLength.val)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    //----找到七牛机房
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;

    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = req.file.originalname;

    if(req.file&&req.file.buffer){
        return new Promise((resolve, reject)=>{ // 用promise封装，才能被上层接收
            formUploader.put(uploadToken, key, req.file.buffer, putExtra, (respErr, respBody, respInfo)=>{
                if (respInfo.statusCode == 200) {
                    var exifObj = {};
                        exifObj.model = respBody.model;
                        exifObj.iso = respBody.iso;
                        exifObj.shutter = respBody.shutter;
                        exifObj.aperture = respBody.aperture;
                        exifObj.Flength = respBody.Flength;
                    resolve({
                        res_code:'0',
                        res_msg:'上传成功',
                        size:respBody.width+'x'+respBody.height,
                        exif:exifObj,
                        backUrl:(bucket==='linwens-img'?'http://osurqoqxj.bkt.clouddn.com/':'http://otvt0q8hg.bkt.clouddn.com/')+respBody.key
                    })
                } else {
                    console.log('=============================');
                    console.log(respInfo.statusCode);
                    console.log(respBody);
                    throw new Error('七牛返回不正常')
                }
            })
        })
        
    }
}
//图片信息存入数据库
var Save_img_info = async (ctx) => {

}
//获取图片列表(需要做缓存处理)
var Get_img_list = async (ctx) => {

}
//图片删除
var Del_img = async (ctx) => {

}
//图片详情获取
var Img_detail = async (ctx) => {
    let req = ctx.req;
    try{
        var rslt = await Img.find({gid:req.query.gid}).exec()
    }catch(err){
        throw Error('查询图片出错')
    }

}
module.exports = {
    Add_img: Add_img,
    Save_img_info: Save_img_info,
    Get_img_list: Get_img_list,
    Del_img: Del_img,
    Img_detail: Img_detail,
}
//图片信息存入数据库
exports.ImgInfosave = function(req, res, next){
    var img = new Img({
        time: Math.round(Date.parse(new Date())/1000),
        title:req.body.title,
        desc: req.body.desc,
        size: req.body.size,
        url: req.body.url,
        exif:JSON.parse(req.body.exif),
        type:req.body.type,
        gid:uuid.v1()
    });
    //判断是修改还是新加
    if(req.body.option&&req.body.option=='modify'){
        Img.update({gid:req.body.gid}, {title: req.body.title,desc:req.body.desc})
        .then((data)=>{
            res.json({
                res_code:1,
                res_msg:'图片信息修改成功'
            })
        })
        .catch((err)=>{
            console.log(err);
            res.json({
                res_code:4,
                res_msg:'图片信息修改失败'
            })
        })
    }else{
        Img.find({url:req.body.url})
        .then((data)=>{
            if(data&&data!=''){
                return Promise.reject('图片信息已存在');
            }else{
                return img
            }
        })
        .then((img)=>{
            img.save()
            .then((data)=>{
                res.json({
                    res_code:1,
                    res_msg:'图片信息保存成功'
                })
            })
            .catch((err)=>{
                console.log(err);
                res.json({
                    res_code:4,
                    res_msg:'图片信息保存失败'
                })
            })
        })
        .catch((err)=>{
            console.log(err);
            res.json({
                res_code:4,
                res_msg:err
            })
        })
    }
}
//获取图片列表(需要做缓存处理)
exports.Getimglist = function(req, res, next){
    var schWord = req.query.schWord?req.query.schWord:null,
        curPage = req.query.curPage?parseInt(req.query.curPage):1,
        pageSize = req.query.pageSize?parseInt(req.query.pageSize):10,
        imgType = req.query.dataType?req.query.dataType:'galleryImg',
        findParams = {'type':imgType};//只筛选摄影作品 add by lws 2017.9.28
    if(schWord){//标题，正文，标签内包含关键字(js的RegExp对象)
        var schRegExp = new RegExp(schWord,"i");
        findParams = {"$or":[{'desc':schRegExp}], 'type':imgType};//图片搜索只根据图片描述进行搜索
    }
    Img.count(findParams)
    .then((total)=>{
        Img.find(findParams)
        .skip((curPage-1)*pageSize)
        .limit(pageSize)
        .sort({time:-1})
        .then((data)=>{
            if(data&&data!=''){
                var galleryImglist = [];
                for(var i = 0;i<data.length;i++){
                    if(data[i].type ===imgType){
                        galleryImglist.push(data[i]);
                    }
                }
                res.json({
                    res_code:1,
                    dataList:galleryImglist,
                    page:curPage,
                    page_size:pageSize,
                    total:total
                })
            }else{
                res.json({
                    res_code:2,
                    dataList:data,
                    page:curPage,
                    page_size:pageSize,
                    total:0,
                    res_msg:'这题材我还没拍'
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            res.json({
                res_code:4,
                res_msg:'图片列表数据出错'
            })
        })
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            res_code:4,
            res_msg:'获取图片总条数出错'
        })
    });
}
//图片删除
exports.RemoveImg = function(req, res, next){
    Img.remove({gid:req.body.gid})
    .then((data)=>{
        if(data&&data!=''){
            res.json({
                res_code:1,
                res_msg:'图片删除成功'
            })
        }else{
            res.json({
                res_code:2,
                res_msg:'图片不存在'
            })
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            res_code:4,
            res_msg:'图片删除出错'
        })
    });
};
//图片详情获取
exports.Getimginfo = function(req, res, next){
    Img.find({gid:req.query.gid})
    .then((data)=>{
        if(data&&data!=''){
            res.json({
                res_code:1,
                imgInfo:{
                    time:data[0].time,
                    title:data[0].title,
                    desc:data[0].desc?data[0].desc:'获取的图片没有描述',
                    size: data[0].size,
                    url:data[0].url,
                    exif:data[0].exif,
                    type:data[0].type
                }
            })
        }else{
            res.json({
                res_code:2,
                res_msg:'图片不存在'
            })
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            res_code:4,
            res_msg:'获取图片详情错误'
        })
    });
};