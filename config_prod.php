<?php
/* ------------------
  | URL Settings    |
  ------------------ */
//if (!isset($slashes) && empty($_SERVER['REDIRECT_BASE'])) {$slashes = '/';} else {$slashes = $_SERVER['REDIRECT_BASE'];}
$slashes = DIRECTORY_SEPARATOR;
$http_host = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : "";
DEFINE('BASE_URL', 'http://' . $http_host . $slashes);
DEFINE('ABSO_URL', $_SERVER['DOCUMENT_ROOT'] . $slashes);
define('STORAGE_NAME', 'file');
DEFINE('SOCKET_CHAT_URL', "ws://" . $http_host . ":9001/course-dialogue-server.php");
DEFINE('EDITOR', 'http://' . $http_host . '/public/js/edt-worker.js');
DEFINE('SOCKET_HOST_NAME', 'http://www.prospus.com/prod.pu/');

/* ------------------
  | Deal Settings    |
  ------------------ */
DEFINE('DEAL_PHASE_PROPERTY_ID', '7744');
DEFINE('DEAL_PHASE_VERSION_PROPERTY_ID', '7745');
DEFINE('DEAL_PAYMENT_TYPE_PROPERTY_ID', 3231);
DEFINE('DEAL_DESIGNATION_PROPERTY_ID', 3230);
DEFINE('DEAL_TRADE_IN_PROPERTY_ID', 3229);
DEFINE('DEAL_ROLE_CLASS_ID', 778);
DEFINE('DEAL_ROLE_USER_NODE_PROPERTY_ID', 6786);
DEFINE('DEAL_ROLE_NODE_PROPERTY_ID', 6787);
DEFINE('DEAL_EST_CLOSING_DATE_PROPERTY_ID', 6802);
DEFINE('DEAL_REJECT_CLASS_ID', 823);
DEFINE('DEAL_APPONE_CLASS_ID', 825);
DEFINE('DEAL_APPONE_APPID_PROPERTY_ID', 8029);
DEFINE('DEAL_APPONE_REQUEST_PROPERTY_ID', 8030);
DEFINE('DEAL_APPONE_RESPONSE_PROPERTY_ID', 8031);
DEFINE('DEAL_CURRENT_VERSION_PROPERTY_ID', 8450);
DEFINE('DEAL_SIZE', 8748);
DEFINE('DEAL_NUMBER', 9090);
DEFINE('MAPPING_DEAL_OP_STATUS', 6354);
DEFINE('FINANCE_DEALS_CLASS_ID', '801');
DEFINE('DEAL_CLASS', '655');
DEFINE('PASS_DEAL', '852');
DEFINE('DEAL_FI_QUOTE_PID', '3228');
DEFINE('DEAL_STOCK_PID', '3216');
DEFINE('DEAL_STATUS_PID', '3287');
DEFINE('DEAL_SUB_STATUS_PID', '8848');
DEFINE('DEAL_TIMESTAMP_PID', 8913);
DEFINE('DEAL_ASSIGNED_PID', 8914);
DEFINE('DEAL_CREATOR_CLASS_ID', 778);
DEFINE('DEAL_PID', '3299');
DEFINE('DEALEROPTIONS_CLASS_ID', 794);
DEFINE('DEAL_EXISTS_PID', 9097);
DEFINE('MOTORS_CLASS_ID', 775);
DEFINE('DEAL_PERMISSIONS_PROP_ID', 7404);
DEFINE('DEAL_CLASS_NODEID', '396138');

/* -------------------
  | Phase Settings    |
  ------------------- */
DEFINE('PHASE_CLASS_ID', '782');
DEFINE('PHASE_DEAL_P_ID', '6885');
DEFINE('PHASE_PHASE_P_ID', '6886');
DEFINE('PHASE_ROLE_P_ID', '6887');
DEFINE('PHASE_STATUS_P_ID', '6888');
DEFINE('PHASE_SEQUENCE', '7689');
DEFINE('MANAGE_PHASE_SEQUENCE', 806);

/* -----------------------
  | Pass Deal Settings    |
  ----------------------- */
DEFINE('PASSED_DEAL_BY_ROLES_CLASS_ID', 855);
DEFINE('PASSED_DEAL_BY_ROLES_CLASS_NID', 1377982);
DEFINE('PASSED_DEAL_D_PID', 8454);
DEFINE('PASSED_DEAL_FR_PID', 8455);
DEFINE('PASSED_DEAL_TR_PID', 8456);
DEFINE('PASSED_DEAL_A_PID', 8457);
DEFINE('PASSED_DEAL_TIMESTAMP', 8749);


/* -------------------
  | Role Settings     |
  ------------------- */
DEFINE('ROLE_CLASS_ID', 633);
DEFINE('ROLE_PID', '3297');
DEFINE('ROLE_BM', 450187);
DEFINE('ROLE_RA', 454674);
DEFINE('ROLE_RM', 454679);
DEFINE('ROLE_C', 1462795);
DEFINE('ROLE_D', 1462785);
DEFINE('ROLE_ADMIN', 8474);
DEFINE('ROLE_SALES_CONSULTANT', '436104');
DEFINE('ROLE_BUSINESS_MANAGER', '436099'); /* ========>This is for Brokerage Consultant<================================= */
DEFINE('ROLE_TEAM_SUPPORT', '454669');
DEFINE('ROLE_SELLER', '454664');
DEFINE('ROLE_BUYER', '454659');
DEFINE('ROLE_REVENUE_ACCOUNTANT', '454674');
DEFINE('ROLE_REVENUE_MANAGER', '454679');
DEFINE('ROLE_CONTROLLER', '1462795');
DEFINE('ROLE_DIRECTOR', '1462785');
DEFINE('BUSINESS_MANAGER', '450187');
DEFINE('REVENUE_ACCOUNTANT', '454674');
DEFINE('REVENUE_MANAGER', '454679');
DEFINE('CONTROLLER', '1462795');
DEFINE('DIRECTOR', '1462785');
DEFINE('ROLE_SUPERADMIN', '1746983');
DEFINE('ROLE_ADMINISTRATOR', '603696');
DEFINE('REQUIRED_ROLES_PROP_ID', 7406);

/* -------------------
  | RA Settings       |
  ------------------- */
DEFINE('RA_MANAGER_COUNTER_CLASS_ID', 857);
DEFINE('RA_MANAGER_ROLE', 8751);
DEFINE('RA_MANAGER_ACTOR', 8752);
DEFINE('RA_MANAGER_COUNT', 8753);
DEFINE('RA_MANAGER_COUNTER', 24);

/* ----------------------------
  | Manage Control Settings    |
  ---------------------------- */
DEFINE('MANAGE_CONTROL_CLASS_ID', 853);
DEFINE('MANAGE_CONTROL_ROLE_PROPERTY_ID', 8444);

/* -----------------------
  | Operation Settings    |
  ----------------------- */
DEFINE('OPERATION_PHASE_CLASS_ID', '781');
DEFINE('OPERATION_CLASS_ID', 661);
DEFINE('OPERATION_ROLE_CLASS_ID', 662);
DEFINE('MAPPING_DEAL_OPERATION_CLASS_ID', 724);
DEFINE('OPERATION_DOCUMENT_UPLOADED_CLASS_ID', 849);
DEFINE('OPERATION_PROPERTY_MAP_DEAL_CLASS_ID', '787');
DEFINE('OPERATION_ROLE_CONTROL', '854');
DEFINE('OPERATION_ROLE', '662');


/* ----------------------
  | Taxonomy Settings    |
  ----------------------- */
DEFINE('TAXONOMY_CLASS_ID', 165);
DEFINE('TAXONOMY_TYPE_PROPERTY_ID', 1656);

/* --------------------
  | Node Z Settings    |
  --------------------- */
DEFINE('VERSION_Z', '16543');
DEFINE('CLASS_Z', '67905');
DEFINE('TAXONOMY_Z', '16525');
DEFINE('DATATYPE_Z', '16537');
DEFINE('FORM_SELECTOR_Z', '16539');
DEFINE('VALIDATION_Z', '16541');
DEFINE('NODE_RIGHTS_Z', '28048');
DEFINE('DATA_SOURCE_Z', '661473');
DEFINE('COLLAPSE_Z', '804675');
DEFINE('NODEZ_DATASOURCE_SEARCH_ARRAY', json_encode(array('#nbsp#', '#,#', '#-#')));
DEFINE('NODEZ_DATASOURCE_REPLACE_ARRAY', json_encode(array(' ', ', ', '-')));
DEFINE('NODEZ_CLASS_ID', 364);

/* -------------------
  | PDF Settings      |
  -------------------- */
DEFINE('PDF_TITLE', 'PDF Template NID');
DEFINE('PDF_PROPERTY_ID', 5028);


/* ------------------------------
  | Encryption Key Settings      |
  ------------------------------- */
DEFINE('ENCRYPTION_KEY', 'd0a7e7997b6d5fcd55f4b5c32611b87cd923e88837b63bf2941ef819dc8ca282');
DEFINE('ENCRYPTION_STATUS', '0');

/* ------------------------------
  | Document Settings            |
  ------------------------------- */
DEFINE('DOCUMENT_TITLE', 'Document');

/* ------------------------------
  | Target Settings              |
  ------------------------------- */
DEFINE('TARGET_PROPERTY_ID', 6312);
DEFINE('TARGET_PROPERTY_NAME', 6355);

/* ------------------------------
  | Dialouge Settings            |
  ------------------------------- */
DEFINE('DIALOGUE_CLASS_ID', 179);
DEFINE('DIALOGUE_TITLE_ID', 839);
DEFINE('DIALOGUE_ADMIN_ID', 1979);
DEFINE('DIALOGUE_TIMESTAMP_ID', 1980);
DEFINE('DIALOGUE_UPDATED_TIMESTAMP_ID', 5114);

/* -------------------------------
  | Statement Settings            |
  -------------------------------- */
DEFINE('STATEMENT_CLASS_ID', 180);
DEFINE('STATEMENT_ACTOR_AUTHOR', 841);

/* --------------------------------
  | Individual Settings            |
  --------------------------------- */
DEFINE('INDIVIDUAL_CLASS_ID', 632);
DEFINE('INDIVIDUAL_FIRST_NAME', 2921);
DEFINE('INDIVIDUAL_LAST_NAME', 2922);
DEFINE('INDIVIDUAL_DOB', 2923);
DEFINE('INDIVIDUAL_EMAIL_ID', 2932);
DEFINE('INDIVIDUAL_DEVICE_TOKEN', 9190);
DEFINE('INDIVIDUAL_PROFILE_IMAGE', 9221);

/* --------------------------------
  | Individual History            |
  --------------------------------- */
DEFINE('INDIVIDUAL_HISTORY_CLASS_ID', 867);
DEFINE('INDIVIDUAL_ACTORID_PROP_ID', 9194);
DEFINE('INDIVIDUAL_TIMESTAMP_PROP_ID', 9195);
DEFINE('INDIVIDUAL_STATUS_PROP_ID', 9196);

/* ------------------------------
  | Customer Settings            |
  ------------------------------- */
DEFINE('CUSTOMER_CLASS_ID', '770');
DEFINE('CUSTOMER_CLASS_NID', '601263');
DEFINE('CUSTOMER_PID', '7202');

/* ------------------------
  | Location Settings      |
  ------------------------ */
DEFINE('LOCATION_ROLE_DETAILS', '858');
DEFINE('LOCATION_ROLE_LNID', '8755');
DEFINE('LOCATION_ROLE_RNID', '8756');
DEFINE('LOCATION_ROLE_ANID', '8757');
DEFINE('LOCATION_ROLE_L', '8758');
DEFINE('LOCATION_ROLE_R', '8759');
DEFINE('LOCATION_ROLE_A', '8760');
DEFINE('LOCATION_ROLE_E', '8761');

/* -------------------
  | Unit Settings      |
  -------------------- */
DEFINE('UNIT_CLASS_ID', '776');
DEFINE('UNIT_CLASS_NID', '641371');
DEFINE('UNIT_MOTOR_CLASS_NID', '640713');

/* --------------------
  | Sales Settings     |
  --------------------- */
DEFINE('SALES_QUOTE_PID', '7204');

/* ----------------------
  | Mapping Settings     |
  ----------------------- */
DEFINE('MAPPING_ROLE_ACTOR_CLASS_ID', 663);
DEFINE('MAPPING_API_CLASS_ID', 768);
DEFINE('SUB_MAPPING_CLASS_ID', 769);

/* ------------------------
  | Seperator Settings     |
  ------------------------- */
DEFINE('CHECKBOX_SEPERATOR', '~#~');

/* -------------------------
  | Pagination Settings     |
  -------------------------- */
DEFINE('RECORD_PER_PGE', 25);
DEFINE('DATA_PER_PGE', 25);

/* ----------------------
  | CSS Settings         |
  ----------------------- */
DEFINE('CSS_FILE_NODE_PROPERTY_ID', 450312);


/* ----------------------
  | email Settings       |
  ----------------------- */
DEFINE('SITE_SUPPORT_EMAIL', 'admin@marinemax.com');

/* ----------------------
  | Stock Settings       |
  ----------------------- */
DEFINE('STOCK_PID', '7203');

/* ----------------------
  | FI Quote Settings    |
  ----------------------- */
DEFINE('FI_QUOTE_PID', '7205');

/* ----------------------
  | CO BUYER Settings    |
  ----------------------- */
DEFINE('COBUYER_PID', '8452');

/* ----------------------
  | Rule Set Settings    |
  ----------------------- */
DEFINE('RULESET_CLASS_ID', 201);

/* ---------------------
  | Account Settings    |
  ---------------------- */
DEFINE('ACCOUNT_CLASS_ID', 634);
DEFINE('ACCOUNT_PASSWORD_ID', 2933);
DEFINE('ACCOUNT_CLASS_NODE_ID', 275709);

/* ----------------------
  | Actor Settings       |
  ----------------------- */
DEFINE('ACTOR_PID', '3298');

/* -----------------------
  | Prefix Settings       |
  ------------------------ */
DEFINE('PREFIX', 'prod_');

/* ---------------------
  | Menu Settings       |
  ---------------------- */
DEFINE('MENU_SETDEFAULT_PROPERTY_ID', 8451);
DEFINE('MENU_ID', 136);
DEFINE('INBOX_MENU_ID', 48);
DEFINE('ACCOUNT_MENU_ID', 132);
DEFINE('CLASSES_MENU_ID', 1);

/* ----------------------
  | Production Settings  |
  ----------------------- */
DEFINE('PRODUCTION_CLASS_ID', 433);

/* ----------------------
  | Series Settings      |
  ----------------------- */
DEFINE('SERIES_CLASS_ID', 431);

/* ---------------------
  | Segment Settings    |
  ---------------------- */
DEFINE('SEGMENT_CLASS_ID', 430);

/* ---------------------
  | Discendant Settings |
  ---------------------- */
DEFINE('DISCENDANT_PROPERTY_ID', 1675);

/* ---------------------
  | Course Settings     |
  ---------------------- */
DEFINE('COURSE_CLASS_ID', 435);
DEFINE('COURSE_TEMP_ID', 2049);
DEFINE('COURSE_TITLE_ID', 2050);

DEFINE('COURSE_CREATED_BY_ID', 3249);
DEFINE('COURSE_TIMESTAMP_ID', 2940);

DEFINE('COURSE_DESC_ID', 2051);
DEFINE('COURSE_OBJ_ID', 2052);
DEFINE('COURSE_TIME_ID', 2940);
DEFINE('COURSE_CREATED_ID', 3249);
DEFINE('COURSE_UPDATE_TIME_ID', 5098);

DEFINE('COURSE_TITLE_PROP_NID', 74685);
DEFINE('COURSE_PROP_PNID', 74679);
DEFINE('COURSE_UPDATE_TIMESTAMP_PROP_NID', 540518);
DEFINE('COURSE_CREATED_BY_PROP_NID', 397264);

/* ---------------------
  | Dialogue Settings   |
  ---------------------- */

DEFINE('DIALOGUE_TITLE_PROP_NID', 19842);
DEFINE('DIALOGUE_TITLE_PROP_PNID', 19840);

/* ---------------------
  | Selector Settings   |
  ---------------------- */
DEFINE('SELECTOR_CLASS_ID', 199);

/* ----------------------
  | Declaration Settings |
  ----------------------- */
DEFINE('DECLARATION_CLASS_ID', 200);

/* ------------------------
  | Notification Settings  |
  ------------------------- */
DEFINE('NOTIFICATION_CLASS_ID', 671);
DEFINE('NOTIFICATION_ACTOR_PID', 3475);
DEFINE('NOTIFICATION_VIEW_PID', 3476);
DEFINE('NOTIFICATION_DIALOG_PID', 3477);

/* ----------------------
  | Obselete Settings    |
  ----------------------- */
DEFINE('OBSELETE_PROPERTY_ID', 6356);

/* ----------------------
  | Data Source Settings |
  ----------------------- */
DEFINE('DATA_SOURCE_PROPERTY_ID', 6795);

/* -------------------------
  | Current Version Settings|
  -------------------------- */
DEFINE('IS_CURRENT_VERSION_PROPERTY_ID', 8446);

/* -----------------------
  | Insurance Settings    |
  ------------------------ */
DEFINE('INSURANCES_CLASS_ID', 803);

/* -----------------------
  | Vantage Settings    |
  ------------------------ */
DEFINE('VANTAGE2K_OPERATION_NID', '455684');
DEFINE('VANTAGE4K_OPERATION_NID', '1659278');

/* -----------------------
  | AWS S3 Settings    |
  ------------------------ */
DEFINE('AWS_BUCKET', 'puprodcdn');
DEFINE('ABS_API_URL', 'http://puprodcdn.s3.amazonaws.com/');
DEFINE('AWS_CDN_URL', 'http://d14kbo42fexcqw.cloudfront.net/');
DEFINE('PU_CDN_URL', 'http://pui.wewnyefk189.maxcdn-edge.com/prod.pu/');

/* -----------------------
  | MENU OPERATION INSTANCE ID FOR SUPER ADMIN ROLE    |
  ------------------------ */
DEFINE('SUPER_ADMIN_MENU_OPERATION_INSTANCE_ID', '1754498');
DEFINE('MAPPING_ROLE_ACTOR_PID', '5026');
DEFINE('OPERATION_PID', '5027');
DEFINE('OPERATION_TRADE_IN_PROPERTY_ID', '6957');
DEFINE('OPERATION_CONDITION_PROPERTY_ID', '6956');
DEFINE('OPERATION_DEAL_TYPE_PROPERTY_ID', 3290);
DEFINE('OPERATION_TYPE_PROPERTY_ID', 7397);
DEFINE('OPERATION_PHASE_CAPPING_PROPERTY_ID', 7794);
DEFINE('OPERATION_PHASE_FINANCING_PROPERTY_ID', 7795);
DEFINE('OPERATION_PHASE_CASH_PROPERTY_ID', 7796);
DEFINE('OPERATION_PHASE_CLOSING_PROPERTY_ID', 7797);
DEFINE('OPERATION_PHASE_POSTING_PROPERTY_ID', 7798);
DEFINE('OPERATION_OTHER_ROLE_PERMISSION_PROPERTY_ID', 8849);
DEFINE('OPERATION_OWNED_BY_PROPERTY_ID', 8850);
DEFINE('OPERATION_READ_BY_PROPERTY_ID', 8851);
DEFINE('OPERATION_EDITED_BY_PROPERTY_ID', 8852);
DEFINE('OPERATION_PRINT_ORDER_PROPERTY_ID', 8878);
DEFINE('OPERATION_READ_ONLY_OWNER_PROPERTY_ID', 9140);
DEFINE('OPERATION_NAME_PROPERTY_ID', 3281);
DEFINE('OPERATION_ICON_PROPERTY_ID', 3282);
DEFINE('OPERATION_DESCRIPTION_PROPERTY_ID', 3283);
DEFINE('OPERATION_VIEW_NID_PROPERTY_ID', 3284);
DEFINE('OPERATION_SEQUENCE_PROPERTY_ID', 3285);
DEFINE('OPERATION_ROLE_PROPERTY_ID', 3288);
DEFINE('OPERATION_PDF_TEMPLATE_NID_PROPERTY_ID', 3472);
DEFINE('OPERATION_NODE_CLASS_PROPERTY_ID', json_encode(array(OPERATION_PHASE_CAPPING_PROPERTY_ID, OPERATION_PHASE_FINANCING_PROPERTY_ID, OPERATION_PHASE_CASH_PROPERTY_ID, OPERATION_PHASE_CLOSING_PROPERTY_ID, OPERATION_PHASE_POSTING_PROPERTY_ID, OPERATION_OWNED_BY_PROPERTY_ID, OPERATION_READ_BY_PROPERTY_ID, OPERATION_EDITED_BY_PROPERTY_ID, OPERATION_PRINT_ORDER_PROPERTY_ID, OPERATION_READ_ONLY_OWNER_PROPERTY_ID, OPERATION_NAME_PROPERTY_ID, OPERATION_ICON_PROPERTY_ID, OPERATION_DESCRIPTION_PROPERTY_ID, OPERATION_VIEW_NID_PROPERTY_ID, OPERATION_SEQUENCE_PROPERTY_ID, OPERATION_ROLE_PROPERTY_ID, OPERATION_DEAL_TYPE_PROPERTY_ID, OPERATION_TYPE_PROPERTY_ID, OPERATION_PDF_TEMPLATE_NID_PROPERTY_ID)));

/* ------------------------------
  | STORED PROCEDURE Settings    |
  ------------------------------- */
DEFINE('USE_STORED_PROCEDURE', FALSE);
DEFINE('COMPLETE_FUNDING_ID', '757734');

/*
 * PPC SETTINGS
 */
DEFINE('PERFORMANCE_REVIEW_CLASS_NODEID', '839021');
DEFINE('PPC_SETTING', 'Employee Review');

/* User Idle State */
DEFINE('IDLE_TIMEOUT', 10 * 365 * 24 * 60 * 60); // in seconds = 10 years
DEFINE("SESSION_DELIM", "|");

/* -------------
  | SOCKET PORT |
  --------------*/
DEFINE('SOCKET_PORT', 9003);

/* --------------------------------
  | Statement Settings            |
  --------------------------------- */
DEFINE('STATEMENT_TYPE_ID', 842);
DEFINE('STATEMENT_TYPE_TEXT', 'Statement');
DEFINE('STATEMENT_TIMESTAMP_ID', 844);
DEFINE('STATEMENT_TITLE_ID', 843);
DEFINE('STATEMENT_UPDATED_STATUS', '6790');
DEFINE('STATEMENT_UPDATED_TIMESTAMP', '');
/* --------------------------------
  | Role Settings            |
  --------------------------------- */
DEFINE('ROLE_COMMON_NAME_PID', 2926);
DEFINE('ROLE_DOMAIN_PID', 2927);

/* --------------------------------
  | Push Notification PEM File     |
  --------------------------------- */
DEFINE('IOS_PEM_FILE', 'pushcert_prod.pem');


/* --------------------------------
  | Flash Notification Class      |
  --------------------------------- */
DEFINE('FLASH_NOTIFICATION_CLASS_ID', '');
DEFINE('FLASH_NOTIFICATION_ADMIN_USER_ID', '');
DEFINE('FLASH_NOTIFICATION_ACTIVE_USER_ID', '');
DEFINE('FLASH_NOTIFICATION_PARTICIPANTS', '');
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_MESSAGE', '');
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_TIMESTAMP', '');
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_STATUS', '');
DEFINE('FLASH_NOTIFICATION_DIALOGUE_NODEID', '');
DEFINE('FLASH_NOTIFICATION_PRODUCTION_NODEID', '');
DEFINE('FLASH_NOTIFICATION_TYPE', '');

/* --------------------------------
  | Flash Notification Counting    |
  --------------------------------- */
DEFINE('FLASH_NOTIFICATION_COUNT', 10);

/* --------------------------------
  | Signup Form Data Array         |
  --------------------------------- */
DEFINE('SIGNUP_FORM_DATA', json_encode(array(
            'form_fields' => array(
                array(
                    'heading' => 'PERSONAL DETAIL',
                    'instruction' => 'Enter your details.',
                    'fields'=> array(
                        '_'.INDIVIDUAL_FIRST_NAME => array(
                            'property' => ''.INDIVIDUAL_FIRST_NAME, 
                            'class' => ''.INDIVIDUAL_CLASS_ID, 
                            'type' => 'text', 
                            'placeholder' => 'First Name',
                            'name' => 'first_name'
                        ),
                        '_'.INDIVIDUAL_LAST_NAME => array(
                            'property' => ''.INDIVIDUAL_LAST_NAME, 
                            'class' => ''.INDIVIDUAL_CLASS_ID, 
                            'type' => 'text', 
                            'placeholder' => 'Last Name',
                            'name' => 'last_name'
                        ),
                        '_'.INDIVIDUAL_EMAIL_ID => array(
                            'property' => ''.INDIVIDUAL_EMAIL_ID, 
                            'class' => ''.ACCOUNT_CLASS_ID, 
                            'type' => 'email', 
                            'placeholder' => "Email",
                            'name' => 'email'
                        ),
                        '_'.INDIVIDUAL_PROFILE_IMAGE => array(
                            'property' => ''.INDIVIDUAL_PROFILE_IMAGE, 
                            'class' => ''.INDIVIDUAL_CLASS_ID, 
                            'type' => 'file', 
                            'placeholder' => 'Upload Profile Image',
                            'name' => 'upload_profile_image'
                        ),
                        '_'.ACCOUNT_PASSWORD_ID => array(
                            'property' => ''.ACCOUNT_PASSWORD_ID, 
                            'class' => ''.ACCOUNT_CLASS_ID, 
                            'type' => 'password', 
                            'placeholder' => 'Password',
                            'name' => 'password'
                        ),
                        '_confirm_password' => array(
                            'property' => 'confirm_password',
                            'class' => '',
                            'type' => 'password', 
                            'placeholder' => 'Confirm Password',
                            'name' => 'confirm_password'
                        )
                    )
                ),
                /*array(
                    'heading' => 'ORGANIZATION',
                    'instruction' => 'Select your organization to connect with pu.',
                    'fields' => array(
                        '_'.ROLE_DOMAIN_PID => array(
                            'property' => ''.ROLE_DOMAIN_PID, 
                            'class' => ''.ROLE_CLASS_ID,
                            'type' => 'select', 
                            'options' => array(
                                'Prospus',
                                'Investible'
                            )
                        )
                    )
                )*/
            )
        )
    )
);

DEFINE('CLASS_VIEW_USER_IDS', array('421934', '1466512', '393390', '391049', '1475072', '1466887', '1476187' , '1631794', '2286164', '1628444', '1628368', '1475118', '2263848', '2289930', '1466890'));

DEFINE('SYSTEM_MEMBER_NODE_ID', 2554569);

DEFINE('COURSE_DIALOGUE_TITLE_LENGTH', 50);