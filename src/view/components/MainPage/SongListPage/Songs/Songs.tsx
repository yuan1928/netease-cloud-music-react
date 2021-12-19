import React from "react";
import {getSongIDs,getSongUrl,isSongValid} from "../../../../../apis/songListDetailPage";
import {HeartOutlined, DownloadOutlined} from "@ant-design/icons";
import './Songs.css'
import {playMusicOfSongList} from "../../MainPage";
import {isNumber} from "util";

interface Song{
    id:number,
    idx:number,
    title:string,
    alia:string,
    singer:string,
    album:string,
    duration:string
}
interface State{
    id:number
    songs:Song[]
    selectedRow:number,
    rows:any
}
class Songs extends React.Component<any, any>{
    state:State={
        id:this.props.match.params.id,
        songs:[],
        selectedRow:this.props.match.params.selectedRow!==undefined?this.props.match.params.selectedRow:-1,
        rows:React.createRef()
    }

    componentDidMount() {
        /*if(this.state.selectedRow!==-1)
        {
            const row=this.state.rows.current.children[this.state.selectedRow]
            row.style.backgroundColor="rgba(0,0,0,0.15)"
        }*/

        getSongIDs(this.state.id).then(res=>{
            let idx=1
            for(let song of res.data.songs)
            {
                this.state.songs.push({
                    id:song.id,
                    idx:idx,
                    title:song.name,
                    alia:song.alia[0]!==undefined?song.alia[0]:"",
                    singer:song.ar[0].name,
                    album:song.al.name,
                    duration:this.getDuration(song.dt),
                })
                idx+=1
            }
            this.forceUpdate()
        })
    }

    getDuration=(time:number)=>{
        time=Math.floor(time/1000)
        const min=Math.floor(time/60)
        const sec=time-min*60
        return String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0")
    }

    playMusic=(id:number,rowIdx:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                    //选中行改变样式
                    if(this.state.selectedRow!==-1)
                    {
                        console.log("last",this.state.selectedRow);
                        const last=this.state.rows.current.children[this.state.selectedRow]
                        last.style.backgroundColor=(this.state.selectedRow%2===0)?"rgba(0,0,0,0.05)":"white"
                    }
                    this.setState(()=>({selectedRow:rowIdx-1}),()=>{
                        console.log("cur",this.state.selectedRow);
                        const cur=this.state.rows.current.children[this.state.selectedRow]
                        cur.style.backgroundColor="rgba(0,0,0,0.15)"
                    })
                    //播放
                    playMusicOfSongList.emit("play",id, res.data.data[0].url,this.state.id)

            })
        },()=>{alert("暂无播放源")})
    }

    render() {
        return (
            <div style={{width:"100%"}}>
                <div style={{width:"100%",display:"flex",alignItems:"center",margin:"10px 0 10px 0"}}>
                    <div style={{width:"10%"}}/>
                    <div style={{width:"30%",display:"flex"}}>标题</div>
                    <div style={{width:"20%",display:"flex"}}>歌手</div>
                    <div style={{width:"30%",display:"flex"}}>专辑</div>
                    <div style={{width:"10%",display:"flex"}}>时长</div>
                </div>
                <div style={{width:"100%",margin:"10px 0 10px 0"}} ref={this.state.rows}>
                    {
                        this.state.songs.map((item,idx)=>(
                            <div
                                className={idx%2===0?"SongListPageSongsEvenRow":"SongListPageSongsOddRow"}
                                onClick={()=>{this.playMusic(item.id,item.idx)}}
                            >
                                <div style={{width:"2%",color:"rgba(0,0,0,0.4)"}}>{item.idx}</div>
                                <div style={{width:"8%",color:"rgba(0,0,0,0.4)",display:"flex",
                                             alignItems:"center",justifyContent:"space-evenly"}}>
                                    <HeartOutlined/>
                                    <DownloadOutlined/>
                                </div>
                                <div style={{width:"30%",color:"dimgray",display:"flex"}}>
                                    {item.title}
                                </div>
                                <div style={{width:"20%",color:"dimgray",display:"flex"}}>
                                    {item.singer}
                                </div>
                                <div style={{width:"30%",color:"dimgray",display:"flex"}}>
                                    {item.album}
                                </div>
                                <div style={{width:"10%",color:"dimgray",display:"flex"}}>
                                    {item.duration}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Songs