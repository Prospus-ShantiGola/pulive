<?php
/* ------------------
  | URL Settings    |
  ------------------ */
//if (!isset($slashes) && empty($_SERVER['REDIRECT_BASE'])) {$slashes = '/';} else {$slashes = $_SERVER['REDIRECT_BASE'];}
$slashes = DIRECTORY_SEPARATOR;
$requestUri = $slashes . explode('/', $_SERVER['REQUEST_URI'])[1] . $slashes;
$http_host = ((isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : "") . $requestUri;
$proto = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
DEFINE('BASE_URL', $proto . $http_host );
DEFINE('ABSO_URL', $_SERVER['DOCUMENT_ROOT'] . $requestUri);
define('STORAGE_NAME', 'file');
DEFINE('SOCKET_CHAT_URL', "ws://" . $http_host . ":9003/course-dialogue-server.php");
DEFINE('EDITOR', 'http://' . $http_host . '/public/js/edt-worker.js');
DEFINE('SOCKET_HOST_NAME', 'http://www.prospus.com/sta/');
DEFINE('JS_ROUTE_PATH', 3);
DEFINE('ADMIN_CONFIG', ['email' => 'support@prospus.com', 'name' => 'Prospus']);

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
DEFINE('INDIVIDUAL_DEVICE_TOKEN', 9211);
DEFINE('INDIVIDUAL_PROFILE_IMAGE', 9338);

/* --------------------------------
  | Individual History            |
  --------------------------------- */
DEFINE('INDIVIDUAL_HISTORY_CLASS_ID', 874);
DEFINE('INDIVIDUAL_ACTORID_PROP_ID', 9213);
DEFINE('INDIVIDUAL_TIMESTAMP_PROP_ID', 9214);
DEFINE('INDIVIDUAL_STATUS_PROP_ID', 9215);
DEFINE('INDIVIDUAL_ROLE_PROP_ID', 9216);

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
DEFINE('ACCOUNT_STATUS_ID', 9449);

/* ----------------------
  | Actor Settings       |
  ----------------------- */
DEFINE('ACTOR_PID', '3298');

/* -----------------------
  | Prefix Settings       |
  ------------------------ */
DEFINE('PREFIX', 'sta_');

/* ---------------------
  | Menu Settings       |
  ---------------------- */
DEFINE('MENU_SETDEFAULT_PROPERTY_ID', 8451);
DEFINE('MENU_ID', 128);
DEFINE('INBOX_MENU_ID', 48);
DEFINE('ACCOUNT_MENU_ID', 132);
DEFINE('CLASSES_MENU_ID', 1);
DEFINE('RESOURSE_MENU_ID', 116);
DEFINE('CALANDER_MENU_ID', 68);

DEFINE('PRODUCT_MENU_ID', 132);
DEFINE('DATA_MENU_ID', 133);
DEFINE('REPORT_MENU_ID', 134);
DEFINE('ORGANIZATION_MENU_ID', 136);
DEFINE('ACTOR_MENU_ID', 135);
DEFINE('STORE_MENU_ID', 129);
DEFINE('BY_PROMT_MENU_ID', 86);

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
DEFINE('AWS_BUCKET', 'pustacdn');
DEFINE('ABS_API_URL', 'http://pustacdn.s3.amazonaws.com/');
DEFINE('AWS_CDN_URL', 'http://dhxcyyu6slkhq.cloudfront.net/');
DEFINE('PU_CDN_URL', 'http://d3mkpgv9no08b9.cloudfront.net/');

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
DEFINE('SOCKET_PORT', 9005);

/* --------------------------------
  | Statement Settings            |
  --------------------------------- */
DEFINE('STATEMENT_TYPE_ID', 842);
DEFINE('STATEMENT_TYPE_TEXT', 'Statement');
DEFINE('STATEMENT_TIMESTAMP_ID', 844);
DEFINE('STATEMENT_TITLE_ID', 843);
DEFINE('STATEMENT_UPDATED_STATUS', '6790');
DEFINE('STATEMENT_UPDATED_TIMESTAMP', 9403);
DEFINE('STATEMENT_REPLY', 9455);

/* --------------------------------
  | Role Settings            |
  --------------------------------- */
DEFINE('ROLE_COMMON_NAME_PID', 2926);
DEFINE('ROLE_DOMAIN_PID', 2927);

/* ----------------------
  | Production CB Settings  |
  ----------------------- */
DEFINE('PRODUCTION_CB_CLASS_ID', 875);
DEFINE('PRODUCTION_CB_TITLE_PID', 9219);
DEFINE('PRODUCTION_CB_TYPE_PID', 9220);
DEFINE('PRODUCTION_CB_DESC_PID', 9221);
DEFINE('PRODUCTION_CB_PERIODS_PID', 9223);
DEFINE('PRODUCTION_CB_COL_PID', 9224);
DEFINE('PRODUCTION_CB_CELL_PID', 9225);
DEFINE('PRODUCTION_CB_SERIES_PID', 9227);
DEFINE('PRODUCTION_CB_SEGMENT_PID', 9228);
DEFINE('PRODUCTION_CB_EVENT_PID', 9229);
DEFINE('PRODUCTION_CB_PERIOD_PID', 9230);

DEFINE('PRODUCTION_CB_ICON_PID', 9407);
DEFINE('PRODUCTION_CB_PUBLISHER_PID', 9408);
DEFINE('PRODUCTION_CB_PRICE_PID', 9409);
DEFINE('PRODUCTION_CB_FEATURE_PID', 9410);
DEFINE('PRODUCTION_CB_WORKFLOW_PID', 9411);
DEFINE('PRODUCTION_CB_ISFREE_PID', 9412);

/* ----------------------
  | Series CB Settings      |
  ----------------------- */
DEFINE('SERIES_CB_CLASS_ID', 876);
DEFINE('SERIES_CB_TITLE_PID', 9233);
DEFINE('SERIES_CB_TYPE_PID', 9234);
DEFINE('SERIES_CB_SEQUENCE_PID', 9235);
DEFINE('SERIES_CB_ACTIVE_PID', 9237);
DEFINE('SERIES_CB_COMPLETE_PID', 9238);
DEFINE('SERIES_CB_HEADER_PID', 9240);
DEFINE('SERIES_CB_DATA_PID', 9241);
DEFINE('SERIES_CB_ROLE_PID', 9242);
DEFINE('SERIES_CB_VARNAME_PID', 9303);
DEFINE('SERIES_CB_VARVALUE_PID', 9304);
DEFINE('SERIES_CB_VARHIDDEN_PID', 9305);

/* ---------------------
  | Segment CB Settings    |
  ---------------------- */
DEFINE('SEGMENT_CB_CLASS_ID', 877);
DEFINE('SEGMENT_CB_TITLE_PID', 9245);
DEFINE('SEGMENT_CB_TYPR_PID', 9246);
DEFINE('SEGMENT_CB_START_PID', 9248);
DEFINE('SEGMENT_CB_END_PID', 9249);
DEFINE('SEGMENT_CB_ACTIVE_PID', 9251);
DEFINE('SEGMENT_CB_COMPLETE_PID', 9252);
DEFINE('SEGMENT_CB_SCLASS_PID', 9254);
DEFINE('SEGMENT_CB_ECLASS_PID', 9255);

/* ---------------------
  | Role CB Settings    |
  ---------------------- */
DEFINE('ROLE_CB_CLASS_ID', 879);
DEFINE('ROLE_CB_GROUP_PID', 9259);
DEFINE('ROLE_CB_ROLE_PID', 9260);

/* --------------------------------
  | For Course Builder Settings    |
  --------------------------------- */
DEFINE('NODES_RIGHTS_TYPES', 9261);
DEFINE('PRODUCTION_CB_CLASS_NID', 2095664);
DEFINE('PRODUCTION_JSON_CLASS_ID', 878);
DEFINE('PRODUCTION_JSON_CLASS_NID', 2096023);
DEFINE('PRODUCTION_JSON_PID', 9257);

/* --------------------------------
  | Production Details             |
  --------------------------------- */
DEFINE('PRODUCTION_DETAILS_CLASS_ID', 880);
DEFINE('PRODUCTION_DETAILS_CLASS_NID', 2097052);
DEFINE('PRODUCTION_DETAILS_NAME_PID', 9263);
DEFINE('PRODUCTION_DETAILS_ID_PID', 9264);

/* --------------------------------
  | Production Data               |
  --------------------------------- */
DEFINE('PRODUCTION_DATA_CLASS_ID', 881);
DEFINE('PRODUCTION_DATA_CLASS_NID', 2097129);
DEFINE('PRODUCTION_DATA_PDI_PID', 9266);
DEFINE('PRODUCTION_DATA_SERIES_PID', 9267);
DEFINE('PRODUCTION_DATA_SEGMENT_PID', 9268);
DEFINE('PRODUCTION_DATA_PRO_PID', 9269);
DEFINE('PRODUCTION_DATA_OPE_PID', 9270);
DEFINE('PRODUCTION_DATA_VAR_PID', 9306);

/* --------------------------------
  | Manage Instance               |
  --------------------------------- */
DEFINE('MANAGE_INSTANCE_CLASS_ID', 882);
DEFINE('MANAGE_INSTANCE_CLASS_NID', 2097191);
DEFINE('MANAGE_INSTANCE_CLASS_PID', 9272);
DEFINE('MANAGE_INSTANCE_INSTANCE_PID', 9273);
DEFINE('MANAGE_INSTANCE_OPERATION_PID', 9274);

/* --------------------------------
  | Careers Class                  |
  --------------------------------- */
DEFINE('CAREERS_CLASS_ID', 884);
DEFINE('CAREERS_CLASS_NID', 2108049);
DEFINE('CAREERS_FIRST_NAME_PID', 9309);
DEFINE('CAREERS_LAST_NAME_PID', 9310);
DEFINE('CAREERS_EMAIL_PID', 9312);
DEFINE('CAREERS_POSITION_PID', 9339);
DEFINE('INDIVIDUAL_EMAIL_PARTICIPANT_FLAG_PROPERTY_ID',9369);

/* --------------------------------
  | Production Validation Class                  |
  --------------------------------- */
DEFINE('PRO_VALIDATION_CLASS_ID', 889);
/*DEFINE('PRO_VALIDATION_CLASS_NID', 2124342);
DEFINE('PRO_VALIDATION_NAME_PID', 9398);
DEFINE('PRO_VALIDATION_DESC_PID', 9399);
DEFINE('PRO_VALIDATION_TYPE_PID', 9400);
DEFINE('PRO_VALIDATION_CODE_PID', 9401);*/

/* --------------------------------
  | Push Notification PEM File     |
  --------------------------------- */
DEFINE('IOS_PEM_FILE', 'pushcert_sta.pem');

DEFINE('HR_ACTOR_ID', 392445);
DEFINE('ROLE_COMMON_PID', 2926);
DEFINE('ROLE_ACTOR_PID', 2928);
DEFINE('ROLE_ASSIGNED_PID', 2929);

/* --------------------------------
  | Flash Notification Class      |
  --------------------------------- */
DEFINE('FLASH_NOTIFICATION_CLASS_ID', 891);
DEFINE('FLASH_NOTIFICATION_ADMIN_USER_ID', 9423);
DEFINE('FLASH_NOTIFICATION_ACTIVE_USER_ID', 9424);
DEFINE('FLASH_NOTIFICATION_PARTICIPANTS', 9425);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_MESSAGE', 9426);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_TIMESTAMP', 9427);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_STATUS', 9428);
DEFINE('FLASH_NOTIFICATION_DIALOGUE_NODEID', 9429);
DEFINE('FLASH_NOTIFICATION_PRODUCTION_NODEID', 9430);
DEFINE('FLASH_NOTIFICATION_TYPE', 9448);

/* --------------------------------
  | Flash Notification Counting    |
  --------------------------------- */
DEFINE('FLASH_NOTIFICATION_COUNT', 10);

/* --------------------------------
  | Signup Form Data Array         |
  --------------------------------- */
DEFINE('SIGNUP_FORM_DATA', json_encode(
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
                        )

                )
            )

    )
);

/* --------------------------------
  | App Subscription Class      |
  --------------------------------- */
DEFINE('SUBSCRIPTION_CLASS_ID', 890);
DEFINE('SUBSCRIPTION_CLASS_NID', 2152024);
DEFINE('SUBSCRIPTION_PRODUCTION_PID', 9414);
DEFINE('SUBSCRIPTION_SUBSCRIBER_PID', 9415);
DEFINE('SUBSCRIPTION_SDATE_PID', 9416);
DEFINE('SUBSCRIPTION_EDATE_PID', 9417);
DEFINE('SUBSCRIPTION_RATING_PID', 9418);
DEFINE('SUBSCRIPTION_REVIEW_PID', 9419);
DEFINE('SUBSCRIPTION_ROLE_PID', 9420);
DEFINE('SUBSCRIPTION_ORGANIZATION_PID', 9421);

/* --------------------------------
  | Group Class                    |
  --------------------------------- */
DEFINE('GROUP_CLASS_ID', 861);
DEFINE('GROUP_CLASS_NID', 1872495);
DEFINE('GROUP_NAME_PID', 9121);
DEFINE('GROUP_ACTOR_PID', 9439);

/* --------------------------------
  | System Roles Class             |
  --------------------------------- */
DEFINE('SYSTEM_ROLE_CLASS_ID', 865);
DEFINE('SYSTEM_ROLE_CLASS_NID', 1913841);
DEFINE('SYSTEM_ROLE_NAME_PID', 9136);

/* --------------------------------
  | Event Roles Class             |
  --------------------------------- */
DEFINE('EVENT_ROLE_CLASS_ID', 864);
DEFINE('EVENT_ROLE_CLASS_NID', 1898427);
DEFINE('EVENT_ROLE_TIME_PID', 9130);
DEFINE('EVENT_ROLE_ACTOR_PID', 9131);
DEFINE('EVENT_ROLE_ROLE_PID', 9132);
DEFINE('EVENT_ROLE_GROUP_PID', 9133);
DEFINE('EVENT_ROLE_ACTION_PID', 9134);

/* --------------------------------
  | State Actor Roles Class             |
  --------------------------------- */
DEFINE('STATE_ACTOR_ROLE_CLASS_ID', 866);
DEFINE('STATE_ACTOR_ROLE_CLASS_NID', 1913871);
DEFINE('STATE_ACTOR_ROLE_ACTOR_PID', 9138);

/* --------------------------------
  | Group Roles Class             |
  --------------------------------- */
DEFINE('GROUP_ROLE_CLASS_ID', 862);
DEFINE('GROUP_ROLE_CLASS_NID', 1872559);
DEFINE('GROUP_ROLE_GROUP_PID', 9123);

DEFINE('SYSTEM_GROUP_ADMIN', 2186243);
DEFINE('SYSTEM_MEMBER_NODE_ID', 2216583);
DEFINE('DEFAULT_ROLE_NAME', array('group admin', 'member'));

/* -------------------
  | User Registration |
  ------------------ */
DEFINE('USER_REG_CLASS_ID', 894);
DEFINE('USER_REG_USERID_PID', 9441);
DEFINE('USER_REG_HASH_KEY_PID', 9442);
DEFINE('USER_REG_STATUS_PID', 9443);
DEFINE('USER_REG_TIMESTAMP_PID', 9444);

/* --------------------------------
  | Classes visible to             |
  --------------------------------- */
DEFINE('CLASS_VIEW_USER_IDS', array('421934', '1466512', '393390', '391049', '1475072', '1476187', '1631794', '2286164', '1628444', '1628368', '1475118', '2263848', '1466890', '2182313', '1466887','1466906'));

/* ---------------------
  | Group Subscription |
  ---------------------- */
DEFINE('GROUP_SUBSCRIPTION_CLASS_ID', 895);
DEFINE('GROUP_SUBSCRIPTION_CLASS_NID', 2195435);
DEFINE('GROUP_SUBSCRIPTION_GROUP_PID', 9451);

/* -------------------------------
  | SUBSCRPTION_GROUP_ACTOR_ROLE |
  -------------------------------- */
DEFINE('SUBS_GROUP_ACT_ROLE_CLASS_ID', 896);
DEFINE('SUBS_GROUP_ACT_ROLE_CLASS_NID', 2195473);
DEFINE('SUBS_GROUP_ACT_ROLE_ACTOR_PID', 9453);
DEFINE('SUBS_GROUP_ACT_ROLE_ROLE_PID', 9454);

DEFINE('CB_NOTIFICATION', array('(notification_user)','(notification_all)','(email)'));
DEFINE('NOTIFICATION_CONTENT', array('##sFirstName##','##rFirstName##','##sLastName##','##rLastName##','##sEmail##','##rEmail##', '##sRoleName##','##rRoleName##','##courseName##','##productionName##'));

/* ----------------------------------
  | PU REPORTS - GOOGLE SPREADSHEET |
  ----------------------------------- */
DEFINE('PU_REPORTS_FORM_URL', 'https://docs.google.com/forms/d/e/1FAIpQLSd-g1VF1fHiyrpjhUMoph6a27ItQXpAHEQ8-BEun52xhb7GXg/formResponse');
DEFINE('PU_REPORTS_SHEET_URL', 'https://docs.google.com/spreadsheets/d/1rUdu-ZFDv-DHNWO65Zc-eTU5w1TGZEUj02AOo3C96BQ');
DEFINE('PU_REPORTS_FORM_FIELDS', [
    'year'          => 'entry.1129631919_year',
    'month'         => 'entry.1129631919_month',
    'day'           => 'entry.1129631919_day',
    't_reg_users'   => 'entry.1644872756',      // Total Registered Users
    't_def_dia_crs' => 'entry.1720429418',      // Total Default Dialogue Courses
    't_prod_crs'    => 'entry.1374814245',      // Total Production Courses
    't_prd_dia_crs' => 'entry.1165220750',      // Total Dialogues in Production Courses
    't_dia'         => 'entry.1073376877',      // Total Dialogues
    't_stat'        => 'entry.445887606',       // Total Statements
]);

DEFINE('COURSE_DIALOGUE_TITLE_LENGTH', 50);

DEFINE('main_menu_cid', 897);
DEFINE('main_menu_id_pid', 9457);
DEFINE('main_parent_menu_id_pid', 9458);
DEFINE('main_menu_pid', 9459);
DEFINE('main_description_pid', 9460);
DEFINE('main_icon_class_pid', 9461);
DEFINE('main_menu_type_pid', 9462);
DEFINE('main_order_pid', 9463);
DEFINE('main_is_display_pid', 9464);
DEFINE('main_is_active_pid', 9465);
DEFINE('main_is_dual_pid', 9466);
DEFINE('main_dual_icon_class_pid', 9467);
DEFINE('main_data_href_pid', 9468);
DEFINE('main_shortcut_icon_pid', 9469);
DEFINE('main_controler_pid', 9470);
DEFINE('main_action_pid', 9471);
DEFINE('main_is_disabled_pid', 9472);