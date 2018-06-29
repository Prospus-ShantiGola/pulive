<?php echo "New---";
	 function httpGet($url)
{
$ch = curl_init();  
  curl_setopt($ch,CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_VERBOSE, 1);
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch,CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
  curl_setopt($ch,CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
  curl_setopt($ch,CURLOPT_TIMEOUT, 300);
  curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
$output=curl_exec($ch);
// Check if any error occurred
if (!curl_errno($ch)) {
  $info = curl_getinfo($ch);
  echo 'Took ', $info['total_time'], ' seconds to send a request to ', $info['url'], "\n";
}

curl_close($ch);

return $output;
}
echo httpGet("http://devintegrator.marinemax.com/rest/V1/CUSTOMERS?X-Connection=ASTRAG2&Location=CW&CustomerNo=1480189");
?>