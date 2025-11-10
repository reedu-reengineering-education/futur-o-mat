<?php
// Include the SocialImageShare class
require_once 'sharing.php';

header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log('get_share_buttons.php received input: ' . print_r($input, true));

    if (!$input || !isset($input['imageUrl'])) {
        throw new Exception('Missing required parameters');
    }

    $imageUrl = $input['imageUrl'];
    $title = $input['title'] ?? 'Mein Futur-O-Mat Avatar';
    $description = $input['description'] ?? 'Erstellt mit dem Futur-O-Mat - Mach dir die Zukunft, wie sie dir gefällt!';
    $pageUrl = $input['pageUrl'] ?? '';
    error_log('get_share_buttons.php using pageUrl: ' . $pageUrl);

    $options = [
        'title' => $title,
        'description' => $description,
        'pageUrl' => $pageUrl,
        'hashtags' => 'FuturOMat,Avatar,Zukunft'
    ];

    // Generate share buttons with custom styling for the German interface
    $buttons = SocialImageShare::generateImageButtons($imageUrl, $options);
    
    echo '<div class="social-share-buttons" style="display: grid; grid-template-columns: repeat(2, minmax(100px, 1fr)); gap: 8px; margin: 0;">';
    
    foreach ($buttons as $button) {
        $platformName = $button['name'];
        // Translate platform names to German
        $germanNames = [
            'Facebook' => 'Facebook',
            'Twitter' => 'Twitter', 
            'LinkedIn' => 'LinkedIn',
            'WhatsApp' => 'WhatsApp',
            'Telegram' => 'Telegram',
            'Email' => 'E-Mail',
            'Copy Link' => 'Link kopieren'
        ];
        
        $displayName = $germanNames[$platformName] ?? $platformName;
        
        printf(
            '<a href="%s" target="_blank" class="share-btn share-%s" style="background-color: %s; color: white; padding: 10px 12px; text-decoration: none; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; transition: opacity 0.2s ease;" onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'1\'">%s</a>',
            htmlspecialchars($button['url']),
            $button['platform'],
            $button['color'],
            htmlspecialchars($displayName)
        );
    }
    
    echo '</div>';

} catch (Exception $e) {
    error_log('Share buttons error: ' . $e->getMessage());
    echo '<div style="text-align: center; color: #999; padding: 20px;">';
    echo '<p>Sharing-Buttons konnten nicht geladen werden.</p>';
    echo '<p style="font-size: 12px;">Du kannst das Bild herunterladen und manuell teilen.</p>';
    echo '</div>';
}
?>