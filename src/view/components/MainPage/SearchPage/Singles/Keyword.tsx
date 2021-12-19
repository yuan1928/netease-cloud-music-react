import React from "react";
import {withRouter} from "react-router";

class Keyword extends React.Component<any, any>{
    render() {
        return <div style={{color:"cornflowerblue"}}>{this.props.match.params.keyword}</div>
        //这里的关键词从路由里获得-------------------------------------------------
    }
}

export default withRouter(Keyword)