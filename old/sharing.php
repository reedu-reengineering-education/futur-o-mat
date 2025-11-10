<?php

class SocialImageShare {
    
    public static function facebook($pageUrl, $caption = '') {
        $shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode($pageUrl);
        error_log('Facebook Share URL: ' . $shareUrl);
        return $shareUrl;
    }
    
    public static function twitter($pageUrl, $text = '', $hashtags = '') {
        $shareUrl = 'https://twitter.com/intent/tweet?url=' . urlencode($pageUrl);
        if ($text) {
            $shareUrl .= '&text=' . urlencode($text);
        }
        if ($hashtags) {
            $shareUrl .= '&hashtags=' . urlencode($hashtags);
        }
        error_log('Twitter Share URL: ' . $shareUrl);
        return $shareUrl;
    }
    
    public static function linkedin($pageUrl, $title = '', $summary = '') {
        $shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' . urlencode($pageUrl);
        error_log('LinkedIn Share URL: ' . $shareUrl);
        return $shareUrl;
    }
    
    public static function whatsapp($pageUrl, $text = '') {
        $message = $text ? $text . ' ' . $pageUrl : $pageUrl;
        $shareUrl = 'https://wa.me/?text=' . urlencode($message);
        error_log('WhatsApp Share URL: ' . $shareUrl);
        return $shareUrl;
    }
    
    public static function telegram($pageUrl, $text = '') {
        $message = $text ? $text : '';
        $shareUrl = 'https://t.me/share/url?url=' . urlencode($pageUrl) . '&text=' . urlencode($message);
        error_log('Telegram Share URL: ' . $shareUrl);
        return $shareUrl;
    }
    
    public static function email($pageUrl, $subject = '', $body = '') {
        $mailUrl = 'mailto:?subject=' . urlencode($subject);
        $mailBody = $body ? $body . "\n\n" . $pageUrl : $pageUrl;
        $mailUrl .= '&body=' . urlencode($mailBody);
        error_log('Email Share URL: ' . $mailUrl);
        return $mailUrl;
    }
    
    public static function generateImageButtons($imageUrl, $options = []) {
        $pageUrl = $options['pageUrl'] ?? '';
        $title = $options['title'] ?? '';
        $description = $options['description'] ?? '';
        $hashtags = $options['hashtags'] ?? '';
        
        error_log('generateImageButtons - imageUrl: ' . $imageUrl . ', pageUrl: ' . $pageUrl);

        $buttons = [];
        
        $platforms = [
            'facebook' => ['name' => 'Facebook', 'color' => '#1877f2'],
            'twitter' => ['name' => 'Twitter', 'color' => '#1da1f2'],
            'linkedin' => ['name' => 'LinkedIn', 'color' => '#0077b5'],
            'whatsapp' => ['name' => 'WhatsApp', 'color' => '#25d366'],
            'telegram' => ['name' => 'Telegram', 'color' => '#0088cc'],
            'email' => ['name' => 'E-Mail', 'color' => '#333333'] // Changed name to German
        ];
        
        foreach ($platforms as $platform => $config) {
            if (!isset($options['exclude']) || !in_array($platform, $options['exclude'])) {
                $shareUrl = ''; // Initialize shareUrl
                switch ($platform) {
                    case 'facebook':
                        $shareUrl = self::facebook($pageUrl, $description); // Pass pageUrl
                        break;
                    case 'twitter':
                        $shareUrl = self::twitter($pageUrl, $title, $hashtags); // Pass pageUrl
                        break;
                    case 'linkedin':
                        $shareUrl = self::linkedin($pageUrl, $title, $description); // Pass pageUrl
                        break;
                    case 'whatsapp':
                        $shareUrl = self::whatsapp($pageUrl, $title); // Pass pageUrl
                        break;
                    case 'telegram':
                        $shareUrl = self::telegram($pageUrl, $title); // Pass pageUrl
                        break;
                    case 'email':
                        $shareUrl = self::email($pageUrl, $title, $description); // Pass pageUrl
                        break;
                }
                
                $buttons[] = [
                    'platform' => $platform,
                    'name' => $config['name'],
                    'url' => $shareUrl,
                    'color' => $config['color']
                ];
            }
        }
        
        return $buttons;
    }
    
    public static function renderImageButtons($imageUrl, $options = []) {
        $buttons = self::generateImageButtons($imageUrl, $options);
        $html = '<div class="social-image-share-buttons">';
        
        foreach ($buttons as $button) {
            $html .= sprintf(
                '<a href="%s" target="_blank" class="share-btn share-image-%s" style="background-color: %s; color: white; padding: 10px 16px; margin: 4px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 14px;">📤 %s</a>',
                htmlspecialchars($button['url']),
                $button['platform'],
                $button['color'],
                htmlspecialchars($button['name'])
            );
        }
        
        $html .= '</div>';
        return $html;
    }
    
    // Helper function to generate Open Graph meta tags for better image sharing
    public static function generateOpenGraphTags($imageUrl, $title, $description, $pageUrl) {
        return sprintf('
<meta property="og:title" content="%s" />
<meta property="og:description" content="%s" />
<meta property="og:image" content="%s" />
<meta property="og:url" content="%s" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="%s" />',
            htmlspecialchars($title),
            htmlspecialchars($description),
            htmlspecialchars($imageUrl),
            htmlspecialchars($pageUrl),
            htmlspecialchars($imageUrl)
        );
    }
}

// Usage examples:

// Usage examples (commented out as this file is included by other PHP scripts):

/*
$imageUrl = 'https://example.com/images/my-photo.jpg';
$options = [
    'title' => 'Check out this amazing photo!',
    'description' => 'A beautiful sunset captured at the beach',
    'pageUrl' => 'https://example.com/photo-gallery',
    'hashtags' => 'photography,sunset,beach'
];

// Generate individual share URLs
echo "Twitter: " . SocialImageShare::twitter($imageUrl, $options['title'], $options['hashtags']) . "\n";

// Generate all share buttons
$buttons = SocialImageShare::generateImageButtons($imageUrl, $options);
foreach ($buttons as $button) {
    echo $button['name'] . ': ' . $button['url'] . "\n";
}

// Render HTML buttons
echo SocialImageShare::renderImageButtons($imageUrl, $options);

// Generate Open Graph meta tags for your HTML head section
echo SocialImageShare::generateOpenGraphTags(
    $imageUrl,
    $options['title'],
    $options['description'],
    $options['pageUrl']
);
*/

?>