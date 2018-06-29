import React from 'react';

const Banner = () => {
    return (
         <div className="market-banner">
            <div className="top-section">
               <img src={PU_CDN_URL + "public/img/prospus-white-logo.png"}/>
               <h2>Marketplace</h2>
               </div>
            <div className="services">
               <div className="row">
                  <div className="col-md-4">
                     <div>
                        <span className="lg-icon">
                        <i className="micro-icon"></i>
                        </span>
                        <h2>MICRO SOLUTIONS</h2>
                        <p>Byte-sized, purpose-built mini applications that work anywhere.</p>
                     </div>
                  </div>
                  <div className="col-md-4">
                     <div>
                        <span className="lg-icon">
                        <i className="plugin-icon"></i>
                        </span>
                        <h2>PLUGIN ANYWHERE</h2>
                        <p>Easily plug our solutions into your site, page, email and more.</p>
                     </div>
                  </div>
                  <div className="col-md-4">
                     <div>
                        <span className="lg-icon">
                        <i className="custom-icon"></i>
                        </span>
                        <h2>CUSTOM DEVELOPMENT</h2>
                        <p>Hire Prospus to quickly build a custom micro-solution.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
    )

}

export default Banner;
