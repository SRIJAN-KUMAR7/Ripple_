export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All fields are required"});    
        }
        if(password.length<6){ return res.status(400).json({message:"Password must be at least 6 characters"});    }
         //validating emails using regex
        
         const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});    
         }

         
    }catch(err){

    }
}