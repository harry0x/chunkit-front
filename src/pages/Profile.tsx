import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Loader2, Crown } from "lucide-react";
import { AxiosError } from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface Membership {
  planType: "monthly" | "yearly";
  startedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "cancelled";
  amountPaid: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [loadingMem, setLoadingMem] = useState(true);

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await api.get("/user/profile");
        setMembership(response.data.subscription);
      } catch (error) {
        console.error("Failed to fetch membership", error);
      } finally {
        setLoadingMem(false);
      }
    };
    fetchMembership();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingName(true);
    try {
      const response = await api.patch("/user/profile", { fullName });
      updateUser(response.data.user);
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoadingPwd(true);
    try {
      await api.patch("/user/password", { currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update password");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setLoadingPwd(false);
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

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 max-w-6xl mx-auto w-full mt-2 overflow-hidden h-[calc(100vh-100px)]">
        <div className="w-full glass-card border-none rounded-3xl p-6 md:p-8 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                {user?.fullName || "My Profile"}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {user?.email}
              </p>
            </div>
            {membership && membership.status === "active" && (
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Pro Member
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Left Column: Personal Details & Account Security */}
            <div className="space-y-8">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-card-foreground border-b border-border/50 pb-2">
                  Personal details
                </h2>
                <form
                  onSubmit={handleUpdateName}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-background/50 border-input text-foreground h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email ID
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="bg-background/20 border-input text-muted-foreground cursor-not-allowed h-10"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end mt-1">
                    <Button
                      type="submit"
                      disabled={loadingName || fullName === user?.fullName}
                      className="gradient-btn border-none px-6 h-9 text-sm"
                    >
                      <span>
                        {loadingName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Profile"
                        )}
                      </span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Account Security Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-card-foreground border-b border-border/50 pb-2">
                  Account Security
                </h2>
                <form
                  onSubmit={handleUpdatePassword}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1.5 sm:col-span-2 sm:w-[calc(50%-0.5rem)]">
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Password
                    </label>
                    <PasswordInput
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-background/50 border-input text-foreground h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      New Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-background/50 border-input text-foreground h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Confirm New Password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-background/50 border-input text-foreground h-10"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end mt-1">
                    <Button
                      type="submit"
                      disabled={loadingPwd}
                      className="gradient-btn border-none px-6 h-9 text-sm"
                    >
                      <span>
                        {loadingPwd ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Update Password"
                        )}
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Membership Status */}
            {user?.role !== "admin" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-card-foreground border-b border-border/50 pb-2">
                    Membership Status
                  </h2>
                  {loadingMem ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : membership ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background/30 p-5 rounded-2xl border border-border/50">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Current Plan
                        </span>
                        <p className="text-foreground font-semibold capitalize text-base">
                          {membership.planType}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Status
                        </span>
                        <p
                          className={`font-semibold capitalize text-base ${membership.status === "active" ? "text-green-500" : "text-red-500"}`}
                        >
                          {membership.status}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Started At
                        </span>
                        <p className="text-foreground text-sm">
                          {new Date(membership.startedAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Expires At
                        </span>
                        <p className="text-foreground text-sm">
                          {new Date(membership.expiresAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center bg-background/30 p-6 rounded-2xl border border-border/50 flex flex-col items-center justify-center h-[200px]">
                      <p className="text-muted-foreground mb-4 text-sm">
                        You don't have an active membership.
                      </p>
                      <a
                        href="/pricing"
                        className="gradient-btn text-white px-5 py-2 rounded-lg font-medium inline-block hover:opacity-90 transition-opacity text-sm"
                      >
                        View Plans
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
