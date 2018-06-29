/**
 * Created by Ben on 16-Jun-17.
 */
import React from 'react';
class NoRecordFound extends React.Component {
    render() {
        return this.getNoRecordFoundHtml()
    }

    getNoRecordFoundHtml() {
        return (
            <div className="no-record">{this.props.msg}</div>
        )
    }
    componentDidMount() {
        this.removeTooltip();
    }
    componentDidUpdate() {
        this.removeTooltip();
    }
    removeTooltip() {
        $(".tooltip").remove();
    }
}
export default NoRecordFound;
