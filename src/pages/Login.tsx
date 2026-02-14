import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth";
import { loginSchema, type TLoginData } from "@/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const form = useForm<TLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate: login, isPending } = useLogin();

  const showPassword = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const onSubmit = (values: TLoginData) => {
    login(values);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl w-full sm:w-96 p-6 transition-all hover:shadow-2xl">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Login to Your Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      autoComplete="username"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="********"
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-md text-lg font-medium transition-all"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don&apos;t have an account yet?{" "}
          <Link
            to="/sign-up"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
