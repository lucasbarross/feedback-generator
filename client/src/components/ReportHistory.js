import React, { Component } from 'react'; 
import { ListCard } from './';
import { orderBy } from 'lodash';

class ReportHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
        
        }
    }

    render() {
        let reports = orderBy(this.props.reports, ['endDate', 'title'], ['asc', 'asc']);
            reports = reports.map((report) => {
            return <ListCard report={report}/>
        })

        return (
            <div className="container column">
                <h1 style={{"textAlign":"center"}} id="show_student_title">History</h1>
                <div id="show_student_hr"></div>
                {reports}
            </div>
       )
    }
}

export default ReportHistory;