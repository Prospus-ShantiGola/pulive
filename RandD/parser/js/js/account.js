var InitallySetWidth = true;
    
/*
*Accounting Panel: Debit/Credit Calculation (shaheem)
*/
function calculateBalance()
{
    

    $('tbody tr td :input:text').not('.calculate-amount, .calculate-amount-hidden, .share-percentage-debit, .share-percentage-credit').attr('value','');

    calFlag = 0;
    
    $("input:checkbox[name=chkDebit]:checked").each(function(i, va){
        currentCol          = $(va).closest('td');
        currentRow          = $(va).closest('tr');
        currentColIndex     = currentCol.index();
        selectedOption      = currentCol.prev('td').find('.calculate-option option:selected').val();

        if(selectedOption=='Fixed')
        {
            inputAmount         = currentCol.prev('td').find('input.calculate-amount:visible').val();
        }
        else
        {
            if(currentCol.prev('td').find('input.calculate-amount-hidden').length > 0)
            {//check if calculate amount exist
                //inputAmount         = currentCol.prev('td').find('input.calculate-amount-hidden').val();
                inputAmount         = currentCol.prev('td').find('input.calculate-amount-hidden:last').val();
            }
            else
            {//else assing null
                inputAmount = '';
            }
        }
        
        debitPercentage = currentRow.next('tr').find('td.cell-'+currentColIndex).find('input.share-percentage-debit:visible').val();

        if(selectedOption != '' && inputAmount != '' && debitPercentage != '')
        {
            calFlag = 1;
            shareDebit = (inputAmount * debitPercentage)/100;
            
            currentRow.next('tr').next('tr').find('td.cell-'+currentColIndex).find('input.share-debit:visible').attr('value', shareDebit.toFixed(2));
            currentRow.next('tr').next('tr').next('tr').find('td.cell-'+currentColIndex).find('input.distribution-debit:visible').attr('value', shareDebit.toFixed(2));

            //Check if multiple credit checked for single row and sum of credit should not be more than 100%
            var totalcreditPercentage = 0;
            /*if($(currentRow).find("input:checkbox[name=chkCredit]:checked").length > 1)
            {*/
                $(currentRow).find("input:checkbox[name=chkCredit]:checked").each(function(i, vc){
                    creditIndex    = $(vc).closest('td').index();
                    totalcreditPercentage  +=   parseFloat(currentRow.next('tr').find('td.cell-'+creditIndex).find('input.share-percentage-credit:visible').val());

                    if(totalcreditPercentage > 100)
                    {
                        

                        if( $.trim(parseInt($('#hidden-popup').val())) == 0){
                            var feesName = $(currentRow).find('div.account-title.fee-title').text();
                            bootbox.alert(
                                "Sum of Credit should not be more than 100 for "+feesName, 
                                function() {
                                $('#hidden-popup').attr('value',0);
                            });
                            $('#hidden-popup').attr('value',1);
                            return false;
                        }

                    }
                });
            /*}*/

            //Calculation for Credit Part
            $(currentRow).find("input:checkbox[name=chkCredit]:checked").each(function(i, vd){
                creditColIndex          = $(vd).closest('td').index();
                creditPercentage  =   currentRow.next('tr').find('td.cell-'+creditColIndex).find('input.share-percentage-credit:visible').val();
                if(totalcreditPercentage <= 100 && creditPercentage != ''){
                    shareCredit = (inputAmount * creditPercentage)/100;
                    currentRow.next('tr').next('tr').find('td.cell-'+creditColIndex).find('input.share-credit:visible').attr('value', shareCredit.toFixed(2));
                    currentRow.next('tr').next('tr').next('tr').find('td.cell-'+creditColIndex).find('input.distribution-credit:visible').attr('value', shareCredit.toFixed(2));
                }
            });
        }
    });

    if(calFlag == 1)
    {
        //Column wise calculation of total Debit Amount
        $('tbody tr.row-group').find('td input:checkbox[name=chkDebit]:checked').each(function(i,v){
            var colDebit          = $(v).closest('td');
            var rowDebit          = $(v).closest('tr');
            var colIndexDebit     = colDebit.index();
            var totalValDebit = 0;
            $('tbody tr.row-share').each(function(i,vt){
                var shareDebit =  $(vt).find('td.cell-'+colIndexDebit+' :input.share-debit:visible').val();
                if(typeof shareDebit != 'undefined'){
                    totalValDebit   = parseFloat(shareDebit)+parseFloat(totalValDebit);
                    if(!isNaN(totalValDebit)){
                        $(vt).next('tr').next('tr.row-balance').find('td.cell-'+colIndexDebit+' :input.total-debit').attr('value',totalValDebit.toFixed(2));
                    }
                }else{
                    if(totalValDebit != 0 ){
                        if(!isNaN(totalValDebit)){
                            $(vt).next('tr').next('tr.row-balance').find('td.cell-'+colIndexDebit+' :input.total-debit').attr('value',totalValDebit.toFixed(2));
                        }
                    }
                }
            });
        });

        //Column wise calculation of total Credit Amount
        $('tbody tr.row-group').find('td input:checkbox[name=chkCredit]:checked').each(function(i,v){

            var colCredit          = $(v).closest('td');
            var rowCredit          = $(v).closest('tr');
            var colIndexCredit     = colCredit.index();
            var totalValCredit = 0;
            $('tbody tr.row-share').each(function(i,vt){
                var shareCredit =  $(vt).find('td.cell-'+colIndexCredit+' :input.share-credit:visible').val();

                if(typeof shareCredit != 'undefined'){
                    totalValCredit   = parseFloat(shareCredit)+parseFloat(totalValCredit);

                    if(!isNaN(totalValCredit)){
                        $(vt).next('tr').next('tr.row-balance').find('td.cell-'+colIndexCredit+' :input.total-credit').attr('value',totalValCredit.toFixed(2));
                    }
                }else{
                    if(totalValCredit != 0){
                        $(vt).next('tr').next('tr.row-balance').find('td.cell-'+colIndexCredit+' :input.total-credit').attr('value',totalValCredit.toFixed(2));
                    }
                }
            });
        });

        //Calculation of Balance for every transaction of each node/Domain
        $('tbody tr.row-balance').each(function(i,vb){
            var finalTotalDebitBalance  = 0;
            var finalTotalCreditBalance = 0;
            $(vb).find('input.total-balance').each(function(i,vtb){
                var totalCredit  = $(vtb).closest('td').prev('td').find('input.total-credit').val();
                var totalDebit   = $(vtb).closest('td').prev('td').prev('td').find('input.total-debit').val();
                if(typeof totalDebit == 'undefined' || totalDebit == ''){ //Assing zero if undefined
                    totalDebit = 0;
                }else{
                    finalTotalDebitBalance = parseFloat(finalTotalDebitBalance) + parseFloat(totalDebit);
                }

                if(typeof totalCredit == 'undefined' || totalCredit == ''){ //Assing zero if undefined
                    totalCredit = 0;
                }else{
                    finalTotalCreditBalance = parseFloat(finalTotalCreditBalance) + parseFloat(totalCredit);
                }

                var totalBalance = parseFloat(totalDebit) - parseFloat(totalCredit);
                if(!isNaN(totalBalance)){ 
                    $(vtb).attr('value',totalBalance);
                }else{
                    $(vtb).attr('value','');
                }
            });

            var finalTotalBalance = parseFloat(finalTotalDebitBalance) - parseFloat(finalTotalCreditBalance);

            if(!isNaN(finalTotalDebitBalance)){
                $(vb).find('input.final-total-debit').attr('value', finalTotalDebitBalance.toFixed(2));//Final Debit Balance
            }

            if(!isNaN(finalTotalCreditBalance)){
                $(vb).find('input.final-total-credit').attr('value', finalTotalCreditBalance.toFixed(2));//Final Credit Balance
            }

            if(!isNaN(finalTotalBalance)){
                $(vb).find('input.final-total-balance').attr('value', finalTotalBalance.toFixed(2));//Final Total Balance
            }

            //Check for Distribution final Balance Debit
            var finalTotalDistributionDebitBalance  = 0;
            $(vb).prev('tr.row-distribution').find('input.distribution-debit:visible').each(function(i,vdb){
                var distributionDValue  =   $(vdb).val();
                if(typeof distributionDValue == 'undefined' || distributionDValue == ''){ 
                    distributionDValue = 0;
                }else{
                    finalTotalDistributionDebitBalance = parseFloat(finalTotalDistributionDebitBalance) + parseFloat(distributionDValue);
                }
            });

            //Check for Distribution final Balance Credit
            var finalTotalDistributionCreditBalance  = 0;
            $(vb).prev('tr.row-distribution').find('input.distribution-credit:visible').each(function(i,vcb){
                var distributionCValue  =   $(vcb).val();
                if(typeof distributionCValue == 'undefined' || distributionCValue == ''){
                    distributionCValue = 0;
                }else{
                    finalTotalDistributionCreditBalance = parseFloat(finalTotalDistributionCreditBalance) + parseFloat(distributionCValue);
                }
            });

            var finalTotalDistributionBalance = parseFloat(finalTotalDistributionDebitBalance) - parseFloat(finalTotalDistributionCreditBalance);

            if(!isNaN(finalTotalDistributionDebitBalance)){
                $(vb).prev('tr.row-distribution').find('input.final-distribution-debit').attr('value', finalTotalDistributionDebitBalance.toFixed(2));//Final Distribution Debit Balance 
            }

            if(!isNaN(finalTotalDistributionCreditBalance)){
                $(vb).prev('tr.row-distribution').find('input.final-distribution-credit').attr('value', finalTotalDistributionCreditBalance.toFixed(2));//Final Distribution Credit Balance
            }

            if(!isNaN(finalTotalDistributionBalance)){
                $(vb).prev('tr.row-distribution').find('input.final-distribution-balance').attr('value', finalTotalDistributionBalance.toFixed(2));//Final Distribution Total Balance
            }
        });
    } 

}

//Accounting Panel: Make editable field light (Vimal)
function makeEditableYellow(){
    $('.account-grid input[type="text"]').each(function(i,v){
       if ( !$(v).is('[readonly]')) { 
           $(v).addClass('highlighted');
           $(v).parents('.account-node').addClass('highlighted');
       }
    });
    $('.account-grid input[type=checkbox]:not(:disabled)').each(function(i,v){
        //console.log($('.account-grid input[type=checkbox]:not(:disabled)'));
         $(v).parent().addClass('highlighted');
    });
}

function financialGrid() {
    $('.center-div.account-grid table#account-table').fixedTblHdrLftCol({
        scroll: {
            leftCol: {
                fixedSpan: 2
            }
        }
    });
    
    $('.center-div .fTHLC-inner-wrapper').scrollLeft(1);
    setTopPosition();
    // setWidthInitialy();
    // setTableWidth();
   
    /*
    *Accounting Panel: Delete Dynamic Nodes (shaheem)
    */
    $('th li.delete-li').on('click',function(){
        var deleteType;//Identify what to delete
        if($(this).hasClass('delete-domain')){
            deleteType  =   'Domain';//Delete Domain
        }else if($(this).hasClass('delete-node')){
            deleteType  =   'Node';//Delete Node
        }
        var $this          =   $(this).closest('th');
        var dataSection    =   $this.data('section').split('-');//Identify current section domain/node
        
        bootbox.confirm({
            title: 'Alert',
            message: 'Are you sure you want to Delete this '+deleteType+'?',
            buttons: {
            'cancel': {
               label: 'Cancel',
               className: 'btn-default'
            },
            'confirm': {
               label: 'Delete',
               className: 'btn-primary'
            }
            },
            callback: function(result) {
                  if(result){
                        displayLoader();//Display Loader

                    if (!$this.hasClass('show')) {
                        hideDrodownMenu();//Hide the dropdown
                        var LastsectionColIndex = 0;
                        $('.add-segment ul.dropdown-menu').removeClass('show');
                        $('i.segment').removeClass('show');
                        var sectionName = $this.attr('data-section');

                        if(deleteType == 'Domain'){//In case of Domain delete
                              undefinedSellerBuyerLength = 0;
                              undefinedSellerBuyerLength   =   $('.center-div .account-head-title.seller-buyer-section').length;//Identify no. of seller-buyer node
                              sellerNodeLength  =   $('.center-div .account-head-title.'+sectionName+'.sellerSection-node').length;//Identify seller node
                              buyerNodeLength  =   $('.center-div .account-head-title.'+sectionName+'.buyerSection-node').length;//Identify buyer node
                              authorityNodeLength  =   $('.center-div .account-head-title.'+sectionName+'.authoritySection-node').length;//Identify buyer node

                              sellerNodeLengthLoop = 0; buyerNodeLengthLoop = 0; authorityNodeLengthLoop = 0;//Initialize loop variable

                            $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {//Loop Start
                                sectionColIndex = $(v).index();

                            if (sectionColIndex != LastsectionColIndex) {
                                    if (sectionName == lastSectionName) {
                                        if(dataSection[0] == 'undefinedSellerBuyerSection' ){//for BuyerSeller Section only

                                        if( undefinedSellerBuyerLength > 1){//Delete if more than one same domain
                                            $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                            $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column'); 
                                        }else{
                                             nodeSection1 = $('.center-div .row-2').find('.cell-' + sectionColIndex).data('section').split('-');
                                            if(nodeSection1[0] == 'sellerSection'){//seller section node
                                            if(sellerNodeLength > 1){//Delete structure for more than one same node
                                                   sellerNodeLengthLoop++
                                                   if(sellerNodeLengthLoop < 6){//collapse for first node
                                                       $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                       $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                       $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                                   }else{//Delete for second node
                                                       $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                                       $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column');     
                                                   }
                                               }else{//Collapse for basic structure
                                                    $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                           } 
                                         }

                                         if(nodeSection1[0] == 'buyerSection'){//Buyer section node
                                                if(buyerNodeLength > 1){
                                                    buyerNodeLengthLoop++
                                                    if(buyerNodeLengthLoop < 6){//collapse for first node
                                                        $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                        $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                        $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                                    }else{//Delete for second node
                                                        $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                                        $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column'); 
                                                    }
                                                }else{//Collapse for basic structure
                                                    $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                                    }
                                                }
                                            }
                                        }else if(dataSection[0] == 'indiaSection'){//India section column
                                            if(authorityNodeLength > 1){
                                                    authorityNodeLengthLoop++
                                                    if(authorityNodeLengthLoop < 6){//collapse for first node
                                                        $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                        $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                        $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                                    }else{//Delete for second node
                                                        $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                                        $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column'); 
                                                    }
                                                }else{//Collapse for basic structure
                                                    $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                    $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                                    }
                                        }else{
                                           $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                           $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column');
                                        } 
                                        } 
                                    }
                                LastsectionColIndex = sectionColIndex;
                                lastSectionName = sectionName;
                                lastSubSectionName = "sub" + sectionName;
                                selectedByParent = false;
                        });

                        }else{//In case of Node Delete
                            var splitSection    =   sectionName.split('-');//Identify Node data section
                            var nodeType        =   splitSection[0]+'-node';//Identify Node Type
                            var currentColIndex =  $($this).index();//Find current cell index
                            var parentDataSection = $('.center-div .row-1').find('.cell-' + currentColIndex).data('section');
                            var splitParentSection = parentDataSection.split('-');//Identify Domain Data Section

                            nodeLength  =   $('.center-div .account-head-title.'+parentDataSection+'.'+nodeType).length;//Identify no. of node within same Domain
                            accountNodeTitle1 = '<div class="col-head"></div>';//Used to retain node title 
                            accountNodeTitle2 = '<div class="col-head"></div>';//Used to retain node title
                            indexLoop = 0; 
                            totalLoop = $('.center-div [data-section=' + sectionName + ']').length;
                           $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {
                                indexLoop++;
                                sectionColIndex = $(v).index();    
                                if (sectionColIndex != LastsectionColIndex) {
                                    if (sectionName == lastSectionName) {
                                        if(splitParentSection[0] == 'undefinedSellerBuyerSection' && nodeLength > 1){//Delete if more than one same node
                                            if(indexLoop == 2){//Get Node Title for same node Under single Domain
                                                accountNodeTitle1 = $('.center-div .row-1').find('th.cell-' + sectionColIndex).prev('.acntSecCol').html();
                                                accountNodeTitle2 = $('.center-div .row-1').find('th.cell-' + sectionColIndex).html();
                                            }
                                            if( indexLoop == totalLoop){
                                               //Insert Node Title with html if not empty 
                                               if($('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').data('section') == parentDataSection ){
                                                   $('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').html(accountNodeTitle1);
                                               }
                                               //Insert Node Title with html if not empty
                                               if($('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').next('th').data('section') == parentDataSection ){
                                                   $('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').next('th').html(accountNodeTitle2);
                                               }
                                            }
                                            //Delete Columns
                                            $('.center-div .cell-' + sectionColIndex).addClass('deleted-column'); 
                                            $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column'); 

                                        }else{
                                            if(nodeLength > 1){
                                                if(indexLoop == 2){//Get Node Title for same node Under single Domain
                                                    accountNodeTitle1 = $('.center-div .row-1').find('th.cell-' + sectionColIndex).prev('.acntSecCol').html();
                                                    accountNodeTitle2 = $('.center-div .row-1').find('th.cell-' + sectionColIndex).html();
                                                }
                                                if( indexLoop == totalLoop){
                                                   //Insert Node title
                                                   if($('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').data('section') == parentDataSection ){
                                                       $('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').html(accountNodeTitle1);
                                                   }
                                                   //Insert Node title
                                                   if($('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').next('th').data('section') == parentDataSection ){
                                                       $('.center-div .row-1').find('th.cell-' + sectionColIndex).next('th').next('th').html(accountNodeTitle2);
                                                   }
                                                }

                                                //Collapse if only one node
                                                $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').addClass('deleted-column');
                                                $('.center-div .cell-' + sectionColIndex).addClass('deleted-column');
                                            }else{
                                                //Collapse if only one node
                                                $('.center-div .cell-' + sectionColIndex).prev('.acntSecCol').removeClass('HideSection');
                                                $('.center-div .cell-' + sectionColIndex).addClass('HideSection');
                                                $('.center-div .cell-' + sectionColIndex).find('input[type=checkbox]:checked:not(:disabled)').prop('checked',false).trigger("change", ['Trigger']);
                                            }
                                        } 
                                    }
                           }
                                LastsectionColIndex = sectionColIndex;
                                lastSectionName = sectionName;
                                lastSubSectionName = "sub" + sectionName;
                                selectedByParent = false;
                        });
                       }
                        $('.center-div .deleted-column').remove();//Remove Columns
                            removeAccountCellClass();
                            setAccountCellClass();
                            manageDomainIcon();//Manage Plus Icons for Domain
                            InitallySetWidth = false;
                            AcountTableWidth();
                            hideLoader();
                    }
        }else{
            hideDrodownMenu();//Hide the dropdown
        }
        calculateBalance();
        
         
            }
        });
     
    });

    /*
     *Accounting Panel: Check/Uncheck Debit/Credit (shaheem)
     * will uncheck its adjacent checkbox and hide text fields of respective rows column
     */
    $('input[type="checkbox"]').on('change', function(e, from) {
       
        var $box            = $(this);
        var $value          = $(this).val();//value of current checkbox
        var current_cell    = $.grep($($box.closest('td')).attr('class').split(" "), function(v, i) {
                                        return v.indexOf('cell-') === 0;
                                }).join();
        current_cell        =   $.trim(current_cell);//Current cell class
        
        if ($box.is(":checked")){//If checked
            //alert('455');
            if($value == 'debit'){//if debit checkbox is checked
               
                if($box.closest('td').next('td').find('input[type=checkbox]').is(":checked")){ //check if adjacent checkbox is also checked
                           
                    var next_cell = $.grep($($box.closest('td').next('td')).attr('class').split(" "), function(v, i) {//Get adjacent cell class
                                        return v.indexOf('cell-') === 0;
                                    }).join();
                            
                    //Check if adjacent Debit checkbox value is not null
                    var chkCreditValue = $box.closest('tr').nextUntil('.row-group').find('.'+next_cell).find('input[type="text"]:not([readonly="readonly"])').val();
                    
                    if(chkCreditValue != ''){//alert('467');
                        bootbox.confirm({
                            title: 'Warning',
                            message: 'Unset will Reset current value',
                            buttons: {
                                'cancel': {
                                   label: 'Cancel',
                                   className: 'btn-default'
                                },
                                'confirm': {
                                   label: 'Proceed Anyway',
                                   className: 'btn-primary'
                                }
                            },
                            callback: function(result) {
                                 if (result) {
                                     
                                      $box.closest('td').next('td').find('input[type=checkbox]').attr("checked", false);//Set adjacent checkbox to unchecked
                                      //Hide adjacent checkbox fields if already checked
                                      $box.closest('tr').nextUntil('.row-group').find('.'+next_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');
                                      
                                      enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes

                                     $box.closest('td').prev('td').removeClass('creation-bg').find('div.account-node').show().find('select,input').removeClass('hide');//Hide previous div input fields
                                      var cellIndex = $box.closest('td').prev('td').index();
                                      $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).addClass('custom-border');
                                      $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide Debit columns

                                }else{
                                      $box.attr("checked", false);
                                } 
                            }
                        });
                    }else{
                        //alert('501');            
                        enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes
    
                        $box.closest('td').prev('td').removeClass('creation-bg').find('div.account-node').show().find('select,input').removeClass('hide');//Hide previous div input fields
                        var cellIndex = $box.closest('td').prev('td').index();

                        $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).addClass('custom-border');

                        $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide Debit columns
                        
                        $box.closest('td').next('td').find('input[type=checkbox]').attr("checked", false);//Set adjacent checkbox to unchecked
                        
                        /*DONE by Divya Rajput
                        * ON Date 30 SEPT 2015
                        * To show calculate-amount value 0 
                        * when checkbox of debit is checked*/
                        $box.closest('td').prev('td').find('.calculate-amount').val('');
                        $box.closest('td').prev('td').find('.calculate-amount').attr('value',' ');

                        $box.closest('tr').next('tr.row-share-percentage').find('.share-percentage-debit').attr('value','100');
                        /*End Here*/

                        var next_cell = $.grep($($box.closest('td').next('td')).attr('class').split(" "), function(v, i) {//Get adjacent cell class
                                            return v.indexOf('cell-') === 0;
                                        }).join();
                        

                        //Hide adjacent checkbox fields if already checked
                        $box.closest('tr').nextUntil('.row-group').find('.'+next_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');
                    }
                }else{
                    enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes

                    $box.closest('td').prev('td').removeClass('creation-bg').find('div.account-node').show().find('select,input').removeClass('hide');//Hide previous div input fields
                    var cellIndex = $box.closest('td').prev('td').index();
                    $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).addClass('custom-border');
                    $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide Debit columns
                }
               
                       }else if($value == 'credit'){//if credit checkbox is checked
                   
                        //Find previous column in order to hide debit section
                            var prev_cell = $.grep($($box.closest('td').prev('td')).attr('class').split(" "), function(v, i) {
                                    return v.indexOf('cell-') === 0;
                            }).join();
                            
                    if($box.closest('td').prev('td').find('input[type=checkbox]').is(":checked")){//check if debit checkbox is checked
                        
                            var chkDebitValue =$box.closest('tr').nextUntil('.row-group').find('.'+prev_cell).find('input[type="text"]:not([readonly="readonly"])').val();
                            
                            if(chkDebitValue != '')
                            {//alert('553');
                                bootbox.confirm({
                                        title: 'Warning',
                                        message: 'Uncheck will Reset current value',
                                        buttons: {
                                                    'cancel': {
                                                       label: 'Cancel',
                                                       className: 'btn-default'
                                                    },
                                                    'confirm': {
                                                       label: 'Proceed Anyway',
                                                       className: 'btn-primary'
                                                    }
                                        },
                                        callback: function(result) {
                                    
                                            if (result) {                                         
                                                //alert('569');
                                                $box.closest('td').prev('td').find('input[type=checkbox]').attr("checked", false);//Uncheck debit checkbox

                                                $box.closest('td').prev('td').prev('td').addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide amount section for debit
                                                $box.closest('tr').nextUntil('.row-group').find('.'+prev_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide debit input fields

                                                enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes

                                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide credit input columns
                                                var cellIndex = $box.closest('td').prev('td').prev('td').index();
                                                $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                                                calculateBalance();//Calculate Balance
                                            }else{
                                                $box.attr("checked", false);
                                            }
                                        }
                                }); 
                            }else{
                                
                                $box.closest('td').prev('td').find('input[type=checkbox]').attr("checked", false);//Uncheck debit checkbox
                                
                                         $box.closest('td').prev('td').prev('td').addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide amount section for debit
                                          $box.closest('tr').nextUntil('.row-group').find('.'+prev_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide debit input fields
                            
                                          enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes
                                          
                                           $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide credit input columns
                                           var cellIndex = $box.closest('td').prev('td').prev('td').index();
                                           $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                            }
                            
                           
                    }else{
                            $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).removeClass('creation-bg').find('div.account-node').show().find('input').removeClass('hide');//Hide credit input columns
                            var cellIndex = $box.closest('td').prev('td').prev('td').index();
                            $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                    }
                }
            
            } else {//If unchecked
                //alert('609');
                    //check if text input value is not null
                    var txtValue = $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).find('input[type="text"]:not([readonly="readonly"])').val();
                        if(txtValue != '' && from != 'Trigger'){//check if text input value is not null and check if event is not triggered
                        //alert('613');
                         bootbox.confirm({
                                        title: 'Warning',
                                        message: 'Uncheck will Reset current value',
                                        buttons: {
                                        'cancel': {
                                           label: 'Cancel',
                                           className: 'btn-default'
                                        },
                                        'confirm': {
                                           label: 'Proceed Anyway',
                                           className: 'btn-primary'
                                        }
                                        },
                                        callback: function(result) {
                                    if (result) {
                                         if($value == 'debit'){//if debit checkbox unchecked
                                                
                                                enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes

                                                $box.closest('td').prev('td').addClass('creation-bg').find('div.account-node').hide().find('select,input').addClass('hide').attr('value','');//Hide amount field for debit
                                                var cellIndex = $box.closest('td').prev('td').index();
                                                $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide();//Hide debit input columns
                                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).find('input').addClass('hide').attr('value','');//Reset Input fields
                                            }else if($value == 'credit'){//if credit checkbox unchecked

                                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide();//Hide credit input columns
                                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).find('input').addClass('hide').attr('value','');//Reset Input fields
                                                var cellIndex = $box.closest('td').prev('td').prev('td').index();
                                                $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                                            }
                                            calculateBalance();//Calculate Balance
                                    }else{
                                            $box.attr("checked", true);
                                    }
                                        }
                                });
                    }else{
                        
                        if($value == 'debit'){//if debit checkbox unchecked
                    
                                enableDisableCheckbox($box);//Enable/Disable all sibling Debit checkboxes

                                $box.closest('td').prev('td').addClass('creation-bg').find('div.account-node').hide().find('select,input').addClass('hide').attr('value','');//Hide amount field for debit
                                var cellIndex = $box.closest('td').prev('td').index();
                                $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide debit input columns

                            }else if($value == 'credit'){//if credit checkbox unchecked

                                $box.closest('tr').nextUntil('.row-group').find('.'+current_cell).addClass('creation-bg').find('div.account-node:not(.total)').hide().find('input').addClass('hide').attr('value','');//Hide credit input columns
                                var cellIndex = $box.closest('td').prev('td').prev('td').index();
                                $box.closest('td').prev('td').closest('tr').next('tr').children('td.cell-'+cellIndex).removeClass('custom-border');
                            }
                    }
                    
               
            }
        });

    /*
    *Accounting Panel: Set textbox attribute in order to hold value (shaheem)
    */
    $('input[type="text"]').on('blur',function(){
        if($.trim($(this).siblings('.calculate-option').val()) == "Percentage"){  
            var hidden_selected_value = $(this).siblings('.selected-amount-hidden').val();  
            var percentage_value = $.trim($(this).val());                               
            var hiddenCalculateAmount = (hidden_selected_value * percentage_value)/100; 
            
            $(this).siblings('.calculate-amount-hidden').attr('value','');
            $(this).siblings('.calculate-amount-hidden').attr('value',hiddenCalculateAmount);
        }


        if($.trim($(this).val()) != ''){
            $(this).attr('value',$(this).val());
        }
        
        calculateBalance();//Calculate Balance
    });

   
    /*
    *Accounting Panel: Set checkbox attribute in order to hold value (shaheem)
    */
    $('input[type="checkbox"]').on('change', function() {
          if ($(this).is(":checked")) {
              $(this).attr("checked", true);
          }else{
              $(this).attr("checked", false);
          }
    });
    
    /*
    *Accounting Panel: Set select attribute in order to hold value (shaheem)
    */
    $('select').on('change', function() {
        $(this).find("option[value="+$(this).val()+"]").attr("selected","selected");
        if($(this).val() == 'Percentage'){
            $(this).siblings('.calculate-amount').attr('value','');
            $(this).siblings('i.add').show().addClass('addDisabled');
            $(this).siblings('input').removeClass('full-width');
        }else{
            $(this).siblings('.calculate-amount').attr('value','');
            $(this).siblings('i.add').hide().removeClass('addDisabled');
            $(this).siblings('input').addClass('full-width');
            $(this).find('input.calculate-amount-hidden').remove();
        } 
        calculateBalance();//Calculate Balance
    });
    
    /*
    *Accounting Panel: Disable all Debit checkboxes if one checked for a single row (shaheem)
    */
    function enableDisableCheckbox(obj){

        if(obj.is("input:checkbox[name=chkDebit]:checked")){
            obj.closest('td').siblings('td').find($('input:checkbox[name=chkDebit]')).attr('disabled',true).closest('div.account-node').removeClass('highlighted');
        }else{
            obj.closest('td').siblings('td').find($('input:checkbox[name=chkDebit]')).attr('disabled',false).closest('div.account-node').addClass('highlighted');
        }
    }


    /*
    *Accounting Panel: Add Seller/Buyer (shaheem)
    */
    $('.add-domain-node').on('click', function() {
        
        var $_this       = $(this);
        var nodeType     = $(this).data('node');
    
        displayLoader();
        var addtdWrapper = $_this.closest('th');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();
       
        var current_cell = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
                return v.indexOf('cell-') === 0;
        }).join();
        
        var dataArrayHead = Array();
        var dataArrayBody = Array();
        var index  = 0;
        var index1 = 0;
        $(".center-div.account-grid table#account-table").each(function() {
                var $table = $(this);
                var $hrows = $("thead tr", $(this));
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];
                

                $hrows.each(function(row, v) {
                        var rowClass = $(v).attr('class');
                        $(v).find("th").each(function(cell, va) {
                                dataArrayHead[index] = row + '@' + cell + '@' + rowClass + '@' + $(va).attr('class') + '@' + $(va).html() + '@' + $(va).data('section');
                                index++;

                        });
                });
               
               $rows.each(function(row, v) {
                        var rowClass = $(v).attr('class');
                        var debitChkLength = $(v).find("input:checkbox[name=chkDebit]:checked").length;
                        $(v).find("td").each(function(cell, va) {
                                dataArrayBody[index1] = row + '@' + cell + '@' + rowClass + '@' + $(va).attr('class') + '@' + $(va).html()+'@'+debitChkLength;
                                index1++;

                        });
                });

        });
      
        if(nodeType == 'Seller-Buyer'){
                $.post(domainUrl + 'accounts/addSellerBuyer', {
                        'datathead' :   dataArrayHead,
                        'datatbody' :   dataArrayBody,
                        'myCol'     :   myCol,
                        'myRow'     :   myRow
                }, accountResponseAddSeller, 'HTML');
        }else{
                $.post(domainUrl + 'accounts/addSeller', {
                        'datathead' :   dataArrayHead,
                        'datatbody' :   dataArrayBody,
                        'myCol'     :   myCol,
                        'myRow'     :   myRow,
                        'nodeType'  :   nodeType //this will set node as Seller/Buyer
                }, accountResponseAddSeller, 'HTML');
        }
   
     });
 
    
     /*
    *Accounting Panel: Add Seller/Buyer/Authority within domain (shaheem)
    */
    $('.add-node').on('click', function() {
       
        var $_this       = $(this);
        var nodeType     = $(this).data('node');
 
        displayLoader();
        var addtdWrapper = $_this.closest('th');
        var addtrWrapper = $(addtdWrapper).closest('tr');
        var addtableWrapper = $(addtrWrapper).closest('table');
        var myCol = $(addtdWrapper).index();
        var myRow = $(addtrWrapper).index();
       
        var current_cell = $.grep($(addtdWrapper).attr('class').split(" "), function(v, i) {
                return v.indexOf('cell-') === 0;
        }).join();
        
        var dataArrayHead = Array();
        var dataArrayBody = Array();
        var index  = 0;
        var index1 = 0;
        $(".center-div.account-grid table#account-table").each(function() {
                var $table = $(this);
                var $hrows = $("thead tr", $(this));
                var $rows = $("tbody tr", $(this));
                var headers = [];
                var rows = [];


                $hrows.each(function(row, v) {
                        var rowClass = $(v).attr('class');
                        $(v).find("th").each(function(cell, va) {
                                dataArrayHead[index] = row + '@' + cell + '@' + rowClass + '@' + $(va).attr('class') + '@' + $(va).html()+ '@' + $(va).data('section');
                                index++;

                        });
                });
               
               $rows.each(function(row, v) {
                        var rowClass = $(v).attr('class');
                        var debitChkLength = $(v).find("input:checkbox[name=chkDebit]:checked").length;
                        $(v).find("td").each(function(cell, va) {
                                dataArrayBody[index1] = row + '@' + cell + '@' + rowClass + '@' + $(va).attr('class') + '@' + $(va).html()+'@'+debitChkLength;
                                index1++;

                        });
                });

        });
            $.post(domainUrl + 'accounts/addNode', {
                    'datathead'     :   dataArrayHead,
                    'datatbody'     :   dataArrayBody,
                    'myCol'         :   myCol,
                    'myRow'         :   myRow,
                    'nodeType'      :   nodeType //this will set node as authority/seller/buyer
                }, accountResponseAddSeller, 'HTML');
        
   
     });
    
     
    $('.center-div.account-grid').find('#account-table').find('tr').last().children('td').addClass('border-bottom');
    
    addCellClass();
    
    $('.center-div.account-grid').find('#account-table').find('tr').each(function() {
        $(this).children('td').last().addClass('border-right');
        $(this).children('th').last().addClass('border-right');
        $(this).children('td:nth-child(2)').addClass('border-left');
        $(this).children('th:nth-child(2)').addClass('border-left');
    });

    var cntrWidth = $("#center-screen").width();
    var cntrHeight = $("#center-screen").height();
     $('.center-div.account-grid').find('.fTHLC-inner-wrapper').css({
        'width': cntrWidth - 200,
        'height': cntrHeight-114
    });
    $('.center-div.account-grid').find('.fTHLC-outer-wrapper').css({
        'width': cntrWidth - 200,
        'height': cntrHeight
    });

   

  setAccountCellClass();
    
    $('body').off('click', '.center-div .col-highlight');
    $('body').on('click', '.center-div .col-highlight', function(event) {
        hideDrodownMenu();
        $('.row-selected').removeClass('row-selected');

        var colIndex = $(this).parent('th').index();
        var tdCol = $('.cell-' + colIndex);
        var tdbodyCol = $('td.cell-' + colIndex);
        var tdheadCol = $('.row-4').children('th.cell-' + colIndex);

        if($(this).parent().hasClass("select-byparent")){
           $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
            $('td,th').find('.node-white-circle').removeClass('node-green-circle');
            $(tdbodyCol).addClass('bg-green border-left-green');
            $(tdheadCol).addClass('bg-green border-left-green border-top-green');
            if($(tdbodyCol).next('td').hasClass('HideSection')){
                $(tdbodyCol).next().next('td').addClass('border-left-green');
                $(tdheadCol).next().next('th').addClass('border-left-green');
              } else {
                $(tdbodyCol).next('td').addClass('border-left-green');
                $(tdheadCol).next('th').addClass('border-left-green');
            }
            $('td.border-bottom.cell-' + colIndex).addClass('border-bottom-green');
            $(tdbodyCol).find('.node-white-circle').addClass('node-green-circle');
            $(this).parent().removeClass("select-byparent");
        } else {
          if ($(this).parent('th').hasClass('bg-green')) {
            $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
            $('td,th').find('.node-white-circle').removeClass('node-green-circle');
            $(tdbodyCol).removeClass('bg-green border-left-green');
            $(tdheadCol).removeClass('bg-green border-left-green border-top-green');
            if($(tdbodyCol).next('td').hasClass('HideSection')){
                $(tdbodyCol).next().next('td').removeClass('border-left-green');
                $(tdheadCol).next().next('th').removeClass('border-left-green');
              } else {
                $(tdbodyCol).next('td').removeClass('border-left-green');
                $(tdheadCol).next('th').removeClass('border-left-green');
            }
            $(this).children('td.border-bottom.cell-' + colIndex).removeClass('border-bottom-green');
            $(tdbodyCol).find('.node-white-circle').removeClass('node-green-circle');

            $(tdheadCol).next('th').removeClass('border-left-green');
          } else {
              $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
              $('td,th').find('.node-white-circle').removeClass('node-green-circle');
              $(tdbodyCol).addClass('bg-green border-left-green');
              $(tdheadCol).addClass('bg-green border-left-green border-top-green');
              if($(tdbodyCol).next('td').hasClass('HideSection')){
                $(tdbodyCol).next().next('td').addClass('border-left-green');
                $(tdheadCol).next().next('th').addClass('border-left-green');
              } else {
                $(tdbodyCol).next('td').addClass('border-left-green');
                $(tdheadCol).next('th').addClass('border-left-green');
              }
              $('td.border-bottom.cell-' + colIndex).addClass('border-bottom-green');
              $(tdbodyCol).find('.node-white-circle').addClass('node-green-circle');   
          }
           
        }
       event.stopPropagation();
        
           
    });


    $('body').on('click', '.center-div .account-node', function(event) {

        hideDrodownMenu();
        $('.row-selected').removeClass('row-selected');

        $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
        $('td,th').find('.node-white-circle').removeClass('node-green-circle');


        var colIndex = $(this).parent('td').index();


        $(this).parent('td.cell-' + colIndex).addClass('bg-green border-left-green border-top-green');
        if( $(this).parent('td.cell-' + colIndex).next().hasClass('HideSection')){
          $(this).parent('td.cell-' + colIndex).next().next('td').addClass('border-left-green');
        } else {
          $(this).parent('td.cell-' + colIndex).next('td').addClass('border-left-green');
        }
        
        $(this).parent('td.cell-' + colIndex).find('.node-white-circle').addClass('node-green-circle');
        $(this).parent('td.cell-' + colIndex).parent('tr').next('tr').children('td.cell-' + colIndex).addClass('border-top-green');

        event.stopPropagation();

    });

    $('.fiancial-grid').find('table').eq(1).find('tr').eq(1).addClass('row-1').prev('tr').nextAll('tr').each(function() {
        $('tr').each(function() {
            $(this).children('th').eq(1).addClass('cell-1');
        });
    });

    var lastSectionName = "suboperationSection";
    var selectedByParent = "false";

    $('.center-div.account-grid .row-1 th').click(function(event) {
        if (!$(this).find('.dropdown-menu').hasClass('show')) {
            hideDrodownMenu();
            $('.row-selected').removeClass('row-selected');
            var LastsectionColIndex = 0;
            $('.add-segment ul.dropdown-menu').removeClass('show');
            $('i.segment').removeClass('show');

            var sectionName = $(this).attr('data-section');
            var arr = [];
            $('.center-div [data-section=' + sectionName + ']').each(function(index, value) {
                sectionColIndex = $(value).index();
                arr.push(sectionColIndex);
            });
            var arrayLength = arr.length;
            var firstCol = arr[0];
            var Lastcol = arr[arrayLength - 1];

            $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {

                sectionColIndex = $(v).index();
                if (sectionColIndex != LastsectionColIndex) {

                    if ($(v).hasClass('bg-green')) {
                        $('.center-div .cell-' + sectionColIndex).removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                        if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                          $('.center-div .cell-' + sectionColIndex).next().next().removeClass('border-left-green');
                        } else{
                          $('.center-div .cell-' + sectionColIndex).next().removeClass('border-left-green');
                        }
                        $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').removeClass('node-green-circle');
                    } else {
                        if (sectionName != lastSectionName) {
                            $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                            $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');
                            if (sectionColIndex == firstCol) {
                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                if(sectionColIndex !=1){
                                  $('.center-div .cell-' + sectionColIndex).addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');
                            } else if (sectionColIndex == Lastcol) {
                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                  $('.center-div .cell-' + sectionColIndex).next().next().addClass('border-left-green');
                                } else{
                                  $('.center-div .cell-' + sectionColIndex).next().addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');
                            } else {
                                if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                  $('.center-div .cell-' + firstCol).next().addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');
                            }
                        } else {

                            if (sectionColIndex == firstCol) {
                                $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');

                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                if(sectionColIndex !=1){
                                  $('.center-div .cell-' + sectionColIndex).addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');

                            } else if (sectionColIndex == Lastcol) {

                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                  $('.center-div .cell-' + sectionColIndex).next().next().addClass('border-left-green');
                                } else{
                                  $('.center-div .cell-' + sectionColIndex).next().addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');
                            } else {
                                if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                  $('.center-div .cell-' + firstCol).next().addClass('border-left-green');
                                }
                                $('.center-div .cell-' + sectionColIndex).addClass('bg-green');
                                $('.center-div .cell-' + sectionColIndex).slice(2).addClass('select-byparent');
                                $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').addClass('node-green-circle');
                            }
                        }
                    }
                }
                LastsectionColIndex = sectionColIndex;
                lastSectionName = sectionName;
                lastSubSectionName = "sub" + sectionName;
                selectedByParent = false;
            });
        }
        event.stopPropagation();
    });

    $('.center-div.account-grid .row-2 th').click(function(event) {
        if (!$(this).find('.dropdown-menu').hasClass('show')) {
            hideDrodownMenu();
            $('.row-selected').removeClass('row-selected');
            var LastsectionColIndex = 0;
            $('.add-segment ul.dropdown-menu').removeClass('show');
            $('i.segment').removeClass('show');

            var sectionName = $(this).attr('data-section');
            var arr = [];
            $('.center-div [data-section=' + sectionName + ']').each(function(index, value) {
                sectionColIndex = $(value).index();
                arr.push(sectionColIndex);
            });
            var arrayLength = arr.length;
            var firstCol = arr[0];
            var Lastcol = arr[arrayLength - 1];
            if($(this).hasClass('select-byparent')){
               $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {

                    sectionColIndex = $(v).index();
                    if (sectionColIndex != LastsectionColIndex) {

                        // if ($(v).hasClass('bg-green')) {
                        //     $('.center-div .cell-' + sectionColIndex).removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                        //     $('.center-div .cell-' + sectionColIndex).next().removeClass('border-left-green');
                        //     $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').removeClass('node-green-circle');
                        // } else {
                            if (sectionName != lastSectionName) {
                                $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');
                                if (sectionColIndex == firstCol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else if (sectionColIndex == Lastcol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                      if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(2).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(2).addClass('border-left-green');
                                      }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                         $('.center-div .cell-' + firstCol).next().slice(2).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                }
                            } else {

                                if (sectionColIndex == firstCol) {
                                    $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                    $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');

                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');

                                } else if (sectionColIndex == Lastcol) {

                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                     if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(2).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(2).addClass('border-left-green');
                                      }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                         $('.center-div .cell-' + firstCol).next().slice(2).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                }
                            }
                      //  }
                    }
                    LastsectionColIndex = sectionColIndex;
                    lastSectionName = sectionName;
                    lastSubSectionName = "sub" + sectionName;
                    selectedByParent = false;
                });
            } else {
                $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {

                    sectionColIndex = $(v).index();
                    //console.log("sectionColIndex", sectionColIndex);
                    if (sectionColIndex != LastsectionColIndex) {

                        if ($(v).hasClass('bg-green')) {
                            $('.center-div .cell-' + sectionColIndex).removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                            if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                               $('.center-div .cell-' + sectionColIndex).next().next().slice(2).removeClass('border-left-green');
                            } else{
                              $('.center-div .cell-' + sectionColIndex).next().slice(2).removeClass('border-left-green');
                            }
                            $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').removeClass('node-green-circle');
                        } else {
                            if (sectionName != lastSectionName) {
                                $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');
                                if (sectionColIndex == firstCol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else if (sectionColIndex == Lastcol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                     if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(2).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(2).addClass('border-left-green');
                                      }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                      $('.center-div .cell-' + firstCol).next().slice(2).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                }
                            } else {

                                if (sectionColIndex == firstCol) {
                                    $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                    $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');

                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');

                                } else if (sectionColIndex == Lastcol) {

                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                     if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(2).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(2).addClass('border-left-green');
                                      }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                        $('.center-div .cell-' + firstCol).next().slice(2).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(2).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(2).find('.node-white-circle').addClass('node-green-circle');
                                }
                            }
                        }
                    }
                    LastsectionColIndex = sectionColIndex;
                    lastSectionName = sectionName;
                    lastSubSectionName = "sub" + sectionName;
                    selectedByParent = false;
                });
            }
        }
      //  event.stopPropagation();
    });

    $('.center-div.account-grid .row-3 th').click(function(event) {
          hideDrodownMenu();
          $('.row-selected').removeClass('row-selected');
          var LastsectionColIndex = 0;
          $('.add-segment ul.dropdown-menu').removeClass('show');
          $('i.segment').removeClass('show');

          var sectionName = $(this).attr('data-section');
          var arr = [];
          $('.center-div [data-section=' + sectionName + ']').each(function(index, value) {
              sectionColIndex = $(value).index();
              arr.push(sectionColIndex);
          });
          var arrayLength = arr.length;
          var firstCol = arr[0];
          var Lastcol = arr[arrayLength - 1];

        if($(this).hasClass('select-byparent')){
             $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {

                    sectionColIndex = $(v).index();
                    //console.log("sectionColIndex", sectionColIndex);
                    if (sectionColIndex != LastsectionColIndex) {

                        // if ($(v).hasClass('bg-green')) {
                        //     $('.center-div .cell-' + sectionColIndex).removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                        //     $('.center-div .cell-' + sectionColIndex).next().removeClass('border-left-green');
                        //     $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').removeClass('node-green-circle');
                        // } else {
                            if (sectionName != lastSectionName) {
                                $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');
                                if (sectionColIndex == firstCol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green ');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else if (sectionColIndex == Lastcol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green ');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                     if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(3).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(3).addClass('border-left-green');
                                      }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                        $('.center-div .cell-' + firstCol).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                }
                            } else {

                                if (sectionColIndex == firstCol) {
                                    $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                    $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');

                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');

                                } else if (sectionColIndex == Lastcol) {

                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(3).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                        $('.center-div .cell-' + firstCol).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                }
                            }
                      //  }
                    }
                    LastsectionColIndex = sectionColIndex;
                    lastSectionName = sectionName;
                    lastSubSectionName = "sub" + sectionName;
                    selectedByParent = false;
                });
        } else {
            if (!$(this).find('.dropdown-menu').hasClass('show')) {
               

                $('.center-div [data-section=' + sectionName + ']').each(function(i, v) {

                    sectionColIndex = $(v).index();
                    //console.log("sectionColIndex", sectionColIndex);
                    if (sectionColIndex != LastsectionColIndex) {

                        if ($(v).hasClass('bg-green')) {
                            $('.center-div .cell-' + sectionColIndex).removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                            if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(3).removeClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(3).removeClass('border-left-green');
                                    }
                            $('.center-div .cell-' + sectionColIndex).find('.node-white-circle').removeClass('node-green-circle');
                        } else {
                            if (sectionName != lastSectionName) {
                                $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');
                                if (sectionColIndex == firstCol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green ');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else if (sectionColIndex == Lastcol) {
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green ');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(3).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                        $('.center-div .cell-' + firstCol).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                }
                            } else {

                                if (sectionColIndex == firstCol) {
                                    $('.center-div.account-grid td, .center-div.account-grid th').removeClass('bg-green border-left-green border-top-green border-bottom-green select-byparent');
                                    $('.center-div.account-grid td, .center-div.account-grid th').find('.node-white-circle').removeClass('node-green-circle');

                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('border-left-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');

                                } else if (sectionColIndex == Lastcol) {

                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    if($('.center-div .cell-' + sectionColIndex).next().hasClass("HideSection")){
                                         $('.center-div .cell-' + sectionColIndex).next().next().slice(3).addClass('border-left-green');
                                      } else{
                                        $('.center-div .cell-' + sectionColIndex).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                } else {
                                    if($('.center-div .cell-' + firstCol).hasClass('HideSection')){
                                        $('.center-div .cell-' + firstCol).next().slice(3).addClass('border-left-green');
                                    }
                                    $('.center-div .cell-' + sectionColIndex).slice(3).addClass('bg-green');
                                    $('.center-div .cell-' + sectionColIndex).slice(4).addClass('select-byparent');
                                    $('.center-div .cell-' + sectionColIndex).slice(3).find('.node-white-circle').addClass('node-green-circle');
                                }
                            }
                        }
                    }
                    LastsectionColIndex = sectionColIndex;
                    lastSectionName = sectionName;
                    lastSubSectionName = "sub" + sectionName;
                    selectedByParent = false;
                });
            }
        }
        event.stopPropagation();
    });

    $('body .center-div  td.cell-1').click(function(event) {

        if (!$(this).find('.dropdown-menu').hasClass('show')) {
            hideDrodownMenu();
            $('.add-col-wrap').children('ul').removeClass('show');
            $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green select-byparent');
            $('.cell-0').removeClass('border-top-green');

            $('td').removeClass('bg-green border-green border-bottom-green');
            $('.node-white-circle.node-green-circle').removeClass('node-green-circle');


            var RowSelected = $(this);

            if ($(RowSelected).hasClass('row-selected')) {
                $(this).removeClass('row-selected');

                $(this).nextAll('td').removeClass('row-selected');
                $(this).parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
                $(this).parent('tr').next('tr').children('td').removeClass('border-top-green');
                $('.cell-0').removeClass('border-top-green');
                $(this).parent('tr').next('tr').children('td.col-1').css({
                    'border-top': '0'
                });

            } else {

                $('td').removeClass('row-selected'); 
                $('.account-head-node .icons.showing').removeClass('showing');
                 $('td').find('.segment').removeClass('HideSegment');

                if($(this).find('.icons')) {
                    $(this).find(".account-head-node input").trigger("focus");   
                }

                
                $(this).addClass('row-selected');

                $('td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
                $(this).parent('tr').next('tr').children('td').addClass('border-top-green');
                $('.cell-0').removeClass('border-top-green');
                $('td').parent('tr').next('tr').children('td.col-1').css({
                    'border-top': '0'
                });
                $(this).nextAll('td').addClass('row-selected');
                $(this).parent('tr').prev('tr').children('td.border-light-bottom').addClass('row-green-border');
                $(this).parent('tr').next('tr').children('td').addClass('border-top-green');
                $('.cell-0').removeClass('border-top-green');
                $(this).parent('tr').next('tr').children('td.col-1').css({
                    'border-top': '1px solid #349644'
                });

                $('.row-selected').find('.node-white-circle').addClass('node-green-circle');
                 event.stopPropagation();
            }
           
        }
    });




    $('.center-div table th').mouseover(function(index, event) {
        
        var datasectionName = $(this).data('section');
        $('[data-section=' + datasectionName + ']').find('i.add').addClass('show');
    });

    $('.center-div table th').mouseout(function(index, event) {
        
        var datasectionName = $(this).data('section');

        if ($(this).find('.add-colums ul.dropdown-menu').hasClass('show')) {
            $('[data-section=' + datasectionName + ']').find('i.add').addClass('show active');

        } else {
            $('[data-section=' + datasectionName + ']').find('i.add').removeClass('show');
        }
    });
    $('.center-div table td, .center-div table th').mouseover(function(index, event) {
        $(this).find('i.segment').addClass('show');
    });

    $('.center-div table td, .center-div table th').mouseout(function(index, event) {

        if ($(this).find('.add-segment ul.dropdown-menu').hasClass('show')) {
            $(this).find('i.segment').addClass('show');

        } else {
            $(this).find('i.segment').removeClass('show');
        }
    });

    $('.fTHLC-inner-wrapper').scroll(function() {
        hideDrodownMenu();
    });

    $('.center-div #account-table .segment').click(function(event) {
        $('td').removeClass('row-selected');
        $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
        $('td,th').find('.node-white-circle').removeClass('node-green-circle');
        $('td').parent('tr').prev('tr').children('td.border-light-bottom').removeClass('row-green-border');
        $('td').parent('tr').next('tr').children('td.col-1').css({
            'border-top': '0'
        });
        var setLeftPos = $(this).offset().left;
        var setTopPos = $(this).offset().top;


        $('.add-segment .dropdown-menu').css({
            'left': setLeftPos,
            "top": setTopPos + 15
        });
        var setTopPos = $(this).offset().top;
        var setLeftoffset = $(this).offset().left;
        var setLeftPos =0;
        var dropdownHeight = $(this).closest('td').find('.add-segment ul.dropdown-menu, .add-status ul.dropdown-menu').height();
        if(setLeftoffset>980){

            setLeftPos = setLeftoffset-145;
        } 
        else {
            setLeftPos = setLeftoffset;
        }

        if(setTopPos>450){      
            setTop = setTopPos-dropdownHeight-15;
          
        }
        else{
            setTop = setTopPos;
       
        }
       
        $('.add-segment ul.dropdown-menu').css({
            'left': setLeftPos,
            "top": setTop+15
        });
        $('#nodeFlyout').modal('hide');
        setTableWidth();
        removeSelection();
        $('.add-colums').children('.dropdown-menu').removeClass('show');
        if ($(this).closest('td').find('.add-segment ul.dropdown-menu').hasClass('show')) {
            $(this).addClass('active');
            $(this).closest('td').find('.add-segment ul.dropdown-menu').removeClass('show');
        } else {
            $('.add-segment ul.dropdown-menu').removeClass('show');
            $(this).addClass('active');
            $(this).closest('td').find('.add-segment ul.dropdown-menu').addClass('show');
        }

        event.stopPropagation();
    });

    $('.center-div #account-table .add').click(function(event) {
  
        event.preventDefault();
        $('td').removeClass('row-selected');
        $('td,th').removeClass('bg-green border-left-green border-bottom-green border-top-green');
        $('td,th').find('.node-white-circle').removeClass('node-green-circle');
        removeSelection();
        var tdWrapper = $(this).closest('td, th'),
            trWrapper = $(tdWrapper).parent('tr'),
            tableWrapper = $(trWrapper).parent(),
            myCol = $(tdWrapper).index();
        var rowFlag = 0;

        var setLeft = $(this).offset().left;
        var settop = $(this).offset().top;


        $('.add-colums').children('.dropdown-menu').css({
            'left': setLeft,
            "top": settop + 16
        }); 
    
        var colFlag = 0;
                if ($(this).siblings('.add-colums').children('ul').hasClass('show')) {
                   $('i.add').removeClass('show show-icon active');
          $('.add-colums').children('ul').removeClass('show');

                } else {
                    $('i.add').removeClass('show show-icon active');
          $(this).find('i.add').addClass('show-icon active');
          $('.add-colums').children('.dropdown-menu').removeClass('show');
          $(this).siblings('.add-colums').children('ul').addClass('show');
          $(this).siblings('.add-segment .dropdown-menu').removeClass('show');

                    $('.add-colums').children('.show-' + myCol).find('.delete-series').removeClass("disabled");
                    $('.add-colums').children('.show-' + myCol).find('.delete-series a').removeClass("disabled");

                }

               $('.add-segment .dropdown-menu').removeClass('show');
          
        rowFlag++;

        event.stopPropagation();
    });



    $('.fiancial-grid .col-head').dblclick(function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
    addborderinSections();   
    ExpandAcoountCol();
    AcountTableWidth();
    makeEditableYellow();//Make Editable field Highlited
    $(".center-div .fTHLC-inner-wrapper").niceScroll({cursorcolor: "#909090",cursorborder: "0",cursorwidth:"10px", autohidemode:false});
}


/*
*Manage Domain Links- in case of multiple node in a single domain hides extra plus icons (shaheem)
*/
function manageDomainIcon(){
       $('.row-1 th').each(function(i,v){
        var dataSection =  $(v).data('section');
        var seclength = $(".row-1 th[data-section='"+dataSection+"']").find('.fa.fa-plus.add').length;
        if(seclength > 1){
             $(".row-1 th[data-section='"+dataSection+"']").find('p.col-head').remove();
            $(".row-1 th[data-section='"+dataSection+"']").find('.fa.fa-plus.add').not(':last').closest('div.col-head').after('<p class="col-head"></p>').hide();
            $(".row-1 th[data-section='"+dataSection+"']").find('.fa.fa-plus.add').last().closest('div.col-head:hidden').show();
        }else{
            $(".row-1 th[data-section='"+dataSection+"']").find('.fa.fa-plus.add').last().closest('div.col-head:hidden').show();
            $(".row-1 th[data-section='"+dataSection+"']").find('p.col-head').remove();
        }
       });
   }

function hideDrodownMenu() {
    $('body .add-colums ul.dropdown-menu').removeClass('show');
    $('body .add-segment ul.dropdown-menu').removeClass('show');
    $('body i.add').removeClass('show');
    $('body i.segment').removeClass('show');

}

function addCellClass(){
    $(".center-div table#account-table").each(function() {        
        var index= 0;    
        $(this).find('tr').each(function(){
        $('.center-div tr').removeClass('row-' + index);
        $(this).addClass('row-' + index);
        $(this).find('.left-col').text(index);
        index++;
     });

    });
}

function removeRowClass(){
    $(".center-div table#account-table").each(function() {        
        var index= 0;    
        $(this).find('tr').each(function(){
            $('.center-div tr').removeClass('row-' + index);
            index++;
        });
    });
}

var currentView = 2;
var currentManifestView = 0;
var clicked;
var clickedManifest;
var clickedModeforManifesto;
var globalSelected;

$(document).ready(function() {
    
    $(".arrows").removeClass("show");
    $(".arrow-left").addClass('inactive');
    $(".arrow-left").removeClass('prevViewNode');



    // start code To show save & cancel icons on click of input field(anjali)    
    $("body").on("focus",'.account-head-node input, .account-head-title input', function(e){
       

        $(this).siblings('.icons').addClass('showing');
        if($(this).siblings('.icons').hasClass('showing')){
            $(this).closest('td').find('.segment').addClass('HideSegment') ;
            $('.editTextDisabledLast').find('i.add').addClass('hide')                
        }
        else{
          
        }
        
        e.stopPropagation();
    });

    $("body").on('click', '.account-head-node span.icons, .account-head-title span.icons', function(e){
       
        $(this).removeClass('showing');
        $('.editTextDisabledLast').find('i.add').removeClass('hide')
        $('td').find('.segment').removeClass('HideSegment');
                e.stopPropagation();

       
    });
  
    // end code


    $("body").on("keydown",function(e){
        
        if($(".arrows").hasClass("show"))
        {
            if(e.keyCode ==37){
            $(".prevViewNode").trigger("click");
            }
            if(e.keyCode==39){
            $(".nextViewNode").trigger("click");
            }
        }
        //e.preventDefault();
    });
    


    $("body").on("click", "#nodeFlyout .interaction-yes .node-left", function(event) {
        $("#nodeFlyout .close").trigger("click");
        globalSelected.nextUntil("tr.operation").nextUntil("tr.end").removeClass("node-hide").next().removeClass("node-hide");
        if(clicked==="next"){
            $(".nextViewNode").trigger("click");
        }
        else{
            $(".prevViewNode").trigger("click");
        }    
    });

    $("body").on("click", "#nodeFlyout .interaction-no .node-left", function(event) {
        $("#nodeFlyout .close").trigger("click");
        globalSelected.nextUntil("tr.operation").nextAll("tr").addClass("node-hide");
        if(clicked==="next"){
            $(".nextViewNode").trigger("click");
        }
        else{
            $(".prevViewNode").trigger("click");
        }
    });

    $("body").on("click", ".nextViewNode", function(event) {
        if ($(".center-div").hasClass("manifest")) {
            CheckBuildMode=0;
            var currentViewLength = $(".center-div .table-count").length;
            
            if(clickedModeforManifesto=="nextClicked"){
                currentManifestView=2;
                clickedModeforManifesto="";
            }
            
            if (currentViewLength < currentManifestView) {
                $(".entr-center-tab .active .cross-tab").trigger("click");
                $("li.manifest-Create").trigger("click");
                $(".nextViewNode").trigger("click");
                return false;
            }


            if (clickedManifest == "prev") {
                currentManifestView = currentManifestView + 2;
            }
            
            // get class to change view mode to bulid mode
            var getClass = $(".center-div").find(".col-text [data-id='"+ currentManifestView +"']").siblings('.custom-node').attr('name');
            $('.center-div td.'+getClass).removeClass('view-mode-node');            

            var lOffset = $(".center-div").find(".col-text [data-id='" + currentManifestView + "']").parents("td").offset().left;
            var windowPos = $('.center-div .fTHLC-inner-wrapper').scrollLeft(); 
            var k = lOffset - $('.center-div .fTHLC-inner-wrapper').offset().left + windowPos;
            $(".center-div .fTHLC-inner-wrapper").scrollLeft(k);
            
            $(".center-div").find(".col-text [data-id='" + currentManifestView + "']").parents("td").find("div:first").trigger("click");
            
            currentManifestView = currentManifestView + 1;
            clickedManifest = "next";

        } else {
             CheckBuildMode=0;
            clickedManifest = "";
            var currentViewLength = $(".center-div tr:not(.node-hide) .table-count").length;
            $(".prevViewNode").css("display", "block");
            if (clicked == "prev") {
                currentView = currentView + 2;
            }
            $(".arrow-left").removeClass('inactive');
            $(".arrow-left").addClass('prevViewNode');
            if (currentViewLength == currentView) {
                $(".arrow-right").addClass('inactive');
                $(".arrow-right").removeClass('nextViewNode'); 
            } else {
                $(".arrow-right").removeClass('inactive');
                $(".arrow-right").addClass('nextViewNode');
            }

            

            if($(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").find("div:first").hasClass("operation-tab-node")==true){
               CheckBuildMode=1;
            }            

            // get class to change view mode to bulid mode
            var getClass = $(".center-div").find(".col-text [data-id='"+currentView+"']").siblings('.custom-node').attr('name');
            $('.center-div td.'+getClass).removeClass('view-mode-node');
            
            var lOffset = $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").offset().left;
            globalSelected = $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").parents("tr");
            var windowPos = $('.center-div .fTHLC-inner-wrapper').scrollLeft(); 
            var k = lOffset - $('.center-div .fTHLC-inner-wrapper').offset().left + windowPos;
            $(".center-div .fTHLC-inner-wrapper").scrollLeft(k);
            
            $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").find("div:first").trigger("click");
            
                $(".center-div.manifest tr .col-node-text").each(function(){
                var getAllTDClass = $(this).attr('name');
                $('.center-div.manifest td.'+getAllTDClass).addClass('view-mode-node');
               });
            
            if(CheckBuildMode=="1"){
            $(".arrow-right").removeClass('nextViewNode');
            setTimeout(function(){
               $(".arrow-right").addClass('nextViewNode');
           }, 500);
            }
            currentView = currentView + 1;
            clicked = "next";
            clickedModeforManifesto = "nextClicked";
           
            
            
        }

        event.stopPropagation();

    });

    $("body").on("click", ".prevViewNode", function(event) {
        
        if ($(".center-div").hasClass("manifest")) {
            CheckBuildMode=0;
            var currentViewLength = $(".center-div .table-count").length;

            if(clickedModeforManifesto=="prevClicked"){
                currentManifestView=currentViewLength;
                clickedModeforManifesto="";
            }
                       
            if (clickedManifest == "next") {
                currentManifestView = currentManifestView - 2;
            }
            
            if (currentManifestView <= 1) {
                $(".entr-center-tab .active .cross-tab").trigger("click");
                $("li.manifest-Create").trigger("click");
                $(".prevViewNode").trigger("click");
                return false;
            }            
            
            
            var currentViewSimManifesto = currentManifestView+1;
            var getClass = $(".center-div").find(".col-text [data-id='"+ currentViewSimManifesto +"']").siblings('.custom-node').attr('name');            
            $('.center-div td.'+getClass).addClass('view-mode-node');

            var lOffset = $(".center-div").find(".col-text [data-id='" + currentManifestView + "']").parents("td").offset().left;
            var windowPos = $('.center-div .fTHLC-inner-wrapper').scrollLeft();
            var k = lOffset - $('.center-div .fTHLC-inner-wrapper').offset().left + windowPos;
            $(".center-div .fTHLC-inner-wrapper").scrollLeft(k);       
            
            
            $(".center-div").find(".col-text [data-id='" + currentManifestView + "']").parents("td").find("div:first").trigger("click");
            
            currentManifestView = currentManifestView - 1;
            clickedManifest = "prev";
            

        } else {
             CheckBuildMode=0;
            clickedManifest = "";
            var currentViewLength = $(".center-div tr:not(.node-hide) .table-count").length;
            $(".nextViewNode").css("display", "block");
            
            if (clicked == "next") {
                currentView = currentView - 2;
            }
            $(".arrow-right").removeClass('inactive');
            $(".arrow-right").addClass('nextViewNode');
            if (currentView == 2) {
                $(".arrow-left").addClass('inactive');
                $(".arrow-left").removeClass('prevViewNode');
            } else {
                $(".arrow-left").removeClass('inactive');
                $(".arrow-left").addClass('prevViewNode');
            }            
            
            if($(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").find("div:first").hasClass("operation-tab-node")==true){
               CheckBuildMode=1;
            }                         
            
            var currentViewSim = currentView+1;
            var getClass = $(".center-div").find(".col-text [data-id='"+ currentViewSim +"']").siblings('.custom-node').attr('name');
            $('.center-div td.'+getClass).addClass('view-mode-node');
            
            var lOffset = $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").offset().left;
            globalSelected = $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").parents("tr");
            var windowPos = $('.center-div .fTHLC-inner-wrapper').scrollLeft(); 
            var k = lOffset - $('.center-div .fTHLC-inner-wrapper').offset().left + windowPos;
            $(".center-div .fTHLC-inner-wrapper").scrollLeft(k);              
            
            $(".center-div").find(".col-text [data-id='" + currentView + "']").parents("td").find("div:first").trigger("click");
            

            $(".center-div.manifest tr .col-node-text").each(function(){
            var getAllTDClass = $(this).attr('name');
            $('.center-div.manifest td.'+getAllTDClass).removeClass('view-mode-node');
            });
            
            if(CheckBuildMode=="1"){
            $(".arrow-left").removeClass('prevViewNode');
            setTimeout(function(){
               $(".arrow-left").addClass('prevViewNode');
           }, 500);
           CheckBuildMode=0;
            }            
            
            currentView = currentView - 1;
            clicked = "prev";
            clickedModeforManifesto = "prevClicked";
           
        }
        event.stopPropagation();

    });

    $("body").on("click", ".simulate-mode", function(event) {
        $(".center-div tr.operation").prev("tr").nextAll("tr").addClass("node-hide");
                
        if(simulateContinue==0)
        {    
      //  $(".entr-center-tab ul li").css("display","none");
        $(".entr-center-tab ul li a.active").parents("li").css("display","block");
            currentView = 2;
            currentManifestView = 0;
            clicked="";
            clickedManifest="";
            clickedModeforManifesto="";
        }
        simulateContinue=0;
        

        $(".arrows").addClass("show");
        $(this).addClass('active');
        $(this).siblings('a').removeClass('active');

        $('.center-div td').addClass('view-mode');
        $('.center-div table tr:not(:first-child, :nth-child(2)) td').addClass('view-mode-node');
        $('.center-div .cell_2_1').removeClass('view-mode-node');
        $('.yes-no').addClass('show');
        $('.saved').addClass('show');
        
       

    });
    $("body").on("click", ".build-mode", function(event) {
        $(".center-div tr").removeClass("node-hide");
        $(".center-div").find(".col-text [data-id='2']").parents("td").find("div:first").trigger("click");
        $(".entr-center-tab ul li").css("display","block");
        $(".arrows").removeClass("show");
        $(this).addClass('active');
        $(this).siblings('a').removeClass('active');
        $('.center-div td').removeClass('view-mode');
        $('.center-div td.ExcelTablerow').removeClass('view-mode-node');

    });


    //Accounting Panel: Add Transactions (shaheem)
    $('body').on('click', '.add-transaction', function(e) {

        var $_this = $(this);
        var $_postion = $_this.data('sequence');
        
        var edit_input  = '<div class="segment-node">';
            edit_input += '<div class="col-text segment-text operation-text">';
            edit_input += '<span class="col-node-text"><input type="text" placeholder="Undefined" class="custom-node undefined"><span class="icons"><i data-original-title="Save" data-placement="bottom" data-toggle="tooltip" class="saveIcon"></i><i data-original-title="Cancel" data-placement="bottom" data-toggle="tooltip" class="closeIcon"></i></span></span>';
            edit_input += '</div>';
                 
                 $_this.closest('tr').addClass('current-section').nextUntil('.row-group').addClass('current-section');
                 $('.account-grid.center-div tbody tr:first').addClass('make-clone');
                 $('.account-grid.center-div tbody tr:first').find('.account-title').addClass('fees-title');
                 $('.account-grid.center-div tbody tr:first').nextUntil('.row-group').addClass('make-clone');
                 var $_Clone = $('.make-clone').clone(true);
                 $_Clone.find('input[type=text]').attr('value','');
                 $_Clone.find('input.share-percentage-debit').attr('value','100');
                 $_Clone.find('select option').removeAttr("selected").prop('selectedIndex',0);
                 $_Clone.find('.account-node input[type=checkbox]').attr("checked", false).attr('disabled',false);
                 $_Clone.find('input[type=text],select').closest('.account-node').not('.total').hide().closest('td').addClass('creation-bg');
                 $_Clone.find('td.custom-border:empty').removeClass('custom-border');
                 $_Clone.find('.fees-title').html(edit_input);
                 $_Clone.find('li:first').removeClass('disabled');
                 $_Clone.find('li:last').removeClass('disabled');
                 $_Clone.find('tr').removeClass('base-fee');
                 
                 if($_postion == 'above'){//Add above to current transaction
                     $_Clone.insertBefore($('.current-section:first'));
                 }else if($_postion == 'below'){//Add below to current transaction
                     $_Clone.insertAfter($('.current-section:last'));
                 }else{
                     $_Clone.insertAfter($('.current-section:last'));
                 }
                 $('.make-clone').removeClass('make-clone');//Remove Clone class
                 $('.current-section').removeClass('current-section');//Remove Current Class class
                 removeRowClass();//Remove row class
                 hideDrodownMenu();//Hide dropdown menu
                 addCellClass();//Add cell Indexing
                 InitallySetWidth = false;
                 AcountTableWidth();//Set Table width
                 $('.center-div .fTHLC-inner-wrapper').scrollLeft(4); 
                 //Set Border
                 $('.center-div #account-table').find('tr').not(':last').children('td.border-bottom').removeClass('border-bottom');      
                 $('.center-div #account-table').find('tr:last').children('td:not(.border-bottom)').addClass('border-bottom');
				 
                // code to make the font weight bold when we click on save button
                $('.center-div #account-table .saveIcon').click(function(){

                    var test = $(this).parent().parent().children()[0];
                    $(test).addClass('makeBolder');
                    var feesName = $(this).closest('div.account-title.fee-title').find('input.custom-node').val();
                    //$(this).closest('div.account-title.fee-title').html('<strong>'+feesName+'</strong>');
                    if(feesName != ''){
                        var array = $.trim(feesName).split(' '); 
                        var $_slug='';
                        $.each(array,function(i){
                            $_slug += array[i]+'-';
                        });

                        $_slug = $_slug.substring(0, $_slug.length -1).toLowerCase();
                        $(this).closest('tr').addClass($_slug).nextUntil('.row-group').addClass($_slug);

                    }
               });
            
    });



    /*
    *Accounting Panel: Delete Transaction (shaheem)
    */ 
    $('body').on('click', '.delete-transaction', function(e) {
        var $_this = $(this);
         
        bootbox.confirm({
            title: 'Alert',
            message: 'Are you sure you want to delete this transaction?',
            buttons: {
            'cancel': {
               label: 'Cancel',
               className: 'btn-default'
            },
            'confirm': {
               label: 'Delete',
               className: 'btn-primary'
            }
            },
            callback: function(result) {
                   if(result){
                       displayLoader();
                       $_this.closest('tr').addClass('deleted-row').nextUntil('.row-group').addClass('deleted-row');
                       removeRowClass();
                       $('.deleted-row').remove();
                       hideDrodownMenu();//Hide dropdown menu
                       addCellClass();//Add cell Indexing
                       InitallySetWidth = false;
                       AcountTableWidth();//Set Table width

                       hideLoader();
                        calculateBalance();//Calculate Balance
                       //Set Border
                       $('.center-div #account-table').find('tr:last').children('td:not(.border-bottom)').addClass('border-bottom');
                }else{
                       hideDrodownMenu();//Hide dropdown menu
                }
            }
        });
    });



    /*
     *Code for enable Tab out for input button (Vimal)
     */
    $("body").on('keydown', 'input[type=text]', function(e) { 
        var keyCode = e.keyCode || e.which; 

        if (keyCode == 9 || keyCode == 8) {
            calculateBalance();//Calculate Balance
            e.stopPropagation();
        } 
    });

    

    /*
     *Select Popped-up value for percentage calculation (shaheem)
     */
    $('body').on('click','input.popout',function(e){
        $this = $(this);
        optionWrapper = $('tbody tr.freeze:last').next('tr');
        
        var selectedValue = $.trim($this.val());    
        //var inputPercentage = $.trim($(optionWrapper).find('.calculate-amount:visible').val());
        

        /*DONE by Divya Rajput
        * ON Date 1st OCT 2015
        * To get percentage amount*/
        var inputPercentage = $.trim($('div.account-node i.selected-value').siblings('input.calculate-amount').val());
        /*End Here*/
        
        if(selectedValue != '' && inputPercentage != '' && selectedValue != '0' && inputPercentage != '0'){
            $this.addClass('selected');
            var hiddenCalculateAmount = (selectedValue * inputPercentage)/100;
            
            //$(optionWrapper).find('.calculate-amount:visible').closest('.account-node').append('<input class="calculate-amount-hidden" type="hidden" value='+hiddenCalculateAmount+'>');
            
            /*DONE by Divya Rajput
            * ON Date 1st OCT 2015
            * To append "calculate-amount-hidden" class 
            * on a specific class 
            * before appending this class*/
            $('div.account-node i.selected-value').siblings('.calculate-amount-hidden,.selected-amount-hidden').remove();
            $('div.account-node i.selected-value').closest('.account-node').append('<input class="calculate-amount-hidden" type="hidden" value='+hiddenCalculateAmount+'><input class="selected-amount-hidden" type="hidden" value='+selectedValue+'>');
            /*End Here*/
            

            /*DONE by Divya Rajput
            * ON Date 30 SEPT 2015
            * To calculate calculation automatically*/
            $('div.account-node i.selected-value').removeClass('selected-value');            
            /*$('div.account-node tbody tr').siblings().removeClass('freeze');
            $('div.account-node tbody tr').siblings().find('input.share-debit, input.share-credit, input.distribution-debit, input.distribution-credit, input.total-debit, input.total-credit, input.total-balance, input.final-distribution-debit, input.final-distribution-credit, input.final-distribution-balance, input.final-total-debit, input.final-total-credit, input.final-total-balance').removeClass('popout');
            */
            $('.center-div #account-table tbody tr').siblings().find('input.share-debit, input.share-credit, input.distribution-debit, input.distribution-credit, input.total-debit, input.total-credit, input.total-balance, input.final-distribution-debit, input.final-distribution-credit, input.final-distribution-balance, input.final-total-debit, input.final-total-credit, input.final-total-balance').removeClass('popout');
            calculateBalance();//Calculate Balance
            /*End Here*/
        }else{
            if(selectedValue == '' || selectedValue == '0'){
                bootbox.alert("Selection Input value should not be zero or blank.");
                $this.focus();
            }else{
                bootbox.alert("Percentage value should not be zero or blank.");
                $(optionWrapper).find('.calculate-amount:visible').focus(); 
            }             
        }

        /*DONE by Divya Rajput
        * ON Date 1st OCT 2015
        * To remove "disabled" class 
        * When percentage value is present*/
        $('div.account-node i.selected-value').removeClass('addDisabled');  
        /*End Here*/     
      
    });



    /*DONE by Divya Rajput
    * ON Date 1st OCT 2015
    * To get automatic calculation 
    * on change of percentage*/    
    /*$('body').on('blur','div.account-node input.calculate-amount',function(){
        if($.trim($(this).siblings('.calculate-option').val()) == "Percentage"){  
            var hidden_selected_value = $(this).siblings('.selected-amount-hidden').val();  
            var percentage_value = $.trim($(this).val());                               
            var hiddenCalculateAmount = (hidden_selected_value * percentage_value)/100; 
            
            $(this).siblings('.calculate-amount-hidden').attr('value','');
            $(this).siblings('.calculate-amount-hidden').attr('value',hiddenCalculateAmount);
            console.log('called-9');
            calculateBalance();
        }
    })*/
    
    /*End Here*/

});//Document ready close

function AcountTableWidth(){
    var setAccountTopPos = $('.center-div #account-table tbody').height()/2.5;

    $('.center-div tbody td.acntSecCol, .account-plus').hover(function(event){
        var tdIndex =  $(this).index()
        $('.center-div td.cell-'+tdIndex).addClass('grayAccountBG');
     
        if($('.center-div td.cell-'+tdIndex).hasClass('grayAccountBG')){
            $('.center-div .grayAccountBG').first().append('<i class="account-plus"></i>');
            $('.center-div i.account-plus').css('top', setAccountTopPos);
        }
    },
    function(){
        $('.center-div td').removeClass('grayAccountBG');
        $('.center-div i.account-plus').remove();
    });
   
   // event.stopPropagation();
    var sum = 0;
    var accountTableSum = 0;
    var count =0;
    $('.center-div #account-table tr.row-4').find('th').each(function(i, v){
        if(!$(this).hasClass("HideSection")) {
          count++;
          if(i>2){
          //console.log("i",i+"xbvhgd"+$(v).outerWidth());
          sum += parseInt($(v).outerWidth());
          }
        }
    });    
    if(InitallySetWidth == true){
    $('.chrome .center-div.account-grid #account-table').css('width', sum-count);
    $('.firefox .center-div.account-grid #account-table').css('width', sum-3);
    } else {
       $('.chrome .center-div.account-grid #account-table').css('width', sum-count);
    $('.firefox .center-div.account-grid #account-table').css('width', sum-3);
      InitallySetWidth = true;
    }
    var scrollLeft = $('.center-div .fTHLC-inner-wrapper').scrollLeft();
    if(scrollLeft == 0){
       $('.center-div .fTHLC-inner-wrapper').scrollLeft(2); 
    } else {
      $('.center-div .fTHLC-inner-wrapper').scrollLeft(0); 
    }
}

function ExpandAcoountCol(){
    $('.center-div td.acntSecCol').click(function(){
        EnableAddButton();
        freezedSection();
       if($(this).hasClass('balancecol')){
            
            }
        else{
           
            var LeftPos = $('.fTHLC-inner-wrapper').scrollLeft();
            LeftPos = LeftPos+5;
            var rightPos = LeftPos - 10;

           $('.center-div .fTHLC-inner-wrapper').scrollLeft(LeftPos);

            var tableWidth = $('.center-div #account-table').width();
            
            var tdIndex =  $(this).index();

            $('.center-div .cell-'+tdIndex).addClass('HideSection');

            var ColIndex =  $('.center-div .cell-'+tdIndex).nextUntil('.acntSecCol');
            var ShowHideCol =  $(this).nextUntil('.acntSecCol');    
            var allTdSum = 0;
            var collapseSum = 0;
            var accountCollapseTableSum = 0;

            $(ShowHideCol).each(function(i, v){   

                collapseSum += parseInt($(v).outerWidth());         
                var TotalCollapseSum =  tableWidth + collapseSum -150;
                $('.center-div.account-grid table').css('width', TotalCollapseSum);
                $('.center-div.account-grid table tr').css('width', TotalCollapseSum );
               
            });

            var totalThead = $('.center-div thead .cell-'+tdIndex).nextUntil('.acntSecCol');
        
            $(totalThead).each(function(i,v){

                var topOfThead = $(v).css('top');
                var setTop = parseInt(topOfThead) + 1;            
                $(this).css('top',setTop);

            });

            $(ColIndex).each(function(i,v){
                $(this).removeClass('HideSection');
            });
            setTopPosition();
        }

      $('.center-div .fTHLC-inner-wrapper').scrollLeft(rightPos);
    
    //$(".extra-class").remove();

    removeAccountCellClass();
    setAccountCellClass();

       $('th,td').removeClass('account-left-group')
        addborderinSections();
        InitallySetWidth = false;
        AcountTableWidth();
       
    });
}
function setAccountCellClass(){
  
  $(".center-div table#account-table").each(function() {
        var $table = $(this);
        var $tbodyrows = $("tbody tr", $(this));
        var $theadrows = $("thead tr", $(this));

        $tbodyrows.each(function(row, v) {
            var index = 0;
      
            $(this).find("td").each(function(cell, va) {
                $(this).addClass('cell-' + index);
                index++;
            });
        });
        
        $theadrows.each(function(row, v) {
            var index  = 0;
            var index1 = 0;
            $(this).find("th").each(function(cell, va) {
                $(this).addClass('cell-' + index);
                
                if (!$(va).hasClass("HideSection")) {
                        $(va).find('.top-col').text(index1)
                        index1++;
                    }
                
                index++;
            });
        });

  });
  $('[data-section="operationSection"]').addClass('cell-1');
  $('.center-div .fTHLC-inner-corner tr:first').addClass('row-0').find('th').eq(1).addClass("cell-1");
  
}
function removeAccountCellClass(){
  
  $(".center-div table#account-table").each(function() {
        var $table = $(this);
        var $tbodyrows = $("tbody tr", $(this));
        var $theadrows = $("thead tr", $(this));

        $tbodyrows.each(function(row, v) {
            var index = 0;
            $(this).find("td").each(function(cell, va) {        
               $('.center-div td').removeClass (function (index, css) {
                    return (css.match (/\bcell-\S+/g) || []).join(' ');
                }); 
            });
        });
        $theadrows.each(function(row, v) {
            var index = 0;      
            $(this).find("th").each(function(cell, va) {
      $('.center-div th').removeClass (function (index, css) {
                    return (css.match (/\bcell-\S+/g) || []).join(' ');
                });
            });
        });

    });
}

/*
 * Add Seller Response (shaheem)
 */
function  accountResponseAddSeller(d) {
    $('.account-grid').html(d);
    financialGrid();
    setTopPosition();
    removeAccountCellClass();
    setAccountCellClass();
    addFeesClassTrTd();//Add fees class name on each row
    manageDomainIcon();//Manage Plus Icons for Domain
    hideLoader();
   InitallySetWidth=false;
    AcountTableWidth();
    setWidthInitialy();
    setTableWidth();
    makeEditableYellow();//Make Editable field Highlited
}

/*
 * Add Fees Name Class In TR (shaheem)
 */
function addFeesClassTrTd(){
 $(".center-div table#account-table").find('.account-title.fee-title').each( function(){
    var $_fee_name = $(this).text();
    if($_fee_name != ''){
       var array = $.trim($_fee_name).split(' '); 
       var $_slug='';
        $.each(array,function(i){
            $_slug += array[i]+'-';
        });
        
       $_slug = $_slug.substring(0, $_slug.length -1).toLowerCase();
       $(this).closest('tr').addClass($_slug).nextUntil('.row-group').addClass($_slug);
      
    }
    
 });
 
}

function setTopPosition(){
    $('.account-grid table tr').eq(0).find('th').css('top',0);
    $('.account-grid table tr').eq(1).find('th').css('top',23);
    $('.account-grid table tr').eq(2).find('th').css('top',46);
    $('.account-grid table tr').eq(3).find('th').css('top',69);
    $('.account-grid table tr').eq(4).find('th').css('top',92);
    $('.fTHLC-outer-corner table tr').eq(0).find('th').css('top',0);
    $('.fTHLC-outer-corner table tr').eq(1).find('th').css('top',23);
    $('.fTHLC-outer-corner table tr').eq(2).find('th').css('top',46);
    $('.fTHLC-outer-corner table tr').eq(3).find('th').css('top',69);
    $('.fTHLC-outer-corner table tr').eq(4).find('th').css('top',92);
}
 
function addborderinSections (){
    var ColIndexparent = [];
      $('.center-div .row-2 th').each(function(i,v){ 
      var abc = $(this).attr('data-section');
      var abcd = $(this).next().attr('data-section');
      //console.log("abc",abc);
      if(abc != abcd){
         ColIndexparent.push(abc);
      }
    });

    var totalsection  = $(ColIndexparent).length;
    for(i=1;i<=8;i++){
       var colindex = [];
        $('[data-section='+ColIndexparent[i]+']').each(function(i, v) {
            colindex.push($(v).index());
        });
       var colindexValue = colindex[colindex.length - 1];
       //console.log("colindexValue",colindexValue);
       if( $('.cell-' + colindexValue).next().hasClass('HideSection')){
        $('.cell-' + colindexValue).next().next().addClass('account-left-group');
       } else {
         $('.cell-' + colindexValue).next().addClass('account-left-group');
       }
    }


    var ColIndexchild = [];
      $('.center-div .row-2 th').each(function(i,v){ 
      var abc = $(this).attr('data-section');
      var abcd = $(this).next().attr('data-section');
      //console.log("abc",abc);
      if(abc != abcd){
         ColIndexchild.push(abc);
      }
    });

    var totalsection  = $(ColIndexchild).length;
    for(i=1;i<=8;i++){
       var colindex = [];
        $('[data-section='+ColIndexchild[i]+']').each(function(i, v) {
            colindex.push($(v).index());
        });
       var colindexValue = colindex[colindex.length - 1];
       //console.log("colindexValue",colindexValue);
       if( $('.cell-' + colindexValue).next().hasClass('HideSection')){
        $('.cell-' + colindexValue).next().next().addClass('account-left-group');
       } else {
         $('.cell-' + colindexValue).next().addClass('account-left-group');
       }
    }
}

/*freezed "$" Section (anjali)*/
function addfreezedClass(){
    $('.center-div.account-grid #account-table td').each(function(i,v){
      if(!$(this).find('input').hasClass("popout") || $(this).find('input.popout').hasClass("hide")){
          $(this).addClass('freezedTd');
          $('.center-div.account-grid .cell-0, .center-div.account-grid .cell-1').removeClass('freezedTd');
      }
    });
}

/*Enable add button (anjali)*/
function EnableAddButton(){
    //alert('EnableAddButton');
    $('.center-div.account-grid #account-table td').each(function(i,v){
        if($(this).children().hasClass('account-node')){  
            if($(this).find('select').siblings('input').val() == 1)
            {                
                $(this).siblings('i.add').addClass('addDisabled').removeClass('active');
            }
            else
            {                
               $(this).siblings('i.add').removeClass('addDisabled').addClass('active');
            }
        }
    });

    $(".center-div.account-grid #account-table .account-node input").on("keyup",function(e){
        if(($.trim($(this).val()) == "") || (! $.isNumeric($(this).val()))){  
            $(this).siblings('i.add').addClass('addDisabled').removeClass('active');
        }
        else{          
            $(this).siblings('i.add').removeClass('addDisabled').addClass('active');
        }    
    });
}

/*Accounting Panel: function to freeze accounting panel (anjali)*/
function freezedSection(){
    $('div.account-node i.add').on('click',function(){
        $(this).siblings('select').find("option[value="+$(this).val()+"]").attr("selected","selected");
        if($(this).siblings('select').val() == 'Percentage'){ 
            $(this).addClass('selected-value');
            $(this).closest('tr').prevUntil('tbody').addClass('freeze').find('input.share-debit, input.share-credit, input.distribution-debit, input.distribution-credit, input.total-debit, input.total-credit, input.total-balance, input.final-distribution-debit, input.final-distribution-credit, input.final-distribution-balance, input.final-total-debit, input.final-total-credit, input.final-total-balance').addClass('popout');
            $(this).closest('tr').prevUntil('tbody').find('input, select').not('.share-debit, .share-credit, .distribution-debit, .distribution-credit, .total-debit, .total-credit, .total-balance, .final-distribution-debit, .final-distribution-credit, .final-distribution-balance, .final-total-debit, .final-total-credit, .final-total-balance').addClass('freeze');
            addfreezedClass();            
        }else{            
            $(this).removeClass('selected-value');
            $(this).siblings('.calculate-amount-hidden').remove();
            $(this).closest('tr').prevUntil('tbody').removeClass('freeze').find('input.share-debit, input.share-credit, input.distribution-debit, input.distribution-credit, input.total-debit, input.total-credit, input.total-balance, input.final-distribution-debit, input.final-distribution-credit, input.final-distribution-balance, input.final-total-debit, input.final-total-credit, input.final-total-balance').removeClass('popout');
            $(this).closest('tr').prevUntil('tbody').find('input, select').not('.share-debit, .share-credit, .distribution-debit, .distribution-credit, .total-debit, .total-credit, .total-balance, .final-distribution-debit, .final-distribution-credit, .final-distribution-balance, .final-total-debit, .final-total-credit, .final-total-balance').removeClass('freeze');
        } 
    });
    // remove  freezeclasses (anjali) 
    $('td').on('click',function(){    
        if(!$(this).hasClass('freezedTd')){
            $('.freezedTd').removeClass('freezedTd');
            //$(".center-div.account-grid #account-table .account-node").find('i.add').addClass('addDisabled');
        }      
    });

}


