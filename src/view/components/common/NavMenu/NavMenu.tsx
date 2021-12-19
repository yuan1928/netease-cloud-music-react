import React from "react";
import 'antd/dist/antd.css'
import {Menu} from "antd";

interface MenuItem{
    key:string,
    title:string,
    click:Function
}
interface State{
    current:string,
    menu:any
}
class NavMenu extends React.Component<any, any>{
    state:State={
        current:this.props.menu[0].key,
        menu:React.createRef()
    }

    componentDidMount() {

        console.log(this.state.menu);
    }

    render() {
        const { current } = this.state;
        return (
            <div id="navMenuRoot">
                <Menu
                    onClick={(e)=>{this.setState({current:e.key})}}
                    selectedKeys={[current]}
                    mode="horizontal"
                    ref={this.state.menu}
                >
                    {
                        this.props.menu.map((item:MenuItem)=>(
                            <Menu.Item key={item.key}>
                                <a onClick={()=>{item.click()}}>{item.title}</a>
                            </Menu.Item>
                        ))
                    }
                </Menu>
            </div>
        )
    }
}

export {NavMenu};
export type { MenuItem };

