<?php
namespace RestfulApi;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ServiceProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\ControllerPluginProviderInterface;

class Module implements AutoloaderProviderInterface, ConfigProviderInterface, ServiceProviderInterface, ControllerPluginProviderInterface
{
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
               
               
                'RestfulApi\MemorySharedManager' => function($sm) {
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
                'prospus' => function ($serviceManager) {
                    // Get the service locator 
                    $serviceLocator = $serviceManager->getServiceLocator();
                    // pass it to your helper 
                    return new \Administrator\View\Helper\StructureBuilder($serviceLocator);
                }
            )
        );
   }  
}
