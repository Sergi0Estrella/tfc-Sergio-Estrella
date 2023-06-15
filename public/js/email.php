<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nombre = $_POST['nombre'];
  $email = $_POST['email'];
  $asunto = $_POST['asunto'];
  $mensaje = $_POST['mensaje'];

  $to = 'anglixcano@gmail.com'; // Reemplaza con tu dirección de correo electrónico de Gmail
  $subject = $asunto;
  $message = "Nombre: " . $nombre . "\n\n";
  $message .= "Email: " . $email . "\n\n";
  $message .= "Mensaje: \n" . $mensaje;

  $headers = "From: " . $email . "\r\n";
  $headers .= "Reply-To: " . $email . "\r\n";

  if (mail($to, $subject, $message, $headers)) {
    echo "Correo electrónico enviado exitosamente.";
  } else {
    echo "Error al enviar el correo electrónico.";
  }
}
?>
