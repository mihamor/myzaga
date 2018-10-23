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
        console.log(typeof id);
        if(!valid_string(id) && typeof id !== "object")
            return Promise.reject(new Error(`Invalid in getById(${id}) arguments`));


        console.log(id);
        return this.this_model().find({ _id : id});

        /*
        if(!valid_number(id)) 
            return Promise.reject(new Error("Invalid arguments"));
        return this.getAll()
            .then((data) => {
                let entities = data.items;
                return search_for_id(id, entities);
            });*/
    }

    static update(ent) {
        if(!this.check_params(ent)) 
            return Promise.reject(new Error("Invalid argument"));
        let curr_model = this.this_model()
        return curr_model.findOneAndUpdate({ _id: ent._id},ent, {upsert : true});
        /*
        if(!this.check_params(x)) 
            return Promise.reject(new Error("Invalid argument"));
        return this.getAll()
            .then((data) => {
                let entities = data.items;
                let old_ent = search_for_id(x.id, entities);
                if (!old_ent) 
                    return Promise.reject(new Error("Entity is not exist"));
                assign_object_value(x, old_ent);
                return save_to_storage(data, this.storage_path());
            });*/
    }

    static insert(ent) {
        if(!this.check_params(ent))
            return Promise.reject(new Error(`Invalid argument in insert(${ent})`));
        let curr_model = this.this_model();
        return new curr_model(ent).save()
        .then(x => x._id);
        /*
        if(!this.check_params(x))
            return Promise.reject(new Error("Invalid argument"));
        return this.getAll()
            .then((data) => {
                let entities = data.items;
                let newId = data.nextId;
                data.nextId++;
                x.id = newId;
                data.items.push(x);
                return Promise.all(
                    [  
                        newId,
                        save_to_storage(data, this.storage_path()),
                    ]);
            })
            .then(([newId, p2]) => newId);*/
    }

    // returns an array of all users in storage
    static getAll() {
        return this.this_model().find();

      /*  return fs.readFile(this.storage_path())
            .then(buffer => JSON.parse(buffer.toString()))*/
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
