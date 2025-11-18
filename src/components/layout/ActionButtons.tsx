
export function ActionButtons(){}
/**
 * ActionButtons Component
 *
 * Provides action buttons for avatar operations: surprise (random), download, and share
 * Uses shadcn/ui components with consistent styling and loading states


import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSurprise: () => void;
  onDownload: () => void;
  onShare: () => void;
  isDownloading?: boolean;
  isSharing?: boolean;
}

export function ActionButtons({
  onSurprise,
  onDownload,
  onShare,
  isDownloading = false,
  isSharing = false,
}: ActionButtonsProps) {
  return (
    <div className="w-full bg-white border-t border-border fixed bottom-0 left-0 right-0 shadow-lg z-50 safe-area-inset-bottom">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-2xl mx-auto">
         
          <Button
            onClick={onSurprise}
            variant="outline"
            className="flex-1 h-12 sm:h-12 font-semibold text-brand-primary border-brand-primary active:bg-brand-primary active:text-white transition-colors touch-manipulation text-sm sm:text-base" //Zufallbox
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-Si" //Smily
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" //Smily
              />
            </svg>
            <span className="hidden xs:inline">Überraschung!</span>
            <span className="xs:hidden">Zufall</span>
          </Button>

          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex-1 h-12 sm:h-12 font-semibold bg-brand-primary active:bg-brand-primary-dark text-white touch-manipulation text-sm sm:text-base disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Lädt...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </>
            )}
          </Button>

          <Button
            onClick={onShare}
            disabled={isSharing}
            className="flex-1 h-12 sm:h-12 font-semibold bg-brand-accent active:bg-brand-accent-light text-brand-primary-dark touch-manipulation text-sm sm:text-base disabled:opacity-50"
          >
            {isSharing ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 border-2 border-brand-primary-dark/30 border-t-brand-primary-dark rounded-full animate-spin" />
                Teilen...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Teilen!
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
 */