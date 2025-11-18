import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function QuizInformation() {
  const [avatarBody, setAvatarBody] = useState<string>("");

  useEffect(() => {
    const savedBody = localStorage.getItem("avatarImage");
    if (savedBody) setAvatarBody(savedBody);
  }, []);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam. Lorem ipsum dolor sit amet.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
              </p>
            </div>
            {avatarBody && (
              <div className="flex justify-center md:justify-end">
                <img
                  src={avatarBody}
                  alt="Avatar"
                  className="w-60 h-50 object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <Link
              to={`/quiz-questions`}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-sm font-medium px-6 py-2 shadow-lg transition-all"
            >
              <Button>Weiter zum Quiz</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
