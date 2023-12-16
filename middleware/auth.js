const isLogin= async(req,res,next)=>{
    try {
        if(req.session.user_id){
            next()
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);

    }
}

const isLogout= async(req,res,next)=>{
    try {

        console.log(req.session.user_id,"thisikl;a");
        if(req.session){
            res.redirect('/home')
        } else {
            next()
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    isLogin,
    isLogout
}