import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Generation } from "@shared/schema";
import { FileAudio, FileText, FileVideo, Image } from "lucide-react";

interface GenerationPreviewProps {
  generation: Generation;
  compact?: boolean;
}

const TYPE_ICONS = {
  text: FileText,
  image: Image,
  video: FileVideo,
  audio: FileAudio,
};

export default function GenerationPreview({ generation, compact }: GenerationPreviewProps) {
  const Icon = TYPE_ICONS[generation.type];

  return (
    <Card className={`p-4 ${compact ? 'space-y-2' : 'space-y-4'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <Badge variant="outline" className="capitalize">
            {generation.type}
          </Badge>
        </div>
        {generation.createdAt && (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
          </span>
        )}
      </div>

      {!compact && (
        <div className="text-sm text-muted-foreground">
          <strong>Prompt:</strong> {generation.prompt}
        </div>
      )}

      <div className="result">
        {generation.type === "text" && (
          <p className="text-sm">{generation.result}</p>
        )}
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
          <div className="bg-muted rounded-md p-4 text-center text-sm text-muted-foreground">
            Audio preview not available
          </div>
        )}
      </div>
    </Card>
  );
}
