import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)

     cb(null, file.originalname)   //for now my project i use this above code i use for in production grade project
  }
})

export const upload = multer({ 
    // storage: storage
    storage        //due to ES6 if both are same then we can write in this manner also
})

// export { upload }
