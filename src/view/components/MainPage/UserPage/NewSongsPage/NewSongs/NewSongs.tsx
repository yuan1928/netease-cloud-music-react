import React from "react";
import Nav from "../Nav/Nav";
import {getNewSongs} from "../../../../../../apis/newSongsPage";
import {PlayCircleOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {getSongUrl, isSongValid} from "../../../../../../apis/songListDetailPage";
import {playSingleSong} from "../../../MainPage";

interface Song{
    id:number,
    idx:string,
    name:string,
    alia:string,
    singer:string,
    albumName:string,
    albumAlia:string,
    duration:string,
    musicUrl:string,
    picUrl:string
}
interface State{
    curType:number,
    newSongs:Song[]
}
const dict=[0,7,96,8,16]

class NewSongs extends React.Component<any, any>{
    state:State={
        curType:0,
        newSongs:[]
    }

    componentDidMount() {
        this.getSongs()
    }

    getSongs=()=>{
        getNewSongs(this.state.curType).then(res=>{
            let idx=1
            for(let song of res.data.data)
            {
                this.state.newSongs.push({
                    id:song.id,
                    idx:String(idx).padStart(3,"0"),
                    name:song.name,
                    alia:(song.alias[0]!==undefined)?song.alias[0]:"",
                    singer:song.artists[0].name,
                    albumName:song.album.name,
                    albumAlia:(song.album.alias[0]!==undefined)?song.album.alias[0]:"",
                    duration:this.getDuration(song.duration),
                    musicUrl:song.mp3Url,
                    picUrl:song.album.picUrl
                })
                idx+=1
            }
            this.forceUpdate()
        })
    }

    getDuration=(time:number)=>{
        time=Math.floor(time/1000)
        let min=Math.floor(time/60)
        let sec=time-min*60
        return String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0")
    }

    click=(typeIdx:number)=>{
        this.setState(()=>({curType:dict[typeIdx],newSongs:[]}),()=>{this.getSongs()})
    }

    play=(id:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                playSingleSong.emit("play", id, res.data.data[0].url, "$new-song")
            })
        },()=>{alert("没有播放源")})
    }

    render() {
        return (
            <div style={{width:"100%"}}>
                <Nav click={this.click}/>
                {
                    this.state.newSongs.map((item,idx)=>(
                        <div
                            style={{width:"95%",display:"flex",justifyContent:"space-evenly",alignItems:"center",
                                    margin:"20px",backgroundColor:idx%2===0?"rgba(0,0,0,0.05)":"white",borderRadius:"6px",
                                    padding:"10px 0 10px 0",cursor:"pointer"}}
                            onClick={()=>{this.play(item.id)}}
                        >
                            <div style={{width:"35%",display:"flex",alignItems:"center",marginRight:"20px"}}>
                                <div style={{color:"rgba(0,0,0,0.4)",marginRight:"5px"}}>{item.idx}</div>
                                <div style={{position:"relative",color:"white",marginRight:"5px"}}>
                                    <img src={item.picUrl} style={{width:"60px",objectFit:"cover",borderRadius:"3px"}}/>
                                    <PlayCircleOutlined style={{position:"absolute",top:"25px",left:"25px"}}/>
                                </div>
                                <Tooltip title={(item.alia.length)?(item.name+"("+item.alia+")"):(item.name)}>
                                    <div style={{display:"flex",flexWrap:"nowrap",overflow:"hidden",height:"20px"}}>
                                        {item.name}
                                        {item.alia.length? <div style={{color:'rgba(0,0,0,0.4)'}}>({item.alia})</div> : null}
                                    </div>
                                </Tooltip>
                            </div>
                            <div style={{width:"15%",display:"flex"}}>
                                {item.singer}
                            </div>
                            <div style={{display:"flex",width:"40%"}}>
                                {item.albumName}
                                {item.albumAlia.length? <div style={{color:"rgba(0,0,0,0.4)"}}>({item.albumAlia})</div> : null}
                            </div>
                            <div style={{width:"5%",color:"rgba(0,0,0,0.4)"}}>
                                {item.duration}
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default NewSongs