import React from "react";
import {withRouter} from "react-router";
import {getSingers} from "../../../../../apis/searchPage";
import {UserOutlined} from "@ant-design/icons";
import './Singers.css'
import {Pagination} from "antd";

interface Singer{
    id:number,
    name:string[],
    alia:string,
    avatarUrl:string
}

interface State{
    keyword:string,
    page:number,
    resNum:number,
    singers:Singer[]
}
class Singers extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        page:1,
        resNum:0,
        singers:[]
    }

    getInfo=()=>{
        this.setState(()=>({singers:[]}),()=>{
            getSingers(this.state.keyword,(this.state.page-1)*30).then(res=>{
                const reg=new RegExp(this.state.keyword,"g")
                this.setState({resNum:res.data.result.artistCount})
                for(let singer of res.data.result.artists)
                {
                    this.state.singers.push({
                        id:singer.id,
                        name:singer.name.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                        alia:singer.alias[0]!==undefined?singer.alias[0]:"",
                        avatarUrl:singer.picUrl
                    })
                }
                this.forceUpdate()
            })
        })
    }

    switchPage=(page:number)=>{
        this.setState(()=>({page:page}),()=>{this.getInfo()})
    }

    componentDidMount() {
        this.getInfo()
    }

    render() {
        return (
            <div  style={{width:"100%"}}>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}位歌手
                </span>
                {
                    this.state.singers.map((item,idx)=>(
                        <div className={idx%2===0?"searchPageSingersRowEven":"searchPageSingersRowOdd"}>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <img
                                    src={item.avatarUrl}
                                    style={{width:"60px",height:"60px",objectFit:"cover",borderRadius:"50%",marginRight:"5px"}}
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
                            <div style={{color:"rgb(201,38,32)"}}><UserOutlined /></div>
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

export default withRouter(Singers)