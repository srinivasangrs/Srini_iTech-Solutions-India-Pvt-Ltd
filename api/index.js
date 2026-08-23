const express=require("express"),cors=require("cors"),jwt=require("jsonwebtoken"),{Pool}=require("pg");
const app=express();app.use(cors());app.use(express.json());
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes("sslmode=require")?{rejectUnauthorized:false}:undefined});
const secret=process.env.JWT_SECRET||"dev-secret";
function auth(req,res,next){const t=(req.headers.authorization||"").replace("Bearer ","");try{req.user=jwt.verify(t,secret);next()}catch{res.status(401).json({message:"Invalid or expired token"})}}
app.get("/health",async(req,res)=>{try{await pool.query("select 1");res.json({status:"UP",database:"UP"})}catch(e){res.status(503).json({status:"DOWN"})}});
app.post("/api/contact",async(req,res)=>{const{name,email,phone,company,service,message}=req.body||{};if(!name||!email||!message)return res.status(400).json({message:"Name, email and message are required"});try{await pool.query("insert into contact_enquiries(name,email,phone,company,service,message) values($1,$2,$3,$4,$5,$6)",[name,email,phone||null,company||null,service||null,message]);res.status(201).json({message:"Thank you. Your enquiry has been submitted."})}catch(e){res.status(500).json({message:"Unable to save enquiry"})}});
app.post("/api/newsletter",async(req,res)=>{try{await pool.query("insert into newsletter_subscribers(email) values($1) on conflict(email) do nothing",[req.body.email]);res.status(201).json({message:"Subscribed successfully"})}catch(e){res.status(500).json({message:"Unable to subscribe"})}});
app.post("/api/admin/login",(req,res)=>{const u=process.env.ADMIN_USERNAME||"admin",p=process.env.ADMIN_PASSWORD||"ChangeMe@123";if(req.body.username!==u||req.body.password!==p)return res.status(401).json({message:"Invalid username or password"});res.json({token:jwt.sign({role:"ADMIN",username:u},secret,{expiresIn:"8h"})})});
app.get("/api/admin/enquiries",auth,async(req,res)=>{try{res.json((await pool.query("select * from contact_enquiries order by created_at desc")).rows)}catch(e){res.status(500).json({message:"Unable to load enquiries"})}});
module.exports=app;
