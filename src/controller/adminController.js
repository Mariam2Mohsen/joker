const pool = require("../config/db")



exports.getPendingProviders = async(req,res)=>{

try{

const [providers] = await pool.query(

`SELECT Users_id, Full_Name, Email, City, phone_number
FROM users
WHERE role_id = 4
AND account_status = 'pending'`

)

res.json({
success:true,
data:providers
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}


exports.approveProvider = async(req,res)=>{

try{

const id = req.params.id

const [result] = await pool.query(

"UPDATE users SET account_status='approved' WHERE Users_id=?",
[id]

)

if(!result.affectedRows){

return res.status(404).json({
success:false,
message:"Provider not found"
})

}

res.json({
success:true,
message:"Provider approved"
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}



exports.rejectProvider = async(req,res)=>{

try{

const id = req.params.id

await pool.query(

"UPDATE users SET account_status='rejected' WHERE Users_id=?",
[id]

)

res.json({
success:true,
message:"Provider rejected"
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}



exports.getPendingServices = async(req,res)=>{

try{

const [services] = await pool.query(

`SELECT 
service_id,
service_name,
description,
price,
provider_id
FROM provider_services
WHERE status='pending'`

)

res.json({
success:true,
data:services
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}



exports.approveService = async(req,res)=>{

try{

const id = req.params.id

await pool.query(

"UPDATE provider_services SET status='approved' WHERE service_id=?",
[id]

)

res.json({
success:true,
message:"Service approved"
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}



exports.rejectService = async(req,res)=>{

try{

const id = req.params.id

await pool.query(

"UPDATE provider_services SET status='rejected' WHERE service_id=?",
[id]

)

res.json({
success:true,
message:"Service rejected"
})

}catch(err){

res.status(500).json({
success:false,
message:err.message
})

}

}