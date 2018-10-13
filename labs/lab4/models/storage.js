const fs = require('fs');
class Storage {

    //static field to overdrive
    static storage_path(){return '.';};
    constructor(){}

    static check_params(x){return true;}
    // static functions to access storage
    static getById(id , callback) {
        this.getAll( (error, data) => {
            if(!valid_number(id)) callback(new Error("Invalid arguments"));
            else if(error) callback(error);
            else {
                let entities = data.items;
                callback(null, search_for_id(id, entities));
            }
        });
    }

    static update(x, callback) {
        this.getAll((error, data) => {
            if(!this.check_params(x)) callback(new Error("Invalid argument"));
            else if(error) callback(error);
            else {
                let entities = data.items;
                let old_ent = search_for_id(x.id, entities);
                if (!old_ent) {
                    callback(new Error("Entity is not exist"));
                    return;
                }
                assign_object_value(x, old_ent);
                save_to_storage(data, this.storage_path(), (err) =>{
                    callback(null);
                });
            }
        });
    }

    static insert(x, callback) {
        this.getAll((error, data) => {
            if(!this.check_params(x)) callback(new Error("Invalid argument"));
            else if(error) callback(error);
            else {
                let entities = data.items;
                let newId = data.nextId;
                data.nextId++;
                x.id = newId;
                data.items.push(x);
                save_to_storage(data, this.storage_path(), (err) =>{
                    callback(null, newId);
                });
            }
        });
    }

    // returns an array of all users in storage
    static getAll(callback) {
        fs.readFile(this.storage_path(), (error, file) => {
            if (error) callback(error);
            else callback(null, JSON.parse(file.toString()));
        });
    }
    static setStoragePath(filename) {
        if (typeof filename === 'string'
            && fs.existsSync(filename))
            this.storage_path = function () { return filename ;};
        else throw new Error("Invalid storage path");
    }

    static delete(id, callback) {
        this.getAll((error, data) => {
            if(!valid_number(id)) callback(new Error("Invalid argument"));
            else if(error) callback(error);
            else {
                let entities = data.items;
                let result = remove_element(id, entities);
                if(!result) {
                    callback(new Error("No such user"))
                    return;
                }
                save_to_storage(data, this.storage_path(), (err) =>{
                    callback(null);
                });
            }
        });
    }
};

function save_to_storage(content, storage_path, callback) {
    let content_json = JSON.stringify(content, null, 4);
    fs.writeFile(storage_path, content_json, (err) => {
        if(err) callback(err);
        else {            
            console.log(`The file has been saved`);
            callback(null);
        }
    });
}

function valid_number(num) {
    return typeof num === 'number'
        && !isNaN(num);
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
