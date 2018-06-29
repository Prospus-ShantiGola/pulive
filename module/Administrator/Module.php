<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Administrator;

use Administrator\Model\Administrator;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

use Administrator\Model\AdministratorTable;
use Administrator\Model\ClassesTable;
use Administrator\Model\LoginTable;
use Administrator\Model\StructureBuilderTable;
use Administrator\Model\CourseDialogueTable;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ServiceProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\ControllerPluginProviderInterface;

class Module implements AutoloaderProviderInterface, ConfigProviderInterface, ServiceProviderInterface, ControllerPluginProviderInterface
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/config/autoload_classmap.php'
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

     public function getControllerPluginConfig()
    {
        return array(
            'factories' => array(
                'MemoryShared' => function($sm) {
                    $memorySharedManager = $sm->getserviceLocator()->get('MemorySharedManager');
                    $managerHelper = new Controller\Plugin\SimpleMemoryShared();
                    $managerHelper->setMemorySharedManager($memorySharedManager);
                    return $managerHelper;
                }
            ),
            'aliases' => array(
                'MemorySharedManager' => 'MemoryShared',
                'SimpleMemoryShared' => 'MemoryShared',
            ),
        );
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Administrator\Model\AdministratorTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new AdministratorTable($dbAdapter);
                    return $table;
                },
                'Administrator\Model\ClassesTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new ClassesTable($dbAdapter);
                    return $table;
                },
                'Administrator\Model\LoginTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new LoginTable($dbAdapter);
                    return $table;
                },
                'Administrator\Model\StructureBuilderTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new StructureBuilderTable($dbAdapter);
                    return $table;
                },
                'Administrator\Model\CourseDialogueTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new CourseDialogueTable($dbAdapter);
                    return $table;
                },
                'MemorySharedManager' => function($sm) {
                    $memorySharedManager = new MemorySharedManager();
                    $config = $sm->get('Config');
                    if(isset($config['simple_memory_shared']['default_storage'])) {
                        $defaultStorage = $config['simple_memory_shared']['default_storage'];
                        $pluginManager = $memorySharedManager->getStoragePluginManager();
                        $storage = $pluginManager->get($defaultStorage['type'], $defaultStorage['options']);
                        $memorySharedManager->setStorage($storage);
                    }
                    return $memorySharedManager;
                },


            ),
            'aliases' => array(
                'SimpleMemoryShared' => 'MemorySharedManager',
            ),
        );
    } 

    public function getViewHelperConfig()
    {
        return array(
            'factories' => array(
                'poms' => function ($serviceManager) {
                    // Get the service locator 
                    $serviceLocator = $serviceManager->getServiceLocator();
                    // pass it to your helper 
                    return new \Administrator\View\Helper\structureBuilder($serviceLocator);
                },
                'encryption_decryption' => function($sm) {
                    $helper = new View\Helper\EncryptionDecryption ;
                    return $helper;
                },
                'pu_view_helper' => function($sm) {
                    $helper = new \Administrator\View\Helper\PuViewHelper ;
                    return $helper;
                }
            )
        );
   } 
}
