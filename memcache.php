<?php
$memcache = new Memcache;

$memcache->connect('sta-memcached01.xredgs.cfg.use1.cache.amazonaws.com', 11211) or die ("Could not connect");
$key = "sess_84ebe2d0731b7c8751b41cf3f24506de"; // Unique Words
$cache_result = array();
$cache_result = $memcache->get("sess_84ebe2d0731b7c8751b41cf3f24506de"); // Memcached object 

if($cache_result)
{
// Second User Request
$demos_result=$cache_result;
}
else
{
// First User Request 

//$demos_result=array('shanti','arvind'); // Results storing in array
//$memcache->set($key, $demos_result, MEMCACHE_COMPRESSED, 1200); 
// 1200 Seconds
}

// Result 
foreach($demos_result as $row)
{
print_r($row);
}
echo "DNS POINt";
?>