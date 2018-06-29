<?php
header("Access-Control-Allow-Origin: *");

if ($_GET['domain']) 
{
    if ($_GET['domain'] != '') 
    {
        error_reporting(0);
        $version                = strtotime(date('Ymdhis'));
        define('BASE_URL_API', "http://sta.pu.prospus.com/puidata/newslatter/");
        include "builderApi.php"; 
        $apiObj                 = new builderApi();
        $domainData             = $apiObj->getDataAndStructure($_GET['domain'], '6', '6');
        $domainArray            = json_decode($domainData, true);
        $node_y_id              = $domainArray['data']['node_id'];
        
        if(intval($node_y_id) > 0)
        {
            
            $returnData             = $apiObj->getDataAndStructure('159827', '6', '2');
            $newsArray              = json_decode($returnData, true);

            function generateRandomString($length = 10) 
            {
                $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                $charactersLength = strlen($characters);
                $randomString = '';
                for ($i = 0; $i < $length; $i++) {
                    $randomString .= $characters[rand(0, $charactersLength - 1)];
                }
                return $randomString;
            }

            if ($_GET['design'] == 'designOne')
            {
            ?>
                <style type="text/css">
                    ::-webkit-input-placeholder, input:-moz-placeholder  {
                       color: #000;
                       opacity:1;
                    }

                    .new-form-group {
                        margin-bottom: 15px;
                    }
                    .social-block {
                        text-align: center;
                    }
                    .social-block h3 {
                        font-size: 24px;
                    }

                    .new-form-control {
                        display: block;
                        width: 100%;
                        height: 38px;
                        padding: 6px 0px;
                        font-size: 14px;
                        line-height: 1.42857143;
                        color: #555;
                        background-color: #fff;
                        background-image: none;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
                        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
                        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
                        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
                        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
                    }
                    .new-form-group .new-form-control {
                        background: #ebebeb;
                        font-weight: 700;
                        border: 0;
                        border-radius: 0;
                        box-shadow: none;
                        text-align: center;
                        font-size: 12px;
                        color: #000;
                    }

                    .btn-style-new-sm {
                        border: 1px solid #fff;
                        text-transform: uppercase;
                        padding: 8px 0;
                        color: #fff;
                        display: inline-block;
                        font-size: 16px;
                        font-weight: 300;
                        min-width: 190px;
                        width: 90%;
                         text-align: center;
                        
                    }
                    .btn-style-new-sm.black {
                        border: 1px solid #000;
                        color: #000;
                    }
                    a.btn-style-new-sm{
                        text-decoration: none;

                    }

                    .btn-style-new-sm:hover, .btn-style-new-sm:focus {
                        color: #fff;
                        background: #aaeacc;
                        border: 1px solid #aaeacc;
                        
                    }
                </style>
                <div class="social-block">
                    <h2>Stay Invested</h2>
                    <form id="subscriberForm" name="subscriberForm" >
                        <div class="new-form-group">
                            <?php $node_class_ids   = $newsArray['data']['node_class_id']; ?>
                            <input type="hidden" id="node_class_id" name="node_class_id" value="<?php echo $node_class_ids; ?>" />
                            <input type="hidden" id="node_y_id" name="node_y_id" value="<?php echo $node_y_id; ?>" />
                            <input type="hidden" id="chimp_api_key" name="chimp_api_key" value="<?php echo $apiObj->encrypt($_GET['api_key']); ?>" />
                            <input type="hidden" id="chimp_list_id" name="chimp_list_id" value="<?php echo $apiObj->encrypt($_GET['list_id']); ?>" />
                            <?php foreach ($newsArray['data']['Properties']['2585']['child'] as $key => $value) { if($value['node_class_property_id'] == '2588') { ?>
                                <?php 
                                    $randData   = generateRandomString(10); 
                                    $string1    = $value['nodeZStructure']['VALIDATION'][0]['value'];
                                    preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);
                                    if(count($matches)>0 && isset($matches[1])){
                                        $newString2 = '';           
                                        foreach (array_reverse($matches[1]) as $key11 => $value11) {
                                            $newString2.= 'check'.$randData.''.$value11."('this.value');";
                                            $replaceStr = 'check'.$randData.''.$value11;
                                            $string1 = str_replace($value11, $replaceStr, $string1);
                                        }           
                                        $newString2 = substr($newString2, 0, -1);
                                    }   
                                ?>
                                <input type="hidden" id="instance_property_id_<?php echo $value['node_class_property_id']; ?>" name="instance_property_id[]" value="<?php echo $value['node_class_property_id']; ?>" />
                                <input type="email" class="new-form-control newslatter_text" placeholder="Enter your email address here" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption[]" validate-data="<?php echo $newString2; ?>" />
                                <?php if(!empty($matches[1]) && $string1!="") { ?>
                                    <script type="text/javascript" >
                                        <?php echo $string1; ?>
                                    </script>
                                <?php } ?>  
                            <?php } } ?>
                        </div>
                        <span id="suc_msg" ></span>
                        <a class="btn-style-new black" href="javascript:void(0);" onclick="subscribeUser();" >Subscribe</a>
                    </form>
                </div>
                <script type="text/javascript">
                    var subscriberUrl = "<?php echo BASE_URL_API; ?>";
                    function subscribeUser()
                    {
                        var flag                        = true;
                        var checkflag                   = "";
                        var temp                        = true;

                        $( ".newslatter_text" ).each(function(i,k)
                        {
                            var data                    = $(this).val();
                            if(flag == true)
                            {
                                var fn                  = "";
                                fn                      = $(this).attr('validate-data').split(";");
                                var aa                  = [];

                                for(i=0;i<fn.length;i++)
                                {
                                    aa.push(fn[i]);
                                }

                                aa.toString();
                                $(aa).each(function(i,v)
                                {
                                    var newStr          = v;
                                    var valdata         = data;
                                    if(valdata == "")
                                    {
                                        var aaa         = newStr.replace("this.value","");
                                    }
                                    else 
                                    {
                                        var aaa         = newStr.replace("this.value",data);    
                                    }

                                    checkflag           = eval(aaa);
                                    if(checkflag == false){
                                        temp            = false;
                                    }
                                });
                                
                                if(temp == false){
                                    flag                = false;
                                } else {
                                    flag                = true;
                                }
                            }
                        });

                        if(flag == true)
                        {
                            $.post(subscriberUrl+'code.php',{'data':$("#subscriberForm").serialize(),'action':'subscribe'},responseSubscribeUser,'JSON');
                        }
                    }

                    function responseSubscribeUser(data,source)
                    {
                        
						 $( ".newslatter_text" ).val("");
						if(parseInt(data.result) == 0)
                        {
                            $(".newslatter_text").val("");
                            $("#suc_msg").css('color','green');
                            $("#suc_msg").html("Thank you for subscribing to our newsletter.");
                            setTimeout('clearMsg()',3000);
                        }

                        if(parseInt(data.result) == 1)
                        {
                            $("#suc_msg").css('color','red');
                            $("#suc_msg").html(data.msg);
                            setTimeout('clearMsg()',3000);
                        }
                        
                    }

                    function clearMsg()
                    {
                        $("#suc_msg").html("");
                    }
                </script>
            <?php } 

            if ($_GET['design'] == 'designTwo')
            {
            ?>
                <ul class="address">
                    <li><h5>Stay invested</h5></li>
                    <li>
                        <form id="subscriberForm2" name="subscriberForm2" >
                            <?php $node_class_ids   = $newsArray['data']['node_class_id']; ?>
                            <input type="hidden" id="node_class_id" name="node_class_id" value="<?php echo $node_class_ids; ?>" />
                            <input type="hidden" id="node_y_id" name="node_y_id" value="<?php echo $node_y_id; ?>" />
                            <input type="hidden" id="chimp_api_key" name="chimp_api_key" value="<?php echo $apiObj->encrypt($_GET['api_key']); ?>" />
                            <input type="hidden" id="chimp_list_id" name="chimp_list_id" value="<?php echo $apiObj->encrypt($_GET['list_id']); ?>" />
                            <?php foreach ($newsArray['data']['Properties']['2585']['child'] as $key => $value) { if($value['node_class_property_id'] == '2588') { ?>
                                <?php 
                                    $randData   = generateRandomString(10); 
                                    $string1    = $value['nodeZStructure']['VALIDATION'][0]['value'];
                                    preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);
                                    if(count($matches)>0 && isset($matches[1])){
                                        $newString2 = '';           
                                        foreach (array_reverse($matches[1]) as $key11 => $value11) {
                                            $newString2.= 'check'.$randData.''.$value11."('this.value');";
                                            $replaceStr = 'check'.$randData.''.$value11;
                                            $string1 = str_replace($value11, $replaceStr, $string1);
                                        }           
                                        $newString2 = substr($newString2, 0, -1);
                                    }   
                                ?>
                            <div class="form-group">
                                <input type="hidden" id="instance_property_id_<?php echo $value['node_class_property_id']; ?>" name="instance_property_id[]" value="<?php echo $value['node_class_property_id']; ?>" />
                                <input type="text" class="form-control new-form-control newslatter_text2" placeholder="Enter your email address here" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption[]" validate-data="<?php echo $newString2; ?>" />
                                <span id="suc_msg2" ></span>
                            </div>
                            <?php if(!empty($matches[1]) && $string1!="") { ?>
                                    <script type="text/javascript" >
                                        <?php echo $string1; ?>
                                    </script>
                                <?php } ?>  
                            <?php } } ?>
                        </form>
                    </li>
                    <li><a class="btn-style-new btn-action" href="javascript:void(0);" onclick="subscribeUser2();" >SUBSCRIBE</a></li>
                </ul>
                <script type="text/javascript">
                    var subscriberUrl = "<?php echo BASE_URL_API; ?>";
                    function subscribeUser2()
                    {
                        var flag                        = true;
                        var checkflag                   = "";
                        var temp                        = true;

                        $( ".newslatter_text2" ).each(function(i,k)
                        {
                            var data                    = $(this).val();
                            if(flag == true)
                            {
                                var fn                  = "";
                                fn                      = $(this).attr('validate-data').split(";");
                                var aa                  = [];

                                for(i=0;i<fn.length;i++)
                                {
                                    aa.push(fn[i]);
                                }

                                aa.toString();
                                $(aa).each(function(i,v)
                                {
                                    var newStr          = v;
                                    var valdata         = data;
                                    if(valdata == "")
                                    {
                                        var aaa         = newStr.replace("this.value","");
                                    }
                                    else 
                                    {
                                        var aaa         = newStr.replace("this.value",data);    
                                    }

                                    checkflag           = eval(aaa);
                                    if(checkflag == false){
                                        temp            = false;
                                    }
                                });
                                
                                if(temp == false){
                                    flag                = false;
                                } else {
                                    flag                = true;
                                }
                            }
                        });

                        if(flag == true)
                        {
                            $.post(subscriberUrl+'code.php',{'data':$("#subscriberForm2").serialize(),'action':'subscribe'},responseSubscribeUser2,'JSON');
                        }
                    }

                    function responseSubscribeUser2(data,source)
                    {
						$(".newslatter_text2").val("");	
                        if(parseInt(data.result) == 0)
                        {
							 
                            $(".newslatter_text").val("");							
                            $("#suc_msg2").css('color','green');
                            $("#suc_msg2").html("Thank you for subscribing to our newsletter.");
                            setTimeout('clearMsg2()',5000);
                        }

                        if(parseInt(data.result) == 1)
                        {
                            $("#suc_msg2").css('color','red');
                            $("#suc_msg2").html(data.msg);
                            setTimeout('clearMsg2()',5000);
                        }
                        
                    }

                    function clearMsg2()
                    {
                        $("#suc_msg2").html("");
                    }
                </script>
            <?php } 

            if ($_GET['design'] == 'designThree')
            {
            ?>
                <div class="register-block">
                    <h3>Register your interest!</h3>
                    <form id="subscriberForm3" name="subscriberForm3" >
                        <?php $node_class_ids   = $newsArray['data']['node_class_id']; ?>
                            <input type="hidden" id="node_class_id" name="node_class_id" value="<?php echo $node_class_ids; ?>" />
                            <input type="hidden" id="node_y_id" name="node_y_id" value="<?php echo $node_y_id; ?>" />
                            <input type="hidden" id="chimp_api_key" name="chimp_api_key" value="<?php echo $apiObj->encrypt($_GET['api_key']); ?>" />
                            <input type="hidden" id="chimp_list_id" name="chimp_list_id" value="<?php echo $apiObj->encrypt($_GET['list_id']); ?>" />
                            <?php foreach ($newsArray['data']['Properties']['2585']['child'] as $key => $value) { if($value['node_class_property_id'] == '2588') { ?>
                                <?php 
                                    $randData   = generateRandomString(10); 
                                    $string1    = $value['nodeZStructure']['VALIDATION'][0]['value'];
                                    preg_match_all('/function[\s\n]+(\S+)[\s\n]*\(/', $string1, $matches);
                                    if(count($matches)>0 && isset($matches[1])){
                                        $newString2 = '';           
                                        foreach (array_reverse($matches[1]) as $key11 => $value11) {
                                            $newString2.= 'check'.$randData.''.$value11."('this.value');";
                                            $replaceStr = 'check'.$randData.''.$value11;
                                            $string1 = str_replace($value11, $replaceStr, $string1);
                                        }           
                                        $newString2 = substr($newString2, 0, -1);
                                    }   
                                ?>
                                <input type="hidden" id="instance_property_id_<?php echo $value['node_class_property_id']; ?>" name="instance_property_id[]" value="<?php echo $value['node_class_property_id']; ?>" />
                                <input type="text" class="form-control rgt-field new-form-control newslatter_text3" placeholder="Enter your email address here" id="instance_property_caption<?php echo $value['node_class_property_id']; ?>"  name="instance_property_caption[]" validate-data="<?php echo $newString2; ?>" />
                                <span id="suc_msg3" ></span>
                                <?php if(!empty($matches[1]) && $string1!="") { ?>
                                    <script type="text/javascript" >
                                        <?php echo $string1; ?>
                                    </script>
                                <?php } ?>  
                            <?php } } ?>
                        <a class="btn-style-new " href="javascript:void(0);" onclick="subscribeUser3();" >REGISTER</a>
                    </form>
                </div>
                <script type="text/javascript">
                    var subscriberUrl = "<?php echo BASE_URL_API; ?>";
                    function subscribeUser3()
                    {
                        var flag                        = true;
                        var checkflag                   = "";
                        var temp                        = true;

                        $( ".newslatter_text3" ).each(function(i,k)
                        {
                            var data                    = $(this).val();
                            if(flag == true)
                            {
                                var fn                  = "";
                                fn                      = $(this).attr('validate-data').split(";");
                                var aa                  = [];

                                for(i=0;i<fn.length;i++)
                                {
                                    aa.push(fn[i]);
                                }

                                aa.toString();
                                $(aa).each(function(i,v)
                                {
                                    var newStr          = v;
                                    var valdata         = data;
                                    if(valdata == "")
                                    {
                                        var aaa         = newStr.replace("this.value","");
                                    }
                                    else 
                                    {
                                        var aaa         = newStr.replace("this.value",data);    
                                    }

                                    checkflag           = eval(aaa);
                                    if(checkflag == false){
                                        temp            = false;
                                    }
                                });
                                
                                if(temp == false){
                                    flag                = false;
                                } else {
                                    flag                = true;
                                }
                            }
                        });

                        if(flag == true)
                        {
                            $.post(subscriberUrl+'code.php',{'data':$("#subscriberForm3").serialize(),'action':'subscribe'},responseSubscribeUser3,'JSON');
                        }
                    }

                    function responseSubscribeUser3(data,source)
                    {
                        if(parseInt(data.result) == 0)
                        {
                            $(".newslatter_text").val("");
                            $("#suc_msg3").css('color','green');
                            $("#suc_msg3").css('display','block');
                            $("#suc_msg3").html("Thank you for sharing your interest with us.");
                            setTimeout('clearMsg3()',3000);
                        }

                        if(parseInt(data.result) == 1)
                        {
                            $("#suc_msg3").css('color','red');
                            $("#suc_msg3").css('display','block');
                            $("#suc_msg3").html(data.msg);
                            setTimeout('clearMsg3()',3000);
                        }
                        
                    }

                    function clearMsg3()
                    {
                        $("#suc_msg3").css('display','none');
                        $("#suc_msg3").html("");
                    }
                </script>
            <?php } ?>

            
        <?php
        }
        else
        {
            echo "Your domain is not register in PU.";
        }
    } 
    else 
    {
        echo "You are Lost.";
    }
}
?>