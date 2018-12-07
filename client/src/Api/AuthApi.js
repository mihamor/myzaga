import UserApi from './UserApi.js';
import fetch from 'cross-fetch';
class AuthApi {

    static setHostName(host){
        //this.getHostName = () => host;
    }
    static getHostName(){
        return "";
    }
    static async login(username, password){
        let res = {user:null, err:null};
        const bodyData = new  URLSearchParams({username: username, password: password});
        try{
            let authResult = await fetch(`${this.getHostName()}/auth/login`, 
                { 
                    mode: "cors", 
                    method: 'POST',
                    body: bodyData 
                }).then(x => x.json());
            // console.log(authResult);
            if(authResult.message) throw new Error(authResult.message);
            const jwt = authResult.token;
            localStorage.setItem("jwt", jwt);// save JWT
            res = await UserApi.getAuthUser();
        }catch(error){
            // console.log(error);
            res.err = error;
        }
        return res;
    }
    static async register(username, password){

        let response = {user: null, err:null};
        const bodyData = new  URLSearchParams({username: username, password: password});
        try{
            let authResult = await fetch(`${this.getHostName()}/auth/register`, 
                { mode: "cors", method: 'POST', body: bodyData })
                .then(x => x.json());
            // console.log(authResult);
            if(authResult.err) throw new Error(authResult.err);
            // console.log(authResult.user);
            response.user = authResult.user;
        }catch(err){
            // console.log(err);
            response.err = err.message;
        }
        return response;
    }
}

export default AuthApi;