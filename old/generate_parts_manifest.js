const fs = require('fs');
const path = require('path');

// Configuration
const baseAssetPath = path.join(__dirname, 'assets', 'avatars'); // Assumes script is in project root
const categoriesToScan = ['accessoires', 'bodytype', 'brust', 'face', 'hair', 'handicap', 'head', 'clothes', 'shoes', 'strengths', 'values'];
// Output file will be placed in the root, accessible by index.html
const outputManifestPath = path.join(__dirname, 'avatar_parts_manifest.json');

const generatedAvatarParts = [];

categoriesToScan.forEach(category => {
    const categoryDirectory = path.join(baseAssetPath, category);
    try {
        if (fs.existsSync(categoryDirectory)) {
            const files = fs.readdirSync(categoryDirectory);
            files.forEach(file => {
                // Process only common image file types
                if (/\.(png|jpe?g|gif|webp)$/i.test(file)) {
                    const fileNameWithoutExtension = path.basename(file, path.extname(file));
                    let partId;

                    // Generate meaningful IDs based on file naming patterns
                    if (fileNameWithoutExtension.startsWith('Futur-O-Mat__')) {
                        // Handle Futur-O-Mat files with special logic for skin tone and hair color categories
                        if (category === 'head' || category === 'bodytype') {
                            // Pattern: Futur-O-Mat__0015s_Hell_Eckig or Futur-O-Mat__0026s_Hell_Breit
                            const skinToneMatch = fileNameWithoutExtension.match(/_(Hell|Braun|Dunkel)_(.+)$/);
                            if (skinToneMatch) {
                                const skinTone = skinToneMatch[1].toLowerCase();
                                const shape = skinToneMatch[2].toLowerCase().replace(/[^a-z0-9]/g, '_');
                                partId = `${category}_${skinTone}_${shape}`;
                            } else {
                                // Fallback to original logic
                                const parts = fileNameWithoutExtension.split('_');
                                const descriptivePart = parts[parts.length - 1];
                                partId = `${category}_${descriptivePart}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            }
                        } else if (category === 'hair') {
                            // Pattern: Futur-O-Mat__black_0000_Offen-lang-Kraus
                            const hairColorMatch = fileNameWithoutExtension.match(/__(black|blonde|brunette|red|white)_[^_]*_(.+)$/);
                            if (hairColorMatch) {
                                const hairColor = hairColorMatch[1];
                                const style = hairColorMatch[2].toLowerCase().replace(/[^a-z0-9]/g, '_');
                                partId = `${category}_${hairColor}_${style}`;
                            } else {
                                // Fallback to original logic
                                const parts = fileNameWithoutExtension.split('_');
                                const descriptivePart = parts[parts.length - 1];
                                partId = `${category}_${descriptivePart}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
                            }
                        } else {
                            // Original logic for other categories
                            const parts = fileNameWithoutExtension.split('_');
                            const descriptivePart = parts[parts.length - 1];
                            partId = `${category}_${descriptivePart}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
                        }
                    } else {
                        // Fallback: use filename as-is, cleaned up
                        partId = `${category}_${fileNameWithoutExtension}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    }

                    generatedAvatarParts.push({
                        id: partId,
                        src: `assets/avatars/${category}/${file}`, // Client-side accessible path
                        category: category
                    });
                }
            });
        } else {
            console.warn(`Warning: Directory not found for category '${category}': ${categoryDirectory}`);
        }
    } catch (err) {
        console.error(`Error reading directory for category '${category}' (${categoryDirectory}):`, err);
    }
});

try {
    fs.writeFileSync(outputManifestPath, JSON.stringify(generatedAvatarParts, null, 2));
    console.log(`Avatar parts manifest successfully generated at: ${outputManifestPath}`);
    if (generatedAvatarParts.length === 0) {
        console.warn("Warning: The generated manifest is empty. Check your asset paths and categories.");
    }
} catch (err) {
    console.error(`Error writing manifest file to ${outputManifestPath}:`, err);
}