import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import GenerationPreview from "./generation-preview";
import type { Generation } from "@shared/schema";

export default function GenerationHistory() {
  const { data: generations, isLoading } = useQuery<Generation[]>({
    queryKey: ["/api/generations"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  if (!generations?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No generations yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {generations.map((generation) => (
          <GenerationPreview
            key={generation.id}
            generation={generation}
            compact
          />
        ))}
      </div>
    </ScrollArea>
  );
}
