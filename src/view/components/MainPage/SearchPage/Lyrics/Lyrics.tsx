import React from "react";
import {withRouter} from "react-router";

class Lyrics extends React.Component<any, any>{
    render() {
        return (
            <div>
                lyrics
                {this.props.match.params.keyword}
            </div>
        )
    }
}

export default withRouter(Lyrics)