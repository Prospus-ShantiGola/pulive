<?php
/* ------------------
  | URL Settings    |
  ------------------ */
if (!isset($slashes) && empty($_SERVER['REDIRECT_BASE'])) {
    $slashes = '/';
} else {
    $slashes = $_SERVER['REDIRECT_BASE'];
}
//$slashes = DIRECTORY_SEPARATOR;
$http_host = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : "localhost";
DEFINE('BASE_URL', 'http://' . $http_host . '/pu/');
DEFINE('ABSO_URL', $_SERVER['DOCUMENT_ROOT'] . $slashes);
define('STORAGE_NAME', 'file');
DEFINE('SOCKET_CHAT_URL', "ws://" . $http_host . ":9003/pu/course-dialogue-server.php");
DEFINE('EDITOR', 'http://' . $http_host . '/pu/public/js/edt-worker.js');
DEFINE('SOCKET_HOST_NAME', 'http://localhost/pu/');
DEFINE('JS_ROUTE_PATH', 0);
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
DEFINE('INDIVIDUAL_DEVICE_TOKEN', 9149);
DEFINE('INDIVIDUAL_PROFILE_IMAGE', 13310);

/* --------------------------------
  | Individual History            |
  --------------------------------- */
DEFINE('INDIVIDUAL_HISTORY_CLASS_ID', 924);
DEFINE('INDIVIDUAL_ACTORID_PROP_ID', 12473);
DEFINE('INDIVIDUAL_TIMESTAMP_PROP_ID', 12474);
DEFINE('INDIVIDUAL_STATUS_PROP_ID', 12475);
DEFINE('INDIVIDUAL_ROLE_PROP_ID', 13085);

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
DEFINE('EMAIL_CLASS_ID', 936);
DEFINE('EMAIL_SETTING_CLASS_ID', 937);
DEFINE('EMAIL_SETTING_TYPE_PROPERTY_ID', 13247);
DEFINE('EMAIL_SETTING_ACTOR_PROPERTY_ID', 13249);
DEFINE('EMAIL_SETTING_ACTOR_EMAIL_PROPERTY_ID', 13250);
DEFINE('EMAIL_SETTING_ACTOR_PASSWORD_PROPERTY_ID', 13251);
DEFINE('EMAIL_FROMADDRESS_PROPERTY_ID', 13238);
DEFINE('EMAIL_TOADDRESS_PROPERTY_ID', 13239);
DEFINE('EMAIL_DATE_PROPERTY_ID', 13240);
DEFINE('EMAIL_SUBJECT_PROPERTY_ID', 13242);
DEFINE('EMAIL_HTMLMSG_PROPERTY_ID', 13243);
DEFINE('EMAIL_PLAINMSG_PROPERTY_ID', 13244);
DEFINE('EMAIL_ATTACHMENT_PROPERTY_ID', 13245);
DEFINE('EMAIL_UID_PROPERTY_ID', 13252);
DEFINE('EMAIL_RECENT_PROPERTY_ID', 13253);
DEFINE('EMAIL_FLAGGED_PROPERTY_ID', 13254);
DEFINE('EMAIL_ANSWERED_PROPERTY_ID', 13255);
DEFINE('EMAIL_DELETED_PROPERTY_ID', 13256);
DEFINE('EMAIL_SEEN_PROPERTY_ID', 13257);
DEFINE('EMAIL_DRAFT_PROPERTY_ID', 13258);
DEFINE('EMAIL_MSGID_PROPERTY_ID', 13259);
DEFINE('EMAIL_MSG_REFERENCE_PROPERTY_ID', 13260);
DEFINE('EMAIL_SETTING_STATIC_ID', 2299928);

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
DEFINE('ACCOUNT_STATUS_ID', 13343);

/* ----------------------
  | Actor Settings       |
  ----------------------- */
DEFINE('ACTOR_PID', '3298');

/* -----------------------
  | Prefix Settings       |
  ------------------------ */
DEFINE('PREFIX', 'local_');

/* ---------------------
  | Menu Settings       |
  ---------------------- */
DEFINE('MENU_SETDEFAULT_PROPERTY_ID', 8451);
DEFINE('MENU_ID', 136);
DEFINE('INBOX_MENU_ID', 48);
DEFINE('ACCOUNT_MENU_ID', 132);
DEFINE('CLASSES_MENU_ID', 1);
DEFINE('RESOURSE_MENU_ID', 116);
DEFINE('CALANDER_MENU_ID', 68);

DEFINE('PRODUCT_MENU_ID', 143);
DEFINE('DATA_MENU_ID', 144);
DEFINE('REPORT_MENU_ID', 145);
DEFINE('ORGANIZATION_MENU_ID', 148);
DEFINE('ACTOR_MENU_ID', 146);
DEFINE('STORE_MENU_ID', 140);
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
DEFINE('AWS_BUCKET', 'localdevbucket');
DEFINE('ABS_API_URL', 'http://localdevbucket.s3.amazonaws.com/');
DEFINE('AWS_CDN_URL', BASE_URL);
DEFINE('PU_CDN_URL', BASE_URL);

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
DEFINE('OPERATION_READ_ONLY_OWNER_PROPERTY_ID', 9122);
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
DEFINE('USE_STORED_PROCEDURE', false);
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
DEFINE('STATEMENT_UPDATED_TIMESTAMP', '13349');
DEFINE('STATEMENT_REPLY', '13350');

/* --------------------------------
  | Role Settings            |
  --------------------------------- */
DEFINE('ROLE_COMMON_NAME_PID', 2926);
DEFINE('ROLE_DOMAIN_PID', 2927);

/* ----------------------
  | Production CB Settings  |
  ----------------------- */
DEFINE('PRODUCTION_CB_CLASS_ID', 871);
DEFINE('PRODUCTION_CB_TITLE_PID', 9168);
DEFINE('PRODUCTION_CB_TYPE_PID', 9169);
DEFINE('PRODUCTION_CB_DESC_PID', 9170);
DEFINE('PRODUCTION_CB_PERIODS_PID', 9172);
DEFINE('PRODUCTION_CB_COL_PID', 9173);
DEFINE('PRODUCTION_CB_CELL_PID', 9174);
DEFINE('PRODUCTION_CB_SERIES_PID', 9176);
DEFINE('PRODUCTION_CB_SEGMENT_PID', 9177);
DEFINE('PRODUCTION_CB_EVENT_PID', 9178);
DEFINE('PRODUCTION_CB_PERIOD_PID', 9179);

DEFINE('PRODUCTION_CB_ICON_PID', 13305);
DEFINE('PRODUCTION_CB_PUBLISHER_PID', 13306);
DEFINE('PRODUCTION_CB_PRICE_PID', 13307);
DEFINE('PRODUCTION_CB_FEATURE_PID', 13308);
DEFINE('PRODUCTION_CB_WORKFLOW_PID', 13309);
DEFINE('PRODUCTION_CB_ISFREE_PID', 13318);

/* ----------------------
  | Series CB Settings      |
  ----------------------- */
DEFINE('SERIES_CB_CLASS_ID', 872);
DEFINE('SERIES_CB_TITLE_PID', 9182);
DEFINE('SERIES_CB_TYPE_PID', 9183);
DEFINE('SERIES_CB_SEQUENCE_PID', 9184);
DEFINE('SERIES_CB_ACTIVE_PID', 9186);
DEFINE('SERIES_CB_COMPLETE_PID', 9187);
DEFINE('SERIES_CB_HEADER_PID', 9205);
DEFINE('SERIES_CB_DATA_PID', 9206);
DEFINE('SERIES_CB_ROLE_PID', 10846);
DEFINE('SERIES_CB_VARNAME_PID', 13271);
DEFINE('SERIES_CB_VARVALUE_PID', 13272);
DEFINE('SERIES_CB_VARHIDDEN_PID', 13273);

/* ---------------------
  | Segment CB Settings    |
  ---------------------- */
DEFINE('SEGMENT_CB_CLASS_ID', 873);
DEFINE('SEGMENT_CB_TITLE_PID', 9193);
DEFINE('SEGMENT_CB_TYPR_PID', 9194);
DEFINE('SEGMENT_CB_START_PID', 9196);
DEFINE('SEGMENT_CB_END_PID', 9197);
DEFINE('SEGMENT_CB_ACTIVE_PID', 9199);
DEFINE('SEGMENT_CB_COMPLETE_PID', 9200);
DEFINE('SEGMENT_CB_SCLASS_PID', 9202);
DEFINE('SEGMENT_CB_ECLASS_PID', 9203);

/* ---------------------
  | Role CB Settings    |
  ---------------------- */
DEFINE('ROLE_CB_CLASS_ID', 874);
DEFINE('ROLE_CB_GROUP_PID', 9208);
DEFINE('ROLE_CB_ROLE_PID', 9209);

/* --------------------------------
  | For Course Builder Settings    |
  --------------------------------- */
DEFINE('NODES_RIGHTS_TYPES', 9226);
DEFINE('PRODUCTION_CB_CLASS_NID', 2110892);
DEFINE('PRODUCTION_JSON_CLASS_ID', 876);
DEFINE('PRODUCTION_JSON_CLASS_NID', 2128054);
DEFINE('PRODUCTION_JSON_PID', 9228);

/* ---------------------------------------
  | For Course Builder Action Settings    |
  ---------------------------------------- */
DEFINE('ACTION_ROLE_CLASS_ID', 881);
DEFINE('ACTION_ROLE_CLASS_NID', 2130265);
DEFINE('ACTION_ROLE_CONTROLER_PID', 9251);

DEFINE('ACTION_CB_CLASS_ID', 880);
DEFINE('ACTION_CB_CLASS_NID', 2130225);
DEFINE('ACTION_CB_NAME_PID', 9247);
DEFINE('ACTION_CB_PRODUCTION_PID', 9248);
DEFINE('ACTION_CB_OPERATION_PID', 9249);

DEFINE('CONDITION_CB_CLASS_ID', 879);
DEFINE('CONDITION_CB_CLASS_NID', 2130163);
DEFINE('CONDITION_CB_PROPERTY_PID', 9241);
DEFINE('CONDITION_CB_OPERATOR_PID', 9242);
DEFINE('CONDITION_CB_THRASHOLD_PID', 9243);
DEFINE('CONDITION_CB_PRODUCTION_PID', 9244);
DEFINE('CONDITION_CB_OPERATION_PID', 9245);

/* --------------------------------
  | Production Details             |
  --------------------------------- */
DEFINE('PRODUCTION_DETAILS_CLASS_ID', 928);
DEFINE('PRODUCTION_DETAILS_CLASS_NID', 2255538);
DEFINE('PRODUCTION_DETAILS_NAME_PID', 13090);
DEFINE('PRODUCTION_DETAILS_ID_PID', 13087);

/* --------------------------------
  | Production Data               |
  --------------------------------- */
DEFINE('PRODUCTION_DATA_CLASS_ID', 933);
DEFINE('PRODUCTION_DATA_CLASS_NID', 2279745);
DEFINE('PRODUCTION_DATA_PDI_PID', 13208);
DEFINE('PRODUCTION_DATA_SERIES_PID', 13209);
DEFINE('PRODUCTION_DATA_SEGMENT_PID', 13210);
DEFINE('PRODUCTION_DATA_PRO_PID', 13234);
DEFINE('PRODUCTION_DATA_OPE_PID', 13235);
DEFINE('PRODUCTION_DATA_VAR_PID', 13274);

/* --------------------------------
  | Manage Instance               |
  --------------------------------- */
DEFINE('MANAGE_INSTANCE_CLASS_ID', 934);
DEFINE('MANAGE_INSTANCE_CLASS_NID', 2279801);
DEFINE('MANAGE_INSTANCE_CLASS_PID', 13212);
DEFINE('MANAGE_INSTANCE_INSTANCE_PID', 13213);
DEFINE('MANAGE_INSTANCE_OPERATION_PID', 13214);

/* --------------------------------
  | Careers Class                  |
  --------------------------------- */
DEFINE('CAREERS_CLASS_ID', 938);
DEFINE('CAREERS_CLASS_NID', 2386705);
DEFINE('CAREERS_FIRST_NAME_PID', 13283);
DEFINE('CAREERS_LAST_NAME_PID', 13284);
DEFINE('CAREERS_EMAIL_PID', 13286);
DEFINE('CAREERS_POSITION_PID', 13295);
DEFINE('INDIVIDUAL_EMAIL_PARTICIPANT_FLAG_PROPERTY_ID', 13280);

/* --------------------------------
  | Production Validation Class                  |
  --------------------------------- */
DEFINE('PRO_VALIDATION_CLASS_ID', 939);
/*DEFINE('PRO_VALIDATION_CLASS_NID', 2396991);
DEFINE('PRO_VALIDATION_NAME_PID', 13299);
DEFINE('PRO_VALIDATION_DESC_PID', 13300);
DEFINE('PRO_VALIDATION_TYPE_PID', 13301);
DEFINE('PRO_VALIDATION_CODE_PID', 13302);*/

/* --------------------------------
  | Push Notification PEM File     |
  --------------------------------- */
DEFINE('IOS_PEM_FILE', 'pushcert_loc.pem');

DEFINE('HR_ACTOR_ID', 391049);
DEFINE('ROLE_COMMON_PID', 2926);
DEFINE('ROLE_ACTOR_PID', 2928);
DEFINE('ROLE_ASSIGNED_PID', 2929);

/* --------------------------------
  | Flash Notification Class      |
  --------------------------------- */
DEFINE('FLASH_NOTIFICATION_CLASS_ID', 940);
DEFINE('FLASH_NOTIFICATION_ADMIN_USER_ID', 13312);
DEFINE('FLASH_NOTIFICATION_ACTIVE_USER_ID', 13319);
DEFINE('FLASH_NOTIFICATION_PARTICIPANTS', 13320);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_MESSAGE', 13313);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_TIMESTAMP', 13314);
DEFINE('FLASH_NOTIFICATION_NOTIFICATION_STATUS', 13315);
DEFINE('FLASH_NOTIFICATION_DIALOGUE_NODEID', 13316);
DEFINE('FLASH_NOTIFICATION_PRODUCTION_NODEID', 13317);
DEFINE('FLASH_NOTIFICATION_TYPE', 13331);

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
));

/* --------------------------------
  | App Subscription Class      |
  --------------------------------- */
DEFINE('SUBSCRIPTION_CLASS_ID', 941);
DEFINE('SUBSCRIPTION_CLASS_NID', 2457391);
DEFINE('SUBSCRIPTION_PRODUCTION_PID', 13322);
DEFINE('SUBSCRIPTION_SUBSCRIBER_PID', 13323);
DEFINE('SUBSCRIPTION_SDATE_PID', 13325);
DEFINE('SUBSCRIPTION_EDATE_PID', 13326);
DEFINE('SUBSCRIPTION_RATING_PID', 13327);
DEFINE('SUBSCRIPTION_REVIEW_PID', 13328);
DEFINE('SUBSCRIPTION_ROLE_PID', 13329);
DEFINE('SUBSCRIPTION_ORGANIZATION_PID', 13330);

/* --------------------------------
  | Group Class                    |
  --------------------------------- */
DEFINE('GROUP_CLASS_ID', 861);
DEFINE('GROUP_CLASS_NID', 1872495);
DEFINE('GROUP_NAME_PID', 9121);
DEFINE('GROUP_ACTOR_PID', 13332);

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

DEFINE('SYSTEM_GROUP_ADMIN', 2566686);
DEFINE('SYSTEM_MEMBER_NODE_ID', 2566688);
DEFINE('DEFAULT_ROLE_NAME', array('group admin', 'member'));

/* -------------------
  | User Registration |
  ------------------ */
DEFINE('USER_REG_CLASS_ID', 944);
DEFINE('USER_REG_USERID_PID', 13338);
DEFINE('USER_REG_HASH_KEY_PID', 13339);
DEFINE('USER_REG_STATUS_PID', 13340);
DEFINE('USER_REG_TIMESTAMP_PID', 13341);

/* --------------------------------
  | Classes visible to             |
  --------------------------------- */
DEFINE('CLASS_VIEW_USER_IDS', array('421934', '1466512', '393390', '391049', '1475072', '1476187', '1631794', '2286164', '1628444', '1628368', '1475118', '2263848', '1466890', '2182313', '1466887', '2539463', '2289977', '2289930','1475204','1466539','1466906'));

/* ---------------------
  | Group Subscription |
  ---------------------- */
DEFINE('GROUP_SUBSCRIPTION_CLASS_ID', 945);
DEFINE('GROUP_SUBSCRIPTION_CLASS_NID', 2539981);
DEFINE('GROUP_SUBSCRIPTION_GROUP_PID', 13345);

/* -------------------------------
  | SUBSCRPTION_GROUP_ACTOR_ROLE |
  -------------------------------- */
DEFINE('SUBS_GROUP_ACT_ROLE_CLASS_ID', 946);
DEFINE('SUBS_GROUP_ACT_ROLE_CLASS_NID', 2540019);
DEFINE('SUBS_GROUP_ACT_ROLE_ACTOR_PID', 13347);
DEFINE('SUBS_GROUP_ACT_ROLE_ROLE_PID', 13348);

DEFINE('CB_NOTIFICATION', array('(notification_user)','(notification_all)','(email)'));
DEFINE('NOTIFICATION_CONTENT', array('##sFirstName##','##rFirstName##','##sLastName##','##rLastName##','##sEmail##','##rEmail##', '##sRoleName##','##rRoleName##','##courseName##','##productionName##'));

/* ----------------------------------
  | PU REPORTS - GOOGLE SPREADSHEET |
  ----------------------------------- */
DEFINE('PU_REPORTS_FORM_URL', 'https://docs.google.com/forms/d/e/1FAIpQLSeXmP-xz81TsrPRv25f4KTVnK1j_xnX21q9HJNMF4uqW1bsGw/formResponse');
DEFINE('PU_REPORTS_SHEET_URL', 'https://docs.google.com/spreadsheets/d/1HyZg3vEYns_7tquBu0yvqeGY30CikZK6IiO5hmtfLpw');
DEFINE('PU_REPORTS_FORM_FIELDS', [
    'year'          => 'entry.1290585095_year',
    'month'         => 'entry.1290585095_month',
    'day'           => 'entry.1290585095_day',
    't_reg_users'   => 'entry.1195518827',      // Total Registered Users
    't_def_dia_crs' => 'entry.1743970342',      // Total Default Dialogue Courses
    't_prod_crs'    => 'entry.1030322659',      // Total Production Courses
    't_prd_dia_crs' => 'entry.1529801319',      // Total Dialogues in Production Courses
    't_dia'         => 'entry.2144477445',      // Total Dialogues
    't_stat'        => 'entry.208923725',       // Total Statements
]);

DEFINE('COURSE_DIALOGUE_TITLE_LENGTH', 50);

DEFINE('main_menu_cid', 947);
DEFINE('main_menu_id_pid', 13352);
DEFINE('main_parent_menu_id_pid', 13353);
DEFINE('main_menu_pid', 13354);
DEFINE('main_description_pid', 13355);
DEFINE('main_icon_class_pid', 13356);
DEFINE('main_menu_type_pid', 13357);
DEFINE('main_order_pid', 13358);
DEFINE('main_is_display_pid', 13359);
DEFINE('main_is_active_pid', 13360);
DEFINE('main_is_dual_pid', 13361);
DEFINE('main_dual_icon_class_pid', 13362);
DEFINE('main_data_href_pid', 13363);
DEFINE('main_shortcut_icon_pid', 13364);
DEFINE('main_controler_pid', 13365);
DEFINE('main_action_pid', 13366);
DEFINE('main_is_disabled_pid', 13367);
