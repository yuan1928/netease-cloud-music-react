import React from "react";
import 'antd/dist/antd.css'
import './NewMusic.css'
import {RightOutlined,PlayCircleOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {getNewMusic} from "../../../../../../apis/recommendPage";
import {getSongUrl, isSongValid} from "../../../../../../apis/songListDetailPage";
import {playSingleSong} from "../../../MainPage";

interface Song{
    imgUrl:string,
    title:string,
    description:string,
    id:number,
    author:string
}
interface Style{
    songsInfo:Song[],
    isRequest:boolean
}
class NewMusic extends React.Component<any, any>{
    state:Style={
        songsInfo:[],
        isRequest:false
    }

    componentDidMount() {
        if(!this.state.isRequest)
        {
            getNewMusic().then(res=>{
                for(let item of res.data.result)
                {
                    this.state.songsInfo.push({
                        imgUrl:item.picUrl,
                        title:item.name,
                        description:item.song.alias[0]!==undefined?item.song.alias[0]:"",
                        id:item.id,
                        author:item.song.artists[0].name
                    })
                }
                return new Promise((resolve)=>{resolve("")})
            }).then(res=>{this.forceUpdate();this.setState({isRequest:true})})
        }
    }

    play=(id:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                playSingleSong.emit("play", id, res.data.data[0].url, "$user")
            })
        },()=>{alert("没有播放源")})
    }

    render() {
        return (
            <div id="newMusicRoot">
                <span style={{width:"90%",marginLeft:"10%",fontSize:"20px",fontWeight:"bolder",display:"flex",alignItems:"center"}}>
                    最新音乐<RightOutlined/>
                </span>
                <div style={{width:"80%",marginLeft:"10%",display:"flex",flexWrap:"wrap",justifyContent:"space-evenly"}}>
                    {
                        this.state.songsInfo.map(item=>(
                            <div className="newMusicContainer" key={item.id} style={{position:"relative"}}>
                                <div>
                                    <img
                                        src={item.imgUrl}
                                        style={{height:"50px",objectFit:"cover",borderRadius:"2px",cursor:"pointer"}}
                                        alt=""
                                        onClick={()=>{this.play(item.id)}}
                                    />
                                </div>
                                <Tooltip title={item.title+(item.description.length?("("+item.description+")"):"")}>
                                    <div
                                        style={{display:"flex",flexDirection:"column", justifyContent:"space-between",
                                            alignItems:"flex-start",cursor:"pointer"}}
                                    >
                                        <div style={{height:"50%",display:"flex",flexWrap:"nowrap",overflow:"hidden"}}>
                                            <div style={{height:"100%"}}>{item.title}</div>
                                            {
                                                item.description.length?
                                                    <div style={{color:"lightgrey"}}>{"("+item.description+")"}</div>:
                                                    null
                                            }
                                        </div>
                                        <div style={{color:"grey"}}>{item.author}</div>
                                    </div>
                                </Tooltip>
                                <div style={{position:"absolute", left:"15px",top:"15px",color:"white"}}><PlayCircleOutlined/></div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default NewMusic