<?php
return array(
    'controllers' => array(
        'invokables' => array(
            'Grid\Controller\Grid' 			=> 'Grid\Controller\GridController',
			'Grid\Controller\Manifestation' => 'Grid\Controller\ManifestationController',
			'Grid\Controller\Accounts'		=> 'Grid\Controller\AccountsController',
			'Grid\Controller\Associations'	=> 'Grid\Controller\AssociationsController',
			'Grid\Controller\Courses'		=> 'Grid\Controller\CoursesController',
			'Grid\Controller\Dashboard'		=> 'Grid\Controller\DashboardController',
			'Grid\Controller\Courseboard'	=> 'Grid\Controller\CourseboardController',
			'Grid\Controller\Process'		=> 'Grid\Controller\ProcessController',
			'Grid\Controller\Menudashboard'	=> 'Grid\Controller\MenudashboardController',
			'Grid\Controller\Calendar'		=> 'Grid\Controller\CalendarController',
			'Grid\Controller\Actors'		=> 'Grid\Controller\ActorsController',
            'Grid\Controller\Email'		=> 'Grid\Controller\EmailController',
            'Grid\Controller\Documents'		=> 'Grid\Controller\DocumentsController',
            'Grid\Controller\Workflow'		=> 'Grid\Controller\WorkflowController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'grid' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/grid[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Grid',
					'action'     => 'index',
								),
                ),
            ),
			'manifestation' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/manifestation[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Manifestation',
					'action'     => 'createManifest',
								),
                ),
            ),
            'accounts' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/accounts[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Accounts',
					'action'     => 'index',
								),
                ),
            ),
            'associations' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/associations[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Associations',
					'action'     => 'index',
								),
                ),
            ),
            'courses' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/courses[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Courses',
					'action'     => 'index',
								),
                ),
            ),
			'board' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/board[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Dashboard',
					'action'     => 'index',
								),
                ),
            ),
			'courseboard' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/courseboard[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Courseboard',
					'action'     => 'index',
								),
                ),
            ),
            'process' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/process[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Process',
					'action'     => 'index',
								),
                ),
            ),
            'menudashboard' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/menudashboard[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Menudashboard',
					'action'     => 'index',
								),
                ),
            ),
            'calendar' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/calendar[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Calendar',
					'action'     => 'index',
								),
                ),
            ),
            'actors' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/actors[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Actors',
					'action'     => 'index',
								),
                ),
            ),
            'email' => array(
				'type'    => 'segment',
				'options' => array(
					'route'    => '/email[/:action][/:id]',
					'constraints' => array(
						'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
					),
				'defaults' => array(
					'controller' => 'Grid\Controller\Email',
					'action'     => 'index',
								),
                ),
            ),
            'documents' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/documents[/:action][/:id]',
                    'constraints' => array(
                        'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Grid\Controller\Documents',
                        'action'     => 'index',
                    ),
                ),
            ),
            'workflow' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/workflow[/:action][/:id]',
                    'constraints' => array(
                        'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Grid\Controller\Workflow',
                        'action'     => 'index',
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
    'view_manager' => array(
        'template_path_stack' => array(
            'grid' => __DIR__ . '/../view',
            'resource/default' => __DIR__ . '/../view/grid/documents/index.phtml',
        ),
    ),
);
