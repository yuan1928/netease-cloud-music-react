import request from "./request";

export function getSingers(type:number,area:number,initial:string|number,page:number){
    return request({
        url:"/artist/list?type="+type+"&area="+area+"&initial="+initial+"&offset="+(page-1)*30,
        method:"get",
    })
}