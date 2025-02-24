import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { SiGoogle } from "react-icons/si";
import { Sparkles } from "lucide-react";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    await signInWithGoogle();
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your AI generation history
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleLogin}
          size="lg"
        >
          <SiGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}
