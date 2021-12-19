import React from "react";
import MenuBar from "../MenuBar/MenuBar";
import {getSingles,getSongUrl} from "../../../../../apis/searchPage";
import {Progress, Table} from "antd";
import {DownloadOutlined, HeartOutlined, SoundFilled } from "@ant-design/icons";
import './Singles.css'
import Keyword from "./Keyword";
import {withRouter} from "react-router";
import axios from "axios";

interface State{
    keyword:string,
    resNum:number
    curRes:Info[],
    maxHot:number,
    selectedRow:number,
    selectedSongId:number,
    emitPlayInfo:boolean
}
interface Info{
    like:boolean,
    download:boolean,
    title:string,
    author:string,
    album:string,
    duration:string,
    hot:number,
    id:number,
    idx:number,
    key:number
}
const getDuration=function (duration:number):string{
    duration=Math.floor(duration/1000)
    const min=Math.floor(duration/60)
    const sec=String(duration-60*min)
    const minStr=(min<10)?("0"+min):min.toString()
    const secStr=(sec.length===1)?("0"+sec):sec.toString()
    return minStr+":"+secStr
}

class Singles extends React.Component<any, any>{
    state:State={
        keyword:'',
        resNum:0,
        curRes:[],
        maxHot:0,
        selectedRow:Infinity,
        selectedSongId:Infinity,
        emitPlayInfo:false
    }

    columns = ()=>{return [
        {
            title: ' ',
            dataIndex: 'idx',
            key: 'idx',
            render:(idx:number)=>{return (<div>
                                              {(idx===this.state.selectedRow)? <SoundFilled style={{color:'rgb(201,38,32)'}}/>:idx}
                                          </div>)}
        },
        {
            title: ' ',
            key: 'like',
            render:()=>(<HeartOutlined />)
        },
        {
            title: ' ',
            key: 'download',
            render:()=>(<DownloadOutlined/>)
        },
        {
            title: '音乐标题',
            key: 'title',
            dataIndex: "title",
            render:(title:string)=>{return this.highlightKeyWord(title)}
        },
        {
            title: '歌手',
            key: 'author',
            dataIndex: "author",
            //render:(title:string)=>{return (<div style={{color:'dimgray'}}>{title}</div>)}
            render:(title:string)=>{return this.highlightKeyWord(title)}
        },
        {
            title: '专辑',
            key: 'album',
            dataIndex: "album",
            //render:(title:string)=>{return (<div style={{color:'grey'}}>{title}</div>)}
            render:(title:string)=>{return this.highlightKeyWord(title)}
        },
        {
            title: '时长',
            key: 'duration',
            dataIndex: "duration",
            render:(title:string)=>{return (<div style={{color:'dimgrey'}}>{title}</div>)}
        },
        {
            title: '热度',
            key: 'hot',
            dataIndex: "hot",
            render:(hot:number)=>{
                return (<Progress
                    percent={100*hot/this.state.maxHot}
                    showInfo={false}
                    strokeColor="rgb(201,38,32)"
                    trailColor="lightgray"
                />)
            }
        }
    ]}

    getCurSongs(data:any,page:number){
        const info=[]
        let idx=1
        let offset=(page-1)*100
        let maxHot=0
        for(let song of data)
        {
            if(idx+offset<=this.state.resNum)
            {
                info.push({
                    like:false,
                    download:false,
                    title:song.name,
                    author:song.artists[0].name,
                    album:song.album.name,
                    duration:getDuration(song.duration),
                    hot:song.mark,
                    id:song.id,
                    idx:idx+offset,
                    key:song.id
                })
                if(song.mark>maxHot){maxHot=song.mark}
                idx+=1
            }
            else {break}
        }
        this.setState({curRes:info,maxHot:maxHot})
    }

    highlightKeyWord=(initInfo:string)=>{
        const reg=new RegExp(this.state.keyword,"g")
        const frags=initInfo.replace(reg, "$#"+this.state.keyword+"#$").split("$")
        return (<div style={{display:"flex"}}>
            {
                frags.map((item)=>{
                    if(item[0]==="#" && item[item.length-1]==="#") {return <Keyword/>}
                    else {return <div style={{color:'dimgray'}}>{item}</div>}
                })
            }
        </div>)
    }

    switchPage=(page:number)=>{
        getSingles(this.state.keyword,(page-1)*100).then(res=>{
            if(res.data.result.songs!==undefined)
            {this.getCurSongs(res.data.result.songs,page)}
            else {alert("请求资源无访问权限")}
        })
    }

    componentDidMount() {
        this.setState(()=>({keyword:this.props.match.params.keyword,selectedRow:this.props.match.params.selectedRow}),
            ()=>{
                getSingles(this.state.keyword,0).then(res=>{
                this.setState({resNum:res.data.result.songCount})
                this.getCurSongs(res.data.result.songs,1)

            })
        })
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if(this.state.keyword!==this.props.match.params.keyword)
        {
            this.setState(()=>({keyword:this.props.match.params.keyword,selectedRow:this.props.match.params.selectedRow}),
                ()=>{
                    getSingles(this.state.keyword,0).then(res=>{
                    this.setState({resNum:res.data.result.songCount,selectedRow:Infinity})
                    this.getCurSongs(res.data.result.songs,1)
                    //this.forceUpdate()
                })
            })
        }


        if(this.state.emitPlayInfo)
        {
            getSongUrl(this.state.selectedSongId).then(res=>{
                this.props.playMusicEvent.emit("play",res.data.data[0].url,this.state.selectedSongId,
                    this.state.keyword,this.state.selectedRow)
            })
            //this.props.playMusicEvent.emit("play",this.state.selectedSongId)
            this.setState({emitPlayInfo:false})
        }
    }

    render() {
        return (
            <div>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}首单曲
                </span>
                <div style={{width:"100%"}}>
                    <Table
                        columns={this.columns()}
                        dataSource={this.state.curRes}
                        pagination={{defaultPageSize:100,total:this.state.resNum,onChange:(page)=>{this.switchPage(page)}}}
                        id="searchSinglesResTable"
                        onRow={(record)=>{
                                                        return ({
                                                            onClick:()=>{
                                                                axios.get("https://wangyi-cloud-music-api.vercel.app/check/music?id="+record.id).then(
                                                                    res=>{
                                                                        this.setState({selectedRow:record.idx,
                                                                            emitPlayInfo:true,
                                                                            selectedSongId:record.id})
                                                                        this.forceUpdate()
                                                                    },
                                                                    ()=>alert("抱歉，暂无播放源"))

                                                            }
                                                        })
                        }}
                        rowClassName={(record)=>{return (record.idx===this.state.selectedRow)?"selectedRow":""}}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(Singles)