const fs = require('fs-promise');
const mongoose = require('mongoose');

const StorageSchema = new mongoose.Schema({
    addedAt: {type: Date, default: Date.now }
  });
  
  const StorageModel = mongoose.model('Storage', StorageSchema);



class Storage {

    //static field to overdrive
    static storage_path(){return '.';};

    static this_model(){ return StorageModel;};
    constructor(){}

    static check_params(x){return true;}
    // static functions to access storage
    static getById(id) {
        if(!valid_string(id) && typeof id !== "object")
            return Promise.reject(new Error(`Invalid in getById(${id}) arguments`));
        return this.this_model().findOne({ _id : id});
    }

    static isExist(id){
        let curr_model = this.this_model()
        return curr_model.find({_id: id})
            .catch(err =>{
                return Promise.reject(new Error("Entity was not found"));
            })
            .then(x => {
                if(x.length !== 0) return Promise.resolve(true);
                else return Promise.reject();
            })
    }
    static update(ent) {
        if(!this.check_params(ent)) 
            return Promise.reject(new Error("Invalid argument in update "+ this.this_model().modelName + ent.toString()));
        let curr_model = this.this_model();
        console.log(`${curr_model.modelName} UPDATE`);
        return curr_model.findOneAndUpdate({ _id: ent._id},ent, {upsert : true});
    }

    static insert(ent) {
        if(!this.check_params(ent))
            return Promise.reject(new Error(`Invalid argument in insert(${ent})`));
        let curr_model = this.this_model();
        return new curr_model(ent).save()
            .then(x => x._id);
    }

    // returns an array of all users in storage
    static getAll() {
        return this.this_model().find();
    }
    static setStoragePath(filename) {
        if (typeof filename === 'string'
            && fs.existsSync(filename))
            this.storage_path = function () { return filename ;};
        else throw new Error("Invalid storage path");
    }

    static delete(id) {
        if(!valid_string(id) && typeof id !== "object") 
            Promise.reject(new Error("Invalid argument"));
        let curr_model = this.this_model();
        return curr_model.findByIdAndRemove(id)
    }
};

function save_to_storage(content, storage_path) {
    let content_json = JSON.stringify(content, null, 4);
    return fs.writeFile(storage_path, content_json)
        .then(x => console.log(`The file has been saved`));
}

function valid_number(num) {
    return typeof num === 'number'
        && !isNaN(num);
}
function valid_string(str){
    return typeof str === 'string'
    && str.length != 0;
  }

function getStorageData(storage_path) {
    if (!fs.existsSync(storage_path))
        throw new Error("invalid storage path");
    let rawData = fs.readFileSync(storage_path);
    let data = JSON.parse(rawData);
    return data;
}

function remove_element(id, entities) {
    let index = 0;
    for (let ent of entities) {
        if (ent.id === id) {
            entities.splice(index, 1);
            return true;
        }
        index++;
    }
    return false;
}

function search_for_id(id, entities) {
    return entities.find(x => x.id === id);
}
function assign_object_value(from, to) {
    for (let key in from) {
        to[key] = from[key];
    }
}

module.exports = { Storage };
