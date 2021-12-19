import React from "react";

const buttons=['全部',"华语","欧美","韩国","日本"]
interface State{
    buttons:any
}
class Nav extends React.Component<any, any>{
    state:State={
        buttons:React.createRef()
    }

    componentDidMount() {
        const defaultButton=this.state.buttons.current.children[0]
        defaultButton.style.fontWeight="bolder"
    }

    click=(select:number)=>{
        const buttons=this.state.buttons.current.children
        for(let i=0; i<buttons.length; i++)
        {
            if(i===select) {buttons[i].style.fontWeight="bolder"}
            else {buttons[i].style.fontWeight="normal"}
        }
    }

    render() {
        return (
            <div
                style={{width:"100%",display:"flex",alignItems:"center"}}
                ref={this.state.buttons}
            >
                {
                    buttons.map((item,idx)=>(
                        <div
                            style={{width:"5%",padding:"2px 6px 2px 6px",cursor:"pointer"}}
                            onClick={()=>{
                                this.click(idx)
                                this.props.click(idx)
                            }}
                        >
                            {item}
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default Nav