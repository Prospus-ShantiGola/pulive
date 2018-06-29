import React from 'react';

class ShowRating extends React.Component {
    render() {
        let rating = this.props.rating;
        let halfRate;
        if (rating % 1 != 0) {
            halfRate = 1;
        }

        return this.showRating(parseInt(rating), halfRate)
    }

    showRating(rating, halfRate) {
        let eleArr = [];
        for (let i = 0; i < rating; i++) {
            eleArr.push(<i key={i} className="fa fa-star active" aria-hidden="true"></i>);
        }
        if (halfRate) {
            rating += 1;
            eleArr.push(<i key={rating} className="fa fa-star-half-o active" aria-hidden="true"></i>);
        }
        for (let i = 1; i <= (5 - rating); i++) {
            eleArr.push(<i key={rating + i} className="fa fa-star" aria-hidden="true"></i>);
        }
        return (
            <span className="app-rating">{eleArr}</span>
        )
    }
}

export default ShowRating;
