import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import type { Generation } from "@shared/schema";
import { FileAudio, FileText, FileVideo, Image } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

interface GenerationPreviewProps {
  generation: Generation;
  history?: boolean;
  compact?: boolean;
}

const TYPE_ICONS = {
  text: FileText,
  image: Image,
  video: FileVideo,
  audio: FileAudio,
} as const;

function TypedText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [text, currentIndex]);

  return (
    <p className="text-sm font-mono">
      {displayText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

export default function GenerationPreview({
  generation,
  history,
  compact = true,
}: GenerationPreviewProps) {
  const Icon = TYPE_ICONS[generation.type as keyof typeof TYPE_ICONS];
  const { playAudio, pauseAudio, resumeAudio, stopAudio } = useAudio();

  return (
    <Card className={`p-4 ${compact ? "space-y-2" : "space-y-4"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <Badge variant="outline" className="capitalize">
            {generation.type}
          </Badge>
        </div>
        {generation.createdAt && (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(generation.createdAt), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>

      {compact && (
        <div className="text-sm text-muted-foreground">
          <strong>Prompt:</strong> {generation.prompt}
        </div>
      )}

      <div className="result">
        {generation.type === "text" &&
          (history ? (
            <p className="text-sm font-mono">{generation.result}</p>
          ) : (
            <TypedText text={generation.result} />
          ))}

        {generation.type === "image" && (
          <img
            src={generation.result}
            alt={generation.prompt}
            className="w-full h-48 object-cover rounded-md"
          />
        )}

        {generation.type === "video" && (
          <div className="bg-muted rounded-md p-4 text-center text-sm text-muted-foreground">
            Video preview not available
          </div>
        )}

        {generation.type === "audio" && (
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="capitalize p-2 hover:border-purple-500"
            >
              <button onClick={() => playAudio(generation.result)}>
                Play Audio
              </button>
            </Badge>
            <Badge
              variant="outline"
              className="capitalize hover:border-purple-500"
            >
              <button onClick={pauseAudio}>Pause Audio</button>
            </Badge>
            <Badge
              variant="outline"
              className="capitalize hover:border-purple-500"
            >
              <button onClick={resumeAudio}>Resume Audio</button>
            </Badge>
            <Badge
              variant="outline"
              className="capitalize hover:border-purple-500"
            >
              <button onClick={stopAudio}>Stop Audio</button>
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
