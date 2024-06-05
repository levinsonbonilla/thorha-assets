<?php
// Obtener el archivo solicitado
$file = $_GET['file'];
$filepath = __DIR__ . '/' . trim($file,"/");

// Comprobar si el archivo existe
if (file_exists($filepath)) {
    // Determinar el tipo MIME del archivo
    $mimeType = mime_content_type($filepath);

    // Añadir encabezados CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Añadir el encabezado de tipo de contenido
    header("Content-Type: " . $mimeType);

    // Leer el archivo y enviarlo al cliente
    readfile($filepath);
    exit();
} else {
    // Enviar un error 404 si el archivo no se encuentra
    http_response_code(404);
    echo "File not found.";
    exit();
}
