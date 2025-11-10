<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Futur-O-Mat</title>
  <meta name="description" content="Mach dir die Zukunft, wie sie dir gefällt!" />
  <meta name="author" content="Benjamin Bertram / Germanwatch" />

  <?php
  $shareImageUrl = isset($_GET['share_image']) ? htmlspecialchars($_GET['share_image']) : 'https://futur-o-mat.germanwatch.org/Futur-O-Mat-ogimage.webp';
  $shareTitle = isset($_GET['share_title']) ? htmlspecialchars($_GET['share_title']) : 'Futur-O-Mat';
  $shareDescription = isset($_GET['share_description']) ? htmlspecialchars($_GET['share_description']) : 'Mach dir die Zukunft, wie sie dir gefällt!';
  ?>
  <meta property="og:title" content="<?php echo $shareTitle; ?>" />
  <meta property="og:description" content="<?php echo $shareDescription; ?>" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="<?php echo $shareImageUrl; ?>" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="<?php echo $shareImageUrl; ?>" />
  <link rel="icon" href="assets/favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <div class="app-container">
      <div class="avatar-generator">
        <div class="header">
          <div class="title-container">
            <h1>Futur-O-Mat</h1>
            <p>Mach dir die Zukunft, wie sie dir gefällt!</p>
          </div>
          <button class="info-button" id="infoButton" aria-label="Information">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </button>
        </div>

        <div class="step-container">
          <div id="bodyEditorStep" class="step active">
            <div class="canvas-container">
              <canvas id="avatarCanvas" width="300" height="400"></canvas>
              <div id="loadingIndicator" class="loading-indicator" style="display: none;">
                <div class="loading-spinner"></div>
                <p>Bilder werden geladen...</p>
              </div>
            </div>
            
            <div class="step-navigation-buttons">
              <button class="btn-secondary btn-small step-nav-button active" id="step1Button">Wer bist du?</button>
              <button class="btn-secondary btn-small step-nav-button" id="step2Button">Wie bist du?</button>
            </div>
            <div class="editor-container">
              <div class="tabs-container">
                <div class="category-tabs">
                  <button class="btn-tertiary btn-small tab-button active" data-category="head">Kopf</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="face">Gesicht</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="hair">Haare</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="bodytype">Körper</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="clothes">Kleidung</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="shoes">Schuhe</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="accessoires">Zubehör</button>
                  <button class="btn-tertiary btn-small tab-button" data-category="handicap">Hilfsmittel</button>
                </div>
                <div class="progress-indicator">
                  <div class="progress-bar" id="progressBar"></div>
                </div>
              </div>

              <div class="parts-selector">
                <!-- Skin color submenu - only visible when bodytype is selected -->
                <div class="skin-color-selector" id="skinColorSelector" style="display: none;">
                  <div class="skin-color-options">
                    <button class="skin-color-option" data-skin-tone="Dunkel" style="background-color: #965f4b;" title="Dunkel"></button>
                    <button class="skin-color-option active" data-skin-tone="Braun" style="background-color: #c97062;" title="Braun"></button>
                    <button class="skin-color-option" data-skin-tone="Hell" style="background-color: #ecbab1;" title="Hell"></button>
                    <button class="skin-color-option" id="brustansatzOption" title="Brustansatz">
                      <span style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.2rem; color: var(--brand-primary)">⚧</span>
                    </button>
                  </div>
                </div>

                <!-- Hair color submenu - only visible when hair is selected -->
                <div class="hair-color-selector" id="hairColorSelector" style="display: none;">
                  <div class="hair-color-options">
                    <button class="hair-remove-option" id="hairRemoveOption" title="Keine Haare / Glatze">✕</button>
                    <button class="hair-color-option" data-hair-color="black" style="background-color: #000000;" title="Schwarz"></button>
                    <button class="hair-color-option" data-hair-color="brunette" style="background-color: #764630;" title="Brünett"></button>
                    <button class="hair-color-option" data-hair-color="red" style="background-color: #f09354;" title="Rot"></button>
                    <button class="hair-color-option active" data-hair-color="white" style="background-color: #ffffff;" title="Weiß"></button>
                    <button class="hair-color-option" data-hair-color="blonde" style="background-color: #ffd760;" title="Blond"></button>
                  </div>
                </div>

                <div class="parts-grid" id="partsGrid"></div>
              </div>

            </div>

            <div class="avatar-actions">
              <button class="btn-primary" id="surpriseButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27" />
                </svg>
                <span>Überraschung!</span>
              </button>
              <div class="action-buttons">
                <button class="btn-secondary btn-small" id="downloadButton">Download</button>
                <button class="btn-secondary btn-small" id="shareButton">Share!</button>
              </div>
            </div>
          </div>

          <div id="valuesEditorStep" class="step">
            <div class="canvas-container">
              <canvas id="valuesCanvas" width="300" height="400"></canvas>
              <div id="loadingIndicatorValues" class="loading-indicator" style="display: none;">
                <div class="loading-spinner"></div>
                <p>Bilder werden geladen...</p>
              </div>
            </div>
            
            <div class="step-navigation-buttons">
              <button class="btn-secondary btn-small step-nav-button" id="step1ButtonValues">Wer bist du?</button>
              <button class="btn-secondary btn-small step-nav-button active" id="step2ButtonValues">Wie bist du?</button>
            </div>
            <div class="editor-container">
              <div class="tabs-container">
                <div class="values-tabs">
                  <button class="btn-tertiary btn-small values-tab-button active" data-tab="werte">Das ist dir wichtig!</button>
                  <button class="btn-tertiary btn-small values-tab-button" data-tab="eigenschaften">Das kannst du gut!</button>
                </div>
                <div class="progress-indicator">
                  <div class="progress-bar" id="progressBarValues"></div>
                </div>
              </div>

              <div class="values-content active" data-tab-content="werte">
                <div class="values-grid" id="valuesGrid"></div>
              </div>

              <div class="values-content" data-tab-content="eigenschaften">
                <div class="properties-grid" id="propertiesGrid"></div>
              </div>

            </div>

            <div class="avatar-actions">
              <button class="btn-primary" id="surpriseButtonValues">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27" />
                </svg>
                <span>Überraschung!</span>
              </button>
              <div class="action-buttons">
                <button class="btn-secondary btn-small" id="downloadButtonValues">Download</button>
                <button class="btn-secondary btn-small" id="shareButtonValues">Share!</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="infoDialog" class="dialog-overlay">
        <div class="dialog-content">
          <div class="dialog-header">
            <h2>Über den Futur-O-Mat</h2>
            <button class="close-button" id="closeDialog">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div class="dialog-body">
            <p>Mach deine Zukunft selbst - mit deinem Style!</p>
            <p>Mit dem Futur-O-Mat kannst du deinen eigenen Avatar bauen und die Welt nach deinen Vorstellungen gestalten. Probier's aus und finde raus, was du bewegen kannst!</p>
            <p>Die Webseite basiert auf der Idee des <a href="https://www.germanwatch.org/de/handabdruck" target="_blank" rel="noopener noreferrer">Handabdrucks</a> von <a href="https://www.germanwatch.org/de" target="_blank" rel="noopener noreferrer">Germanwatch</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="scripts.js"></script>
</body>
</html>