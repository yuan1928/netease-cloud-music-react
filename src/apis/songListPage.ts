import request from "./request";

export function getSongLists(tag:string,offset:number){
    if(offset===Infinity)
    {
        return request({
            url:"/top/playlist/highquality?limit=50&cat="+tag,
            method:"get"
        })
    }
    else
    {
        return request({
            url:"/top/playlist/highquality?limit=50&before="+offset+"&cat="+tag,
            method:"get"
        })
    }
}