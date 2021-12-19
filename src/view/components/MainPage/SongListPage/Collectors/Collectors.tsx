import React from "react";
import {getSongListDetailInfo} from "../../../../../apis/songListDetailPage";
import {ManOutlined,WomanOutlined} from "@ant-design/icons"

interface Collector{
    id:number,
    name:string,
    img:string,
    signature:string,
    gender:number
}
interface State{
    id:number,
    collectors:Collector[]
}
class Collectors extends React.Component<any, any>{
    state:State={
        id:this.props.match.params.id,
        collectors:[]
    }

    componentDidMount() {
        getSongListDetailInfo(this.state.id).then(res=>{
            for(let person of res.data.playlist.subscribers)
            {
                this.state.collectors.push({
                    id:person.userId,
                    name:person.nickname,
                    img:person.avatarUrl,
                    signature:person.signature,
                    gender:person.gender
                })
            }
            this.forceUpdate()
        })
    }

    render() {
        return (
            <div style={{width:"100%",display:"flex",alignItems:"center",flexWrap:"wrap"}}>
                {
                    this.state.collectors.map(item=>(
                        <div style={{width:"28%",display:"flex",alignItems:"center",margin:"30px"}}>
                            <img src={item.img} style={{width:"25%",objectFit:"cover",borderRadius:"50%"}}/>
                            <div style={{width:"70%",marginLeft:"30px",display:"flex",alignItems:"center",flexWrap:"wrap"}}>
                                <div style={{width:"100%",display:"flex"}}>
                                    {item.name}
                                    {item.gender===1?<div style={{color:"cornflowerblue"}}><ManOutlined/></div>:null}
                                    {item.gender===2?<div style={{color:"pink"}}><WomanOutlined/></div>:null}
                                </div>
                                <div style={{color:"rgba(0,0,0,0.3)",textAlign:"start"}}>
                                    {item.signature}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default Collectors