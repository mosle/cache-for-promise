
class CacheForPromise{
    constructor(func,ttl=30){
        this.cacheStore = {}
        this.func = func;
        this.ttl = ttl * 1000;//seconds

        this.autoGc = false;
        this.gcInterval = 30 * 1000;
        this.gcTimer = null;

        this.keygen = null;
    }
    setAutoGc(interval = null){
        if(interval) this.gcInterval = interval;
        this.autoGc = true;
        clearTimeout(this.gcTimer);
        this.gcTimer = setTimeout(()=>{
            this.gc();
            this.gcTimer = this.setAutoGc(this.gcInterval);
        },this.gcInterval);
    }
    clear(){
        this.cacheStore = {}
    }
    gc(){
        let now = new Date;
        for(let key in this.cacheStore){
            const hit = this.cacheStore[key];
            const limit = hit.at;
            if(now > limit + this.ttl){
                delete this.cacheStore[key];
            }
        }
    }

    async exec(...args){
        this.gc();

        let key = this.keygen ? this.keygen.apply(null,args) : args.shift();
        let hit = this.cacheStore[key];
        let now = new Date;

        if(hit){
            const limit = hit.at;
            if(now > limit + this.ttl){
                delete this.cacheStore[key];
            }
            else{
                const result = hit.result;
                if(result){
                    return new Promise((resolve,reject)=>{
                        resolve(hit.result);
                    })
                }
                else if(hit.proc){
                    return new Promise((resolve,reject)=>{
                        hit.proc.then(result=>{
                            resolve(result);
                            delete hit.proc;
                        }).catch((error)=>{
                            reject(error);
                            delete hit.proc;
                        })/*.finally(()=>{
                            delete hit.proc;
                        })*/
                    })
                }
            }
        }
        
        const proc = this.func.apply(null,args);
        let object = {
            at:now.getTime(),
            proc:proc
        }
        this.cacheStore[key] = object;
        return new Promise((resolve,reject)=>{
            proc.then(result=>{
                object.result = result;
                resolve(result);
            }).catch(error=>{
                delete this.cacheStore[key];
                reject(error);
            })
        })

    }
}

export default CacheForPromise;
