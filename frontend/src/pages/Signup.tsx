import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Moon, Sun } from "lucide-react";
import Input from "@/components/ui/Input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store/appStore";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schema/auth.schema";
import type { SignupFormValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import PasswordInput from "@/components/ui/PasswordInput";

const Signup = () => {
  const { signup, isSubmitting, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated]);

  const formSubmit = async (data: SignupFormValues) => {
    await signup(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="w-full bg-background border-b border-stone/30 px-20 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-teal text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm">
            I
          </div>
          <span className="font-medium text-foreground">Invio</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Tooltip>
            <TooltipTrigger
              className="p-2 hover:bg-foreground/10 text-foreground/80 cursor-pointer rounded-md transition-colors duration-150 ease-in-out"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="size-5.5 sm:size-6 shrink-0" />
              ) : (
                <Moon className="size-5.5 sm:size-6 shrink-0" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            size="lg"
          >
            Sign in
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm w-full max-w-md px-10 py-10">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Create your account
          </h1>
          <p className="text-sm text-stone mb-7">
            Sign up to create invoices for free.
          </p>

          <form onSubmit={handleSubmit(formSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Input
                type="input"
                label="Name"
                {...register("name")}
                placeholder="John Doe"
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Input
                type="email"
                label="Email"
                {...register("email")}
                placeholder="you@example.com"
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-1.5">
              <PasswordInput
                {...register("password")}
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
              />
            </div>

            <div className="space-y-1.5">
              <PasswordInput
                {...register("confirmPassword")}
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button
              disabled={isSubmitting}
              variant="default"
              size="lg"
              className="w-full h-10 bg-teal hover:bg-teal-dark text-white"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Signing up...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold underline text-teal hover:text-teal-dark transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
