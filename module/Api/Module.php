<?php

namespace Api;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Api\Model\Api;
use Api\Model\ApiTable;
use Zend\View\Model\JsonModel;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'onDispatchError'), 0);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, array($this, 'onRenderError'), 0);
    }

    public function onDispatchError($e)
    {
        return $this->getJsonModelError($e);
    }

    public function onRenderError($e)
    {
        return $this->getJsonModelError($e);
    }

    public function getJsonModelError($e)
    {
        $error = $e->getError();
        if (!$error) {
            return;
        }

        $response = $e->getResponse();
        $exception = $e->getParam('exception');
        $exceptionJson = array();
        if ($exception) {
            $exceptionJson = array(
                'class' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'message' => $exception->getMessage(),
                'stacktrace' => $exception->getTraceAsString()
            );
        }

        $errorJson = array(
            'message'   => 'An error occurred during execution; please try again later.',
            'error'     => $error,
            'exception' => $exceptionJson,
        );
        if ($error == 'error-router-no-match') {
            $errorJson['message'] = 'Resource not found.';
        }

        $model = new JsonModel(array('errors' => array($errorJson)));

        $e->setResult($model);

        return $model;
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
    
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/config/autoload_classmap.php',
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
                'Api\Model\ApiTable' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new ApiTable($dbAdapter);
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
                //Register the factory with whatever service name you like
                //                'MyOAuth2Provider' => function($sm) {
                //                    $table = $sm->get('Codeacious\OAuth2Provider\ProviderFactory');
                //                  return $table;
                //                }      
                        
            ),
            'aliases' => array(
                'SimpleMemoryShared' => 'MemorySharedManager',
            ),
        );           
    }
}
