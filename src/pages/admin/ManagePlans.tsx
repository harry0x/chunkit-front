import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, X, GripVertical } from "lucide-react";

interface Plan {
  id: string;
  planType: "monthly" | "half-yearly" | "yearly";
  priceInr: string;
  features: string[];
  isPopular?: boolean;
}

interface Subscription {
  id: string;
  planType: string;
  amountPaid: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function ManagePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  // Edit states for plans
  const [editedPlans, setEditedPlans] = useState<
    Record<string, { price: string; features: string[]; isPopular: boolean }>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subsRes] = await Promise.all([
          api.get("/plans"),
          api.get("/admin/subscriptions"),
        ]);

        const fetchedPlans = plansRes.data.plans;
        setPlans(fetchedPlans);

        const initialEdits: Record<
          string,
          { price: string; features: string[]; isPopular: boolean }
        > = {};
        fetchedPlans.forEach((p: Plan) => {
          initialEdits[p.planType] = {
            price: p.priceInr,
            features: Array.isArray(p.features) ? p.features : [],
            isPopular: !!p.isPopular,
          };
        });
        setEditedPlans(initialEdits);

        setSubscriptions(subsRes.data.subscriptions);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdatePlan = async (planType: string) => {
    const editData = editedPlans[planType];
    if (!editData || isNaN(Number(editData.price))) {
      toast.error("Please enter a valid price");
      return;
    }

    setSavingPlanId(planType);
    try {
      await api.patch(`/admin/plans/${planType}`, {
        priceInr: Number(editData.price),
        features: editData.features.filter((f) => f.trim() !== ""),
        isPopular: editData.isPopular,
      });
      toast.success(`${planType} plan updated successfully`);
      
      // Update local state for plans if isPopular was true (since others become false)
      if (editData.isPopular) {
        setEditedPlans(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            if (key !== planType) {
              newState[key].isPopular = false;
            }
          });
          return newState;
        });
      }
    } catch (err) {
      toast.error("Failed to update plan");
    } finally {
      setSavingPlanId(null);
    }
  };

  const addFeature = (planType: string) => {
    setEditedPlans((prev) => ({
      ...prev,
      [planType]: {
        ...prev[planType],
        features: [...prev[planType].features, ""],
      },
    }));
  };

  const updateFeature = (planType: string, index: number, value: string) => {
    setEditedPlans((prev) => {
      const newFeatures = [...prev[planType].features];
      newFeatures[index] = value;
      return {
        ...prev,
        [planType]: { ...prev[planType], features: newFeatures },
      };
    });
  };

  const removeFeature = (planType: string, index: number) => {
    setEditedPlans((prev) => {
      const newFeatures = [...prev[planType].features];
      newFeatures.splice(index, 1);
      return {
        ...prev,
        [planType]: { ...prev[planType], features: newFeatures },
      };
    });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Plans & Subscriptions
        </h1>
        <p className="text-muted-foreground">
          Manage your pricing plans and view customer subscriptions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">
              Edit Pricing Plans
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="glass-card shadow-lg flex flex-col border-0"
                >
                  <CardHeader>
                    <CardTitle className="text-card-foreground capitalize">
                      {plan.planType} Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          className="pl-8 bg-background border-border text-foreground"
                          value={editedPlans[plan.planType]?.price || ""}
                          onChange={(e) =>
                            setEditedPlans((prev) => ({
                              ...prev,
                              [plan.planType]: {
                                ...prev[plan.planType],
                                price: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">
                          Plan Features
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-primary"
                          onClick={() => addFeature(plan.planType)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {editedPlans[plan.planType]?.features.map(
                          (feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move flex-shrink-0" />
                              <Input
                                value={feature}
                                onChange={(e) =>
                                  updateFeature(
                                    plan.planType,
                                    idx,
                                    e.target.value,
                                  )
                                }
                                className="h-8 text-sm bg-background border-border text-foreground"
                                placeholder="Feature description"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 flex-shrink-0"
                                onClick={() =>
                                  removeFeature(plan.planType, idx)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                        {editedPlans[plan.planType]?.features.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-2 italic border border-dashed border-border rounded">
                            No features added
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-border">
                      <input
                        type="checkbox"
                        id={`popular-${plan.planType}`}
                        checked={editedPlans[plan.planType]?.isPopular || false}
                        onChange={(e) =>
                          setEditedPlans((prev) => ({
                            ...prev,
                            [plan.planType]: {
                              ...prev[plan.planType],
                              isPopular: e.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
                      />
                      <label
                        htmlFor={`popular-${plan.planType}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                      >
                        Set as "Best Value"
                      </label>
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={() => handleUpdatePlan(plan.planType)}
                      disabled={savingPlanId === plan.planType}
                    >
                      {savingPlanId === plan.planType ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Subscriptions History
            </h2>
            <Card className="glass-card shadow-lg border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-muted-foreground pl-4">
                          Customer
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Email
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Plan
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Amount
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Started
                        </TableHead>
                        <TableHead className="text-muted-foreground pr-4">
                          Expires
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => (
                        <TableRow
                          key={sub.id}
                          className="border-border hover:bg-muted/30"
                        >
                          <TableCell className="font-medium text-foreground pl-4">
                            {sub.user?.fullName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sub.user?.email}
                          </TableCell>
                          <TableCell className="capitalize text-foreground">
                            {sub.planType}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            ₹{sub.amountPaid}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs capitalize font-semibold ${
                                sub.status === "active"
                                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                  : sub.status === "expired"
                                    ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(sub.startedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground pr-4">
                            {new Date(sub.expiresAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {subscriptions.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No subscriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
