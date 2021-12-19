import React from "react";
import {withRouter} from "react-router";
import {getVideos} from "../../../../../apis/searchPage";
import {Pagination, Tooltip} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";

interface Video{
    name:string,
    nameArr:string[],
    playCount:number,
    duration:string,
    creator:string,
    coverUrl:string
}
interface State{
    keyword:string,
    page:number,
    resNum:number,
    videos:Video[]
}

class Videos extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        page:1,
        resNum:0,
        videos:[]
    }

    getInfo=()=>{
        this.setState(()=>({videos:[]}),()=>{
            getVideos(this.state.keyword,(this.state.page-1)*40).then(res=>{
                const reg=new RegExp(this.state.keyword,"g")
                this.setState({resNum:res.data.result.videoCount})
                for(let video of res.data.result.videos)
                {
                    this.state.videos.push({
                        name:video.title,
                        nameArr:video.title.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                        playCount:video.playTime,//不确定
                        duration:this.getDuration(video.durationms),
                        creator:String(video.creator[0].userName),
                        coverUrl:video.coverUrl
                    })
                }
                this.forceUpdate()
            })
        })
    }

    getDuration=(time:number)=>{
        time=Math.floor(time/1000)
        let hour=Math.floor(time/3600)
        let min=Math.floor((time-3600*hour)/60)
        let sec=time-3600*hour-60*min
        return String(hour).padStart(2,"0")+":"+String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0")
    }

    switchPage=(page:number)=>{
        this.setState(()=>({page:page}),()=>{this.getInfo()})
    }

    componentDidMount() {
        this.getInfo()
    }

    render() {
        return (
            <div style={{width:"100%"}}>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}个视频
                </span>
                <div style={{width:"100%",display:"flex",flexWrap:"wrap",alignItems:"center"}}>
                    {
                        this.state.videos.map(item=>(
                            <div style={{width:"25%",padding:"10px",position:"relative"}}>
                                <img
                                    src={item.coverUrl}
                                    style={{width:"100%",height:"200px",objectFit:"cover",borderRadius:"3px",marginBottom:"3px"}}
                                    alt=""
                                />
                                <Tooltip title={item.name}>
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-start",cursor:"pointer"}}>
                                            {
                                                item.nameArr.map(str=>{
                                                    if(str[0]==="#" && str[str.length-1]==="#")
                                                    {
                                                        return <div style={{color:"cornflowerblue",whiteSpace:"nowrap",wordBreak:"keep-all",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                                    {str.slice(1, str.length-1)}
                                                                </div>
                                                    }
                                                    else {return <div style={{whiteSpace:"nowrap",wordBreak:"keep-all",overflow:"hidden",textOverflow:"ellipsis"}}>{str}</div>}
                                                })
                                            }
                                    </div>
                                </Tooltip>
                                <div style={{textAlign:"start",color:"rgba(0,0,0,0.4)"}}>
                                    by{"      "+item.creator}
                                </div>
                                <div style={{display:"flex",alignItems:"center",position:"absolute",top:"15px",right:"15px",color:"white"}}>
                                    <PlayCircleOutlined/>
                                    {
                                        Math.floor(item.playCount/10000)>0?
                                            String(Math.floor(item.playCount/10000))+"万":
                                            item.playCount
                                    }
                                </div>
                                <div style={{display:"flex",alignItems:"center",position:"absolute",top:"185px",right:"15px",color:"white"}}>
                                    {item.duration}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",margin:"20px 0 20px 0"}}>
                    <Pagination total={this.state.resNum} pageSize={40} onChange={this.switchPage}/>
                </div>
            </div>
        )
    }
}

export default withRouter(Videos)