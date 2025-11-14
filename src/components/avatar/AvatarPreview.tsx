// import { useRef } from "react";
// import { AvatarCanvas, type AvatarCanvasRef } from "./AvatarCanvas";
// import type { AvatarConfig } from "../../types";
// import { Button } from "../ui/button";

// interface AvatarPreviewProps {
//   avatarConfig: AvatarConfig;
//   width?: number;
//   height?: number;
//   showDownloadButton?: boolean;
//   className?: string;
// }

// /**
//  * AvatarPreview component wraps AvatarCanvas with download functionality
//  * Provides a simple interface for displaying and downloading avatars
//  */
export function AvatarPreview() {}
//   avatarConfig,
//   width = 800,
//   height = 1200,
//   showDownloadButton = true,
//   className = "",
// }: AvatarPreviewProps) {
//   const canvasRef = useRef<AvatarCanvasRef>(null);

//   const handleDownload = () => {
//     canvasRef.current?.downloadImage();
//   };

//   return (
//     <div className={`flex flex-col items-center gap-4 ${className}`}>
//       <AvatarCanvas
//         ref={canvasRef}
//         avatarConfig={avatarConfig}
//         width={width}
//         height={height}
//         className="rounded-lg shadow-lg"
//       />
//       {showDownloadButton && (
//         <Button onClick={handleDownload} variant="default" size="lg">
//           Download Avatar
//         </Button>
//       )}
//     </div>
//   );
// }
