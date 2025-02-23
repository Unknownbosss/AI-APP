import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerationForm from "@/components/generation-form";
import GenerationHistory from "@/components/generation-history";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              AI Generation Platform
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <GenerationForm type="text" />
              </TabsContent>
              <TabsContent value="image">
                <GenerationForm type="image" />
              </TabsContent>
              <TabsContent value="video">
                <GenerationForm type="video" />
              </TabsContent>
              <TabsContent value="audio">
                <GenerationForm type="audio" />
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generation History</h2>
            <GenerationHistory />
          </Card>
        </div>
      </div>
    </div>
  );
}