<?php
return array(
    'router' => array(
        'routes' => array(
            'pui' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/pui[/:action][/:id]',
                    'defaults' => array(
                        'controller' => 'RestfulApi\Controller\PuiApi',
                    ),
                    'constraints' => array(
                        'action' => '(?!\border_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
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
    
    'controllers' => array(
        'invokables' => array(
            'RestfulApi\Controller\PuiApi'   => 'RestfulApi\Controller\PuiApiController',
        ),
    ),
    
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
