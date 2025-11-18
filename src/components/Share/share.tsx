 /*

// const [isSharing, setIsSharing] = useState(false);
  // const [isDownloading, setIsDownloading] = useState(false);
 

  // --- Auskommentiert: Download ---
  const handleDownload = useCallback(() => {
    if (avatarCanvasRef.current) {
      setIsDownloading(true);
      setRenderError(null);
      try {
        avatarCanvasRef.current.downloadImage();
        showToast("Avatar erfolgreich heruntergeladen!", "success");
      } catch (error) {
        console.error("Failed to download avatar:", error);
        const err =
          error instanceof Error ? error : new Error("Download fehlgeschlagen");
        setRenderError(err);
        showToast(
          "Download fehlgeschlagen. Bitte versuche es erneut.",
          "error"
        );
      } finally {
        setTimeout(() => setIsDownloading(false), 1000);
      }
    }
  }, [showToast]);
  */

  /*
  // --- Auskommentiert: Teilen ---
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    setRenderError(null);
    try {
      const encodedState = encodeState(avatarConfig);
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encodedState}`;
      if (navigator.share) {
        await navigator.share({
          title: "Mein Futur-O-Mat Avatar",
          text: "Schau dir meinen Avatar an!",
          url: shareUrl,
        });
        showToast("Avatar erfolgreich geteilt!", "success");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Link wurde in die Zwischenablage kopiert!", "success");
      }
    } catch (error) {
      console.error("Failed to share:", error);
      if (error instanceof Error && error.name !== "AbortError") {
        setRenderError(error);
        showToast("Teilen fehlgeschlagen. Bitte versuche es erneut.", "error");
      }
    } finally {
      setIsSharing(false);
    }
  }, [avatarConfig, encodeState, showToast]);

 */
    {/* --- Auskommentiert: Action Buttons --- */}
              {/*
              <div className="mt-6">
                <ActionButtons
                  onSurprise={handleSurprise}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  isDownloading={isDownloading}
                  isSharing={isSharing}
                />
              </div>
              */}
 