import fetch from 'cross-fetch';
class UserApi {
    static setHostName(host){
        //this.getHostName = () => host;
    }
    static getHostName(){
        return "";
    }
    static getOptions(jwt){
        // // console.log(jwt);
        return {
            headers: { Authorization: `Bearer ${jwt}`, },
            mode: "cors"
        };
    }
    static async getAuthUser(){
        let user,err = null;
        const jwt = localStorage.getItem('jwt');
        if(jwt) try{
          //  console.log("trying fetch")
            let response = await fetch(`${this.getHostName()}/api/v3/me`, this.getOptions(jwt));
          //  console.log("fetched");
            const data = await response.json();
            if(data.err) throw new Error(data.err);
            user = data;
        }catch(error){
            err = error;
        //     console.log(error);
        }//else console.log("JWT is missing. Log in first");
         return {user, err};
    }
    
    static async getUsers(page, search_str){
        let result = {users:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/api/v3/users?page=${page}&search=${search_str}`, reqOptions);
    
            let data = await response.json();
            if(data.err) throw new Error(data.err);

            // // console.log(data);
            result.users = data;
        }catch(error){

            result.err = error;
            // // console.log(error);
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
    static async getById(id){
        let result = {user:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/api/v3/users/${id}`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // // console.log(data);
            result.user = data;
        }catch(error){
            // // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async updateUser(id, formData){
        let result = {oldUser:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'PUT';
            reqOptions.body = formData;
            let response = await fetch(`${this.getHostName()}/api/v3/users/${id}`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // // console.log(data);
            result.oldUser = data;
        }catch(error){
            // // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async getAdminMenu(){
        let result = {selected:null, not_selected:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/admin_menu`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // // console.log(data);
            result.selected = data.selected;
            result.not_selected = data.not_selected;
        }catch(error){
            // // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async updateAdmins(selected){
        let result = {status:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            selected = JSON.stringify(selected);
            const bodyData = new  URLSearchParams({admins: selected});
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'POST';
            reqOptions.body = bodyData;
            console.log(selected);
            let response = await fetch(`${this.getHostName()}/admin_menu`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.status = data.status;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    
    /*
    static async getList(page=1, search_str=""){
        let users = null;
        const reqOptions = getHeaders();
        if(reqOptions)
        try{
            let response = await fetch(`/api/v3/users?page=${page}&search=${search_str}`, reqOptions);
            let data = await response.json()
            if(data.err) throw new Error(data.err);
            users = data;
        }catch(err){
            // // console.log(err);
        }
        return users;
    }
    static async getById(id){
        let user = null;
        const reqOptions = getHeaders();
        if(reqOptions)
        try{
            let response = await fetch(`/api/v3/users/${id}`, reqOptions);
            let data = await response.json();
            if(data.err)throw new Error(data.err);
            user = data;
        }catch(err){
            // // console.log(err);
        }
        return user;
    }*/
};

export default UserApi;