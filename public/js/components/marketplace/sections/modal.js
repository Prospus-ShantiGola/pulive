import React from 'react'


class Modal extends React.Component {
    render() {
        return (
        	<div className="modal fade pu-popup bg-none" id="demo-popup" data-backdrop="static">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">
			      <div className="modal-header modal-header-custom">
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div className="modal-body custom-banner">
			        <img src="public/img/demo-banner.png" alt="" />
			      </div>
			    </div>
			  </div>
			</div>
		)
    }
}


export default Modal;