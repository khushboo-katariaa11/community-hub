let express= require('express');
let app = express();   
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
var methodOverride = require('method-override')
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const { faker } = require('@faker-js/faker');
function createRandomUser() {
    return [
     faker.string.uuid(),
      faker.internet.username(), // before version 9.1.0, use userName()
      faker.internet.email(),
     
      faker.internet.password()
    
    ];
  }
  // create the connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'user',
    password: 'khush1124'
  }); 


  //INSERTING DUMMY DATA TO DATABSE:
// let data=[];
// for (let i = 0; i < 100; i++) {
//   data.push(createRandomUser());
// }

// let q="INSERT INTO userinfo (id,username,email,password) VALUES ?";
// conn.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log("Data inserted");
// })

    
let port=3030;
app.listen(port,()=>{
    console.log("server is listing on port 3030");
});

//index route 
app.get('/',(req,res)=>{
    
    let q="select count(*) from userinfo";
    conn.query(q,(err,result)=>{
        let record= result[0]['count(*)'];
        res.render("home",{record});
    });
});
//information route 
app.get('/users',(req,res)=>{
    
    let q="select * from userinfo";
    conn.query(q,(err,result)=>{
        let record= result;
        
        res.render("allinfo",{record});
    });
});

//edit route
app.get("/users/:id/edit",(req,res)=>{
    let {id}=req.params;
   
    let q=`select * from userinfo where id="${id}"`;
    conn.query(q,(err,result)=>{
       
       let target=result[0];
        res.render("edit",{target});
      
    })
    
})
app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let { username } = req.body;

    let q = `UPDATE userinfo SET username = ? WHERE id = ?`;
    conn.query(q, [username, id], (err, result) => {
        

        console.log("Update Result:", result);
        res.redirect("/users");
    });
});
app.delete("/users/:id", (req, res) => {
    let { id } = req.params;
    

    let q = `delete from userinfo WHERE id = ?`;
    conn.query(q,id, (err, result) => {
        console.log("Update Result:", result);
        res.redirect("/users");
    });

  

});

//create user route

app.get("/users/new",(req,res)=>{
    res.render("new");
});
app.post("/users",(req,res)=>{
    let{username,id,password,email}=req.body;
    let q="INSERT INTO userinfo (id,username,email,password) VALUES ?";
    conn.query(q,[[[id,username,email,password]]],(err,result)=>{
        if(err) throw err;
        res.redirect("/users");
    })

})
