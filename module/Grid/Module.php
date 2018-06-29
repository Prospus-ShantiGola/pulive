<?php

namespace Grid;

use Grid\Model\GridTable;
use Grid\Model\DashboardTable;
use Grid\Model\EmailTable;
use Administrator\Model\ClassesTable;
use Zend\EventManager\StaticEventManager;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ServiceProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\ControllerPluginProviderInterface;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

class Module implements AutoloaderProviderInterface, ConfigProviderInterface, ServiceProviderInterface, ControllerPluginProviderInterface
{
    /*public function onBootstrap($e)
    {
        $e->getApplication()->getEventManager()->getSharedManager()->attach('Zend\Mvc\Controller\AbstractActionController', 'dispatch', function($e) {
            $controller = $e->getTarget();
            if ($_SESSION[PREFIX.'user_info']) {
                return;
            } else {
                $controller->plugin('redirect')->toRoute('login/index');
            }
        }, 100);
    }*/

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/config/autoload_classmap.php'
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    'Imapemail' => __DIR__ . '/../../puidata/Imapemail',
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
                'Grid\Model\GridTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new GridTable($dbAdapter);
                    return $table;
                },
                'Administrator\Model\ClassesTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new ClassesTable($dbAdapter);
                    return $table;
                },
                'Grid\Model\DashboardTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new DashboardTable($dbAdapter);
                    return $table;
                },
                'Grid\Model\EmailTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new EmailTable($dbAdapter);
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

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
}