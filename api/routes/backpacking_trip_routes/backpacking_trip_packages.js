const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Backpacking_Trip_Package=require('../../models/Backpacking_Trip/backpacking_trip_package');
const multer=require('multer');
const fs = require("fs");
var randomstring = require("randomstring");

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },

    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});

const upload=multer({storage:storage});

//route for uchat
router.get('/get_backpacking_trip_packages/:backpacking_trip_common_city_id',(req,res)=>{

    Backpacking_Trip_Package.find({backpacking_trip_common_city_id:req.params.backpacking_trip_common_city_id,period:'new'})
    .exec()
    .then(result=>{
        res.json({
            data:result,
            count:result.length
        });
    })
    .catch(err=>{
        res.json({
            error:err
        });
    });

});

//route for retool admin panel
router.get('/get_backpacking_trip_packages',(req,res)=>{
    Backpacking_Trip_Package.find()
    .populate('backpacking_trip_common_city_id')
    .exec()
    .then(result=>{
        res.json({
            data:result,
            count:result.length
        });
    })
    .catch(error=>{
        res.json({
            error:err
        });
    });
});

//route for retool admin panel
router.post('/post_backpacking_trip_package',upload.fields([{name:'package_front_image',maxCount:1},{name:'package_details_pdf',maxCount:1}]),(req,res)=>{


    const actual_package_id='BATP'+String(randomstring.generate({
        length:11,
        charset:'numeric'
    }));
    

    const newData=new Backpacking_Trip_Package({

        _id:mongoose.Types.ObjectId(),
        package_id:actual_package_id,
        backpacking_trip_common_city_id:req.body.backpacking_trip_common_city_id,
        package_front_image_path:req.files.package_front_image[0].path,
        package_details_web_url:req.body.package_details_web_url,
        package_details_pdf_path:req.files.package_details_pdf[0].path,
        package_name:req.body.package_name,
        package_description:req.body.package_description,
        package_number_of_days:req.body.package_number_of_days
    });

    newData.save()
    .then(result=>{
        res.json({
            message:'Data saved successfully',
            data:result
        });
    })
    .catch(err=>{
        res.json({
            error:err
        });
    });
});


module.exports=router;