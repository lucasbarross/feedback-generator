import React, { Component } from 'react';
import '../assets/show_student.css';

class InfoBlock extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className={"container column centered " + this.props.class}>
                <b><h3> { this.props.title } </h3></b>
                <em><h5> { this.props.subtitle } </h5> </em>
            </div>
        );
  }
}

export default InfoBlock;