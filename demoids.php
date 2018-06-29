	<?php
	
	function get_headers_from_curl_response($response)
	{
	    $headers = array();

	    $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

	    foreach (explode("\r\n", $header_text) as $i => $line)
	        if ($i === 0)
	        {
	        	$new = explode(" ",$line);
	        	$headers['http_code'] = $line;//.$new[1];
	        }
	        else
	        {
	            list ($key, $value) = explode(': ', $line);

	            $headers[$key] = $value;
	        }

	    return $headers;
	}

	function callCurl($url)
	{
		$ch 					= curl_init();
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch,CURLOPT_USERPWD, "PROSPUS:GRQrC7S");
		curl_setopt($ch,CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,0);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);

		$data 					= curl_exec($ch);  
                
        $http_status 			= curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($http_status != 200) {
            $http_status = "API Error - $http_status";
        }
        else {
            $http_status = "API Status - $http_status";
        }

		curl_close($ch);
		return $data;
	}

	function checkSearch($request){
		if($request['search']==='true'){
			return '/SEARCH';
		} else {
			return '';
		}
	}
	function ifEmpty($string,$param){
		if ($param === '') {
			return '';
		} else {
			return $string.$param;
		}
	}
	function callApi($request)
	{
		$errorArray = array(
						'201' => 'Request was processed successfully. Resources were created or modified. POST, PUT, PATCH or DELETE methods.',
						'204' => 'Request was processed successfully but no data returned. GET method only.',
						'400' => 'There was a problem processing the request. The response body will contain additional information.',
						'401' => 'The request was refused because the authentication information was not provided or is not valid.',
						'404' => 'The requested resource could not be found.',
						'405' => 'The requested HTTP method is not supported by the resource.',
						'429' => 'Too many requests.',
						'500' => 'Server processing error.'
					   );


		$url = 'https://devintegrator.marinemax.com/rest/V1/';

		switch ($request['select']) {
		    case 'financeQuote':
		    	$url .= 'FINANCE_DEALS';
		    	$url .= checkSearch($request);
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location']);
		    	$url .= ifEmpty('&QuoteNo=',$request['quote']);
		    	$url .= ifEmpty('&CustomerNo=',$request['customer']);
		    	$url .= ifEmpty('&StockNo=',$request['stock']);
		        break;
		    case 'salesQuote':
		    	$url .= 'SALES_QUOTES';
		    	$url .= checkSearch($request);
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location']);
		    	$url .= ifEmpty('&SalesQuoteNo=',$request['quote']);
		    	$url .= ifEmpty('&CustomerNo=',$request['customer']);
		    	$url .= ifEmpty('&StockNo=',$request['stock']);
		        break;
		    case 'customer':
		    	$url .= 'CUSTOMERS';
		    	$url .= checkSearch($request);
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location']);
		    	$url .= ifEmpty('&CustomerNo=',$request['quote']);
		    	$url .= ifEmpty('&LastName=',$request['last']);
		    	$url .= ifEmpty('&Email=',$request['email']);
		    	$url .= ifEmpty('&Phone=',$request['phone']);
		        break;
		    case 'stock':
		    	$url .= 'UNITS';
		    	$url .= checkSearch($request);
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location']);
		    	$url .= ifEmpty('&StockNo=',$request['quote']);
		    	$url .= ifEmpty('&Model=',$request['model']);
		    	$url .= ifEmpty('&Brand=',$request['brand']);
		    	$url .= ifEmpty('&Year=',$request['year']);
		    	$url .= ifEmpty('&Status=',$request['status']);
		        break;
		    case 'coBuyer':
		    	$url .= 'COBUYERS';
		    	$url .= '?X-Connection=ASTRAG2';
		    	$url .= ifEmpty('&Location=',$request['location']);
		    	$url .= ifEmpty('&CoBuyerNo=',$request['quote']);
		        break;
		    default:
		}
		return $url;
	}

	function getResponse($url){

		$myXMLData			= callCurl($url);

		$myXMLData 			= explode("<?xml",$myXMLData);
		$myXMLData[1]       = "<?xml".$myXMLData[1];

		return $myXMLData;
	}

	$slowLoad = 'false';
	$request = json_encode($_REQUEST);
	if(!empty($_REQUEST)){
		$slowLoad = 'false';
	} else {
		$slowLoad = 'true';

	}
	$url = callApi($_REQUEST);
?>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	window.slowLoad = <?php echo($slowLoad); ?>;
	function hideAll(delay){
		$('.stock').hide(delay);
		$('.search').hide(delay);
		$('.location').hide(delay);
		$('.unitSearch').hide(delay);
		$('.quoteSearch').hide(delay);
		$('.customerSearch').hide(delay);
	}
	function showSearch(delay,searchable){
		$('.stock').show(delay);
		$('.location').show(delay);
		(searchable)?$('.search').show(delay):$('.search').hide();
	}
	function onSelect(){
		var apiSelect = $('.apiSelect').children(':selected').val();
		var searchSelect = $('.searchSelect').children(':selected').val();
		switch (apiSelect) {
		    case 'financeQuote':
		        showSearch(1000,true);
		        break;
		    case 'salesQuote':
		        showSearch(1000,true);
		        break;
		    case 'customer':
		        showSearch(1000,true);
		        break;
		    case 'stock':
		        showSearch(1000,true);
		        break;
		    case 'coBuyer':
		        showSearch(1000,false);
		        break;
		    default:
		    	alertNoSelection();
		}
		$('.unitSearch').hide();
		$('.quoteSearch').hide();
		$('.customerSearch').hide();
		if(apiSelect === 'customer' && searchSelect === 'true'){
			$('.customerSearch').show();
		}
		if(apiSelect === 'stock' && searchSelect === 'true'){
			$('.unitSearch').show();
		}
		if((apiSelect === 'financeQuote' || apiSelect === 'salesQuote') && searchSelect === 'true'){
			$('.quoteSearch').show();
		}
		if (searchSelect === 'false') {
			$('.unitSearch input').val('');
			$('.quoteSearch input').val('');
			$('.customerSearch input').val('');
		}
	}
	function alertNoSelection(){
    	hideAll(0);
		alert('Please select an API!');
	}
	if (slowLoad) {
		hideAll(0);
	} else {
		window.request = <?php echo($request); ?>;
		$('.apiSelect').children('option[value="'+request.select+'"]').prop('selected',true);
		$('.searchSelect').children('option[value="'+request.search+'"]').prop('selected',true);
		onSelect();
		$('input[name="year"]').val(request.year);
		$('input[name="last"]').val(request.last);
		$('input[name="quote"]').val(request.quote);
		$('input[name="brand"]').val(request.brand);
		$('input[name="model"]').val(request.model);
		$('input[name="email"]').val(request.email);
		$('input[name="phone"]').val(request.phone);
		$('input[name="stock"]').val(request.stock);
		$('input[name="status"]').val(request.status);
		$('input[name="location"]').val(request.location);
		$('input[name="customer"]').val(request.customer);
	}
	$('.apiSelect').on('change',function(){
		onSelect();
	});
	$('.searchSelect').on('change',function(){
		onSelect();
	});
	$('#apiHit').on('submit', function(event){
		if($('.apiSelect').children(':selected').val() === 'select'){
			event.preventDefault();
			alertNoSelection();
		}
	});
});
</script>
<form id="apiHit" name="apiHit" action="" method="POST">
	<br>
	<table>
		<tr>
			<td>
				<label>Which API?:</label>
			</td>
			<td>
				<select class="apiSelect" name="select">
					<?php ($slowLoad==='true')? print('<option value="select">Select an option</option>'):false; ?>
					<option value="financeQuote">Finance Quote</option>
					<option value="salesQuote">Sales Quote</option>
					<option value="customer">Customer</option>
					<option value="stock">Boat (Stock/Unit)</option>
					<option value="coBuyer">Co-Buyer</option>
				</select>
			</td>
		</tr>
		<tr class="search">
			<td>
				<label>Want to search?:</label>
			</td>
			<td>
				<select class="searchSelect" name="search">
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</td>
		</tr>
		<tr class="location">
			<td>
				<label>Location</label>
			</td>
			<td>
				<input type="text" name="location">
			</td>
		</tr>
		<tr class="stock">
			<td>
				<label>Quote/Customer/Stock #</label>
			</td>
			<td>
				<input type="text" name="quote">
			</td>
		</tr>
	</table>
	<label class="unitSearch">Unit Search:</label>
	<table class="unitSearch">
		<ul>
			<tr>
				<td><li><label>Brand </label></li></td>
				<td><input type="text" name="brand"></td>
			</tr>
			<tr>
				<td><li><label>Model </label></li></td>
				<td><input type="text" name="model"></td>
			</tr>
			<tr>
				<td><li><label>Year </label></li></td>
				<td><input type="text" name="year"></td>
			</tr>
			<tr>
				<td><li><label>Status </label></li></td>
				<td><input type="text" name="status"></td>
			</tr>
		</ul>
	</table>
	<label class="customerSearch">Customer Search:</label>
	<table class="customerSearch">
		<ul>
			<tr>
				<td><li><label>Last Name </label></li></td>
				<td><input type="text" name="last"></td>
			</tr>
			<tr>
				<td><li><label>Email </label></li></td>
				<td><input type="text" name="email"></td>
			</tr>
			<tr>
				<td><li><label>Phone </label></li></td>
				<td><input type="text" name="phone"></td>
			</tr>
		</ul>
	</table>
	<label class="quoteSearch">Quote Search:</label>
	<table class="quoteSearch">
		<ul>
			<tr>
				<td><li><label>Customer </label></li></td>
				<td><input type="text" name="customer"></td>
			</tr>
			<tr>
				<td><li><label>Stock </label></li></td>
				<td><input type="text" name="stock"></td>
			</tr>
		</ul>
	</table>
		<input type="submit" name="Submit">
</form>
<?php
	if(!empty($_REQUEST)){
		print($url);
		echo "<pre>";
		$myXMLData = getResponse($url);
		$headers = get_headers_from_curl_response($myXMLData[0]);
		print_r($headers);
		$xml = simplexml_load_string($myXMLData[1]);
		$returnArray = json_encode($xml);
	 	$returnArray = json_decode($returnArray, true);
	 	print_r($returnArray);
	 }

		//for Customer
		
		//$url 				= "https://devintegrator.marinemax.com/rest/V1/CUSTOMERS?X-Connection=ASTRAG2&Location=CW&CustomerNo=218009";
        //$url 				= "https://devintegrator.marinemax.com/rest/V1/CUSTOMERS/SEARCH?X-Connection=ASTRAG2&Location=CW&LastName=S&Email=jordan572@yahoo.com";

        //for Units - Boat

        //$url 				= "https://devintegrator.marinemax.com/rest/V1/UNITS?X-Connection=ASTRAG2&Location=CW&StockNo=7483N";
        //$url 				= "https://devintegrator.marinemax.com/rest/V1/UNITS/SEARCH?X-Connection=ASTRAG2&Location=CW&Brand=SEA";

        //for Finance - FI Quote
        //$url 				= "https://devintegrator.marinemax.com/rest/V1/FINANCE_DEALS/SEARCH?X-Connection=ASTRAG2&Location=CW&CustomerNo=1551917";
        // $url 				= "https://devintegrator.marinemax.com/rest/V1/FINANCE_DEALS?X-Connection=ASTRAG2&Location=MSP&QuoteNo=12345";
        //$url 				= "https://devintegrator.marinemax.com/rest/V1/FINANCE_DEALS/SEARCH?X-Connection=ASTRAG2&Location=CW&CustomerNo=128897";


		// Co-Buyer API

		//$url     = "https://devintegrator.marinemax.com/rest/V1/COBUYERS?X-Connection=ASTRAG2&Location=CW&CoBuyerNo=1551917";

        //for Sales Quoate

        //$url 				= "https://devintegrator.marinemax.com/rest/V1/SALES_QUOTES?X-Connection=ASTRAG2&Location=CW&SalesQuoteNo=128897";
        //$url 				= "https://devintegrator.marinemax.com/rest/V1/SALES_QUOTES/SEARCH?X-Connection=ASTRAG2&Location=CW&CustomerNo=128897";