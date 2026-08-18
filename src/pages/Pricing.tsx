import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Ensure you have razorpay type definitions or declare it
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  planType: "monthly" | "half-yearly" | "yearly";
  priceInr: string;
  features: string[];
  isPopular?: boolean;
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.get("/user/profile").then(res => {
        if (res.data.subscription?.status === "active") {
          setActivePlan(res.data.subscription.planType);
        }
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await api.get("/plans");
        setPlans(response.data.plans);
      } catch (error) {
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    loadPlans();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubscribe = async (planType: string) => {
    setBuyingPlan(planType);
    try {
      // 1. Create order on backend
      const orderRes = await api.post("/subscription/create-order", {
        planType,
      });
      const { orderId, amount, currency } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount,
        currency: currency,
        name: "Video Chunker SaaS",
        description: `${planType} Subscription`,
        order_id: orderId,
        prefill: {
          name: user?.fullName || "Test User",
          email: user?.email || "test@example.com",
          contact: "9999999999", // Dummy 10-digit number for test mode bypass
        },
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            await api.post("/subscription/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planType,
            });
            toast.success("Subscription activated successfully!");
            setTimeout(() => {
              if (localStorage.getItem("pendingJob")) {
                window.location.href = "/";
              } else {
                window.location.href = "/profile";
              }
            }, 1500);
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        theme: {
          color: "#8b5cf6", // Primary color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to subscribe", {
          action: {
            label: "Login",
            onClick: () => (window.location.href = "/login"),
          },
        });
      } else {
        toast.error("Failed to initiate checkout");
      }
    } finally {
      setBuyingPlan(null);
    }
  };

  return (
    <>
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-orb bg-orb--4" />
      </div>
      <div className="bg-grid" />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-[80vh]">
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock infinite chunking possibilities.
          </p>
        </div>

        {loading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full z-10 relative">
            {plans.map((plan) => {
              const planLevel = { "monthly": 1, "half-yearly": 2, "yearly": 3 };
              const currentLevel = activePlan ? planLevel[activePlan as keyof typeof planLevel] : 0;
              const thisLevel = planLevel[plan.planType as keyof typeof planLevel];
              
              const isActive = activePlan === plan.planType;
              const isLowerOrEqual = currentLevel >= thisLevel;
              const isDisabled = isLowerOrEqual || buyingPlan === plan.planType;
              
              let buttonText = "Subscribe";
              if (isActive) buttonText = "Current Plan";
              else if (isLowerOrEqual) buttonText = "Included";
              else if (activePlan) buttonText = "Upgrade";

              return (
              <Card
                key={plan.id}
                className={`glass-card flex flex-col transition-all hover:border-primary/50 relative overflow-hidden group ${plan.isPopular ? "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ring-1 ring-primary/20" : "hover:shadow-lg"}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-5 right-5 text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30">
                    Best Value
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl capitalize text-card-foreground">
                    {plan.planType} Plan
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-card-foreground">
                      ₹{plan.priceInr}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{" "}
                      {plan.planType === "monthly"
                        ? "month"
                        : plan.planType === "half-yearly"
                          ? "6 months"
                          : "year"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {Array.isArray(plan.features) &&
                    plan.features.length > 0 ? (
                      plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-foreground"
                        >
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))
                    ) : (
                      <li className="flex items-center text-muted-foreground italic text-sm">
                        No features listed
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full text-lg h-12 border-none cursor-pointer ${plan.isPopular && !isDisabled ? "gradient-btn text-white" : "bg-primary/10 hover:bg-primary/20 text-primary"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    variant={plan.isPopular ? "default" : "secondary"}
                    onClick={() => handleSubscribe(plan.planType)}
                    disabled={isDisabled}
                  >
                    <span>
                      {buyingPlan === plan.planType ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        buttonText
                      )}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
