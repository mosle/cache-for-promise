import test from "ava";
import CacheForPromise from "../cache-for-promise"
import KeyGenerator from "../key-generator"

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
const success = (...args)=>{
    return new Promise((resolve,reject)=>{
        return resolve.apply(null,args);
    })
}
const fail = (...args)=>{
    return new Promise((resolve,reject)=>{
        return reject.apply(null,args);
    })
}

test.beforeEach(t => {
	t.context.cfp = new CacheForPromise();
});


test("always success",t=>{
    t.pass()
});


test("stored normally",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 0;
    cfp.func = success;
    const val = 1;
    const a = await cfp.exec("key1",val);
    t.true(a===val);
});


test("stored normally when fail",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 0;
    cfp.func = fail;
    const val = 1;
    try{
        const a = await cfp.exec("key2",val);
        t.fail();
    }
    catch(err){
        t.is(err,val);
    }
});

test("cached normally",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 10;
    cfp.func = success;
    const val = 1;
    const a = await cfp.exec("key3",val);
    const b = await cfp.exec("key3",val + val); //not equal

    t.is(b,val);
    t.is(a,b);
});


test("clear cache after specified seconds",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 1;
    cfp.func = success;
    const val = 1;
    const a = await cfp.exec("key4",val);

    await sleep(2);
    const b = await cfp.exec("key4",val + val);

    t.is(a,val);
    t.is(b,val + val);
    t.is(a + a,b);
    //await sleep(5);
    //console.log(cfp.cacheStore)
});


test("when rejected cache is exsited, re-execute it",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 10;
    cfp.func = fail;
    const val = 1;

    try{
        const a = await cfp.exec("key5",val);
    }
    catch(error){
        cfp.func = success;
        await sleep(3);
        const b = await cfp.exec("key5",val + val);
        
        t.is(b,val + val);
    }
});


test("auto key works",async t=>{
    const cfp = t.context.cfp;
    cfp.ttl = 6;

    let times = 0;
    cfp.func = ()=>{
        return new Promise((resolve,reject)=>{
            return resolve(times++);
        })
    };
    cfp.keygen = KeyGenerator.axios;

    const params = {method:"get",url:"/test",params:{test1:1,test2:2}}
    const a = await cfp.exec(params);
    const b = await cfp.exec(params);
    t.is(a,0);
    t.is(a,b);
});
