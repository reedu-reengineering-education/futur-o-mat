// /** */


// import { useState, useCallback } from "react";
// import type { AvatarConfig, AvatarPart } from "@/types";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { PartsGrid } from "@/components/layout";
// import { useAvatarParts } from "@/hooks";

// interface ValuesEditorProps {
//   avatarConfig: AvatarConfig;
//   allParts: AvatarPart[];
//   onUpdatePart: (part: AvatarPart) => void;
// }

// export function ValuesEditor({
//   avatarConfig,
//   onUpdatePart,
// }: ValuesEditorProps) {
//   const [activeTab, setActiveTab] = useState<string>("values");

//   // Get filtered parts for values
//   const { parts: valuesParts } = useAvatarParts({
//     category: "values",
//   });

//   // Get filtered parts for strengths
//   const { parts: strengthsParts } = useAvatarParts({
//     category: "strengths",
//   });

//   // Handle part selection (single select for both categories)
//   const handlePartSelect = useCallback(
//     (part: AvatarPart) => {
//       onUpdatePart(part);
//     },
//     [onUpdatePart]
//   );

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2 h-auto bg-white">
//           <TabsTrigger
//             value="values"
//             className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base font-semibold data-[state=active]:bg-brand-primary data-[state=active]:text-white touch-manipulation min-h-[44px]"
//           >
//             <span className="hidden xs:inline">Das ist dir wichtig!</span>
//             <span className="xs:hidden">Werte</span>
//           </TabsTrigger>
//           <TabsTrigger
//             value="strengths"
//             className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base font-semibold data-[state=active]:bg-brand-primary data-[state=active]:text-white touch-manipulation min-h-[44px]"
//           >
//             <span className="hidden xs:inline">Das kannst du gut!</span>
//             <span className="xs:hidden">Stärken</span>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="values" className="mt-4 sm:mt-6">
//           <div className="space-y-3 sm:space-y-4">
//             <div className="text-center px-2">
//               <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-1 sm:mb-2">
//                 Wähle einen Wert
//               </h3>
//               <p className="text-xs sm:text-sm text-muted-foreground">
//                 Was ist dir im Leben besonders wichtig?
//               </p>
//             </div>

//             <PartsGrid
//               parts={valuesParts}
//               selectedParts={avatarConfig.selectedParts}
//               selectedItems={avatarConfig.selectedItems}
//               onPartSelect={handlePartSelect}
//               multiSelect={false}
//               category="values"
//             />
//           </div>
//         </TabsContent>

//         <TabsContent value="strengths" className="mt-4 sm:mt-6">
//           <div className="space-y-3 sm:space-y-4">
//             <div className="text-center px-2">
//               <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-1 sm:mb-2">
//                 Wähle eine Stärke
//               </h3>
//               <p className="text-xs sm:text-sm text-muted-foreground">
//                 Was kannst du besonders gut?
//               </p>
//             </div>

//             <PartsGrid
//               parts={strengthsParts}
//               selectedParts={avatarConfig.selectedParts}
//               selectedItems={avatarConfig.selectedItems}
//               onPartSelect={handlePartSelect}
//               multiSelect={false}
//               category="strengths"
//             />
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
