<?php
$query = "";
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $query = $_GET['q'];
        get($query);
        break;
    default:
        die('Invalid request method');
}


function get($query)
{
    if ($query == "") :
        header('Content-Type: application/json');

        echo json_encode([
            "status" => "error",
            "message" => "No query specified"
        ]);
        return;
    endif;

    $url = base64_decode($query);
    $ch = curl_init();

    $user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1';
    curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $headers = getallheaders();
    $cookie = $headers['Cookie'];
    // get trakteer-sess key
    $trakteer_sess = explode("trakteer-sess=", $cookie);
    if (!isset($trakteer_sess[1])):
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "No trakteer-sess specified"
        ]);
        return;
    endif;

    $xsrf_token = explode("XSRF-TOKEN=", $cookie);
    if (!isset($xsrf_token[1])) :
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "No XSRF-TOKEN specified"
        ]);
        return;
    endif;

    $trakteer_sess = explode(";", $trakteer_sess[1])[0];
    $xsrf_token = explode(";", $xsrf_token[1])[0];

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json, text/plain, */*",
        "Accept-Language: en-US,en;q=0.5",
        "Connection: keep-alive",
        "Cookie: trakteer-sess=$trakteer_sess; XSRF-TOKEN=$xsrf_token",
        "Host: trakteer.id",
        "Referer: https://trakteer.id/",
        "Sec-Fetch-Dest: empty",
        "Sec-Fetch-Mode: cors",
        "Sec-Fetch-Site: same-origin",
        "TE: trailers",
        "User-Agent: $user_agent"
    ]);

    
    $output = curl_exec($ch);

    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpcode == 200) :
        header('Content-Type: application/json');
        echo $output;
        return;
    else :
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Internal server error"
        ]);
        return;
    endif;

}