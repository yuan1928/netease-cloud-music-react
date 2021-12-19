import React from "react";
import {withRouter} from "react-router";
import {getAlbums} from "../../../../../apis/searchPage";
import './Albums.css'
import {Pagination} from "antd";

interface Album{
    id:number,
    name:string[],
    alia:string,
    coverUrl:string,
    singer:string[],
    singerAlia:string
}

interface State{
    keyword:string,
    page:number,
    resNum:number,
    albums:Album[]
}

class Albums extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        page:1,
        resNum:0,
        albums:[]
    }

    getInfo=()=>{
        getAlbums(this.state.keyword,(this.state.page-1)*30).then(res=>{
            const reg=new RegExp(this.state.keyword,"g")
            this.setState({resNum:res.data.result.albumCount})
            const data=res.data.result.albums
            let start=(data.length<=30)?0:((this.state.page-1)*30)
            let end=start+29
            let album
            while (start<=end && start<data.length)
            {
                album=data[start]
                this.state.albums.push({
                    id:album.id,
                    name:album.name.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                    alia:album.alias[0]!==undefined?album.alias[0]:"",
                    coverUrl:album.picUrl,
                    singer:album.artist.name.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                    singerAlia:album.artist.alias[0]!==undefined?album.artist.alias[0]:""
                })
                start+=1
            }
            this.forceUpdate()
        })
    }

    switchPage=(page:number)=>{
        this.setState(()=>({page:page,albums:[]}),()=>{this.getInfo()})
    }

    getAlbumDetail=(id:number)=>{
        //this.props.history.push("/song-list/"+id)
    }

    componentDidMount() {
        this.getInfo()
    }

    render() {
        return (
            <div style={{width:"100%"}}>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}张专辑
                </span>
                {
                    this.state.albums.map((item,idx)=>(
                        <div
                            className={idx%2===0?"searchPageAlbumsRowEven":"searchPageAlbumsRowOdd"}
                            onClick={()=>{this.getAlbumDetail(item.id)}}
                        >
                            <div style={{display:"flex",alignItems:"center",width:"50%"}}>
                                <img
                                    src={item.coverUrl}
                                    style={{width:"60px",height:"60px",objectFit:"cover",borderRadius:"3px",marginRight:"5px"}}
                                    alt=""
                                />
                                {
                                    item.name.map(str=>{
                                        if(str[0]==="#" && str[str.length-1]==="#")
                                        {return <div style={{color:"cornflowerblue"}}>{str.slice(1,str.length-1)}</div>}
                                        else {return <div>{str}</div>}
                                    })
                                }
                                {item.alia.length? <div style={{color:"rgba(0,0,0,0.4)"}}>({item.alia})</div>:null}
                            </div>
                            <div style={{width:"50%",display:"flex",alignItems:"center"}}>
                                {
                                    item.singer.map(str=>{
                                        if(str[0]==="#" && str[str.length-1]==="#")
                                        {return <div style={{color:"cornflowerblue"}}>{str.slice(1,str.length-1)}</div>}
                                        else {return <div>{str}</div>}
                                    })
                                }
                                {item.singerAlia.length? <div style={{color:"rgba(0,0,0,0.4)"}}>({item.singerAlia})</div>:null}
                            </div>
                        </div>
                    ))
                }
                <div style={{width:"100%",display:"flex",justifyContent:"center",margin:"20px 0 20px 0"}}>
                    <Pagination total={this.state.resNum} pageSize={30} onChange={this.switchPage}/>
                </div>
            </div>
        )
    }
}

export default withRouter(Albums)