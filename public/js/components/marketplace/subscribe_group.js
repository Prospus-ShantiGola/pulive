import React from 'react';
const SubscribeGroup = () => {
    return (
        <div id="subscribe-group-popup" className="modal fade pu-popup" data-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true"><span aria-hidden="true"><i className="icon close"></i></span></button>
                        <h4 className="modal-title">Subscribe for?</h4>
                    </div>
                    <div className="modal-body">
                                               
                    </div>
                    <div className="modal-footer modal-custom-footer">
                        <button type="button" className="btn full-btn btn-dark-blue subscribe-group-js">Ok</button>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default SubscribeGroup;
