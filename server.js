const exp=require("express")

const app=exp() 

app.use(exp.json())

// require('dotenv').config()
//assign port numnrt
const port=process.env.PORT||5000;
app.listen(port, () => console.log("server listening on port 5000..."));
const path=require("path")

//connect react build
app.use(exp.static(path.join(__dirname,'./build')))


//for validating CORS policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//connect user api
const manageStudents=require("./src/APIS/students")
app.use("/students-api",manageStudents)

//connect to mongoclient
const mclient=require('mongodb').MongoClient

mclient
  .connect(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.15"
  )
  .then((dbRef) => {
    const dbObj = dbRef.db("nsstudyhall");
    const studentObj = dbObj.collection("students");
    app.set("studentObj", studentObj);
  })
  .catch((err) => console.log("Connection to Faculty-Portal DB - Failed"));


//middleware to deal with page refresh
const pageRefresh=(request,response,next)=>{
response.sendFile(path.join(__dirname,'./build/index.html'))
}
app.use("*",pageRefresh)


//create err handling middleware
const errHandler = (error, request, response, next) => {
response.send({ "error-message": error.message });
};
app.use(errHandler);