import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import GenerationPreview from "@/components/generation-preview";
import type { Generation } from "@shared/schema";
import { useEffect, useState } from "react";

export default function GenerationHistory() {
  const [generations, setGenerations] = useState<Generation[]>(() =>
    JSON.parse(localStorage.getItem("generations") || "[]")
  );

  /*
  //Add this in future when generations are stored on the backend
  const { data: generations, isLoading } = useQuery<Generation[]>({
    queryKey: ["/api/generations"],
  });
  */

  // if (isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       <Skeleton className="h-[100px] w-full" />
  //       <Skeleton className="h-[100px] w-full" />
  //       <Skeleton className="h-[100px] w-full" />
  //     </div>
  //   );
  // }

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
        {generations
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((generation) => (
            <GenerationPreview
              key={generation.id}
              generation={generation}
              compact
              history
            />
          ))}
      </div>
    </ScrollArea>
  );
}
