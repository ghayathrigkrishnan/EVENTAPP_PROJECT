var mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://ghayu2006:ghayathri@cluster0.ec4cpsl.mongodb.net/Student?retryWrites=true&w=majority&appName=Cluster0"
)
.then(()=>{
    console.log("Db connect")
})
.catch((err)=>{
    console.log(err)
});