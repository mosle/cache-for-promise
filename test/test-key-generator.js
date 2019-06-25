import test from "ava";
import KeyGenerator from "../key-generator"


test("always success",t=>{
    t.pass()
});


test("key for axios",t=>{
    const key = KeyGenerator.axios({
        url:"/testpath",
        params:{
            test1: "1",
            test2: "2"
        }
    })

    t.is("/testpath-test1=1&test2=2",key);
});


