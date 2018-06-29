function removeRolesOfOrganization(id)
{
    var all_ids         = $("#orga_all_role_id").val();
    all_roleids         = all_ids.substring(0,all_ids.length - 1);
    var temp            = all_roleids.split(',');
    var newIds          = '';
    for(i=0;i<temp.length;i++)
    {
        if(parseInt(temp[i]) != parseInt(id))
        {
            newIds = newIds + temp[i] + ',';
        }
    }
    $("#orga_all_role_id").prop('value',newIds);
    $("#organization_"+id).remove();
}

function removeRolesOfOrganizationPermanent(id,relation_id)
{
    bootbox.confirm({
        title: 'Warning',
        message: 'Are you sure you want to remove this role.',
        buttons: {
            'cancel': {
                label: 'No',
                className: 'btn-default'
            },
            'confirm': {
                label: 'Yes',
                className: 'btn-primary'
            }
        },
        callback: function(result) {
            if (result)
            {
                $.ajax({
                    url : domainUrl+'group/removeRelation',
                    type: "POST",
                    data : {'relation_id':relation_id,'user_id':setUserID,'role_id':id,'group_node_id':$("#group_instance_node_id").val(),'action':'Remove Role'},
                    dataType: "json",
                    async: true,
                    beforeSend : function(){
                    },
                    success:function(data)
                    {
                        var all_ids         = $("#orga_all_role_id").val();
                        all_roleids         = all_ids.substring(0,all_ids.length - 1);
                        var temp            = all_roleids.split(',');
                        var newIds          = '';
                        for(i=0;i<temp.length;i++)
                        {
                            if(parseInt(temp[i]) != parseInt(id))
                            {
                                newIds = newIds + temp[i] + ',';
                            }
                        }
                        $("#orga_all_role_id").prop('value',newIds);
                        $("#organization_"+id).remove();
                    }
                });
            }
        }
    });
}

var allrolespu = [];
function responseSystemRoles(data,source)
{
    var counter = 0;
    $.each(data, function (index, roles) {
        if(parseInt(roles['role_id']) > 0)
            counter++;
    });

    if(parseInt(counter) > 0)
    {
        $.each(data, function (index, roles) {
            allrolespu.push({"key":roles['role_id'],"value":roles['role']});
        });
        $("#is_system_roles").attr('value','Y');
    }
}

var alluserspu = [];
function responseSystemUsers(data,source)
{
    var counter = 0;
    $.each(data, function (index, user) {
        if(parseInt(user['node_id']) > 0)
            counter++;
    });

    if(parseInt(counter) > 0)
    {
        $.each(data, function (index, user) {
            alluserspu.push({"key":user['node_id'],"value":user['email_address'],"first_name":user['first_name'],"last_name":user['last_name'],"profile_image":user['profile_image']});
        });
    }
}

function addOrganizationRolesAndGroupsFromUser(type)
{
    $("#add_organization_form").addClass('hide');
    $("#add_roles_form").addClass('hide');
    $("#add_member_with_group").addClass('hide');
    $("#organization_action_menu a").addClass('hide');
    $("#dialogue_role_group").removeClass('hide');

    if($("#is_system_roles").val() == "")
    {
        $.post(domainUrl+'group/getAllRoles',{},responseSystemRoles,'json');
        $.post(domainUrl+'classes/getAllUsers',{},responseSystemUsers,'json');
    }

    if(type == 'organizations')
    {
        $(".list-row").removeClass('active');
        $(".lisat-class-row0").before('<tr class="lisat-class-row-undefined list-row active" id="list-row_0" data-node-id ="" ><td>Undefine</td></tr>');
        $(".AddGroup_li").addClass('inactive');
        $(".AddGroup_li").css('pointer-events','none');
        $("#group_label").html('');
        $("#organization_type").prop('value','group_add');
        $("#group_instance_node_id").prop('value','');
        $("#group_instance_id").prop('value','');
        $("#group_property_val_"+group_name_pid).removeClass('hide');
        $("#group_property_val_"+group_name_pid).prop('value','');
        $("#add_organization_form").removeClass('hide');
        $("#button-save-organization").removeClass('hide');
        $("#button-cancel-groups-organization").removeClass('hide');
    } 
    else if(type == 'roles')
    {
        $("#add_organization_form").removeClass('hide');
        $("#add_roles_form").removeClass('hide');
        $("#roles_orga_main_div").removeClass('hide');
        $("#button-roles-organization").removeClass('hide');
        $("#organization_type").prop('value','role_add');
        $("#button-cancel-groups-organization").removeClass('hide');
    } 
    else if(type == 'groups')
    {
        $("#add_member_with_group").removeClass('hide');
        $("#button-role-groups-organization").removeClass('hide');
    }
    else if(type == 'edit_organizations')
    {
        $("#add_organization_form").removeClass('hide');
        $("#button-save-organization").removeClass('hide');
        $("#group_property_val_"+group_name_pid).removeClass('hide');
        $("#button-cancel-groups-organization").removeClass('hide');
        $("#organization_type").prop('value','group_edit');
        $("#group_label").html('');
    }
}

function addMoreRolesOfOrganization()
{
    var all_ids         = $("#orga_all_role_id").val();
    var role_id         = $("#orga_role_id").val();
    var role_name       = $("#roles_list").val();

    if($.trim(role_id) == '' && $.trim(role_name) != '')
    {
        $.ajax({
            url : domainUrl+'group/addRole',
            type: "POST",
            data : {'role_name':role_name},
            dataType: "json",
            async: true,
            beforeSend : function(){
            },
            success:function(data)
            {
                if($.trim(data.role_id) != '')
                {
                    role_id = data.role_id;
                    allrolespu = [];
                    $.ajax({
                        url : domainUrl+'group/getAllRoles',
                        type: "POST",
                        data : {},
                        dataType: "json",
                        async: true,
                        beforeSend : function(){
                        },
                        success:function(data)
                        {
                            var counter = 0;
                            $.each(data, function (index, roles) {
                                if(parseInt(roles['role_id']) > 0)
                                    counter++;
                            });

                            if(parseInt(counter) > 0)
                            {
                                $.each(data, function (index, roles) {
                                    allrolespu.push({"key":roles['role_id'],"value":roles['role']});
                                });
                                $("#is_system_roles").attr('value','Y');
                            }

                            $('#roles_list').autocomplete({
                                appendTo: "#rolesOrganizationAutoCompleteBox",
                                lookup: allrolespu,
                                width: '80%',
                                onSelect: function (suggestion) {
                                    $("#orga_role_id").val(suggestion.key);
                                    $('#roles_list').val(suggestion.value);
                                },
                                forceFixPosition: 'auto',
                                orientation: 'top'
                            });
                        }
                    });

                    if($.trim(role_id) != '')
                    {
                        $("#orga_all_role_id").prop('value',all_ids + role_id + ',');
                        $("#orga_role_id").prop('value','');
                        $("#roles_list").prop('value','');
                        var html            = '<div id="organization_'+role_id+'"><span>'+role_name+'</span><a class="" href="javascript:void(0)" onclick="removeRolesOfOrganization('+role_id+')">Remove</a></div>';
                        $("#orga_all_role_list").append(html);

                    }
                }
                
            }
        });
    }   
    else
    {
        all_roleids         = all_ids.substring(0,all_ids.length - 1)
        var temp            = all_roleids.split(',');
        for(i=0;i<temp.length;i++)
        {
            if(parseInt(temp[i]) == parseInt(role_id))
            {
                alert('Already added this role.');
                $("#orga_role_id").prop('value','');
                $("#roles_list").prop('value','');
                return false;
            }
        }
        if($.trim(role_id) != '')
        {
            $("#orga_all_role_id").prop('value',all_ids + role_id + ',');
            $("#orga_role_id").prop('value','');
            $("#roles_list").prop('value','');
            var html            = '<div id="organization_'+role_id+'"><span>'+role_name+'</span><a class="" href="javascript:void(0)" onclick="removeRolesOfOrganization('+role_id+')">Remove</a></div>';
            $("#orga_all_role_list").append(html);
        }
    } 
}

function saveOrganizationRoleAndGroup(type)
{
    var data = {};
    if(type == 'organizations')
    {
        if($.trim($("#group_property_val_9121").val()) == '')
        {
            alert("Please enter organization.");
            return false;
        }
        var formData = $("#group_form").serialize();
        data = {'type':type,'form':formData};
    } 
    else if(type == 'roles')
    {
        if($.trim($("#group_instance_node_id").val()) == '')
        {
            alert("Please select any organization.");
            return false;
        }

        if($.trim($("#orga_all_role_id").val()) == '')
        {
            alert("Please select at least one role.");
            return false;
        }
        data = {'type':type,'role_ids':$("#orga_all_role_id").val(),'group_instance_id':$("#group_instance_id").val(),'group_node_id':$("#group_instance_node_id").val(),'action':'Add Role','user_id':setUserID};
    } 
    else if(type == 'users')
    {
        var groupUserList   = [];
        var allUserIds      = $("#all_user_ids").val();
        all_userids         = allUserIds.substring(0,allUserIds.length - 1)
        var temp            = all_userids.split(',');
        for(i=0;i<temp.length;i++)
        {
            var actorId     = temp[i];
            for(j=0;j<alluserspu.length;j++)
            {
                if(parseInt(alluserspu[j]['key']) == parseInt(actorId))
                {
                    groupUserList.push({"key":alluserspu[j]['key'],"email_address":alluserspu[j]['value'],"first_name":alluserspu[j]['first_name'],"last_name":alluserspu[j]['last_name'],"profile_image":alluserspu[j]['profile_image']});
                }
            }
        }

        var roleId          = $("#add_users_role_id").val();
        var roleName        = '';
        for(j=0;j<allrolespu.length;j++)
        {
            if(parseInt(allrolespu[j]['key']) == parseInt(roleId))
            {
                roleName = allrolespu[j]['value'];
            }
        }

        var groupId    = $("#add_users_group_id").val();
        var groupName  = $("#group_property_val_"+group_name_pid).val();

        data = {'type':type,'group_id':groupId,'group_name':groupName,'role_id':roleId,'role_name':roleName,'all_user_ids':allUserIds,'group_user_list':groupUserList};
    }
    else if(type == 'groups')
    {
        data = {'type':type};
    }

    $.post(domainUrl+'group/saveOrganizationRoleAndGroup',{'data':data},responseSaveOrganizationRoleAndGroup,'json');
}

function responseSaveOrganizationRoleAndGroup(d,s)
{ 
    if(d.type == 'group_add')
    {
        $(".lisat-class-row-undefined").remove();
        $(".AddGroup_li").removeClass('inactive');
        $(".AddGroup_li").css('pointer-events','all');
        $(".group_top_cl").trigger('click');
    }
    else if(d.type == 'group_edit')
    {
        $("#group_label_"+d.group_id).attr('onclick','selectOrganization('+d.group_id+','+d.group_node_id+',"'+d.group_name+'")');
        $("#group_label_"+d.group_id).html(d.group_name);
        $("#group_label_"+d.group_id).trigger('click');
    }
    else if(d.type == 'roles')
    {
        $("#group_label_"+d.group_id).trigger('click');
    }
    else if(d.type == 'users')
    {
        $("#orga_all_users_list").html('');
        var all_ids         = '';
        for(i=0;i<d.user_list.length;i++)
        {
            var actorId     = d.user_list[i];
            all_ids         = all_ids + actorId + ',';
            var actorName   = '';
            for(j=0;j<alluserspu.length;j++)
            {
                if(parseInt(alluserspu[j]['key']) == parseInt(actorId))
                {
                    actorName = alluserspu[j]['value'];
                }
            }

            if($.trim(actorName) != '')
            {
                var html            = '<div id="organization_user_'+actorId+'"><span>'+actorName+'</span><a class="hide" href="javascript:void(0)" onclick="removeUsersOfOrganization('+actorId+')">Remove</a></div>';
                $("#orga_all_users_list").append(html);
            }
        }
        $("#all_user_ids").prop('value',all_ids);
    }
}

function selectOrganization(group_instance_id,group_node_id,group_name)
{
    $("#orga_all_role_id").prop('value','');
    $("#orga_role_id").prop('value','');
    $("#roles_list").prop('value','');
    $("#orga_all_role_list").html('');
    $("#add_organization_form").addClass('hide');
    $("#add_roles_form").addClass('hide');
    $("#add_member_with_group").addClass('hide');
    $("#organization_action_menu a").addClass('hide');
    $("#dialogue_role_group").removeClass('hide');

    $("#button-edit-organization").removeClass('hide');
    $("#button-add-roles").removeClass('hide');

    $(".list-row").removeClass('active');
    $("#list-row_"+group_instance_id).addClass('active');

    $("#group_instance_node_id").prop('value',group_node_id);
    $("#group_instance_id").prop('value',group_instance_id);
    $("#group_property_val_"+group_name_pid).prop('value',group_name);
    $("#organization_type").prop('value','group_view');

    $("#group_property_val_"+group_name_pid).addClass('hide');
    $("#group_label").html(' '+group_name);

    $("#add_organization_form").removeClass('hide');

    $.post(domainUrl+'group/getRolesOfGroup',{'group_node_id':group_node_id,'group_instance_id':group_instance_id,'group_name':group_name},responseSelectOrganization,'json');
    if($("#is_system_roles").val() == "")
    {
        $.post(domainUrl+'group/getAllRoles',{},responseSystemRoles,'json');
        $.post(domainUrl+'menudashboard/getAllUsers',{},responseSystemUsers,'json');
    }
}

function responseSelectOrganization(d,s)
{
    if(d.roles != '')
    {
        var html            = '';
        var all_ids         = '';
        for(i=0;i<d.roles.length;i++)
        {
            all_ids         = all_ids + d.roles[i].node_x_id + ',';
            // For Remove Role Functionality Please Add Below Line On Action
            // <a class="hide" href="javascript:void(0)" onclick="removeRolesOfOrganizationPermanent('+d.roles[i].node_x_id+','+d.roles[i].node_x_y_relation_id+')">Remove</a>
            html            = html+'<div id="organization_'+d.roles[i].node_x_id+'"><span>'+d.roles[i].role+'</span><a class="" href="javascript:void(0)" onclick="addUserWithRoleAndGroup('+d.group_node_id+','+d.roles[i].node_x_id+')">Add User</a></div>';
        }

        $("#orga_all_role_list").html(html);
        $("#orga_all_role_id").prop('value',all_ids);
    }
    $("#add_roles_form").removeClass('hide');
    $("#roles_orga_main_div").addClass('hide');
}

function cancelOrganization()
{
    var type = $("#organization_type").val();

    if(type == 'group_edit')
    {
        $("#add_organization_form").addClass('hide');
        $("#add_roles_form").removeClass('hide');
        $("#roles_orga_main_div").addClass('hide');
        $("#add_member_with_group").addClass('hide');
        $("#organization_action_menu a").addClass('hide');
        $("#dialogue_role_group").removeClass('hide');

        $("#button-edit-organization").removeClass('hide');
        $("#button-add-roles").removeClass('hide');

        $("#organization_type").prop('value','group_view');
        $("#group_property_val_"+group_name_pid).addClass('hide');

        var val = $("#group_label_"+$("#group_instance_id").val()).html();
        $("#group_label").html(' '+$.trim(val));
        $("#group_property_val_"+group_name_pid).prop('value',$.trim(val));

        $("#add_organization_form").removeClass('hide');
    }
    else if(type == 'role_add')
    {
        $("#add_organization_form").addClass('hide');
        //$("#add_roles_form").addClass('hide');
        $("#roles_orga_main_div").addClass('hide');
        $("#add_member_with_group").addClass('hide');
        $("#organization_action_menu a").addClass('hide');
        $("#dialogue_role_group").removeClass('hide');

        $("#button-edit-organization").removeClass('hide');
        $("#button-add-roles").removeClass('hide');

        $("#organization_type").prop('value','group_view');
        $("#group_property_val_"+group_name_pid).addClass('hide');

        var val = $("#group_label_"+$("#group_instance_id").val()).html();
        $("#group_label").html(' '+$.trim(val));
        $("#group_property_val_"+group_name_pid).prop('value',$.trim(val));

        $("#add_organization_form").removeClass('hide');
    }
    else if(type == 'group_add')
    {
        $(".lisat-class-row-undefined").remove();
        $(".AddGroup_li").removeClass('inactive');
        $(".AddGroup_li").css('pointer-events','all');
        if($(".first-group-div").length)
        {
            $(".first-group-div").trigger('click');
        }
        else
        {
            $("#organization_action_menu a").addClass('hide');
            $("#dialogue_role_group").removeClass('hide');
            $("#add_organization_form").addClass('hide');
            $(".lisat-class-row0").addClass('active');
        }
    }
    else if(type == 'add_member')
    {
        $("#add_organization_form").addClass('hide');
        $("#add_roles_form").removeClass('hide');
        $("#roles_orga_main_div").addClass('hide');
        $("#add_member_with_group").addClass('hide');
        $("#organization_action_menu a").addClass('hide');
        $("#dialogue_role_group").removeClass('hide');

        $("#button-edit-organization").removeClass('hide');
        $("#button-add-roles").removeClass('hide');

        $("#organization_type").prop('value','group_view');
        $("#add_organization_form").removeClass('hide');
    }
}

function addUserWithRoleAndGroup(groupId,roleId)
{
    $("#add_member_with_group").removeClass('hide');
    $("#organization_action_menu a").addClass('hide');
    $("#dialogue_role_group").removeClass('hide');
    $("#button-save-users-with-group").removeClass('hide');
    $("#button-cancel-groups-organization").removeClass('hide');

    $("#add_users_group_id").prop('value',groupId);
    $("#add_users_role_id").prop('value',roleId);
    $("#organization_type").prop('value','add_member');

    $.post(domainUrl+'group/getUsersOfRoleAndGroup',{'groupId':groupId,'roleId':roleId},responseGetUsersOfRoleAndGroup,'json');
}

function responseGetUsersOfRoleAndGroup(d,s)
{
    $("#orga_all_users_list").html('');
    var all_ids         = '';
    for(i=0;i<d.user_list.length;i++)
    {
        var actorId     = d.user_list[i];
        all_ids         = all_ids + actorId + ',';
        var actorName   = '';
        for(j=0;j<alluserspu.length;j++)
        {
            if(parseInt(alluserspu[j]['key']) == parseInt(actorId))
            {
                actorName = alluserspu[j]['value'];
            }
        }

        if($.trim(actorName) != '')
        {
            var html            = '<div id="organization_user_'+actorId+'"><span>'+actorName+'</span><a class="hide" href="javascript:void(0)" onclick="removeUsersOfOrganization('+actorId+')">Remove</a></div>';
            $("#orga_all_users_list").append(html);
        }
    }
    $("#all_user_ids").prop('value',all_ids);
}

function addMoreUsersOfOrganization()
{
    var all_ids         = $("#all_user_ids").val();
    var user_id         = $("#particuler_user_id").val();
    var user_name       = $("#users_list_auto").val();

    if($.trim(user_id) == '' && $.trim(user_name) != '')
    {
        $("#particuler_user_id").prop('value','');
        $("#users_list_auto").prop('value','');
    }   
    else
    {
        all_roleids         = all_ids.substring(0,all_ids.length - 1)
        var temp            = all_roleids.split(',');
        for(i=0;i<temp.length;i++)
        {
            if(parseInt(temp[i]) == parseInt(user_id))
            {
                alert('Already added this user.');
                $("#particuler_user_id").prop('value','');
                $("#users_list_auto").prop('value','');
                return false;
            }
        }
        if($.trim(user_id) != '')
        {
            $("#all_user_ids").prop('value',all_ids + user_id + ',');
            $("#particuler_user_id").prop('value','');
            $("#users_list_auto").prop('value','');
            var html            = '<div id="organization_user_'+user_id+'"><span>'+user_name+'</span><a class="" href="javascript:void(0)" onclick="removeUsersOfOrganization('+user_id+')">Remove</a></div>';
            $("#orga_all_users_list").append(html);
        }
    } 
}

function removeUsersOfOrganization(id)
{
    var all_ids         = $("#all_user_ids").val();
    all_userids         = all_ids.substring(0,all_ids.length - 1);
    var temp            = all_userids.split(',');
    var newIds          = '';
    for(i=0;i<temp.length;i++)
    {
        if(parseInt(temp[i]) != parseInt(id))
        {
            newIds = newIds + temp[i] + ',';
        }
    }
    $("#all_user_ids").prop('value',newIds);
    $("#organization_user_"+id).remove();
}