
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { cartItems, addToCart, isLoading: isLoadingCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = async (productId: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    await addToCart(productId);
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-campus-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Campus Store</h1>
          <Button variant="outline">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Cart ({isLoadingCart ? "..." : getTotalCartItems()})
          </Button>
        </div>

        {isLoadingProducts ? (
          <div>Loading products...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products?.map((product) => (
              <div key={product.id} className="glass-card p-6 rounded-xl">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button onClick={() => handleAddToCart(product.id)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
