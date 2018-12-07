import fetch from 'cross-fetch'
class TracksApi{

    static setHostName(host){
        //this.getHostName = () => host;
    }
    static getHostName(){
        return "";
    }
    static getOptions(jwt){
        // console.log(jwt);
        return {
            headers: { Authorization: `Bearer ${jwt}`, },
           // mode: "cors"
        };
    }
    static async getTracks(page, search_str){
        let result = {tracks:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/api/v3/tracks?page=${page}&search=${search_str}`, reqOptions);
    
            let data = await response.json();
            if(data.err) throw new Error(data.err);

            // console.log(data);
            result.tracks = data;
        }catch(error){

            result.err = error;
            // console.log(error);
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
    static async getAllTracks(){
        let result = {tracks:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/api/v3/tracks/all`, reqOptions);
    
            let data = await response.json();
            if(data.err) throw new Error(data.err);

            // console.log(data);
            result.tracks = data;
        }catch(error){

            result.err = error;
            // console.log(error);
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
    static async getById(id){
        let result = {track:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'GET';
            let response = await fetch(`${this.getHostName()}/api/v3/tracks/${id}`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.track = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
    static async updateTrack(track){
        let result = {newTrack:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            let id = track._id;
            const bodyData = new  URLSearchParams(track);
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'PUT';
            reqOptions.body = bodyData;
            let response = await fetch(`${this.getHostName()}/api/v3/tracks/${id}`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.newTrack = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async newTrack(formData){
        let result = {newTrack:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'POST';
            reqOptions.body = formData;
            let response = await fetch(`${this.getHostName()}/api/v3/tracks`, reqOptions);

            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.newTrack = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }

    static async deleteTrack(id){
        let result = {oldTrack:null, err:null};
        const jwt = localStorage.getItem('jwt');
        if(jwt)
        try{
            const reqOptions = this.getOptions(jwt);
            reqOptions.method = 'DELETE';
            let response = await fetch(`${this.getHostName()}/api/v3/tracks/${id}`, reqOptions);
            
            let data = await response.json();
            if(data.err)throw new Error(data.err);

            // console.log(data);
            result.oldTrack = data;
        }catch(error){
            // console.log(error); 
            result.err = error;
        }
        else result.err = "Missing JWT, login first";
        return result;
    }
}

export default TracksApi;