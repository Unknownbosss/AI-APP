import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGenerationSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GenerationPreview from "@/components/generation-preview";
import { Loader2 } from "lucide-react";

interface GenerationFormProps {
  type: "text" | "image" | "video" | "audio";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      toast({
        title: "Generation Complete",
        description: "Your content has been generated successfully.",
      });
    },
    onError: (err) => {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4 mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
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
                    className="h-32"
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

      {mutation.data && <GenerationPreview generation={mutation.data} />}
    </div>
  );
}