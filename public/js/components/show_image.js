import React from 'react';

class ShowImage extends React.Component {
    render() {
        let self = this;
        /*if (!self.props.imagesUrl) {
            return null;
        }*/
        if (typeof self.props.imagesUrl == 'undefined') {
            return null;
        }

        let imageWapperClassName = this.props.imageWapperClassName;
        let imgClassName = this.props.classesName;
        let dialogueCreatedBy = this.props.dialogueCreatedBy;
        if (typeof self.props.imagesUrl == 'string' || self.props.imagesUrl == 0) {
            return <div className={imageWapperClassName}>
                {this.getSingleImage(imgClassName,self.props.imagesUrl,self.props.initialName)}
            </div>
        }
        //debugger;
        let actorDetails = this.getActorDetails(self.props.imagesUrl);
        return <span>
            {
                Object.keys(actorDetails).map((value, index) => {
                    let class_name = imageWapperClassName;
                    let userName = actorDetails[value].full_name;
                    let initialName = actorDetails[value].initial_name;
                    if (dialogueCreatedBy == $.trim(value)) {
                        class_name += ' actor-admin';
                    }
                    if (window.setUserID == $.trim(value)) {
                        userName = 'You';
                    }
                    return <div key={index}
                                className={class_name}>{this.getImage(userName, actorDetails[value].url, imgClassName,initialName)}</div>
                })
            }
        </span>

    }

    getSingleImage(imgClassName,url,initialName){
        if(url){
            return <img src={url} className={imgClassName}/>
        }
        if(!initialName){
            initialName = ((this.props.firstName.charAt(0)) + (this.props.lastName.charAt(0))).toUpperCase();
        }
        return <span className="initials-box">{initialName}</span>
    }

    getImage(userName, url, imgClassName,initialName) {
        if(url){
            return <img data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={userName} src={url} className={imgClassName}/>
        }
        return <span className="initials-box" data-toggle="tooltip" data-container="body" data-placement="bottom" data-original-title={userName}>{initialName}</span>

    }

    getActorDetails(listArr) {
        let newListArr = {};
        Object.keys(listArr).map(index => {
            let userDetails = listArr[index];
            if(userDetails.has_removed == 0 || typeof userDetails.has_removed == 'undefined'){
                newListArr[index] = listArr[index];
            }
        })
        let listArrKeys = Object.keys(newListArr);
        let actorDetails = {};
        //let admin = listArr[this.props.dialogueCreatedBy];

        for (let i = 0; i < listArrKeys.length; i++) {
            let actor = listArr[listArrKeys[i]];
            if (listArrKeys[i] == this.props.dialogueCreatedBy) {
                continue;
            }
            actorDetails[' ' + listArrKeys[i]] = {
                'url': actor.profile_image,
                full_name: actor.first_name + ' ' + actor.last_name,
                initial_name : ((actor.first_name.charAt(0)) + (actor.last_name.charAt(0))).toUpperCase()
            };
            if (i == 5) {
                break;
            }
        }
        if (this.props.dialogueCreatedBy && listArr[this.props.dialogueCreatedBy]) {
            actorDetails[' ' + this.props.dialogueCreatedBy] = {
                'url': listArr[this.props.dialogueCreatedBy].profile_image,
                full_name: listArr[this.props.dialogueCreatedBy].first_name + ' ' + listArr[this.props.dialogueCreatedBy].last_name,
                initial_name : ((listArr[this.props.dialogueCreatedBy].first_name.charAt(0)) + (listArr[this.props.dialogueCreatedBy].last_name.charAt(0))).toUpperCase()
            };
        }
        return actorDetails;
    }
}
export default ShowImage;
