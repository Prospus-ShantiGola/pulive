<?php

return array(
    'router' => array(
        'routes' => array(
            'api' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/api/[:apiname][/dialogueNodeId/:dialogueNodeId][/classid/:classid][/login_userId/:login_userId][/userNodeId/:userNodeId][/emailaddress/:emailaddress][/password/:password][/courseNodeIds/:courseNodeIds][/instanceId/:instanceId][/group/:group][/productionid/:productionid][/devicetoken/:devicetoken][/excludedUsers/:excludedUsers][/excludeRole/:excludeRole][/view_type/:view_type][/timestamp/:timestamp][/logged_in_user/:logged_in_user][/forceUser/:forceUser][/platform/:platform][/course_instance_id/:course_instance_id][/userID/:userID][/status/:status]',
                    'constraints'           => array(
                        'apiname'          => '[a-zA-Z]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Api\Controller\Api',
                    ),
                ),
            ),
            
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Api\Controller\Api' => 'Api\Controller\ApiController',
        ),
    ),
    'controller_plugins' => array(
        'invokables' => array(
            'PUMailer'    => 'Api\Controller\Plugin\PUMailer',
            'PUCipher'    => 'Api\Controller\Plugin\PUCipher',
            'PUGData'     => 'Api\Controller\Plugin\PUGData',
            'PUSession'   => 'Api\Controller\Plugin\PUSession',
        ),
    ),
    'view_manager' => array(
        'strategies' => array(
            'ViewJsonStrategy',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
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
        'factories' => array(
           // 'MyOAuth2Provider' => 'Codeacious\OAuth2Provider\ProviderFactory',
        )
    ),
    
    
//    'oauth2provider' => [
//        'storage' => [
//            [
//                'class' => 'OAuth2\Storage\Pdo',
//                'options' => [
//                    'dsn' => 'mysql:host=192.168.1.15;dbname=pu_live',
//                    'username' => 'arvind',
//                    'password' => 'Prospus1',
//                ],
//            ]
//        ],
//        'options' => [
//            'allow_implicit' => true,
//            'auth_code_lifetime' => 60,
//            'access_lifetime' => 3600,
//            'refresh_token_lifetime' => 1209600,
//        ],
//    ],
);
