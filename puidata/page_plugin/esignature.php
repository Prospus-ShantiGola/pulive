<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL_API; ?>css/esign/digital-sign.css" />
<script type="text/javascript" src="<?php echo BASE_URL_API; ?>js/modules/esign/digital-sign.js"></script>	
<div class="top-doc-nav">
    <a href="javascript:void(0)" id="createSignature" class="active">Create Signature</a>
    <a href="javascript:void(0)" id="signDocument">Sign Document</a>
    <a href="javascript:void(0)" id="" class="inactive">Workflow</a>
</div>	
<div id="signatureContainer" style="display:block">
    <div class="signNav">
        <select id="doActorSign"  class="form-select"><option value="select">-Select Actor-</option><option value="actor1Sign">Actor1</option><option value="actor2Sign">Actor2</option></select>
    </div>
    <div id="signRegion">
        <div>
            <div class="signed-wrap">
                <h4>Confirm your name, signature, and initials.</h4>
                <div class="signed-row">
                    <div class="signed-col">
                        <h5>Full Name</h5>
                        <span><input type="text" readonly="readonly" value="<?php echo $fullName; ?>" class="form-control input-field"/></span>

                    </div>
                    <div class="signed-col">
                        <h5>Initials</h5>
                        <span><input type="text" readonly="readonly" value="<?php echo $initials; ?>" class="form-control input-field"/></span>

                    </div>
                </div>
                <div class="signed-row">
                    <div class="signed-preview-col">
                        <canvas id="digitalSign" class="digitalSign" width="350" height="100"></canvas>					
                        <button type="button" id="clr" size="23" onclick="digitalSign.erase('digitalSign')" class="btn btn-black">Clear</button>
                    </div>
                    <div class="signed-preview-col">
                        <canvas id="initialSign" class="initialSign" width="130" height="100"></canvas>					
                        <button type="button" id="clr" size="23" onclick="digitalSign.erase('initialSign')" class="btn btn-black">Clear</button>
                    </div>
                </div>
                <div class="signed-row">
                    <p>By clicking <b>Adopt and Save</b>, I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on documents including legally binding contracts - just the same as a pen-and-paper signature or initial.</p>
                </div>
                <div class="signed-row">				
                    <input type="button" value="Adopt and Save" id="btn" size="30" onclick="digitalSign.save()" class="btn btn-black">
                    <input type="button" value="Cancel" id="clr" size="23" class="btn btn-black">
                </div>
            </div>
        </div>
    </div>
</div>
<div id="signDocumentContainer">
    <div class="signNav"><select id="selectActor" class="form-select"><option value="select">-Select Actor-</option><option value="actor1Sign">Actor1</option><option value="actor2Sign">Actor2</option></select> <button id="prevSign" class="btn btn-black"><<</button> <button id="nextSign" class="btn btn-black">>></button> <button id="applySign" class="btn btn-black">Sign</button></div>
    <div id="docContainer">
        <div id="signThumbnails" class="customScroll signWrap">
            <span class="signImgThumbContainer">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/1.jpg" class="signingDocThumb active">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/2.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/3.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/4.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/5.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/6.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/7.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/8.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/9.jpg" class="signingDocThumb">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/10.jpg" class="signingDocThumb">
            </span>
        </div>
        <div class="signIMG customScroll signWrap">     
            <span class="signImgContainer">
                <div>
                    <span class="signPplace actor1Sign" style="top: 793px;left: 136px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 1646px;left: 136px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 2498px;left: 134px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 3350px;left: 136px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 4203px;left: 136px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 5054px;left: 131px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 5904px;left: 130px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 6758px;left: 131px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 7609px;left: 158px;width: 187px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor1Sign" style="top: 7849px;left: 145px;width: 213px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                </div>
                <div>
                    <span class="signPplace actor2Sign" style="top: 794px;left: 462px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 1646px;left: 462px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 2498px;left: 460px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 3351px;left: 463px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 4203px;left: 462px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 5054px;left: 457px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 5904px;left: 457px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 6758px;left: 457px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 7609px;left: 484px;width: 197px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                    <span class="signPplace actor2Sign" style="top: 7849px;left: 408px;width: 201px; position: absolute;"><div class='signedArrow notSigned'>Sign 1/10</div></span>
                </div>

                <img src="<?php echo BASE_URL_API; ?>/component/docs/1.jpg" class="signingDoc" index="0">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/2.jpg" class="signingDoc" index="1">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/3.jpg" class="signingDoc" index="2">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/4.jpg" class="signingDoc" index="3">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/5.jpg" class="signingDoc" index="4">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/6.jpg" class="signingDoc" index="5">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/7.jpg" class="signingDoc" index="6">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/8.jpg" class="signingDoc" index="7">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/9.jpg" class="signingDoc" index="8">
                <img src="<?php echo BASE_URL_API; ?>/component/docs/10.jpg" class="signingDoc" index="9">
            </span>     
        </div>
        <div id="right-signed-wrap" class="customScroll signWrap">
            <ul>
                <li><span class="signed-title sign_icon">Signature 1</span></li>
                <li><span class="signed-title sign_icon">Signature 2</span></li>
                <li><span class="signed-title sign_icon">Signature 3</span></li>
                <li><span class="signed-title sign_icon">Signature 4</span></li>
                <li><span class="signed-title sign_icon">Signature 5</span></li>
                <li><span class="signed-title sign_icon">Signature 6</span></li>
                <li><span class="signed-title sign_icon">Signature 7</span></li>
                <li><span class="signed-title sign_icon">Signature 8</span></li>
                <li><span class="signed-title sign_icon">Signature 9</span></li>
                <li><span class="signed-title sign_icon">Signature 10</span></li>
            </ul> 


        </div>
    </div>
</div>