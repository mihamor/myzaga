class CommentApi {

    static setHostName(host){
       // this.getHostName = () => host;
    }
    static getHostName(){
        return "";
    }
    static getOptions(jwt){
        console.log(jwt);
        return {
            headers: { Authorization: `Bearer ${jwt}`, },
            mode: "cors"
        };
    }
    static async newComment(commnent, trackId){
        let result = {newComment:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'POST';
            const bodyData = new URLSearchParams(commnent);
            reqOptions.body = bodyData;
            let response = await fetch(`${this.getHostName()}/api/v3/comments/${trackId}`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.newComment = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async deleteComment(id, trackId){
        let result = {oldComment:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'DELETE';
            reqOptions.body = new URLSearchParams({trackId});
            let response = await fetch(`${this.getHostName()}/api/v3/comments/${id}`, reqOptions);
            
            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.oldComment = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
}
export default CommentApi;