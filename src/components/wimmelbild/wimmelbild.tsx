// wimmelbild.tsx

import { Link } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import Layout from "../layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  useWimmelbildState,
  type WimmelbildImage,
} from "@/hooks/useWimmelbildState";

interface WimmelbildProps {
  images: WimmelbildImage[];
}

const Wimmelbild: React.FC<WimmelbildProps> = ({ images }) => {
  const { image, setImage } = useWimmelbildState();

  const handleImageSelect = (image: WimmelbildImage) => {
    setImage(image);
  };

  useEffect(() => {
    if (images.length > 0) {
      setImage(images[0]);
    }
  }, [images, setImage]);

  return (
    <Layout>
      <Card className="w-md">
        <CardContent>
          {image && (
            <div className="grid gap-4">
              <CardHeader>
                <CardTitle>{image.title}</CardTitle>
                <CardDescription>{image.description}</CardDescription>
              </CardHeader>

              <div className="w-full h-auto mx-auto rounded-xl overflow-hidden ring-3 ring-primary ring-offset-2">
                <img
                  src={image.source}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Untere Vorschau */}
          <div className="bg-gray-100 rounded-xl py-4 px-2 mt-8 max-w-full">
            <p className="text-sm text-gray-600 mb-4 text-center font-medium">
              Verfügbare Wimmelbilder:
            </p>
            <div className="flex">
              <ScrollArea className="w-1 flex-1">
                <div className="flex w-max space-x-4 py-4 px-2">
                  {images.map((wb_image) => (
                    <button
                      key={wb_image.id}
                      className={`h-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        image?.id === wb_image.id
                          ? "border-primary ring-4 ring-primary/20"
                          : "border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => handleImageSelect(wb_image)}
                    >
                      <img
                        src={wb_image.source}
                        alt={wb_image.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <CardFooter className="flex justify-end mt-4">
            <Link to="/engagement">
              <Button disabled={!image}>Auswählen</Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Wimmelbild;
