# cache-for-promise
simple cache for promise-returning-functions.

## Install
```
npm install cache-for-promise
```


## Usage

basic usage
```
import CacheForPromise from "cache-for-promise"

let anyPromiseFunction = (arg)=>{
    console.log("any promise function is called");
    return new Promise((resolve,reject)=>{
        return resolve(arg);
    })
}

const ttl = 10;//seconds
const cfp = new CacheForPromise(anyPromiseFunction,ttl);

let arg = 1;
cfp.exec("cache-key-1",arg).then(result=>{
    console.log(result);//1
})
//"any promise function is called" is output

arg = 2;
cfp.exec("cache-key-1",arg).then(result=>{
    console.log(result);//2
})
//key is same and cache is not expired, so "any promise function is called" is not output.

```

i.e with axios


```
import CacheForPromise from "cache-for-promise"
import axios from "axios"

const ttl = 10;//seconds
const cfp = new CacheForPromise(axios,ttl);

const axiosArguments = {
    method:"get",
    params:{test1:1,test2:2},
    url:"/any-url"
};//recommended for only get.

cfp.exec("cache-key-1",axiosArguments).then(result=>{
    console.log(result.data);
}).catch(error=>{
    console.log(error);
})

cfp.exec("cache-key-1",axiosArguments).then(result=>{
    console.log(result.data);
}).catch(error=>{
    console.log(error);
})


```

with auto cache key functions


```
import CacheForPromise from "cache-for-promise"
import KeyGenerator from "cache-for-promise/key-generator"
import axios from "axios"

const ttl = 10;//seconds
const cfp = new CacheForPromise(axios,ttl);

cfp.keygen = KeyGenerator.axios;//only for axios is prepared, now.

const axiosArguments = {
    method:"get",
    params:{test1:1,test2:2},
    url:"/any-url"
};//recommended for only get.

cfp.exec(axiosArguments).then(result=>{
    console.log(result.data);
}).catch(error=>{
    console.log(error);
})

cfp.exec(axiosArguments).then(result=>{
    console.log(result.data);
}).catch(error=>{
    console.log(error);
})

