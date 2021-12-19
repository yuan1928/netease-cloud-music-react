import React from "react";
import {withRouter} from "react-router";
import {getSingers, getUsers} from "../../../../../apis/searchPage";
import {UserOutlined} from "@ant-design/icons";
import './Users.css'
import {ManOutlined, WomanOutlined} from "@ant-design/icons";
import {Pagination} from "antd";

interface User{
    id:number,
    name:string[],
    gender:number,
    tag:string,
    avatarUrl:string
}
interface State{
    keyword:string,
    page:number,
    resNum:number,
    users:User[]
}

class Users extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        page:1,
        resNum:0,
        users:[]
    }

    getInfo=()=>{
        this.setState(()=>({users:[]}),()=>{
            getUsers(this.state.keyword,(this.state.page-1)*30).then(res=>{
                const reg=new RegExp(this.state.keyword,"g")
                if(this.state.resNum===0 && this.state.resNum!==res.data.result.userprofileCount)
                {this.setState({resNum:res.data.result.userprofileCount})}
                console.log(res);
                for(let user of res.data.result.userprofiles)
                {
                    this.state.users.push({
                        id:user.userId,
                        name:user.nickname.replace(reg,"$#"+this.state.keyword+"#$").split("$"),
                        gender:user.gender,
                        tag:user.description,
                        avatarUrl:user.avatarUrl//有可能使用默认头像
                    })
                }
                console.log(this.state.users);
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
            <div>
                <span style={{display:"flex",fontSize:'25px',fontWeight:"bolder",padding:"5px"}}>
                    找到{this.state.resNum}位用户
                </span>
                {
                    this.state.users.map((item,idx)=>(
                        <div className={idx%2===0?"searchPageUsersRowEven":"searchPageUsersRowOdd"}>
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
                                {item.gender===1?<div style={{color:"cornflowerblue",marginLeft:"5px"}}><ManOutlined/></div>:null}
                                {item.gender===2?<div style={{color:"pink",marginLeft:"5px"}}><WomanOutlined/></div>:null}
                            </div>
                            <div style={{color:"rgba(0,0,0,0.4)"}}>{item.tag}</div>
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

export default withRouter(Users)