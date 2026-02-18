import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const claimAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.functions.invoke("make-admin", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    } catch (e) {
      // Silently fail - user will just not be admin
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      // Auto-confirm is on, so sign in immediately
      const { error: loginError } = await signIn(email, password);
      if (loginError) {
        toast({ title: "Account created! Please sign in.", description: loginError.message });
        setIsSignUp(false);
        setLoading(false);
        return;
      }
      await claimAdmin();
      toast({ title: "Admin account created!" });
      // Small delay to let auth state propagate
      setTimeout(() => navigate("/admin-dashboard"), 500);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/admin-dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient-gold">Vastra</h1>
          <p className="text-muted-foreground mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 shadow-elegant space-y-5">
          <h2 className="text-xl font-display font-bold text-foreground">
            {isSignUp ? "Create Admin Account" : "Sign In"}
          </h2>
          {isSignUp && (
            <p className="text-xs text-muted-foreground">The first account created will automatically become the admin.</p>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2.5 bg-secondary rounded-md border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="admin@vastra.in" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-2.5 bg-secondary rounded-md border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "First time?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
