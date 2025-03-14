import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Generation, insertGenerationSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GenerationPreview from "@/components/generation-preview";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface GenerationFormProps {
  type: "text" | "image" | "video" | "audio";
}

// Function to save generation to localStorage
function saveGenerationToLocal(generation: Generation) {
  const generations = JSON.parse(localStorage.getItem("generations") || "[]");
  generations.push(generation);
  localStorage.setItem("generations", JSON.stringify(generations));
}

// Function to load generations from localStorage
function loadGenerationsFromLocal(): Generation[] {
  return JSON.parse(localStorage.getItem("generations") || "[]");
}

export default function GenerationForm({ type }: GenerationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertGenerationSchema),
    defaultValues: {
      type,
      prompt: "",
      result: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: { prompt: string; type: string }) => {
      const res = await apiRequest("POST", "/api/generate", values);

      return res.json();
    },
    onSuccess: (data) => {
      // Save to localStorage
      saveGenerationToLocal(data);
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      toast({
        title: "Generation Complete",
        description: "Your content has been generated successfully.",
      });
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content.",
        variant: "destructive",
      });
    },
  });

  // Load existing generations from localStorage
  const existingGenerations = loadGenerationsFromLocal();
  return (
    <div className="space-y-4 mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            mutation.mutate(values);
          })}
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              form.handleSubmit((values) => {
                mutation.mutate(values);
              })();
            }
          }}
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Describe the ${type} you want to generate...`}
                    className="h-32 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              `Generate ${type}`
            )}
          </Button>
        </form>
      </Form>

      {/* Display existing generations */}
      {existingGenerations
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .map((gen: Generation, i) => (
          <GenerationPreview key={i} generation={gen} />
        ))}
    </div>
  );
}
