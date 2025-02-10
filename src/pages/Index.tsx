
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { ArrowRight, Users, Calendar, MessageSquare, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const features = [
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Build meaningful connections with fellow students and faculty members.",
    },
    {
      icon: Calendar,
      title: "Campus Events",
      description: "Stay updated with all campus events and activities.",
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Communicate instantly with your study groups and friends.",
    },
    {
      icon: ShoppingBag,
      title: "Campus Store",
      description: "Shop for university merchandise and essential supplies.",
    },
  ];

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Your Complete Campus Life Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Connect, collaborate, and thrive in your campus community with CampusConnect.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in">
            <Button 
              className="bg-campus-600 hover:bg-campus-700 text-white px-8"
              onClick={handleSignIn}
            >
              Get Started with Google
            </Button>
            <Button variant="outline" className="border-campus-600 text-campus-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="h-12 w-12 text-campus-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-campus-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to join your campus community?</h2>
          <Button 
            className="bg-campus-600 hover:bg-campus-700"
            onClick={handleSignIn}
          >
            <span>Join Now</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
