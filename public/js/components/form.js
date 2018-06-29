import React from 'react';
const Form = (props) => {

    var form_fields = props.form_fields;

    return (
        <div>
            {
                form_fields.map(function(item, index) {

                    let fields = item['fields'];
                    return (
                        <div key={index}>
                            <div className="form-detail-pane" key={index}>
                                {
                                    Object.keys(fields).map(function(key1) {

                                        let field = fields[key1];

                                        if(field.type == 'text' || field.type == 'email') {
                                            return getTextInput(field, key1, props)
                                        }
                                        if(field.type == 'file') {
                                            return getImageUploadInput(field, key1)
                                        }
                                        if(field.type == 'password') {
                                            return getPasswordInput(field, key1)
                                        }
                                        if(field.type == 'select') {
                                            return getDropdown(field, key1)
                                        }
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
function getTextInput(field, key, props) {
    let errMsg = 'Please enter ';
    let common_class = 'form-control input-gray input-sm';
    if(field.type == 'email') {
        errMsg += ' valid ';
        common_class = 'form-control input-gray';
    }
    if(props.additionalParams && props.additionalParams[field.name]) {
        return (<div key={key}>
            <input type="text" className={common_class} placeholder={field.placeholder} data-input={field.property} name={field.name} disabled defaultValue={props.additionalParams[field.name]}/>
            {getErrorTag(errMsg + field.placeholder)}
        </div>)
    }
    return (
        <div key={key}>
            <input type="text" className={common_class} placeholder={field.placeholder} data-input={field.property} name={field.name}/>
            {getErrorTag(errMsg + field.placeholder)}
        </div>
    )
}

function getPasswordInput(field, key) {
    return (
        <div key={key}>
            <input type="password" className="form-control input-gray" placeholder={field.placeholder}  data-input={field.property} name={field.name}/>
            {getErrorTag('Please enter ' + field.placeholder)}
        </div>
    )
}

function getImageUploadInput(field, key) {
    let backgroundImage = 'url(' + domainUrl + 'public/img/user.png)' ;
    return (
        <div key={key}>

                <div className="userprofile-wrap">
                    <div id="input-file" className="upload-file" style={{backgroundImage: backgroundImage}} data-default-profile={backgroundImage}>

                        {/* <img data-default-img="public/img/user.png" src="public/img/user.png" id="profile-preview-img" className="img-responsive"/> */}
                        <input type="hidden" className="form-control input-gray" data-input={field.property} name={field.name}/>
                        <i className="fa fa-upload icon-upload" aria-hidden="true" onClick={triggerFileSelect}></i>

                    </div>
            </div>

        </div>
    )
}
function triggerFileSelect() {
    setTimeout(function() {
        $("#input-file").trigger('click');
    });
}

function getDropdown(field, key) {
    field.name = field.name || 'organization';
    return (
        <div key={key}>
            <select className="selectpicker form-control input-gray" data-input={field.property} name={field.name}>
                <option value="0">Select</option>
                <option value="Prospus">Prospus</option>
                <option value="Investible">Investible</option>
            </select>
            <p className="sm-text">Don't worry you can do this later as well.</p>
        </div>
    )
}

function getErrorTag(text) {
    return <p className="error-msg-txt hide">{text}</p>
}
export default Form;
