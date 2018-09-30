const fs = require('fs');
class Storage {

    //static field to overdrive
    static storage_path(){return '.';};
    constructor(){}

    static check_params(x){return true;}
    // static functions to access storage
    static getById(id) {
        if (!valid_number(id)) throw new Error("Invalid arguments");
        let entities = this.getAll();
        return search_for_id(id, entities);
    }

    static update(x) {
        if (!this.check_params(x)) throw new Error("Invalid argument");
        let data = getStorageData(this.storage_path());
        let entities = data.items;

        let old_ent = search_for_id(x.id, entities);
        if (!old_ent)
            throw new Error("Entity is not exist. Try insert() instead");
        assign_object_value(x, old_ent);
        save_to_storage(data, this.storage_path());
    }

    static insert(x) {
        if (!this.check_params(x)) throw new Error("Invalid argument");
        let data = getStorageData(this.storage_path());
        let entities = data.items;
        let newId = data.nextId;
        data.nextId++;
        x.id = newId;
        data.items.push(x);
        save_to_storage(data, this.storage_path());
        return newId;
    }

    // returns an array of all users in storage
    static getAll() {
        let data = getStorageData(this.storage_path());
        return data.items;
    }
    static setStoragePath(filename) {
        if (typeof filename === 'string'
            && fs.existsSync(filename))
            this.storage_path = function () { return filename ;};
        else throw new Error("Invalid storage path");
    }

    static delete(id) {
        if (!valid_number(id))
            throw new Error("Invalid argument");
        let data = getStorageData(this.storage_path());
        let entities = data.items;
        let result = remove_element(id, entities);
        if(!result) throw new Error("No such user");
        save_to_storage(data, this.storage_path());
    }

};

function save_to_storage(content, storage_path) {
    let content_json = JSON.stringify(content, null, 4);
    fs.writeFileSync(storage_path, content_json);
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
