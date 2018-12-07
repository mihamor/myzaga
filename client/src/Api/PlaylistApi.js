class PlaylistApi{
    
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
        static async getPlaylists(page, search_str, user){
            user = user ? user : "";
            let result = {playlists:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'GET';
                let response = await fetch(`${this.getHostName()}/api/v3/playlists?user=${user}&page=${page}&search=${search_str}`, reqOptions);
                
                let data = await response.json();
                if(data.err) throw new Error(data.err);
                // console.log(data);
                result.playlists = data;
            }catch(error){
    
                result.err = error;
                // console.log(error);
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
    
        static async getById(id){
            let result = {playlist:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'GET';
                let response = await fetch(`${this.getHostName()}/api/v3/playlists/${id}`, reqOptions);
    
                let data = await response.json();
                if(data.err)throw new Error(data.err);
    
                // console.log(data);
                result.playlist = data;
            }catch(error){
                // console.log(error); 
                result.err = error;
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
        static async updatePlaylist(playlist){
            let result = {oldPlaylist:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                let id = playlist._id;
                playlist.tracks = JSON.stringify(playlist.tracks);
                const bodyData = new  URLSearchParams(playlist);
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'PUT';
                reqOptions.body = bodyData;
                let response = await fetch(`${this.getHostName()}/api/v3/playlists/${id}`, reqOptions);
    
                let data = await response.json();
                if(data.err)throw new Error(data.err);
    
                // console.log(data);
                result.oldPlaylist = data;
            }catch(error){
                // console.log(error); 
                result.err = error;
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
    
        static async getUpdateData(id){
            let result = {data:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'GET';
                let response = await fetch(`${this.getHostName()}/api/v3/playlists/${id}/update`, reqOptions);
    
                let data = await response.json();
                if(data.err)throw new Error(data.err);
    
                // console.log(data);
                result.data = data;
            }catch(error){
                // console.log(error); 
                result.err = error;
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
        static async newPlaylist(playlist){
            let result = {newPlaylist:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'POST';
                
                playlist.tracks = JSON.stringify(playlist.tracks);
                const bodyData = new  URLSearchParams(playlist);
                reqOptions.body = bodyData;
                let response = await fetch(`${this.getHostName()}/api/v3/playlists`, reqOptions);
    
                let data = await response.json();
                if(data.err)throw new Error(data.err);
    
                // console.log(data);
                result.newPlaylist = data;
            }catch(error){
                // console.log(error); 
                result.err = error;
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
    
        static async deletePlaylist(id){
            let result = {oldPlaylist:null, err:null};
            const jwt = localStorage.getItem('jwt');
            if(jwt)
            try{
                const reqOptions = this.getOptions(jwt);
                reqOptions.method = 'DELETE';
                let response = await fetch(`${this.getHostName()}/api/v3/playlists/${id}`, reqOptions);
                
                let data = await response.json();
                if(data.err)throw new Error(data.err);
    
                // console.log(data);
                result.oldPlaylist = data;
            }catch(error){
                // console.log(error); 
                result.err = error;
            }
            else result.err = "Missing JWT, login first";
            return result;
        }
    }
    
    export default PlaylistApi;