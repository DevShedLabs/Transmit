<?php

header( 'Access-Control-Allow-Origin: *' );
header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
header( 'Content-Type: application/json' );

if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
	exit( 0 );
}

$requestData = json_decode( file_get_contents( 'php://input' ), true );
if ( ! $requestData ) {
	http_response_code( 400 );
	echo json_encode( [ 'error' => 'Invalid request data' ] );
	exit;
}

$ch = curl_init();

curl_setopt( $ch, CURLOPT_URL, $requestData[ 'url' ] );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_HEADER, true );
curl_setopt( $ch, CURLOPT_ENCODING, '' );
curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, $requestData[ 'method' ] );
// Add cookie handling
curl_setopt( $ch, CURLOPT_COOKIEFILE, "" ); // Enable cookie handling

$headers = [];
if ( isset( $requestData[ 'headers' ] ) && is_array( $requestData[ 'headers' ] ) ) {
	foreach ( $requestData[ 'headers' ] as $header ) {
		if ( isset( $header[ 'key' ] ) && isset( $header[ 'value' ] ) ) {
			$headers[] = $header[ 'key' ] . ': ' . $header[ 'value' ];
		}
	}
}
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );

if ( in_array( $requestData[ 'method' ], [ 'POST', 'PUT', 'PATCH' ] ) && isset( $requestData[ 'body' ] ) ) {
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $requestData[ 'body' ] );
}

$response = curl_exec( $ch );

if ( curl_errno( $ch ) ) {
	http_response_code( 500 );
	echo json_encode( [ 'error' => curl_error( $ch ) ] );
	exit;
}

$status_code = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
$header_size = curl_getinfo( $ch, CURLINFO_HEADER_SIZE );

$header_text = substr( $response, 0, $header_size );
$body        = substr( $response, $header_size );

// Parse headers and cookies
$headers   = [];
$cookies   = [];
$lines     = explode( "\n", str_replace( "\r\n", "\n", $header_text ) );
$firstLine = true;

foreach ( $lines as $line ) {
	$line = trim( $line );
	if ( empty( $line ) ) {
		continue;
	}

	if ( $firstLine ) {
		if ( preg_match( '/^HTTP\/\d+(?:\.\d+)?\s+(\d+)/', $line, $matches ) ) {
			$headers[ 'status' ] = $line;
		}
		$firstLine = false;
		continue;
	}

	if ( preg_match( '/^([^:]+):\s*(.+)$/', $line, $matches ) ) {
		$key   = trim( $matches[ 1 ] );
		$value = trim( $matches[ 2 ] );

		// Parse Set-Cookie headers
		if ( strtolower( $key ) === 'set-cookie' ) {
			$cookie = [];
			$parts  = explode( ';', $value );

			// Parse the main cookie pair
			$mainPart = array_shift( $parts );
			list( $cookieName, $cookieValue ) = explode( '=', $mainPart, 2 );
			$cookie[ 'name' ]  = trim( $cookieName );
			$cookie[ 'value' ] = trim( $cookieValue );

			// Parse additional attributes
			foreach ( $parts as $part ) {
				$part = trim( $part );
				if ( strpos( $part, '=' ) !== false ) {
					list( $attrName, $attrValue ) = explode( '=', $part, 2 );
					$cookie[ strtolower( trim( $attrName ) ) ] = trim( $attrValue );
				} else {
					$cookie[ strtolower( $part ) ] = true;
				}
			}

			$cookies[] = $cookie;
		} else {
			// Handle other headers
			if ( in_array( strtolower( $key ), [ 'report-to', 'nel', 'server-timing' ] ) ) {
				try {
					$decodedValue = json_decode( $value, true );
					if ( json_last_error() === JSON_ERROR_NONE ) {
						$headers[ $key ] = $decodedValue;
					} else {
						$headers[ $key ] = $value;
					}
				} catch ( Exception $e ) {
					$headers[ $key ] = $value;
				}
			} else {
				$headers[ $key ] = $value;
			}
		}
	}
}

curl_close( $ch );

echo json_encode( [
	'status'  => $status_code,
	'headers' => $headers,
	'cookies' => $cookies,
	'body'    => json_decode( $body ) ?? $body,
] );
