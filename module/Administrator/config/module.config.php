<?php

return array(
    'router' => array(
        'routes' => array(
            'home' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/',
                    'defaults' => array(
                        'controller' => 'Administrator\Controller\Marketplace',
                        'action'     => 'index',
                    ),
                ),
            ),
            'store' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/store[/:action][/node_id/:id]',
                    'constraints' => array(
                        'action'        => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[0-9]+',
                    ),
                    'defaults'          => array(
                        'controller'    => 'Administrator\Controller\Marketplace',
                        'action'        => 'index',
                    ),
                ),
            ),
			'login' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/login[/:action][/:id][/data/:data][/userEmail/:userEmail]',
                    'constraints' => array(
                        'action'        => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[0-9]+',
                    ),
                    'defaults'          => array(
                        'controller'    => 'Administrator\Controller\Login',
                        'action'        => 'index',
                    ),
                ),
            ),
            /*'index' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/index[/:action][/:id][/page/:page][/order_by/:order_by][/:order]',
                    'constraints' => array(
                        'action' => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                        'page' => '[0-9]+',
                        'order_by' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'order' => 'ASC|DESC',
                    ),
                    'defaults' => array(
                        'controller' => 'Administrator\Controller\Index',
                        'action' => 'index',
                    ),
                ),
            ),*/
            'classes' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/classes[/:action][/:id][/page/:page][/order_by/:order_by][/:order][/type/:type]',
                    'constraints'   => array(
                        'action'    => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'        => '[0-9]+',
                        'page'      => '[0-9]+',
                        'order_by'  => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'order'     => 'ASC|DESC',
                    ),
                    'defaults' => array(
                        'controller' => 'Administrator\Controller\Classes',
                        'action' => 'index',
                    ),
                ),
            ),
            'inbox' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/inbox[/:action][/:id]',
                    'constraints' => array(
                        'action' => '(?!\bpage\b)[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Grid\Controller\Menudashboard',
                        'action'     => 'index',
                    ),
                ),
            ),
            'board' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/board[/:action][/:id]',
                    'constraints' => array(
                        'action' => '(?!\bpage\b)[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Grid\Controller\Dashboard',
                        'action'     => 'getCourseBuilderClasses',
                    ),
                ),
            ),
            'group' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/group[/:action]',
                    'constraints' => array(
                        'action'        => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[0-9]+',
                    ),
                    'defaults'          => array(
                        'controller'    => 'Administrator\Controller\Organization',
                        'action'        => 'index',
                    ),
                ),
            ),
            'dashboard' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/dashboard[/:action]',
                    'constraints' => array(
                        'action'        => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[0-9]+',
                    ),
                    'defaults'          => array(
                        'controller'    => 'Administrator\Controller\Dboard',
                        'action'        => 'index',
                    ),
                ),
            ),
            'products' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/products[/:action]',
                    'constraints' => array(
                        'action'        => '(?!\bpage\b)(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'            => '[0-9]+',
                    ),
                    'defaults'          => array(
                        'controller'    => 'Administrator\Controller\Products',
                        'action'        => 'index',
                    ),
                ),
            ),
        ),
    ),
    'simple_memory_shared' => array(
        'default_storage' => array(
            'type' => 'file',
            'options' => array(
                'dir' => ABSO_URL."data/perspective_cache/",
            ),
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Administrator\Controller\Login'        => 'Administrator\Controller\LoginController',
            'Administrator\Controller\Index'        => 'Administrator\Controller\IndexController',
            'Administrator\Controller\Classes'      => 'Administrator\Controller\ClassesController',
            'Administrator\Controller\Marketplace'  => 'Administrator\Controller\MarketplaceController',
            'Administrator\Controller\Organization'  => 'Administrator\Controller\OrganizationController',
            'Administrator\Controller\Dboard'  => 'Administrator\Controller\DboardController',
            'Administrator\Controller\Products'  => 'Administrator\Controller\ProductsController',
        ),
    ),
    'controller_plugins' => array(
        'invokables' => array(
            'FileParser'  => 'Administrator\Controller\Plugin\FileParser',
            'ViewBuilder' => 'Administrator\Controller\Plugin\ViewBuilder',
            'MyTcpdf'     => 'Administrator\Controller\Plugin\MyTcpdf',
            'AwsS3'       => 'Administrator\Controller\Plugin\AwsS3',
        ),
    ),
    'constants' => array(
        'DIALOGUE_CLASS_ID'     => 179,
        'DIALOGUE_TEMPLATE_ID'  => 838,
        'DIALOGUE_TITLE_ID'     => 839,
        'DIALOGUE_TIMESTAMP_ID' => 1980, //added by Divya Rajput on date 22 April 2016
        'FILE_NODE_CLASS_ID'    => 188,
        'METHOD_VALUE_CP_ID'    => 868,
        'PROCESS_MENU_ID'       => 11,
        'ASSOCIATION_MENU_ID'   => 14,
        'WORKFLOW_MENU_ID'      => 128,
        'COURSE_NEW_COURSE_MENU'=> 114,
        'PRODUCT_CLASS_ID'      => 433,
        'PRODUCT_TITLE_ID'      => 2023,
        'PRODUCT_TYPE_ID'       => 2024,
        'FOLDER_CLASS_ID'       => 584,
        'FOLDER_TITLE_ID'       => 2609,
        'FOLDER_PARENT_ID'      => 2610,
        'FOLDER_TIMESTAMP_ID'   => 2652,
        'DOC_CLASS_ID'          => 596,
        'DOC_TITLE_ID'          => 2656,
        'DOC_TIMESTAMP_ID'      => 2658,
        'DOC_FOLDER_ID'         => 2657,
        'DOC_TYPE_ID'           => 2659,
        'XLS_CLASS_ID'          => 613,
        'XLS_TITLE_ID'          => 2791,
        'XLS_FOLDER_ID'         => 2792,
        'XLS_TIMESTAMP_ID'      => 2793,
        'XLS_TYPE_ID'           => 2794,
        'CSV_CLASS_ID'          => 614,
        'CSV_TITLE_ID'          => 2797,
        'CSV_FOLDER_ID'         => 2798,
        'CSV_TIMESTAMP_ID'      => 2799,
        'CSV_TYPE_ID'           => 2800,
        'PDF_CLASS_ID'          => 615,
        'PDF_TITLE_ID'          => 2803,
        'PDF_FOLDER_ID'         => 2804,
        'PDF_TIMESTAMP_ID'      => 2805,
        'PDF_TYPE_ID'           => 2806,
        'PPT_CLASS_ID'          => 616,
        'PPT_TITLE_ID'          => 2809,
        'PPT_FOLDER_ID'         => 2810,
        'PPT_TIMESTAMP_ID'      => 2811,
        'PPT_TYPE_ID'           => 2812,
        'JPEG_CLASS_ID'         => 619,
        'JPEG_TITLE_ID'         => 2832,
        'JPEG_FOLDER_ID'        => 2833,
        'JPEG_TIMESTAMP_ID'     => 2834,
        'JPEG_TYPE_ID'          => 2835,
        'PNG_CLASS_ID'          => 620,
        'PNG_TITLE_ID'          => 2838,
        'PNG_FOLDER_ID'         => 2839,
        'PNG_TIMESTAMP_ID'      => 2840,
        'PNG_TYPE_ID'           => 2841,
        'GIF_CLASS_ID'          => 621,
        'GIF_TITLE_ID'          => 2844,
        'GIF_FOLDER_ID'         => 2845,
        'GIF_TIMESTAMP_ID'      => 2846,
        'GIF_TYPE_ID'           => 2847,
        'ZIP_CLASS_ID'          => 624,
        'ZIP_TITLE_ID'          => 2879,
        'ZIP_FOLDER_ID'         => 2880,
        'ZIP_TIMESTAMP_ID'      => 2881,
        'ZIP_TYPE_ID'           => 2882,
        'RAR_CLASS_ID'          => 625,
        'RAR_TITLE_ID'          => 2885,
        'RAR_FOLDER_ID'         => 2886,
        'RAR_TIMESTAMP_ID'      => 2887,
        'RAR_TYPE_ID'           => 2888,
        'COURSE_CLASS_ID'       => 435,
        'COURSE_TEMPLATE_ID'    => 2049,
        'COURSE_TITLE_ID'       => 2050,
        'COURSE_DESCRIPTION_ID' => 2051,
        'COURSE_OBJECTIVE_ID'   => 2052,
        'COURSE_TIMESTAMP_ID'   => 3033,
        'INDIVIDUAL_CLASS_ID'   => 632,
        'PRODUCT_TITLE'         => 'course_title',
        'VIEW_CLASS_ID'         => 638,
        'THEME_CLASS_ID'        => 639,
        'DOMAIN_CLASS_PROP_ID'  => 2946,
        'URL_CLASS_PROP_ID'     => 2947,
        'LAYOUT_CLASS_PROP_ID'  => 2949,
        'HTML_CLASS_PROP_ID'    => 2950,
        'CSS_CLASS_PROP_ID'     => 2951,
        'COMBINED_CLASS_PROP_ID'=> 2952,
        'FILE_TYPE_PROP_ID'     => 877,
        'TAXONOMY_CLASS_NODE_ID'        => TAXONOMY_Z,
        'NODE_Z_GROUPING_CLASSES'       => array(TAXONOMY_Z, VERSION_Z, CLASS_Z),
        'NODE_Z_CLASSES'                => array(TAXONOMY_Z,DATATYPE_Z,FORM_SELECTOR_Z,VALIDATION_Z,NODE_RIGHTS_Z,DATA_SOURCE_Z,COLLAPSE_Z), // When you need to add any new z class id, Please always add last in the array(First element will remove in some condition)
        'NODE_Z_DEFAULT_VALUES'         => array('Version' => '1','Status'=>'Publish','Descendant'=>'Instance','View'=>'','Data Type'=>'String','Form Selector'=>'Input','Validation'=>'..', 'Data Source Type' => 'User Input', 'Class Property Details' => '--','Collapse'=>'Uncollapse' ),
        'OPERATIONS_ROLES_CLASS_ID' =>662,
        'VISIBLE_ROLES_PROP_ID' => 7405,
        'REQUIRED_ROLES_PROP_ID' => 7406,
        'PARENT_CLASS_PID' => 9148,
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'             => __DIR__ . '/../view/layout/layout.phtml',
            'head'                      => __DIR__ . '/../view/layout/head.phtml',
            'header'                    => __DIR__ . '/../view/layout/header.phtml',
            'footer'                    => __DIR__ . '/../view/layout/footer.phtml',
            'left'                      => __DIR__ . '/../view/layout/left.phtml',
            'right'                     => __DIR__ . '/../view/layout/right.phtml',
            'administrator/index/index' => __DIR__ . '/../view/administrator/index/index.phtml',
            'error/404'                 => __DIR__ . '/../view/error/404.phtml',
            'error/index'               => __DIR__ . '/../view/error/index.phtml',
            'paginator-ajax'            => __DIR__ . '/../view/layout/paginator-ajax.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),

    'view_helpers' => array(
        /*'factories' => array(
            'EncryptionDecryption' => function($sm) {
                $helper = new Administrator\View\Helper\EncryptionDecryption;
                return $helper;
            },
        ),*/
        'invokables'=> array(
            'PuViewHelper' => 'Administrator\View\Helper\PuViewHelper'
        )
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
