<!-- Cancel Dialog -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="confirmation-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to cancel?

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" id="exit-confirmation" onclick="callDetailsContentAction('C')" class="btn btn-black" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-black" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<!-- Cancel confirmation Dialog if add/edit form is visible -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="add-edit-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to cancel?

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" id="add-edit-btn" class="btn btn-black" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-black" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<!-- Cancel Confirmation Dialog (Operation Form) -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="operation-confirmation-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to cancel?

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal" id="operation-confirm">Yes</button>
                <button type="button" class="btn btn-black" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<!-- Alert Popup -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="alert-deal-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Alert</h4>
            </div>
            <div class="modal-body">
                <p><span>Please enter valid Customer #.</span>

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="alert-stock-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Alert</h4>
            </div>
            <div class="modal-body">
                <p><span>Please enter valid Stock #.</span>

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="alert-sales-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Alert</h4>
            </div>
            <div class="modal-body">
                <p><span>Please enter valid Sales Quote #.</span>

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="alert-fi-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Alert</h4>
            </div>
            <div class="modal-body">
                <p><span>Please enter a valid combination of FI Quote # &amp; Location.</span>

                </p>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<!-- operation(op) complete/incomplete popup -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="op-complete-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" id="" class="close op-complete-cancel" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">
                <p><span>Are you sure you want to mark this operation as Complete?</span></p>
            </div>
            <div class="modal-footer">
                <button type="button" id="op-complete-cnfrn" class="btn btn-black op-complete-cnfrn" data-dismiss="modal">Yes</button>
                <button type="button" id="op-complete-cancel" class="btn btn-black op-complete-cancel" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="op-incomplete-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close op-incomplete-cancel" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">

                <p><span>Are you sure you want to mark this operation as Incomplete?</span></p>
            </div>
            <div class="modal-footer">
                <button type="button" id="op-incomplete-cnfrn" class="btn btn-black op-incomplete-cnfrn" data-dismiss="modal">Yes</button>
                <button type="button" id="op-incomplete-cancel" class="btn btn-black op-incomplete-cancel" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="edit-opinfo-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Alert</h4>
            </div>
            <div class="modal-body">

                <p><span>This operation has been checked as Complete. To edit, uncheck the operation.</span></p>
            </div>
            <div class="modal-footer">
                <button type="button" id="" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<!-- new modal code add here for workspace disabled mode -->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="workspace-open-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close workspace-incomplete-cancel" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Confirm</h4>
            </div>
            <div class="modal-body">

                <p><span>This deal is not published yet. To publish, please assign roles on <b>Roles</b> tab and then hit <b>Publish</b>.
                        <br><br>Do you want to publish this deal?</span></p>
            </div>
            <div class="modal-footer">
                <button type="button"  onclick="getRolesOfPlugin(1);" class="btn btn-black op-incomplete-cnfrn" data-dismiss="modal">Yes</button>
                <button type="button"  class="btn btn-black op-incomplete-cancel" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="workspace-roles-open-popup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close workspace-roles-incomplete-cancel" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 id="workspace-roles-open-popup" class="modal-title">Confirm</h4>
            </div>
            <div class="modal-body">
                <p><span>This deal is not published yet. Please confirm if you want to publish this deal?</span></p>
            </div>
            <div class="modal-footer">
                <button type="button"  onclick="callEditContentAction(1);" class="btn btn-black op-incomplete-cnfrn" data-dismiss="modal">Yes</button>
                <button type="button"  class="btn btn-black op-incomplete-cancel" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="confirm-operation-completion" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close workspace-roles-incomplete-cancel" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 id="workspace-roles-open-popup" class="modal-title">Confirm</h4>
            </div>
            <div class="modal-body">
                <p><span>By completing this phase, all of your operations will be marked as complete and the  next phase will be enabled.<br/><br/> Please confirm that you want to complete this phase of the deal process?</span></p>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="completeAllOperation();" class="btn btn-black op-incomplete-cnfrn" data-dismiss="modal">Yes</button>
                <button type="button"  class="btn btn-black op-incomplete-cancel" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" id="commonConfirmPopup" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-body">
                <div class="series-content"> Are you sure you want to remove this message?                  
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black confirm-yes" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-black" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="exclamationPopup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Alert</h4>
            </div>
            <div class="modal-body">
                <p>This buyer is not registered in Digital Closing. He needs to register first to get Buyer role on this deal</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>



<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="multplePrintPopup" data-backdrop="static">
    <div class="modal-dialog small-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Alert</h4>
            </div>
            <div class="modal-body">
                <p>This buyer is not registered in Digital Closing. He needs to register first to get Buyer role on this deal</p>
                <div class="list-view">
                    <ul>
                        <li><a href="javascript:void(0)">
                            <div class="custom-checkbox"><input type="checkbox"><label></label></div>                            
                            <span>Lorem Ipsum is simply dummy text of the printing.</span>
                        </a></li>
                        <li><a href="javascript:void(0)">
                            <div class="custom-checkbox"><input type="checkbox"><label></label></div>    
                            <span>Lorem Ipsum is simply dummy text</span>
                        </a></li>
                        <li><a href="javascript:void(0)">
                            <div class="custom-checkbox"><input type="checkbox"><label></label></div>    
                            <span>Lorem Ipsum is simply dummy text of the printing.</span>
                        </a></li>
                        <li><a href="javascript:void(0)">
                            <div class="custom-checkbox"><input type="checkbox"><label></label></div>    
                            <span>Lorem Ipsum is simply dummy text</span>
                        </a></li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-black" data-dismiss="modal">Ok</button>
            </div>
        </div>
    </div>
</div>

<!--  Save on hold reason dialog box : Anil 00-->
<div class="modal fade plugin-custom-modal" tabindex="-1" role="dialog" id="onhold-open-popup" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"  class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">On Hold Reasons</h4>
            </div>
            <div class="modal-body">
                <div class="onholdres"></div>
            </div>
            <div class="modal-footer">
                <button type="button"   class="btn btn-black" data-dismiss="modal" onclick="saveOnholdReason(this);">Submit</button>               
            </div>
        </div>
    </div>
</div>