<?
require_once 'simple_html_dom.php';

// config
$base_url = 'http://www.aucklandcouncil.govt.nz/';
$content_url = 'http://www.aucklandcouncil.govt.nz/EN/newseventsculture/events/Events/Pages/search.aspx';

// fetch the data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $content_url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($ch);
curl_close($ch);

// load up PHP DOM
$html = str_get_html($data);
  
// create a plain PHP object to store our data in
$rep = new stdClass();
$rep->results = array();

// prepare the content
foreach ($html->find('div.newslistingitems div.item') as $ele) {

    $link = $ele->find('a', 0);
    $img = $ele->find('img', 0);
    $desc = $ele->find('div.description', 0)->innertext;
    
    $item = new stdClass();
    $item->title = $link->title;
    $item->img_small = $base_url . $img->src;
    $item->desc_short = $desc;
    $item->url = $link->href;
	
	// add our new item into the output array
    $rep->results[] = $item;
}

// debug - use this to view the data structure
// print_r($rep);

// convert our PHP object into JSON for sending back to the browser
header('Content-Type: application/json');
echo json_encode($rep);